import { useEffect, useState, type FC } from 'react';
import styled, { css } from 'styled-components';
import { CSS } from 'styled-components/dist/types';

import {
    TIMELINE,
    TimelineEntity,
    TimelineSectionItem,
    TimelineSectionType,
} from '../constants';
import useHover from '../hooks/useHover';
import { useSettings } from '../providers/SettingsProvider';
import { hueGlow, scale } from '../helpers';
import { ThumbnailImage } from './ThumbnailImage';
import { TimelineSection } from './TimelineSection';
import { ChapterPreview } from './ChapterPreview';
import { withCrossLines } from './CrossLines';
import { withShadow } from './ShadowWrapper';
import { Tooltip } from './Tooltip';
import { Link } from './Link';

interface SectionItemCoverProps {
    $titleVisible?: boolean;
    $invertBorder?: boolean;
    $blankFontSize: number;
    $titleFontSize: number;
    $fit: CSS.Property.ObjectFit;
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

type TimelineSectionItemProps = {
    timelineSection: {
        [K in TimelineSectionType]: TimelineSectionItem<K>;
    }[TimelineSectionType];
    entity: TimelineEntity;
    idx: number;
};

export const TimelineSectionItemComponent: FC<
    TimelineSectionItemProps
> = props => {
    const [hoveredItem, hoverHandlers] = useHover();
    const { timelineSection, entity, idx } = props;
    const { unboundedChapterWidth, showTitles, showCrosslines, animeTitle } =
        useSettings();
    const [itemWidth, setItemWidth] = useState(0);

    const timeline = TIMELINE[animeTitle].data;

    const {
        type,
        fit = 'cover',
        backgroundColor = 'black',
        scale = 1.05,
        sidewaysText = false,
        width,
        wikiLink,
        height,
        titleProcessor = a => a,
        numberProcessor = a => a.toString(),
        blankfontSize,
        titleFontSize,
        focusable = false,
        subTimeline: nestedTimeline,
    } = timelineSection;

    useEffect(() => {
        setItemWidth(width(timeline, idx, unboundedChapterWidth));
    }, [unboundedChapterWidth]);

    const itemNumber = idx + 1;
    const processedNumber = numberProcessor(itemNumber);

    const title =
        (typeof entity.title === 'function'
            ? entity.title(timeline, idx)
            : entity.title) ?? processedNumber;
    const cover =
        typeof entity.cover === 'function'
            ? entity.cover(timeline, idx)
            : entity.cover;
    const offset = 'offset' in entity ? entity.offset : null;

    const link = `${timeline.wikiBase}${wikiLink(title, itemNumber)}`;
    const itemTitle =
        type === 'chapter'
            ? processedNumber
            : titleProcessor(title, itemNumber);

    const hovered = hoveredItem(itemNumber);
    const titleVisible = showTitles || hovered;
    const textColor = backgroundColor === 'black' ? 'white' : 'black';

    const linkImage =
        type !== 'season' || cover ? (
            <Link href={link}>
                {cover ? (
                    <ThumbnailImage
                        src={cover}
                        $offsetX={offset?.x}
                        $offsetY={offset?.y}
                    />
                ) : type === 'arc' ? (
                    // for arcs without cover, just show the title
                    itemTitle
                ) : (
                    // for everything else, show the number
                    processedNumber
                )}
            </Link>
        ) : (
            // don't add link to seasons without cover (speculation)
            `SEASON ${processedNumber}`
        );

    const itemCover = (
        <SectionItemCover
            className={`${type}Cover`}
            data-title={itemTitle}
            $invertBorder={!cover && backgroundColor === 'black'}
            $titleVisible={(!!cover || textColor === 'black') && titleVisible}
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
            {titleProcessor(title, itemNumber)}
        </ChapterPreview>
    );

    const itemCoverTooltip =
        type === 'chapter' ? (
            <Tooltip
                placement='top'
                animation='grow'
                content={chapterPreview}
                visible={!showCrosslines && hovered}
            >
                {itemCover}
            </Tooltip>
        ) : (
            itemCover
        );

    return (
        <SectionItem
            id={`${type}-${itemNumber}`}
            className={type}
            $width={itemWidth}
            $height={height}
            key={cover || itemNumber}
            $crossLinesVisible={hovered}
            {...hoverHandlers(itemNumber)}
            $focusable={focusable}
            tabIndex={focusable ? -1 : undefined}
        >
            {itemCoverTooltip}
            {nestedTimeline && (
                <TimelineSection specificIndex={idx} {...nestedTimeline} />
            )}
        </SectionItem>
    );
};
