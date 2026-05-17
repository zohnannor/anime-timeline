import { useCallback, useRef, useState } from 'react';
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

    @media (max-width: ${MOBILE_BREAKPOINT}px) {
        font-size: 1rem;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
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

const RadioGroup = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 0.5rem;
`;

const RadioLabel = styled.label`
    display: flex;
    align-items: center;
    gap: 0.3rem;
    cursor: pointer;
    font-size: 1.1rem;
`;

const RadioInput = styled.input`
    accent-color: black;
    width: 1rem;
    height: 1rem;
    margin: 0;
`;

const ErrorText = styled.div`
    color: red;
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

const preparePngClone = (captureScaleFactor: number) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const root = document.getElementById('root')!;
    const clone = root.cloneNode(true) as typeof root;
    clone.id = 'capture-root';
    clone.style.setProperty(SCALE_FACTOR_PROPERTY, `${captureScaleFactor}px`);
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

type HookOpts = {
    fullWidth: number;
    maxHeight: number;
    animeTitle: string;
    title: string;
};

const useCaptureTimeline = ({
    animeTitle,
    title,
    fullWidth,
    maxHeight,
}: HookOpts) => {
    const captureRootRef = useRef<HTMLElement | null>(null);
    const [loading, setLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [capturing, setCapturing] = useState(false);
    const [atViewportHeight, setAtViewportHeight] = useState(false);

    const scaleFactor = parseFloat(
        document.documentElement.style.getPropertyValue(SCALE_FACTOR_PROPERTY),
    );
    const scaledWidth = Math.round(fullWidth * scaleFactor);
    const scaledHeight = Math.round(maxHeight * scaleFactor);
    const width = atViewportHeight ? scaledWidth : fullWidth;
    const height = atViewportHeight ? scaledHeight : maxHeight;

    const cleanupClone = () => {
        captureRootRef.current?.remove();
        captureRootRef.current = null;
    };

    const config = useCallback(
        (kind: 'svg' | 'png'): Parameters<typeof useToPng>[0] => ({
            selector: kind === 'png' ? '#capture-root' : '#root',
            height,
            width,
            canvasHeight: height,
            canvasWidth: width,
            backgroundColor: '#000',
            skipAutoScale: true,
            filter,
            style:
                kind === 'svg' && !atViewportHeight ?
                    {
                        transform: `scale(${1 / scaleFactor})`,
                        transformOrigin: 'top left',
                    }
                :   {},
            onStart: () => {
                setCapturing(true);
                console.debug(`Real dimensions: ${fullWidth}x${maxHeight}`);
                console.debug(
                    `Viewport dimensions: ${scaledWidth}x${scaledHeight}`,
                );
                setLoading(
                    `starting "${title}" ${kind.toUpperCase()} timeline capture`,
                );
                setError(null);
                if (kind === 'png') {
                    captureRootRef.current = preparePngClone(
                        atViewportHeight ? scaleFactor : 1,
                    );
                }
            },
            onSuccess: dataUrl => {
                if (kind === 'png') {
                    cleanupClone();
                }
                const timestamp = new Date().toISOString();
                const title = toTitleCase(animeTitle);
                const filename = `${title}_Timeline_${timestamp}.${kind}`;
                downloadDataUrl(dataUrl, filename);
                setLoading(`saving "${filename}" image`);
                setCapturing(false);
            },
            onLoading: () =>
                setLoading(
                    `rendering "${title}" ${kind.toUpperCase()} timeline`,
                ),
            onError: error => {
                if (kind === 'png') {
                    cleanupClone();
                }
                setCapturing(false);
                setLoading(null);
                setError(error);
            },
            onImageErrorHandler: (...args: unknown[]) => {
                console.warn('Image failed during capture:', args);
            },
        }),
        [
            animeTitle,
            atViewportHeight,
            fullWidth,
            height,
            maxHeight,
            scaleFactor,
            scaledHeight,
            scaledWidth,
            title,
            width,
        ],
    );

    const [, captureSvg] = useToSvg(config('svg'));
    const [, capturePng] = useToPng(config('png'));

    const resetCapture = () => {
        cleanupClone();
        setCapturing(false);
        setLoading(null);
        setError(null);
    };

    return {
        capturePng,
        captureSvg,
        capturing,
        loading,
        error,
        atViewportHeight,
        setAtViewportHeight,
        resetCapture,
        width,
        height,
        scaledWidth,
        scaledHeight,
    };
};

export const CaptureTimelineModal: React.FC = () => {
    const {
        captureTimelineModalOpen,
        setCaptureTimelineModalOpen,
        unboundChapterWidth,
        showExtraChapters,
        animeTitle,
    } = useSettings();
    const {
        maxHeight,
        maxWidth,
        data: { title },
    } = useTimeline();

    const fullWidth =
        maxWidth(unboundChapterWidth, showExtraChapters) + HEADERS_WIDTH;

    const {
        capturePng,
        captureSvg,
        capturing,
        loading,
        error,
        atViewportHeight,
        setAtViewportHeight,
        resetCapture,
        scaledWidth,
        scaledHeight,
    } = useCaptureTimeline({ fullWidth, maxHeight, animeTitle, title });

    return (
        <Modal
            isOpen={captureTimelineModalOpen}
            onClose={() => {
                resetCapture();
                setCaptureTimelineModalOpen(false);
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
                <RadioGroup>
                    <RadioLabel>
                        <RadioInput
                            type='radio'
                            name='captureMode'
                            checked={!atViewportHeight}
                            onChange={() => setAtViewportHeight(false)}
                        />
                        Full resolution ({fullWidth}x{maxHeight})
                    </RadioLabel>
                    <RadioLabel>
                        <RadioInput
                            type='radio'
                            name='captureMode'
                            checked={atViewportHeight}
                            onChange={() => setAtViewportHeight(true)}
                        />
                        Viewport height ({scaledWidth}x{scaledHeight})
                    </RadioLabel>
                </RadioGroup>
                <ButtonRow>
                    <DownloadButton onClick={capturePng} disabled={capturing}>
                        Download PNG
                    </DownloadButton>
                    <DownloadButton onClick={captureSvg} disabled={capturing}>
                        Download SVG
                    </DownloadButton>
                </ButtonRow>
                <h6>(this might take a while)</h6>
                {loading !== null && <div>Loading ({loading}...)</div>}
                {error && <ErrorText>{error}</ErrorText>}
            </Container>
        </Modal>
    );
};
