import React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';

import { SCROLLER_WIDTH, TIMELINE } from '../timelines';
import { scale } from '../shared/lib/helpers';
import useMousePosition from '../shared/lib/hooks/useMousePosition';
import useWindowScroll from '../shared/lib/hooks/useWindowScroll';
import useSettings from '../app/providers/SettingsProvider';
import { clamp } from '../shared/lib/util';
import { ThumbnailImage } from '../shared/ui/ThumbnailImage';

type ScrollHoverAreaProps = {
    $visible: boolean;
};

export const ScrollerHoverArea = styled.div<ScrollHoverAreaProps>`
    pointer-events: none;
    position: fixed;
    z-index: 10;
    bottom: 0;
    height: ${scale(250)};
    width: 100svw;
    display: flex;
    justify-content: center;

    & > div {
        ${({ $visible }) =>
            $visible &&
            css`
                bottom: ${scale(160)};
            `}
    }
`;

type ScrollProps = {
    $offset: number;
};

export const ScrollerWrapper = styled.div.attrs<ScrollProps>(({ $offset }) => {
    return {
        style: {
            '--left': `${$offset * 100}%`,
        },
    };
})`
    transition: bottom 0.2s ease-in-out;
    pointer-events: auto;
    position: absolute;
    bottom: ${scale(-190)};
    height: ${scale(32)};
    width: ${scale(SCROLLER_WIDTH)};
    background-color: white;
    border: ${scale(3)} solid black;
    border-radius: ${scale(16)};
    display: flex;
    align-items: center;
    filter: drop-shadow(0 0 ${scale(16)} rgba(0, 0, 0, 0.5));

    & > img {
        position: absolute;
        width: ${scale(160)};
        height: ${scale(160)};
        filter: drop-shadow(0 0 ${scale(16)} rgba(0, 0, 0, 0.5));
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
    const { animeTitle } = useSettings();

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
        [dragging],
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
                    src={
                        TIMELINE[animeTitle].data.smallImages[
                            'scroller-or-favicon'
                        ]
                    }
                    onMouseDown={() => setDragging(true)}
                />
            </ScrollerWrapper>
        </ScrollerHoverArea>
    );
};
