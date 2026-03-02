import CSS from 'csstype';
import styled, { css } from 'styled-components';

import { ChapterPreview } from '@modules/timeline/ChapterPreview';
import { withCrossLines } from '@modules/timeline/CrossLines';
import { TimelineSection } from '@modules/timeline/TimelineSection';
import { useSettings } from '@shared/contexts/SettingsContext';
import { hueGlow, scale } from '@shared/lib/helpers';
import { useHover } from '@shared/lib/hooks';
import { Link, ThumbnailImage, Tooltip, withShadow } from '@shared/ui';
import { TIMELINE } from '@timelines/registry';
import {
    ResolvedSectionItem,
    ResolvedTimelineEntity,
} from '@timelines/resolved';
import { TimelineSectionType } from '@timelines/types';

type SectionItemCoverProps = {
    $titleVisible?: boolean;
    $invertBorder?: boolean;
    $blankFontSize: number;
    $titleFontSize: number;
    $fit: CSS.Property.ObjectFit;
    $backgroundColor: CSS.Property.Color;
    $color: CSS.Property.Color;
    $scale: number;
    $sidewaysText: boolean;
};

const SectionItemCover = withShadow(
    // a comment to have a line break, otherwise syntax highlighting breaks
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
                text-shadow:
                    -1px -1px 0 black,
                    1px -1px 0 black,
                    -1px 1px 0 black,
                    1px 1px 0 black;
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
            white-space: pre-wrap;
            line-break: strict;
            hyphens: auto;
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
            text-shadow:
                -1px -1px 0 black,
                1px -1px 0 black,
                -1px 1px 0 black,
                1px 1px 0 black,
                0 0 ${scale(10)} black,
                0 0 ${scale(20)} rgba(0, 0, 0, 0.5),
                0 0 ${scale(30)} rgba(0, 0, 0, 0.3);

            ${({ $titleVisible }) =>
                $titleVisible &&
                css`
                    opacity: 1;
                `}
        }
    `,
);

type SectionItemProps = {
    $width: number;
    $height: number;
    $focusable: boolean;
};

const SectionItem = withCrossLines(
    // a pretty long comment with a lot of words to force good code formatting
    // eslint-disable-next-line arrow-body-style
    styled.div.attrs<SectionItemProps>(({ $width }) => {
        return {
            style: {
                width: scale($width),
            },
        };
    })`
        position: relative;
        display: flex;
        flex-direction: column;
        height: ${({ $height }) => scale($height)};
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
    `,
);

type TimelineSectionItemProps = {
    timelineSection: ResolvedSectionItem<TimelineSectionType>;
    entity: ResolvedTimelineEntity[TimelineSectionType];
    num: number;
};

export const TimelineSectionItemComponent: React.FC<
    TimelineSectionItemProps
> = ({
    timelineSection: {
        type,
        fit = 'cover',
        defaultCoverPosition = 'center',
        backgroundColor = 'black',
        scale = 1.05,
        sidewaysText = false,
        height,
        blankfontSize,
        titleFontSize,
        focusable = false,
        subTimeline: nestedTimeline,
    },
    entity,
    num,
}) => {
    const [hoveredItem, hoverHandlers] = useHover<string>();
    const { unboundChapterWidth, showTitles, showCrosslines, animeTitle } =
        useSettings();

    const {
        data: { wikiBase },
    } = TIMELINE[animeTitle];

    const itemWidth = entity.width(unboundChapterWidth);
    const itemNumber = entity.number;

    const { title } = entity;
    const cover = 'cover' in entity ? entity.cover : null;
    const offset = 'offset' in entity ? entity.offset : null;

    const itemTitle = type === 'chapter' ? itemNumber : title;

    const hovered = hoveredItem(itemNumber);
    const titleVisible = showTitles || hovered;
    const textColor = backgroundColor === 'black' ? 'white' : 'black';

    const linkImage =
        type === 'season' && typeof cover !== 'string' ?
            // don't add link to seasons without cover (speculation)
            `SEASON ${itemNumber}`
        :   <Link href={`${wikiBase}${entity.wikiLink}`}>
                {cover ?
                    <ThumbnailImage
                        src={cover}
                        $offsetX={offset?.x}
                        $offsetY={offset?.y}
                        $defaultPosition={defaultCoverPosition}
                    />
                : type === 'arc' || type === 'saga' ?
                    // for sagas/arcs without cover, just show the title
                    itemTitle
                    // for everything else, show the number
                :   itemNumber}
            </Link>;

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
            {title}
        </ChapterPreview>
    );

    const itemCoverTooltip =
        type === 'chapter' ?
            <Tooltip
                placement='top'
                animation='grow'
                content={chapterPreview}
                visible={!showCrosslines && hovered}
            >
                {itemCover}
            </Tooltip>
        :   itemCover;

    return (
        <SectionItem
            id={`${type}-${itemNumber}`}
            className={type}
            $width={itemWidth}
            $height={height}
            key={cover ?? itemNumber}
            $crossLinesVisible={hovered}
            {...hoverHandlers(itemNumber)}
            $focusable={focusable}
            tabIndex={focusable ? -1 : undefined}
        >
            {itemCoverTooltip}
            {nestedTimeline && (
                <TimelineSection parentNumber={num} {...nestedTimeline} />
            )}
        </SectionItem>
    );
};
