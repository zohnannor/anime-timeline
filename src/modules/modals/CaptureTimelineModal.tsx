import { useState } from 'react';
import styled from 'styled-components';

import { useToPng } from '@hugocxl/react-to-image';

import useSettings from '../../shared/contexts/SettingsContext';
import {
    getVolumeWidth,
    maxHeight,
    scale,
    toTitleCase,
} from '../../shared/lib/helpers';
import { sum } from '../../shared/lib/util';
import { Modal } from '../../shared/ui';
import TIMELINE from '../../timelines';

const ConfirmButton = styled.button`
    cursor: pointer;
    background-color: black;
    color: white;
    font-size: ${scale(60)};
    border-color: white;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: ${scale(40)} ${scale(190)};
    width: 50svw;
    font-size: ${scale(75)};

    @media (max-width: 768px) {
        width: 80svw;
    }
`;

export const CaptureTimelineModal: React.FC = () => {
    const {
        captureTimelineModalOpen,
        setCaptureTimelineModalOpen,
        unboundedChapterWidth,
        animeTitle,
    } = useSettings();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const timeline = TIMELINE[animeTitle].data;
    const height = maxHeight(TIMELINE[animeTitle]);
    const width = sum(
        timeline.volumes.map((_, vi) =>
            getVolumeWidth(timeline, vi, unboundedChapterWidth),
        ),
    );

    const [_, captureTimeline, __] = useToPng({
        selector: '#root',
        canvasHeight: height,
        canvasWidth: width,
        backgroundColor: '#000',
        filter: el =>
            ['floatingButtons', 'scrollerHoverArea'].every(
                className => !el.classList?.contains(className),
            ),
        onStart: () => {
            setLoading(false);
            setError(null);
            console.debug(`Real dimensions: ${width}x${height}`);
        },
        onSuccess: dataUrl => {
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `${toTitleCase(
                animeTitle,
            )}_Timeline_${new Date().toISOString()}.png`;
            link.click();
            setLoading(false);
        },
        onLoading: () => setLoading(true),
        onError: error => {
            setLoading(false);
            setError(error);
        },
    });

    return (
        <Modal
            isOpen={captureTimelineModalOpen}
            onClose={() => {
                setCaptureTimelineModalOpen(false);
                setLoading(false);
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
                    width) will affect the rendered image. The maximum width is
                    16384px. If something renders incorrectly, try Chrome
                    browser.
                </h5>
                <ConfirmButton onClick={captureTimeline}>
                    Yes, proceed
                </ConfirmButton>
                <h6>(this might take a while)</h6>
                {loading && <div>Loading...</div>}
                {error && <div style={{ color: 'red' }}>{error}</div>}
            </Container>
        </Modal>
    );
};
