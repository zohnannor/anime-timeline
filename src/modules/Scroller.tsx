import { useCallback, useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';

import { useSettings } from '@shared/contexts/SettingsContext';
import { scale } from '@shared/lib/helpers';
import { useWindowScroll } from '@shared/lib/hooks';
import useMousePosition from '@shared/lib/hooks/useMousePosition';
import { clamp } from '@shared/lib/util';
import { ThumbnailImage } from '@shared/ui';
import { SCROLLER_WIDTH } from '@timelines/index';
import { TIMELINE } from '@timelines/registry';

type ScrollHoverAreaProps = {
    $visible: boolean;
};

const ScrollerHoverArea = styled.div<ScrollHoverAreaProps>`
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

// otherwise syntax highlighting breaks
// eslint-disable-next-line arrow-body-style
const ScrollerWrapper = styled.div.attrs<ScrollProps>(({ $offset }) => {
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

    const { body } = document;
    const totalX = body.scrollWidth - body.clientWidth;
    const offset = scrollX / totalX;

    const updateScrollerHandle = useCallback(
        (ev: MouseEvent) => {
            if (!scrollerRef.current) {
                return;
            }
            const { left, width } = scrollerRef.current.getBoundingClientRect();
            const percent = clamp((ev.clientX - left) / width, 0, 1);
            setScrollX(percent * totalX);
        },
        [setScrollX, totalX],
    );

    useEffect(() => {
        const handleDrag = (ev: MouseEvent) =>
            dragging && updateScrollerHandle(ev);
        const stopDrag = () => setDragging(false);

        body.addEventListener('mousemove', handleDrag);
        window.addEventListener('mouseup', stopDrag);
        return () => {
            body.removeEventListener('mousemove', handleDrag);
            window.removeEventListener('mouseup', stopDrag);
        };
    }, [body, dragging, updateScrollerHandle]);

    const handleScrollerClick = (ev: React.MouseEvent) =>
        updateScrollerHandle(ev.nativeEvent);

    const scrollerVisible =
        dragging || scrolling || mouseY > window.innerHeight - 100;

    const { smallImages } = TIMELINE[animeTitle].data;

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
                    src={smallImages['scroller-or-favicon']}
                    onMouseDown={() => setDragging(true)}
                />
            </ScrollerWrapper>
        </ScrollerHoverArea>
    );
};
