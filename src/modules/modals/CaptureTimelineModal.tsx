import { useCallback, useState } from 'react';
import styled from 'styled-components';

import { useToPng, useToSvg } from '@hugocxl/react-to-image';
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

const downloadDataUrl = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.click();
};

const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
};

const dataUrlToBlob = async (dataUrl: string): Promise<Blob> =>
    (await fetch(dataUrl)).blob();

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

    const [, captureSvg] = useToSvg({
        selector: '#root',
        canvasWidth: width,
        canvasHeight: height,
        backgroundColor: '#000',
        filter: filterEl,
        onStart: () => setLoading(`rendering as SVG`),
        onSuccess: dataUrl => {
            const timestamp = new Date().toISOString();
            const titleCase = toTitleCase(animeTitle);
            downloadDataUrl(
                dataUrl,
                `${titleCase}_Timeline_${timestamp}.svg`,
            );
            setLoading(null);
        },
        onError: () => setLoading(null),
    });

    const svgFallback = useCallback(() => captureSvg(), [captureSvg]);

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
        onError: () => svgFallback(),
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
