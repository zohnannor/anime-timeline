import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { HEADERS_WIDTH, pxToScale, scale, scaleToPx } from '../constants';
import useWindowScroll from '../hooks/useWindowScroll';
import { getDocumentPosition as getElementPosition } from '../util';

interface PreviewProps {
    $hasPicture: boolean;
    $offsetX: number;
}

const PADDING = scaleToPx(50);

const Preview = styled.div.attrs<PreviewProps>(({ $offsetX }) => {
    return {
        style: {
            '--left': `${scale($offsetX)}svh`,
        } as React.CSSProperties,
    };
})`
    display: flex;
    height: ${({ $hasPicture }) => scale($hasPicture ? 600 : 250)}svh;
    width: ${scale(600)}svh;
    padding: ${scale(30)}svh;
    gap: ${scale(20)}svh;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: ${scale(50)}svh;
    box-shadow: 0 0 ${scale(15)}svh ${scale(6)}svh rgba(0, 0, 0, 0.4);
    background: white;
    color: black;
    border-radius: ${scale(40)}svh;

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
    const previewRef = useRef<HTMLDivElement>(null);
    const [offset, setOffset] = useState(0);
    const { scrollX } = useWindowScroll();

    useEffect(() => {
        const element = previewRef.current;
        if (!element) return;

        const { x: left, width } = getElementPosition(element);
        const right = left + width;

        const visibleLeft = scrollX + scaleToPx(HEADERS_WIDTH);
        const visibleRight = scrollX + document.body.clientWidth;

        const adjustX =
            left <= visibleLeft
                ? visibleLeft - left + PADDING
                : right >= visibleRight
                ? visibleRight - right - PADDING
                : 0;

        setOffset(pxToScale(adjustX));
    }, [scrollX]);

    return <Preview ref={previewRef} $offsetX={offset} {...props} />;
};
