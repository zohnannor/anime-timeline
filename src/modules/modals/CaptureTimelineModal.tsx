import { useState } from 'react';
import styled from 'styled-components';

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

    @media (max-width: ${MOBILE_BREAKPOINT}px) {
        font-size: 1rem;
    }
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
        padding: 0.4rem 1rem;
        font-size: 1rem;
    }
`;

const isImg = (el: Node): el is HTMLImageElement =>
    el instanceof HTMLImageElement && el.getAttribute('src') !== null;

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

    const [_, captureTimeline, __] = useToPng({
        selector: '#root',
        canvasHeight: height,
        canvasWidth: width,
        backgroundColor: '#000',
        skipAutoScale: true,
        filter: (el: Node) =>
            !(el instanceof HTMLElement) ||
            !(
                [
                    'floatingButtons',
                    'scrollerHoverArea',
                    'crosslines',
                    'tooltipContent',
                ].some(cls => el.classList.contains(cls)) ||
                (isImg(el) && el.complete && el.naturalWidth === 0)
            ),
        onStart: () => {
            setLoading(`starting "${title}" timeline capture`);
            setError(null);
            console.debug(`Real dimensions: ${width}x${height}`);
        },
        onSuccess: dataUrl => {
            const link = document.createElement('a');
            link.href = dataUrl;
            const filename = `${toTitleCase(
                animeTitle,
            )}_Timeline_${new Date().toISOString()}.png`;
            link.download = filename;
            link.click();
            setLoading(`saving "${filename}" image`);
        },
        onLoading: () => setLoading('rendering timeline'),
        onError: error => {
            setLoading(null);
            setError(error);
        },
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
