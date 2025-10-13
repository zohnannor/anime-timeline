import React from 'react';
import styled, { css } from 'styled-components';
import { CSS } from 'styled-components/dist/types';

import {
    TIMELINE,
    TimelineSectionItem,
    TimelineSectionType,
} from '../constants';
import { hueGlow, scale } from '../helpers';
import useHover from '../hooks/useHover';
import { useSettings } from '../providers/SettingsProvider';
import { ChapterPreview } from './ChapterPreview';
import { withCrossLines } from './CrossLines';
import { Link } from './Link';
import { withShadow } from './ShadowWrapper';
import { ThumbnailImage } from './ThumbnailImage';
import { Timeline } from './Timeline';
import { TimelineContainer } from './TimelineContainer';
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
        height: ${({ $height }) => scale($height)};
        width: ${({ $width }) => scale($width)};
        transition: width 0.2s ease-in-out;

        ${({ $focusable }) =>
            $focusable &&
            css`
                &:focus {
                    z-index: 1;
                    outline: ${scale(20)} solid red;
                    animation: ${hueGlow} 2s linear infinite;
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
        font-size: ${({ $blankFontSize }) => scale($blankFontSize)};
        height: 100%;
        width: 100%;

        & > a {
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            inset: 0;
            cursor: pointer;

            writing-mode: ${({ $sidewaysText }) =>
                $sidewaysText ? 'vertical-lr' : 'unset'};
        }

        @supports (writing-mode: sideways-lr) {
            & > a {
                writing-mode: ${({ $sidewaysText }) =>
                    $sidewaysText ? 'sideways-lr' : 'unset'};
            }
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
                        filter: blur(${scale(10)});
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
                        filter: blur(${scale(5)});
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
            font-size: ${({ $titleFontSize }) => scale($titleFontSize)};
            color: white;
            z-index: 2;
            opacity: 0;
            inset: 0;
            pointer-events: none;
            transition: opacity 0.2s ease-in-out;
            text-wrap: auto;
            text-shadow: -1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black,
                1px 1px 0 black, 0 0 ${scale(10)} black,
                0 0 ${scale(20)} rgba(0, 0, 0, 0.5),
                0 0 ${scale(30)} rgba(0, 0, 0, 0.3);

            ${({ $titleVisible }) =>
                $titleVisible &&
                css`
                    opacity: 1;
                `}
        }
    `
);

type TimelineSections =
    | {
          [K in TimelineSectionType]: TimelineSectionItem<K>;
      }[TimelineSectionType]
    | {
          type: 'timeline';
      };

export const TimelineSection: React.FC<TimelineSections> = timelineItem => {
    const [hoveredItem, hoverHandlers] = useHover();
    const { unboundedChapterWidth, showTitles, showCrosslines, animeTitle } =
        useSettings();

    if (timelineItem.type === 'timeline')
        return <Timeline $animeTitle={animeTitle} />;

    const {
        type,
        fit = 'cover',
        backgroundColor = 'black',
        scale = 1.05,
        sidewaysText = false,
        width,
        wikiLink,
        height,
        titleProcessor,
        blankfontSize,
        titleFontSize,
        focusable = false,
        subTimeline: nestedTimeline,
    } = timelineItem;

    const entities = {
        arc: TIMELINE[animeTitle].data.arcs,
        chapter: TIMELINE[animeTitle].data.volumes.flatMap(v => v.chapters),
        season: TIMELINE[animeTitle].data.seasons,
        episode: TIMELINE[animeTitle].data.seasons.flatMap(
            s => s.episodes ?? []
        ),
        volume: TIMELINE[animeTitle].data.volumes,
    };

    return (
        <TimelineContainer>
            {entities[type].map((entity, idx) => {
                const title =
                    typeof entity.title === 'function'
                        ? entity.title(TIMELINE[animeTitle].data, idx)
                        : entity.title;
                const cover =
                    typeof entity.cover === 'function'
                        ? entity.cover(TIMELINE[animeTitle].data, idx)
                        : entity.cover;
                const offset = 'offset' in entity ? entity.offset : null;

                const itemNumber = idx + 1;
                const itemWidth = width(
                    TIMELINE[animeTitle].data,
                    itemNumber,
                    unboundedChapterWidth
                );
                const link = wikiLink(title ?? '', itemNumber);
                const itemTitle =
                    timelineItem.type === 'chapter'
                        ? itemNumber
                        : titleProcessor?.(title ?? '', itemNumber) ?? title;

                const titleVisible = showTitles || hoveredItem(itemNumber);
                const textColor =
                    backgroundColor === 'black' ? 'white' : 'black';

                const linkImage =
                    timelineItem.type !== 'season' || !!cover ? (
                        <Link href={link}>
                            {cover ? (
                                <ThumbnailImage
                                    src={cover}
                                    $offsetX={offset?.x}
                                    $offsetY={offset?.y}
                                />
                            ) : timelineItem.type === 'arc' ? (
                                itemTitle
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
                        data-title={itemTitle}
                        $invertBorder={!cover && backgroundColor === 'black'}
                        $titleVisible={
                            (!!cover || textColor === 'black') && titleVisible
                        }
                        $blankFontSize={blankfontSize}
                        $titleFontSize={titleFontSize}
                        $fit={fit}
                        $backgroundColor={backgroundColor}
                        $color={textColor}
                        $scale={scale}
                        $sidewaysText={sidewaysText}
                    >
                        {linkImage}
                    </SectionItemCover>
                );

                const chapterPreview = (
                    <ChapterPreview className='preview' $hasPicture={!!cover}>
                        {cover && <ThumbnailImage src={cover} />}
                        {titleProcessor?.(title ?? '', itemNumber)}
                    </ChapterPreview>
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
                        $focusable={focusable}
                        tabIndex={focusable ? -1 : undefined}
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
