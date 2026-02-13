import React, { PropsWithChildren, useEffect, useState, useRef } from 'react';
import styled from 'styled-components';

import { HEADERS_WIDTH } from '../../timelines';
import { maxHeight, scale } from '../../shared/lib/helpers';
import useWindowScroll from '../../shared/lib/hooks/useWindowScroll';
import useSettings from '../../app/providers/SettingsProvider';
import { getDocumentPosition } from '../../shared/lib/util';

type PreviewProps = {
    $hasPicture: boolean;
    $offsetX: number;
};

const Preview = styled.div.attrs<PreviewProps>(({ $offsetX }) => {
    return {
        style: {
            '--left': `${scale($offsetX)}`,
        },
    };
})`
    display: flex;
    height: ${({ $hasPicture }) => scale($hasPicture ? 600 : 250)};
    width: ${scale(600)};
    padding: ${scale(30)};
    gap: ${scale(20)};
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: ${scale(50)};
    box-shadow: 0 0 ${scale(15)} ${scale(6)} rgba(0, 0, 0, 0.4);
    background: white;
    color: black;
    border-radius: ${scale(40)};

    transform: translateX(var(--left));

    & > img {
        object-fit: contain;
        max-height: 75%;
        max-width: 75%;
    }
`;

type ChapterPreviewProps = React.ComponentProps<'div'> &
    PropsWithChildren<Omit<PreviewProps, '$offsetX'>>;

export const ChapterPreview: React.FC<ChapterPreviewProps> = props => {
    const { animeTitle } = useSettings();
    const previewRef = useRef<HTMLDivElement>(null);
    const [offset, setOffset] = useState(0);
    const { scrollX } = useWindowScroll();

    const scaleToPx = (n: number) =>
        n * (window.innerHeight / maxHeight(animeTitle));
    const pxToScale = (n: number) =>
        n * (maxHeight(animeTitle) / window.innerHeight);

    useEffect(() => {
        const element = previewRef.current;
        if (!element) return;

        const { x: left, width } = getDocumentPosition(element);
        const right = left + width;

        const visibleLeft = scrollX + scaleToPx(HEADERS_WIDTH);
        const visibleRight = scrollX + document.body.clientWidth;
        const padding = scaleToPx(50);

        const adjustX =
            left <= visibleLeft ? visibleLeft - left + padding
            : right >= visibleRight ? visibleRight - right - padding
            : 0;

        setOffset(pxToScale(adjustX));
    }, [scrollX]);

    return <Preview ref={previewRef} $offsetX={offset} {...props} />;
};
