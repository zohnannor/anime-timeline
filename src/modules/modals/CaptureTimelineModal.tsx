import { useRef, useState } from 'react';
import styled from 'styled-components';

import { useToPng, useToSvg } from '@hugocxl/react-to-image';
import { MOBILE_BREAKPOINT, SCALE_FACTOR_PROPERTY } from '@shared/config';
import { useSettings } from '@shared/contexts/SettingsContext';
import { useTimeline } from '@shared/contexts/TimelineContext';
import { toTitleCase } from '@shared/lib/helpers';
import { Modal } from '@shared/ui';
import { HEADERS_WIDTH } from '@timelines/index';

const ButtonRow = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
`;

const DownloadButton = styled.button`
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

const OVERLAY_CLASSES = [
    'floatingButtons',
    'scrollerHoverArea',
    'crosslines',
    'tooltipContent',
] as const;

const isImg = (el: Node): el is HTMLImageElement =>
    el instanceof HTMLImageElement && el.getAttribute('src') !== null;

const filter = (el: HTMLElement) =>
    !(el instanceof HTMLElement) ||
    !(
        OVERLAY_CLASSES.some(cls => el.classList.contains(cls)) ||
        (isImg(el) && el.complete && el.naturalWidth === 0)
    );

const downloadDataUrl = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.click();
};

const preparePngClone = () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const root = document.getElementById('root')!;
    const clone = root.cloneNode(true) as typeof root;
    clone.id = 'capture-root';
    clone.style.setProperty(SCALE_FACTOR_PROPERTY, '1px');
    const classNames = OVERLAY_CLASSES.map(cls => `.${cls}`).join(', ');
    for (const el of clone.querySelectorAll<HTMLElement>(
        `${classNames}, img[src]`,
    )) {
        if (!filter(el)) {
            el.remove();
        }
    }
    return document.body.appendChild(clone);
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
    const captureRootRef = useRef<HTMLElement | null>(null);
    const [loading, setLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const width = maxWidth(unboundChapterWidth) + HEADERS_WIDTH;

    const scaleFactor = parseFloat(
        document.documentElement.style.getPropertyValue(SCALE_FACTOR_PROPERTY),
    );

    const [, captureSvg] = useToSvg({
        selector: '#root',
        width,
        height,
        backgroundColor: '#000',
        filter,
        style: {
            transform: `scale(${1 / scaleFactor})`,
            transformOrigin: 'top left',
        },
        onStart: () => {
            setLoading(`starting "${title}" SVG timeline capture`);
            setError(null);
            console.debug(`Real dimensions: ${width}x${height}`);
        },
        onSuccess: dataUrl => {
            const timestamp = new Date().toISOString();
            const title = toTitleCase(animeTitle);
            const filename = `${title}_Timeline_${timestamp}.svg`;
            downloadDataUrl(dataUrl, filename);
            setLoading(`saving "${filename}" SVG image`);
        },
        onLoading: () => setLoading(`rendering "${title}" timeline`),
        onError: error => {
            setLoading(null);
            setError(error);
        },
    });

    const [, capturePng] = useToPng({
        selector: '#capture-root',
        height,
        width,
        canvasHeight: height,
        canvasWidth: width,
        backgroundColor: '#000',
        skipAutoScale: true,
        filter,
        onStart: () => {
            setLoading(`starting "${title}" PNG timeline capture`);
            setError(null);
            captureRootRef.current = preparePngClone();
            console.debug(`Real dimensions: ${width}x${height}`);
        },
        onSuccess: dataUrl => {
            captureRootRef.current?.remove();
            captureRootRef.current = null;
            const timestamp = new Date().toISOString();
            const title = toTitleCase(animeTitle);
            const filename = `${title}_Timeline_${timestamp}.png`;
            downloadDataUrl(dataUrl, filename);
            setLoading(`saving "${filename}" PNG image`);
        },
        onLoading: () => setLoading(`rendering "${title}" timeline`),
        onError: error => {
            captureRootRef.current?.remove();
            captureRootRef.current = null;
            setLoading(null);
            setError(error);
        },
    });

    return (
        <Modal
            isOpen={captureTimelineModalOpen}
            onClose={() => {
                captureRootRef.current?.remove();
                captureRootRef.current = null;
                setCaptureTimelineModalOpen(false);
                setLoading(null);
                setError(null);
            }}
            title='Are you sure?'
            $bgColor='rgba(0, 0, 0, 0.85)'
        >
            <Container>
                <h5>
                    This will save a huge (20MB-200MB) image. It is recommended
                    to scroll to the end of the timeline to load all images.
                    Your settings (visibility of titles and chapter width) will
                    affect the rendered image, but some elements are not
                    rendered anyway (UI). If something renders incorrectly, try
                    Chrome browser. If PNG rendering fails, try SVG.
                </h5>
                <ButtonRow>
                    <DownloadButton onClick={capturePng}>
                        Download PNG
                    </DownloadButton>
                    <DownloadButton onClick={captureSvg}>
                        Download SVG
                    </DownloadButton>
                </ButtonRow>
                <h6>(this might take a while)</h6>
                {loading !== null && <div>Loading ({loading}...)</div>}
                {error && <div style={{ color: 'red' }}>{error}</div>}
            </Container>
        </Modal>
    );
};
