import { useCallback, useState } from 'react';
import styled from 'styled-components';

import { toSvg } from 'html-to-image';
import { useToPng } from '@hugocxl/react-to-image';
import { MOBILE_BREAKPOINT } from '@shared/config/ui';
import { useSettings } from '@shared/contexts/SettingsContext';
import { useTimeline } from '@shared/contexts/TimelineContext';
import { toTitleCase } from '@shared/lib/helpers';
import { Modal } from '@shared/ui';

const MAX_SAFE_PIXELS = 250_000_000;

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

const downloadDataUrl = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.click();
};

const loadImage = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = src;
    });

const MAX_TILE_WIDTH = 8192;

const captureTimelineSvg = async (
    rootEl: HTMLElement,
    width: number,
    height: number,
): Promise<string> => {
    const docEl = document.documentElement;
    const origScale = docEl.style.getPropertyValue('--scale-factor');

    docEl.style.setProperty('--scale-factor', '1px');
    await new Promise<void>(resolve => { requestAnimationFrame(() => { requestAnimationFrame(() => { resolve(); }); }); });

    try {
        return await toSvg(rootEl, {
            width,
            height,
            backgroundColor: '#000',
            filter: filterEl,
        });
    } finally {
        docEl.style.setProperty('--scale-factor', origScale);
        await new Promise<void>(resolve => { requestAnimationFrame(() => { resolve(); }); });
    }
};

const downloadTilesFromSvg = async ({
    svgDataUrl,
    logicalWidth,
    logicalHeight,
    titleCase,
    timestamp,
    setLoading,
    setError,
}: {
    svgDataUrl: string;
    logicalWidth: number;
    logicalHeight: number;
    titleCase: string;
    timestamp: string;
    setLoading: (_: string | null) => void;
    setError: (_: string | null) => void;
}): Promise<void> => {
    const fullImage = await loadImage(svgDataUrl);
    const tileCount = Math.ceil(logicalWidth / MAX_TILE_WIDTH);

    for (let i = 0; i < tileCount; i++) {
        setLoading(`capturing tile ${i + 1}/${tileCount}`);

        const srcX = i * MAX_TILE_WIDTH;
        const srcWidth = Math.min(MAX_TILE_WIDTH, logicalWidth - srcX);

        try {
            const canvas = document.createElement('canvas');
            canvas.width = srcWidth;
            canvas.height = logicalHeight;
            const ctx = canvas.getContext('2d');
            if (ctx === null) { throw new Error('canvas context unavailable'); }

            ctx.drawImage(fullImage, srcX, 0, srcWidth, logicalHeight, 0, 0, srcWidth, logicalHeight);

            const filename = `${titleCase}_Timeline_${String(i + 1).padStart(String(tileCount).length, '0')}_${timestamp}.png`;
            downloadDataUrl(canvas.toDataURL(), filename);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            return;
        }
    }
};

export const CaptureTimelineModal: React.FC = () => {
    const {
        captureTimelineModalOpen,
        setCaptureTimelineModalOpen,
        unboundChapterWidth,
        animeTitle,
    } = useSettings();
    const {
        maxHeight: logicalHeight,
        maxWidth,
        data: { title },
    } = useTimeline();
    const [loading, setLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const logicalWidth = maxWidth(unboundChapterWidth);

    const [_, captureTimeline, __] = useToPng({
        selector: '#root',
        canvasHeight: logicalHeight,
        canvasWidth: logicalWidth,
        backgroundColor: '#000',
        skipAutoScale: true,
        filter: filterEl,
        onStart: () => {
            setLoading(`starting "${title}" timeline capture`);
            setError(null);
            console.debug(`Logical dimensions: ${logicalWidth}x${logicalHeight}`);
        },
        onSuccess: dataUrl => {
            const filename = `${toTitleCase(
                animeTitle,
            )}_Timeline_${new Date().toISOString()}.png`;
            downloadDataUrl(dataUrl, filename);
            setLoading(`saving "${filename}" image`);
        },
        onLoading: () => setLoading('rendering timeline'),
        onError: error => {
            setLoading(null);
            setError(error);
        },
    });

    const handleCapture = useCallback(async () => {
        if (logicalWidth * logicalHeight <= MAX_SAFE_PIXELS) {
            captureTimeline();
            return;
        }

        setLoading(`rendering "${title}" timeline at full resolution`);
        setError(null);

        const rootEl = document.querySelector<HTMLElement>('#root');
        if (rootEl === null) {
            return;
        }

        const timestamp = new Date().toISOString();
        const titleCase = toTitleCase(animeTitle);

        setLoading(`rendering full timeline as SVG`);
        const svgDataUrl = await captureTimelineSvg(rootEl, logicalWidth, logicalHeight);

        downloadDataUrl(svgDataUrl, `${titleCase}_Timeline_${timestamp}.svg`);

        await downloadTilesFromSvg({
            svgDataUrl,
            logicalWidth,
            logicalHeight,
            titleCase,
            timestamp,
            setLoading,
            setError,
        });

        setLoading(null);
    }, [captureTimeline, logicalWidth, logicalHeight, animeTitle, title]);

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
                <ConfirmButton onClick={() => { handleCapture().catch(() => undefined); }}>
                    Yes, proceed
                </ConfirmButton>
                <h6>(this might take a while)</h6>
                {loading !== null && <div>Loading ({loading}...)</div>}
                {error && <div style={{ color: 'red' }}>{error}</div>}
            </Container>
        </Modal>
    );
};
