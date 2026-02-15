import * as varint from 'varint';

type ProtobufReader = {
    buf: Uint8Array;
    pos: number;
    len: number;
    u32(): number;
    string(): string;
};

type Title = {
    titleId?: number;
    name?: string;
    author?: string;
    portraitImageUrl?: string;
    titleUpdateStatus?: number;
};

type TitleDetailView = {
    title?: Title;
    titleImageUrl?: string;
    overview?: string;
    nextTimeStamp?: number;
};

type SuccessResponse = {
    titleDetailView?: TitleDetailView;
};

type ApiResponse = {
    Ok?: SuccessResponse;
};

const PROXY_URL = 'https://api.allorigins.win/raw?url=';
const MANGA_API_URL =
    'https://jumpg-webapi.tokyo-cdn.com/api/title_detailV3?title_id=100037&clang=eng';

const createProtobufReader = (buffer: Uint8Array): ProtobufReader => ({
    buf: buffer,
    pos: 0,
    len: buffer.length,
    u32() {
        const value = varint.decode(this.buf, this.pos);
        this.pos += varint.decode.bytes || 0;
        return value;
    },
    string() {
        const length = this.u32();
        const start = this.pos;
        const end = start + length;
        this.pos += length;
        return String.fromCharCode(...this.buf.slice(start, end));
    },
});

type FieldDecoder<T> = (reader: ProtobufReader) => T[keyof T];

type FieldDescriptor<T> = {
    tag: number;
    property: keyof T;
    decoder: FieldDecoder<T>;
};

const decodeMessage = <T>(
    reader: ProtobufReader,
    end: number,
    descriptors: FieldDescriptor<T>[],
): T => {
    const result: Partial<T> = {};
    end = end === 0 ? reader.len : reader.pos + end;
    while (reader.pos < end) {
        const tag = reader.u32() >>> 3;
        const descriptor = descriptors.find(d => d.tag === tag);
        if (descriptor) {
            result[descriptor.property] = descriptor.decoder(reader);
        } else {
            console.warn(`tag: ${tag}, unknown descriptor`);
            break;
        }
    }
    return result as T;
};

const decodeTitle = (reader: ProtobufReader, length: number): Title => {
    return decodeMessage(reader, length, [
        { tag: 1, property: 'titleId', decoder: r => r.u32() },
        { tag: 2, property: 'name', decoder: r => r.string() },
        { tag: 3, property: 'author', decoder: r => r.string() },
        { tag: 4, property: 'portraitImageUrl', decoder: r => r.string() },
        { tag: 8, property: 'titleUpdateStatus', decoder: r => r.u32() },
    ]);
};

const decodeTitleDetailView = (
    reader: ProtobufReader,
    length: number,
): TitleDetailView => {
    return decodeMessage(reader, length, [
        { tag: 1, property: 'title', decoder: r => decodeTitle(r, r.u32()) },
        { tag: 2, property: 'titleImageUrl', decoder: r => r.string() },
        { tag: 3, property: 'overview', decoder: r => r.string() },
        { tag: 5, property: 'nextTimeStamp', decoder: r => r.u32() },
    ]);
};

const decodeSuccessResponse = (
    reader: ProtobufReader,
    length: number,
): SuccessResponse => {
    return decodeMessage(reader, length, [
        {
            tag: 8,
            property: 'titleDetailView',
            decoder: r => decodeTitleDetailView(r, r.u32()),
        },
    ]);
};

const decodeApiResponse = (
    reader: ProtobufReader,
    length: number,
): ApiResponse => {
    return decodeMessage(reader, length, [
        {
            tag: 1,
            property: 'Ok',
            decoder: r => decodeSuccessResponse(r, r.u32()),
        },
    ]);
};

export default async (): Promise<Date | null> => {
    try {
        const response = await fetch(
            `${PROXY_URL}${encodeURIComponent(MANGA_API_URL)}`,
        );
        const buffer = new Uint8Array(await response.arrayBuffer());
        const reader = createProtobufReader(buffer);
        const result = decodeApiResponse(reader, reader.len);

        if (!result.Ok?.titleDetailView?.nextTimeStamp) {
            console.error(result);
            throw new Error('Next chapter timestamp not found in response');
        }

        console.debug('protobuf result:', result);

        return new Date(result.Ok.titleDetailView.nextTimeStamp * 1000);
    } catch (error) {
        console.error('Error fetching next chapter date:', error);
        return null;
    }
};
