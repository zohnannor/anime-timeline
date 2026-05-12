import { useCallback, useState } from 'react';
import styled from 'styled-components';

import { toSvg } from 'html-to-image';
import { useToPng } from '@hugocxl/react-to-image';
import { MOBILE_BREAKPOINT } from '@shared/config/ui';
import { useSettings } from '@shared/contexts/SettingsContext';
import { useTimeline } from '@shared/contexts/TimelineContext';
import { toTitleCase } from '@shared/lib/helpers';
import { Modal } from '@shared/ui';

const ConfirmButton = styled.button`
    cursor: pointer;
    background-color: black;
    color: white;
    font-size: 1.25rem;
    border-color: white;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.8rem 3.8rem;
    width: 50svw;
    font-size: 1.5rem;

    @media (max-width: ${MOBILE_BREAKPOINT}px) {
        width: 80svw;
    }
`;

const isImg = (el: Node): el is HTMLImageElement =>
    el instanceof HTMLImageElement && el.getAttribute('src') !== null;

const filterEl = (el: Node) =>
    !(el instanceof HTMLElement) ||
    !(
        [
            'floatingButtons',
            'scrollerHoverArea',
            'crosslines',
            'tooltipContent',
        ].some(cls => el.classList.contains(cls)) ||
        (isImg(el) && el.complete && el.naturalWidth === 0)
    );

const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
};

const dataUrlToBlob = async (dataUrl: string): Promise<Blob> => {
    const response = await fetch(dataUrl);
    return response.blob();
};

const loadImage = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = src;
    });

const captureTimelineSvg = async (
    rootEl: HTMLElement,
    width: number,
    height: number,
): Promise<string> => {
    const docEl = document.documentElement;
    const origScale = docEl.style.getPropertyValue('--scale-factor');
    const overlay = document.createElement('div');
    overlay.style.cssText =
        'position:fixed;top:0;left:0;width:100vw;height:100vh;background:#000;z-index:9999';
    document.body.appendChild(overlay);

    docEl.style.setProperty('--scale-factor', '1px');
    await new Promise<void>(resolve => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                resolve();
            });
        });
    });

    try {
        return await toSvg(rootEl, {
            width,
            height,
            backgroundColor: '#000',
            filter: filterEl,
        });
    } finally {
        docEl.style.setProperty('--scale-factor', origScale);
        overlay.remove();
        await new Promise<void>(resolve => {
            requestAnimationFrame(() => {
                resolve();
            });
        });
    }
};

const TILE_WIDTH = 8192;

/* eslint-disable no-bitwise */
const crc32Table = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
    let crc = i;
    for (let j = 0; j < 8; j++) {
        crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
    }
    crc32Table[i] = crc;
}

const crc32 = (data: Uint8Array): number => {
    let crc = 0xffffffff;
    /* eslint-disable-next-line @typescript-eslint/prefer-for-of */
    for (let i = 0; i < data.length; i++) {
        const byte = data[i];
        if (byte === undefined) {
            throw new Error('Unexpected undefined byte');
        }
        const idx = (crc ^ byte) & 0xff;
        const tableVal = crc32Table[idx];
        if (tableVal === undefined) {
            throw new Error('CRC32 table lookup out of bounds');
        }
        crc = tableVal ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
};
/* eslint-enable no-bitwise */

const pngChunk = (type: string, data: Uint8Array): Blob => {
    const len = new ArrayBuffer(4);
    new DataView(len).setUint32(0, data.byteLength);
    const typeB = new TextEncoder().encode(type);
    const combined = new Uint8Array(typeB.length + data.byteLength);
    combined.set(typeB);
    combined.set(data, typeB.length);
    const crcBuf = new ArrayBuffer(4);
    new DataView(crcBuf).setUint32(0, crc32(combined));
    return new Blob([len, typeB, data as BlobPart, crcBuf]);
};

type BatchRowsParams = {
    writer: WritableStreamDefaultWriter<BufferSource>;
    img: HTMLImageElement;
    totalWidth: number;
    batchY: number;
    batchH: number;
    tileCount: number;
};

const writeBatchRows = async (params: BatchRowsParams): Promise<void> => {
    const { writer, img, totalWidth, batchY, batchH, tileCount } = params;
    const tilePixels: Uint8ClampedArray[] = [];
    for (let tile = 0; tile < tileCount; tile++) {
        const srcX = tile * TILE_WIDTH;
        const tw = Math.min(TILE_WIDTH, totalWidth - srcX);
        const canvas = document.createElement('canvas');
        canvas.width = tw;
        canvas.height = batchH;
        const ctx = canvas.getContext('2d');
        if (ctx === null) {
            throw new Error('Canvas 2D context unavailable');
        }
        ctx.drawImage(img, srcX, batchY, tw, batchH, 0, 0, tw, batchH);
        tilePixels.push(ctx.getImageData(0, 0, tw, batchH).data);
    }

    const rowSize = totalWidth * 4 + 1;
    for (let row = 0; row < batchH; row++) {
        const rowData = new Uint8ClampedArray(totalWidth * 4);
        for (let tile = 0; tile < tileCount; tile++) {
            const tw = Math.min(TILE_WIDTH, totalWidth - tile * TILE_WIDTH);
            const offset = row * tw * 4;
            const pixelRow = tilePixels[tile];
            if (pixelRow === undefined) {
                throw new Error('Unexpected missing tile pixel data');
            }
            rowData.set(
                pixelRow.subarray(offset, offset + tw * 4),
                tile * TILE_WIDTH * 4,
            );
        }
        const filtered = new Uint8Array(rowSize);
        filtered[0] = 0;
        filtered.set(rowData, 1);
        /* eslint-disable-next-line no-await-in-loop */
        await writer.write(filtered);
    }
};

type SvgToPngParams = {
    svgDataUrl: string;
    totalWidth: number;
    totalHeight: number;
    onProgress: (_msg: string | null) => void;
};

const svgToPng = async (params: SvgToPngParams): Promise<Blob> => {
    const { svgDataUrl, totalWidth, totalHeight, onProgress } = params;
    const img = await loadImage(svgDataUrl);
    const tileCount = Math.ceil(totalWidth / TILE_WIDTH);
    const parts: BlobPart[] = [];

    const signature = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
    parts.push(signature.buffer);

    const ihdr = new Uint8Array(13);
    const dv = new DataView(ihdr.buffer, ihdr.byteOffset, ihdr.byteLength);
    dv.setUint32(0, totalWidth);
    dv.setUint32(4, totalHeight);
    ihdr[8] = 8;
    ihdr[9] = 6;
    ihdr[10] = 0;
    ihdr[11] = 0;
    ihdr[12] = 0;
    parts.push(pngChunk('IHDR', ihdr));

    const cs = new CompressionStream('deflate');
    const writer = cs.writable.getWriter();

    const BATCH = 100;
    for (let batchY = 0; batchY < totalHeight; batchY += BATCH) {
        const batchH = Math.min(BATCH, totalHeight - batchY);
        onProgress(
            `converting to PNG ${Math.round((batchY / totalHeight) * 100)}%`,
        );
        /* eslint-disable-next-line no-await-in-loop */
        await writeBatchRows({
            writer,
            img,
            totalWidth,
            batchY,
            batchH,
            tileCount,
        });
    }

    onProgress('finalizing PNG');
    await writer.close();
    const compressed = await new Response(cs.readable).blob();
    const compressedBytes = await compressed.arrayBuffer();
    parts.push(pngChunk('IDAT', new Uint8Array(compressedBytes)));
    parts.push(pngChunk('IEND', new Uint8Array(0)));

    return new Blob(parts, { type: 'image/png' });
};

export const CaptureTimelineModal: React.FC = () => {
    const {
        captureTimelineModalOpen,
        setCaptureTimelineModalOpen,
        unboundChapterWidth,
        animeTitle,
    } = useSettings();
    const {
        maxHeight: height,
        maxWidth,
        data: { title },
    } = useTimeline();
    const [loading, setLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const width = maxWidth(unboundChapterWidth);

    const svgFallback = useCallback(async () => {
        setLoading(`rendering "${title}" timeline via fallback`);

        const rootEl = document.querySelector<HTMLElement>('#root');
        if (rootEl === null) {
            return;
        }

        const timestamp = new Date().toISOString();
        const titleCase = toTitleCase(animeTitle);

        setLoading(`rendering as SVG`);
        const svgDataUrl = await captureTimelineSvg(rootEl, width, height);

        setLoading(`converting to PNG`);
        try {
            const pngBlob = await svgToPng({
                svgDataUrl,
                totalWidth: width,
                totalHeight: height,
                onProgress: setLoading,
            });
            downloadBlob(pngBlob, `${titleCase}_Timeline_${timestamp}.png`);
        } catch {
            const svgBlob = await dataUrlToBlob(svgDataUrl);
            downloadBlob(svgBlob, `${titleCase}_Timeline_${timestamp}.svg`);
        }

        setLoading(null);
    }, [width, height, animeTitle, title]);

    const [, captureTimeline] = useToPng({
        selector: '#root',
        canvasHeight: height,
        canvasWidth: width,
        backgroundColor: '#000',
        skipAutoScale: true,
        filter: filterEl,
        onStart: () => {
            setLoading(`starting "${title}" timeline capture`);
            setError(null);
            console.debug(`Real dimensions: ${width}x${height}`);
        },
        onSuccess: async dataUrl => {
            const filename = `${toTitleCase(
                animeTitle,
            )}_Timeline_${new Date().toISOString()}.png`;
            const blob = await dataUrlToBlob(dataUrl);
            downloadBlob(blob, filename);
            setLoading(null);
        },
        onLoading: () => setLoading('rendering timeline'),
        onError: () => svgFallback().catch(() => undefined),
    });

    return (
        <Modal
            isOpen={captureTimelineModalOpen}
            onClose={() => {
                setCaptureTimelineModalOpen(false);
                setLoading(null);
                setError(null);
            }}
            title='Are you sure?'
            $bgColor='rgba(0, 0, 0, 0.85)'
        >
            <Container>
                <h5>
                    This will save a huge (50MB-100MB) PNG file. It is
                    recommended to scroll to the end of the timeline to load all
                    images. Your settings (visibility of titles and chapter
                    width) will affect the rendered image, but some elements are
                    not rendered anyway (UI). If something renders incorrectly,
                    try Chrome browser.
                </h5>
                <ConfirmButton onClick={captureTimeline}>
                    Yes, proceed
                </ConfirmButton>
                <h6>(this might take a while)</h6>
                {loading !== null && <div>Loading ({loading}...)</div>}
                {error && <div style={{ color: 'red' }}>{error}</div>}
            </Container>
        </Modal>
    );
};
