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

        setLoading(`rendering "${title}" timeline at full width`);
        setError(null);

        const rootEl = document.querySelector<HTMLElement>('#root');
        if (rootEl === null) {
            return;
        }

        const renderedHeight = globalThis.innerHeight;
        const viewportWidth = globalThis.innerWidth;
        const scaleFactor = renderedHeight / logicalHeight;
        const renderedWidth = Math.ceil(logicalWidth * scaleFactor);
        const tileCount = Math.ceil(renderedWidth / viewportWidth);
        const timestamp = new Date().toISOString();
        const titleCase = toTitleCase(animeTitle);

        setLoading(`rendering full timeline as SVG`);
        const svgDataUrl = await toSvg(rootEl, {
            width: renderedWidth,
            height: renderedHeight,
            backgroundColor: '#000',
            filter: filterEl,
        });

        setLoading(`processing full timeline image`);
        const fullImage = await loadImage(svgDataUrl);

        const cropTile = (i: number) => {
            const canvas = document.createElement('canvas');
            canvas.width = viewportWidth;
            canvas.height = renderedHeight;

            const ctx = canvas.getContext('2d');
            if (ctx === null) {
                throw new Error('Failed to get canvas context');
            }

            ctx.drawImage(
                fullImage,
                i * viewportWidth,
                0,
                viewportWidth,
                renderedHeight,
                0,
                0,
                viewportWidth,
                renderedHeight,
            );

            return canvas.toDataURL();
        };

        for (let i = 0; i < tileCount; i++) {
            setLoading(`capturing tile ${i + 1}/${tileCount}`);

            try {
                const dataUrl = cropTile(i);
                const filename = `${titleCase}_Timeline_${String(i + 1).padStart(String(tileCount).length, '0')}_${timestamp}.png`;
                downloadDataUrl(dataUrl, filename);
            } catch (err) {
                setLoading(null);
                setError(err instanceof Error ? err.message : String(err));
                return;
            }
        }

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
