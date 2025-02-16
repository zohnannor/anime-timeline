import {
    MouseEvent as MouseEventReact,
    useEffect,
    useRef,
    useState,
    useCallback,
} from 'react';
import styled, { css } from 'styled-components';

import { scale, SCROLLER_WIDTH } from '../constants';
import useMousePosition from '../hooks/useMousePosition';
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

export const ScrollerWrapper = styled.div<ScrollProps>`
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
        left: ${({ $offset }) => $offset * 100}%;
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
    const isDragging = useRef(false);
    const isPageScrolling = useRef(false);
    const wheelTimeout = useRef(0);
    const [_, setT] = useState(Date.now());
    const [offset, setOffset] = useState(0);
    const mousePosition = useMousePosition();

    const updatePageScroll = useCallback((offsetRaw: number) => {
        const offset = clamp(offsetRaw, 0, 1);
        const el = document.body;
        setOffset(offset);
        el.scrollLeft = (el.scrollWidth - el.clientWidth) * offset;
    }, []);

    const onPageScrollChange = useCallback(() => {
        isPageScrolling.current = true;
        const el = document.body;
        const scrollWidth = el.scrollWidth - el.clientWidth;
        setOffset(scrollWidth > 0 ? el.scrollLeft / scrollWidth : 0);

        clearTimeout(wheelTimeout.current);
        wheelTimeout.current = window.setTimeout(() => {
            isPageScrolling.current = false;
            setT(Date.now());
        }, 400);
    }, []);

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!isDragging.current || !scrollerRef.current) return;
            const rect = scrollerRef.current.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const normalizedOffset = clamp(offsetX / rect.width, 0, 1);
            updatePageScroll(normalizedOffset);
        },
        [updatePageScroll]
    );

    const stopDragging = useCallback(() => {
        isDragging.current = false;
        setT(Date.now());
    }, []);

    useEffect(() => {
        document.body.addEventListener('scroll', onPageScrollChange);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', stopDragging);
        return () => {
            document.body.removeEventListener('scroll', onPageScrollChange);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', stopDragging);
        };
    }, [handleMouseMove, onPageScrollChange, stopDragging]);

    const handleScrollerClick = (e: MouseEventReact<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const normalizedOffset = clamp(offsetX / rect.width, 0, 1);
        updatePageScroll(normalizedOffset);
    };

    const scrollerVisible =
        isDragging.current ||
        isPageScrolling.current ||
        mousePosition.y > window.innerHeight - 100;

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
                    draggable={false}
                    onMouseDown={() => (isDragging.current = true)}
                />
            </ScrollerWrapper>
        </ScrollerHoverArea>
    );
};
