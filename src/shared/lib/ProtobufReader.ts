import { decode as varintDecode } from 'varint';

import { throwError } from '@shared/lib/util';

type Title = Readonly<{
    titleId?: number;
    name?: string;
    author?: string;
    portraitImageUrl?: string;
    titleUpdateStatus?: number;
}>;

type TitleDetailView = Readonly<{
    title?: Title;
    titleImageUrl?: string;
    overview?: string;
    nextTimeStamp?: number;
}>;

type SuccessResponse = Readonly<{ titleDetailView?: TitleDetailView }>;

type ApiResponse = Readonly<{ Ok?: SuccessResponse }>;

const PROXY_URL = 'https://api.allorigins.win/raw?url=';
const mangaApiUrl = (titleId: number) =>
    `https://jumpg-webapi.tokyo-cdn.com/api/title_detailV3?title_id=${titleId}&clang=eng`;

class ProtobufReader {
    pos = 0;
    len: number;
    constructor(private buffer: Uint8Array) {
        this.len = buffer.length;
    }

    u32() {
        const value = varintDecode(this.buffer, this.pos);
        this.pos += varintDecode.bytes ?? 0;
        return value;
    }

    string() {
        const length = this.u32();
        const start = this.pos;
        const end = start + length;
        this.pos += length;
        return String.fromCodePoint(...this.buffer.slice(start, end));
    }
}

type FieldDecoder<T> = (_reader: ProtobufReader) => T[keyof T];

type FieldDescriptor<T> = Readonly<{
    tag: number;
    property: keyof T;
    decoder: FieldDecoder<T>;
}>;

const decodeMessage = <T>(
    reader: ProtobufReader,
    end: number,
    descriptors: FieldDescriptor<T>[],
): T => {
    const result: Partial<T> = {};
    const endPos = end === 0 ? reader.len : reader.pos + end;
    while (reader.pos < endPos) {
        // eslint-disable-next-line no-bitwise
        const tag = reader.u32() >>> 3;
        const descriptor = descriptors.find(fd => fd.tag === tag);
        if (descriptor) {
            result[descriptor.property] = descriptor.decoder(reader);
        } else {
            console.warn(`tag: ${tag}, unknown descriptor`);
            break;
        }
    }
    return result as T;
};

const decodeTitle = (reader: ProtobufReader, length: number): Title =>
    decodeMessage(reader, length, [
        { tag: 1, property: 'titleId', decoder: r => r.u32() },
        { tag: 2, property: 'name', decoder: r => r.string() },
        { tag: 3, property: 'author', decoder: r => r.string() },
        { tag: 4, property: 'portraitImageUrl', decoder: r => r.string() },
        { tag: 8, property: 'titleUpdateStatus', decoder: r => r.u32() },
    ]);

const decodeTitleDetailView = (
    reader: ProtobufReader,
    length: number,
): TitleDetailView =>
    decodeMessage(reader, length, [
        { tag: 1, property: 'title', decoder: r => decodeTitle(r, r.u32()) },
        { tag: 2, property: 'titleImageUrl', decoder: r => r.string() },
        { tag: 3, property: 'overview', decoder: r => r.string() },
        { tag: 5, property: 'nextTimeStamp', decoder: r => r.u32() },
    ]);

const decodeSuccessResponse = (
    reader: ProtobufReader,
    length: number,
): SuccessResponse =>
    decodeMessage(reader, length, [
        {
            tag: 8,
            property: 'titleDetailView',
            decoder: r => decodeTitleDetailView(r, r.u32()),
        },
    ]);

const decodeApiResponse = (
    reader: ProtobufReader,
    length: number,
): ApiResponse =>
    decodeMessage(reader, length, [
        {
            tag: 1,
            property: 'Ok',
            decoder: r => decodeSuccessResponse(r, r.u32()),
        },
    ]);

const protobufReader = async (): Promise<Temporal.Instant | undefined> => {
    try {
        const response = await fetch(
            `${PROXY_URL}${encodeURIComponent(mangaApiUrl(100_037))}`,
        );
        const buffer = new Uint8Array(await response.arrayBuffer());
        const reader = new ProtobufReader(buffer);
        const result = decodeApiResponse(reader, reader.len);

        const nextTimestamp =
            result.Ok?.titleDetailView?.nextTimeStamp ??
            throwError('Next chapter timestamp not found in response');

        console.debug('protobuf result:', result);

        return Temporal.Instant.fromEpochMilliseconds(nextTimestamp * 1000);
    } catch (err) {
        console.error('Error fetching next chapter date:', err);
        return undefined;
    }
};

export default protobufReader;
