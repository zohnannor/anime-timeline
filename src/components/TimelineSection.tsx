import React from 'react';
import styled, { css } from 'styled-components';
import { CSS } from 'styled-components/dist/types';

import { scale, TimelineInfoItem } from '../constants';
import { useHover } from '../hooks/useHover';
import { useSettings } from '../providers/SettingsProvider';
import { Preview } from './Chapters';
import { TimelineContainer } from './Container';
import { withCrossLines } from './CrossLines';
import { Link } from './Link';
import { withShadow } from './ShadowWrapper';
import { ThumbnailImage } from './ThumbnailImage';
import { Timeline } from './Timeline';
import { Tooltip } from './Tooltip';

interface SectionItemProps {
    $width: number;
    $height: number;
    $focusable: boolean;
}

const SectionItem = withCrossLines(
    styled.div<SectionItemProps>`
        position: relative;
        display: flex;
        flex-direction: column;
        height: ${({ $height }) => scale($height)}svh;
        width: ${({ $width }) => scale($width)}svh;
        transition: width 0.2s ease-in-out;

        ${({ $focusable }) =>
            $focusable &&
            css`
                &:focus {
                    outline: ${scale(20)}svh solid red;
                    z-index: 10; // TODO: fix focus layering
                }
            `}
    `
);

interface SectionItemCoverProps {
    $titleVisible?: boolean;
    $invertBorder?: boolean;
    $blankFontSize: number;
    $titleFontSize: number;
    $fit: 'cover' | 'contain';
    $backgroundColor: CSS.Property.Color;
    $color: CSS.Property.Color;
    $scale: number;
    $sidewaysText: boolean;
}

export const SectionItemCover = withShadow(
    styled.div<SectionItemCoverProps>`
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        background-color: ${({ $backgroundColor }) => $backgroundColor};
        color: ${({ $color }) => $color};
        font-size: ${({ $blankFontSize }) => scale($blankFontSize)}svh;
        height: 100%;
        width: 100%;

        & > a {
            position: absolute;
            writing-mode: ${({ $sidewaysText }) =>
                $sidewaysText ? 'sideways-lr' : 'unset'};
            display: flex;
            align-items: center;
            justify-content: center;
            inset: 0;
            cursor: pointer;
        }

        & > a > img {
            position: absolute;
            object-fit: ${({ $fit }) => $fit};
            height: 100%;
            width: ${({ $fit }) => ($fit === 'cover' ? '100%' : 'auto')};
            transition: 0.1s ease-in-out;
            pointer-events: none;

            will-change: transform, filter;
        }

        &:hover > a > img {
            transform: scale(${({ $scale }) => $scale});
        }

        &::before {
            content: '';
            position: absolute;
            inset: 0;
            opacity: 0;
            transition: opacity 0.2s ease-in-out;
            pointer-events: none;
            z-index: 1;
            ${({ $titleVisible }) =>
                $titleVisible &&
                css`
                    opacity: 1;
                    background-color: rgba(0, 0, 0, 0.2);
                `}
        }

        @media (hover: hover) and (pointer: fine) {
            & > a > img {
                ${({ $titleVisible }) =>
                    $titleVisible &&
                    css`
                        filter: blur(${scale(10)}svh);
                    `}
            }
        }

        @media not ((hover: hover) and (pointer: fine)) {
            &::after {
                text-shadow: -1px -1px 0 black, 1px -1px 0 black,
                    -1px 1px 0 black, 1px 1px 0 black;
            }

            & > a > img {
                ${({ $titleVisible }) =>
                    $titleVisible &&
                    css`
                        filter: blur(${scale(5)}svh);
                    `}
                transform: none !important;
                transition: none !important;
            }
        }

        &::after {
            content: attr(data-title);
            white-space: pre;
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            font-size: ${({ $titleFontSize }) => scale($titleFontSize)}svh;
            color: white;
            z-index: 2;
            opacity: 0;
            inset: 0;
            pointer-events: none;
            transition: opacity 0.2s ease-in-out;
            text-wrap: auto;
            text-shadow: -1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black,
                1px 1px 0 black, 0 0 ${scale(10)}svh black,
                0 0 ${scale(20)}svh rgba(0, 0, 0, 0.5),
                0 0 ${scale(30)}svh rgba(0, 0, 0, 0.3);

            ${({ $titleVisible }) =>
                $titleVisible &&
                css`
                    opacity: 1;
                `}
        }
    `
);

export const TimelineSection: React.FC<TimelineInfoItem> = timelineItem => {
    const [hoveredItem, hoverHandlers] = useHover();
    const { unboundedChapterWidth, showTitles, showCrosslines } = useSettings();

    if (timelineItem.type === 'timeline') return <Timeline />;

    const {
        covers,
        titles,
        offsets,
        widthHandler,
        wikiLink,
        height,
        titleProcessor,
        blankfontSize,
        titleFontSize,
        timeline: nestedTimeline,
    } = timelineItem;

    return (
        <TimelineContainer>
            {covers.map((cover, idx) => {
                const itemNumber = idx + 1;
                const itemWidth = widthHandler(
                    itemNumber,
                    unboundedChapterWidth
                );
                const link = wikiLink(titles[idx] ?? '', itemNumber);
                const title =
                    timelineItem.type === 'chapter'
                        ? itemNumber
                        : titleProcessor?.(titles[idx] ?? '', itemNumber) ??
                          titles[idx];
                const titleVisible = showTitles || hoveredItem(itemNumber);

                const linkImage =
                    timelineItem.type !== 'season' || !!cover ? (
                        <Link href={link}>
                            {cover ? (
                                <ThumbnailImage
                                    src={cover}
                                    $offsetX={offsets?.[idx]?.x ?? 0}
                                    $offsetY={offsets?.[idx]?.y ?? 0}
                                />
                            ) : timelineItem.type === 'arc' ? (
                                title
                            ) : (
                                itemNumber
                            )}
                        </Link>
                    ) : (
                        `SEASON ${itemNumber - 1}`
                    );

                const sectionCover = (
                    <SectionItemCover
                        className={`${timelineItem.type}Cover`}
                        data-title={title}
                        $invertBorder={
                            !cover && timelineItem.type !== 'chapter'
                        }
                        $titleVisible={
                            (!!cover || timelineItem.type === 'chapter') &&
                            titleVisible
                        }
                        $blankFontSize={blankfontSize}
                        $titleFontSize={titleFontSize}
                        $fit={
                            timelineItem.type === 'chapter'
                                ? 'contain'
                                : 'cover'
                        }
                        $backgroundColor={
                            timelineItem.type === 'chapter' ? 'white' : 'black'
                        }
                        $color={
                            timelineItem.type === 'chapter' ? 'black' : 'white'
                        }
                        $scale={timelineItem.type === 'episode' ? 1.2 : 1.05}
                        $sidewaysText={timelineItem.type === 'arc'}
                    >
                        {linkImage}
                    </SectionItemCover>
                );

                const chapterPreview = (
                    <Preview
                        className='preview'
                        $firstChapter={idx === 0}
                        $hasPicture={!!cover}
                    >
                        {cover && <ThumbnailImage src={cover} />}
                        {titleProcessor?.(titles[idx] ?? '', itemNumber)}
                    </Preview>
                );

                const sectionCoverTooltip =
                    timelineItem.type === 'chapter' ? (
                        <Tooltip
                            placement='top'
                            animation='grow'
                            content={chapterPreview}
                            visible={!showCrosslines && hoveredItem(itemNumber)}
                        >
                            {sectionCover}
                        </Tooltip>
                    ) : (
                        sectionCover
                    );

                return (
                    <SectionItem
                        id={`${timelineItem.type}-${itemNumber}`}
                        className={timelineItem.type}
                        $width={itemWidth}
                        $height={height}
                        key={cover || itemNumber}
                        $crossLinesVisible={hoveredItem(itemNumber)}
                        {...hoverHandlers(itemNumber)}
                        $focusable={timelineItem.type === 'chapter'}
                        tabIndex={-1}
                    >
                        {sectionCoverTooltip}
                        {nestedTimeline &&
                            timelineItem.type === 'season' &&
                            itemNumber === 1 && (
                                <TimelineSection {...nestedTimeline} />
                            )}
                    </SectionItem>
                );
            })}
        </TimelineContainer>
    );
};
