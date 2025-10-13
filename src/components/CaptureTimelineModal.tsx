import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

import { useToPng } from '@hugocxl/react-to-image';

import { TIMELINE } from '../constants';
import { maxHeight, scale } from '../helpers';
import { useSettings } from '../providers/SettingsProvider';
import { map, sum } from '../util';

const ShadowOverlay = styled.div`
    position: fixed;
    inset: 0;
    z-index: 100;
    background: rgba(0, 0, 0, 0.6);
    cursor: pointer;
`;

const ModalContainer = styled.div`
    position: fixed;
    display: flex;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -40%);
    z-index: 100;
    background: rgba(0, 0, 0, 0.85);
    padding: ${scale(40)} ${scale(190)};
    max-width: 50svw;

    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: ${scale(75)};
    width: 80vw;
`;

const Title = styled.h2`
    margin: 0;
`;

const Button = styled.button`
    cursor: pointer;
    background-color: black;
    color: white;
    font-size: ${scale(60)};
    border-color: white;
`;

export const CaptureTimelineModal: React.FC = () => {
    const {
        captureTimelineModalOpen,
        setCaptureTimelineModalOpen,
        unboundedChapterWidth,
        animeTitle,
    } = useSettings();

    void unboundedChapterWidth; // TODO: remove

    const [_, captureTimeline, __] = useToPng({
        selector: '#root',
        canvasHeight: maxHeight(animeTitle),
        canvasWidth: sum(
            map(
                TIMELINE[animeTitle].data.volumes.flatMap(v => v.chapters),
                _v => 100 // TODO: chapter width
            )
        ),
        backgroundColor: '#000',
        filter: el => !el.classList?.contains('floatingButtons'),
        onSuccess: dataUrl => {
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `${animeTitle?.toUpperCase()}_Timeline_${new Date().toISOString()}.png`;
            link.click();
        },
    });

    if (!captureTimelineModalOpen) return null;

    return ReactDOM.createPortal(
        <>
            <ShadowOverlay
                className='shadow'
                onClick={() => setCaptureTimelineModalOpen(false)}
            />
            <ModalContainer className='captureTimelineModal'>
                <Title>Are you sure?</Title>
                <h5>
                    This will save a huge (around 50MB) PNG file. It is
                    recommended to scroll to the end of the timeline to load all
                    images. Your settings (visibility of titles and chapter
                    width) will affect the rendered image.
                </h5>
                <Button onClick={captureTimeline}>Yes, proceed</Button>
                <h6>(this might take a while)</h6>
            </ModalContainer>
        </>,
        document.querySelector('#captureTimelineModal')!
    );
};
