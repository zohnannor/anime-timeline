import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

import { useToPng } from '@hugocxl/react-to-image';

import { CHAPTERS_TOTAL, MAX_HEIGHT, scale } from '../constants';
import { getChapterWidth } from '../helpers';
import { useSettings } from '../providers/SettingsProvider';
import { map, range, sum } from '../util';

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
    padding: ${scale(40)}svh ${scale(190)}svh;
    max-width: 50svw;

    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: ${scale(75)}svh;
    width: 80vw;
`;

const Title = styled.h2`
    margin: 0;
`;

const Button = styled.button`
    cursor: pointer;
    background-color: black;
    color: white;
    font-size: ${scale(60)}svh;
    border-color: white;
`;

export const CaptureTimelineModal: React.FC = () => {
    const {
        captureTimelineModalOpen,
        setCaptureTimelineModalOpen,
        unboundedChapterWidth,
    } = useSettings();

    const [_, captureTimeline, __] = useToPng({
        selector: '#root',
        canvasHeight: MAX_HEIGHT,
        canvasWidth: sum(
            map(range(0, CHAPTERS_TOTAL), v =>
                getChapterWidth(v + 1, unboundedChapterWidth)
            )
        ),
        backgroundColor: '#000',
        filter: el => !el.classList?.contains('floatingButtons'),
        onSuccess: dataUrl => {
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `CSM_Timeline_${new Date().toISOString()}.png`;
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
