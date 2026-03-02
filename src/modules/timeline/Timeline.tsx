import { useCallback, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';

import { withCrossLines } from '@modules/timeline/CrossLines';
import { useSettings } from '@shared/contexts/SettingsContext';
import {
    chapterDatesByMonth,
    chapterDatesByYear,
    Chunk,
    DAYS_GRADIENT,
    interpolateColor,
    MONTHS,
    MONTHS_GRADIENT,
    scale,
} from '@shared/lib/helpers';
import { useHover } from '@shared/lib/hooks';
import { map, NonEmptyArray, sum } from '@shared/lib/util';
import { withShadow } from '@shared/ui';
import { SMALL_FONT_SIZE, TIMELINE_HEIGHT } from '@timelines/index';
import { TIMELINE } from '@timelines/registry';
import { ResolvedChapter } from '@timelines/resolved';
import { AnimeTitle } from '@timelines/types';

type DayProps = {
    $width: number;
    $background: string;
    $variant: string;
};

const Timeframe = withCrossLines(
    withShadow(
        // a pretty long comment with a lot of words to force good formatting
        // eslint-disable-next-line arrow-body-style
        styled.div.attrs<DayProps>(({ $width }) => {
            return {
                style: {
                    width: scale($width),
                },
            };
        })`
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            height: ${scale(TIMELINE_HEIGHT / 3)};
            background: ${({ $background }) => $background};
            color: black;
            font-size: ${scale(SMALL_FONT_SIZE)};
            line-height: ${scale(TIMELINE_HEIGHT / 3)};
            transition: width 0.2s ease-in-out;
            cursor: ${({ $variant }) =>
                $variant === 'days' ? 'pointer' : 'default'};
        `,
    ),
);

const TimeframeDate = styled.div`
    text-align: center;
    overflow: hidden;
`;

const TimelineWrapper = styled.div`
    position: relative;
    display: flex;
    height: ${scale(TIMELINE_HEIGHT / 3)};
`;

type Segment = {
    width: number;
    colorValue: number;
    label: string;
};

type TimelineSegmentProps = {
    segments: NonEmptyArray<Segment>;
    colorInterpolation: {
        inputRange: readonly [number, number];
        outputGradient: NonEmptyArray<number>;
    };
    variant: 'years' | 'months' | 'days';
};

const TimelineSegment: React.FC<TimelineSegmentProps> = ({
    segments,
    colorInterpolation,
    variant,
}) => {
    const [hoveredSegment, hoverHandlers] = useHover<number>();
    const { setCalendarOpen } = useSettings();
    const lastClickedChapter = useRef<number | null>(null);

    const handleDayClick = useCallback(
        (ev: React.MouseEvent, chapterNumber: number | null) => {
            ev.preventDefault();
            if (!chapterNumber) {
                return;
            }

            setCalendarOpen(true);
            lastClickedChapter.current = chapterNumber;
        },
        [setCalendarOpen],
    );

    useEffect(() => {
        if (lastClickedChapter.current === null) {
            return;
        }

        const element = document.querySelector(
            `#day-${lastClickedChapter.current}`,
        );
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center',
            });
            (element as HTMLElement).focus({
                preventScroll: false,
            });
        }

        lastClickedChapter.current = null;
    }, [setCalendarOpen]);

    return (
        <TimelineWrapper className={`wrapper-${variant}`}>
            {segments.map((segment, idx) => {
                const { width, colorValue, label } = segment;
                const { inputRange, outputGradient } = colorInterpolation;

                const color = interpolateColor(
                    colorValue,
                    inputRange,
                    outputGradient,
                );

                const chapterNumber = idx + 1;
                return (
                    <Timeframe
                        key={chapterNumber}
                        className={`frame-${variant}`}
                        $width={width}
                        $crossLinesVisible={hoveredSegment(chapterNumber)}
                        {...hoverHandlers(chapterNumber)}
                        $background={`#${color.toString(16).padStart(6, '0')}`}
                        onClick={
                            variant === 'days' ?
                                ev => handleDayClick(ev, chapterNumber)
                            :   undefined
                        }
                        $variant={variant}
                        role={variant === 'days' ? 'button' : undefined}
                        tabIndex={variant === 'days' ? 0 : -1}
                        onKeyDown={
                            variant === 'days' ?
                                ev =>
                                    // a11y: allow focusing with space or enter
                                    (ev.key === 'Enter' || ev.key === ' ') &&
                                    handleDayClick(
                                        ev as unknown as React.MouseEvent,
                                        chapterNumber,
                                    )
                            :   undefined
                        }
                    >
                        <TimeframeDate className={`date-${variant}`}>
                            {label}
                        </TimeframeDate>
                    </Timeframe>
                );
            })}
        </TimelineWrapper>
    );
};

type TimelineProps = {
    animeTitle: AnimeTitle;
};

const toSegments = <T extends ResolvedChapter>(
    chunks: NonEmptyArray<Chunk<T>>,
    getMeta: (_first: T) => Omit<Segment, 'width'>,
    unboundChapterWidth: boolean,
): NonEmptyArray<Segment> =>
    map(chunks, group => {
        const [first] = group;
        const { colorValue, label } = getMeta(first);

        return {
            width: sum(group.map(ch => ch.width(unboundChapterWidth))),
            colorValue,
            label,
        };
    });

export const Timeline: React.FC<TimelineProps> = ({ animeTitle }) => {
    const { unboundChapterWidth } = useSettings();
    const timeline = TIMELINE[animeTitle];

    const daysSegments: NonEmptyArray<Segment> = useMemo(
        () =>
            map(timeline.data.chapters, ch => ({
                width: ch.width(unboundChapterWidth),
                colorValue: ch.date.getDate(),
                label: ch.date.getDate().toString(),
            })),
        [timeline.data.chapters, unboundChapterWidth],
    );

    const monthsSegments: NonEmptyArray<Segment> = useMemo(
        () =>
            toSegments(
                chapterDatesByMonth(timeline),
                ch => {
                    const month = ch.date.getMonth();
                    return {
                        colorValue: (month + 1) % 12,
                        label: MONTHS[month] ?? 'Invalid month',
                    };
                },
                unboundChapterWidth,
            ),
        [timeline, unboundChapterWidth],
    );

    const yearsSegments: NonEmptyArray<Segment> = useMemo(
        () =>
            toSegments(
                chapterDatesByYear(timeline),
                ch => {
                    const year = ch.date.getFullYear();
                    return { colorValue: year, label: year.toString() };
                },
                unboundChapterWidth,
            ),
        [timeline, unboundChapterWidth],
    );
    const yearRange = useMemo(() => {
        const start = yearsSegments[0].colorValue;
        const end = yearsSegments.at(-1)?.colorValue ?? start;
        return [start, end] as const;
    }, [yearsSegments]);

    return (
        <>
            <TimelineSegment
                segments={yearsSegments}
                colorInterpolation={{
                    inputRange: yearRange,
                    outputGradient: [0xaaaaaa, 0xffffff],
                }}
                variant='years'
            />
            <TimelineSegment
                segments={monthsSegments}
                colorInterpolation={{
                    inputRange: [0, 11],
                    outputGradient: MONTHS_GRADIENT,
                }}
                variant='months'
            />
            <TimelineSegment
                segments={daysSegments}
                colorInterpolation={{
                    inputRange: [1, 31],
                    outputGradient: DAYS_GRADIENT,
                }}
                variant='days'
            />
        </>
    );
};
