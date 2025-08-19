import { useCallback, useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';

import { scale, SCROLLER_WIDTH } from '../constants';
import useMousePosition from '../hooks/useMousePosition';
import useWindowScroll from '../hooks/useWindowScroll';
import { clamp } from '../util';
import { ThumbnailImage } from './ThumbnailImage';

interface ScrollHoverAreaProps {
    $visible: boolean;
}

export const ScrollerHoverArea = styled.div<ScrollHoverAreaProps>`
    pointer-events: none;
    position: fixed;
    z-index: 10;
    bottom: 0;
    height: ${scale(250)}svh;
    width: 100svw;
    display: flex;
    justify-content: center;

    & > div {
        ${({ $visible }) =>
            $visible &&
            css`
                bottom: ${scale(160)}svh;
            `}
    }
`;

interface ScrollProps {
    $offset: number;
}

export const ScrollerWrapper = styled.div.attrs<ScrollProps>(({ $offset }) => {
    return {
        style: {
            '--left': `${$offset * 100}%`,
        } as React.CSSProperties,
    };
})`
    transition: bottom 0.2s ease-in-out;
    pointer-events: auto;
    position: absolute;
    bottom: -${scale(190)}svh;
    height: ${scale(32)}svh;
    width: ${scale(SCROLLER_WIDTH)}svh;
    background-color: white;
    border: ${scale(3)}svh solid black;
    border-radius: ${scale(16)}svh;
    display: flex;
    align-items: center;
    filter: drop-shadow(0 0 ${scale(16)}svh rgba(0, 0, 0, 0.5));

    & > img {
        position: absolute;
        width: ${scale(160)}svh;
        height: ${scale(160)}svh;
        filter: drop-shadow(0 0 ${scale(16)}svh rgba(0, 0, 0, 0.5));
        left: var(--left);
        transform: translateX(-50%) scale(1);
        transition: transform 0.2s ease-in-out;
    }

    & > img:hover {
        cursor: grab;
        transform: translateX(-50%) scale(1.05);
    }

    & > img:active {
        cursor: grabbing;
        transform: translateX(-50%) scale(0.95);
    }
`;

export const Scroller = () => {
    const scrollerRef = useRef<HTMLDivElement>(null);
    const { scrollX, setScrollX, scrolling } = useWindowScroll();
    const [dragging, setDragging] = useState(false);
    const { y: mouseY } = useMousePosition();

    const body = document.body;
    const totalX = body.scrollWidth - body.clientWidth;
    const offset = scrollX / totalX;

    const updateScrollerHandle = (e: MouseEvent) => {
        if (!scrollerRef.current) return;
        const { left, width } = scrollerRef.current.getBoundingClientRect();
        const percent = clamp((e.clientX - left) / width, 0, 1);
        setScrollX(percent * totalX);
    };

    const handleDrag = useCallback(
        (e: MouseEvent) => dragging && updateScrollerHandle(e),
        [dragging]
    );

    const stopDrag = useCallback(() => setDragging(false), []);

    useEffect(() => {
        body.addEventListener('mousemove', handleDrag);
        window.addEventListener('mouseup', stopDrag);
        return () => {
            body.removeEventListener('mousemove', handleDrag);
            window.removeEventListener('mouseup', stopDrag);
        };
    }, [handleDrag, stopDrag]);

    const handleScrollerClick = (e: React.MouseEvent) =>
        updateScrollerHandle(e.nativeEvent);

    const scrollerVisible =
        dragging || scrolling || mouseY > window.innerHeight - 100;

    return (
        <ScrollerHoverArea
            className='scrollerHoverArea'
            $visible={scrollerVisible}
        >
            <ScrollerWrapper
                className='scroller'
                ref={scrollerRef}
                $offset={offset}
                onClick={handleScrollerClick}
            >
                <ThumbnailImage
                    src='pochita'
                    onMouseDown={() => setDragging(true)}
                />
            </ScrollerWrapper>
        </ScrollerHoverArea>
    );
};
