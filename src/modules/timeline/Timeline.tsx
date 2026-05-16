import { useCallback, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';

import { withCrossLines } from '@modules/timeline/CrossLines';
import { useSettings } from '@shared/contexts/SettingsContext';
import { useTimeline } from '@shared/contexts/TimelineContext';
import {
    chapterDatesByMonth,
    chapterDatesByYear,
    Chunk,
    DAYS_GRADIENT,
    interpolateColor,
    MONTHS,
    MONTHS_GRADIENT,
    scale,
    scrollToId,
} from '@shared/lib/helpers';
import { useHover } from '@shared/lib/hooks';
import { asNonEmpty, map, NonEmptyArray, sum } from '@shared/lib/util';
import { withShadow } from '@shared/ui';
import { SMALL_FONT_SIZE, TIMELINE_HEIGHT } from '@timelines/index';
import { ResolvedChapter } from '@timelines/resolved';

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
            display: flex;
            position: relative;
            align-items: center;
            justify-content: center;
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
    display: flex;
    height: ${TIMELINE_HEIGHT / 3};
`;

type Segment = {
    width: number;
    colorValue: number;
    label: string;
    chapterNumber: string;
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
    const [hoveredSegment, hoverHandlers] = useHover<string>();
    const { setCalendarOpen } = useSettings();
    const lastClickedChapter = useRef<string | null>(null);

    const openCalendarForChapter = useCallback(
        (chapterNumber: string) => {
            setCalendarOpen(true);
            lastClickedChapter.current = chapterNumber;
        },
        [setCalendarOpen],
    );

    useEffect(() => {
        if (lastClickedChapter.current === null) {
            return;
        }

        scrollToId(`day-${lastClickedChapter.current}`);

        lastClickedChapter.current = null;
    }, [setCalendarOpen]);

    return (
        <TimelineWrapper className={`wrapper-${variant}`}>
            {segments.map(segment => {
                const { width, colorValue, label, chapterNumber } = segment;
                const { inputRange, outputGradient } = colorInterpolation;

                const color = interpolateColor(
                    colorValue,
                    inputRange,
                    outputGradient,
                );

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
                                ev => {
                                    ev.preventDefault();
                                    openCalendarForChapter(chapterNumber);
                                }
                            :   undefined
                        }
                        $variant={variant}
                        role={variant === 'days' ? 'button' : undefined}
                        tabIndex={variant === 'days' ? 0 : -1}
                        onKeyDown={
                            variant === 'days' ?
                                ev => {
                                    // a11y: allow focusing with space or enter
                                    if (ev.key !== 'Enter' && ev.key !== ' ') {
                                        return;
                                    }
                                    ev.preventDefault();
                                    openCalendarForChapter(chapterNumber);
                                }
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

const toSegments = <T extends ResolvedChapter>(
    chunks: NonEmptyArray<Chunk<T>>,
    getMeta: (_first: T) => Omit<Segment, 'width'>,
    unboundChapterWidth: boolean,
): NonEmptyArray<Segment> =>
    map(chunks, group => {
        const [first] = group;
        return {
            width: sum(group.map(({ width }) => width(unboundChapterWidth))),
            ...getMeta(first),
        };
    });

export const Timeline: React.FC = () => {
    const { unboundChapterWidth, showExtraChapters } = useSettings();
    const {
        data: { chapters },
    } = useTimeline();

    const visibleChapters = useMemo(
        () =>
            showExtraChapters ? chapters : (
                asNonEmpty(
                    chapters.filter(ch => !ch.extra),
                    'visibleChapters',
                )
            ),
        [chapters, showExtraChapters],
    );

    const daysSegments: NonEmptyArray<Segment> = useMemo(
        () =>
            map(visibleChapters, ({ width, date, number }) => ({
                width: width(unboundChapterWidth),
                colorValue: date.getDate(),
                label: date.getDate().toString(),
                chapterNumber: number,
            })),
        [visibleChapters, unboundChapterWidth],
    );

    const monthsSegments: NonEmptyArray<Segment> = useMemo(
        () =>
            toSegments(
                chapterDatesByMonth(visibleChapters),
                ({ date, number }) => {
                    const month = date.getMonth();
                    return {
                        colorValue: (month + 1) % 12,
                        label: MONTHS[month] ?? 'Invalid month',
                        chapterNumber: number,
                    };
                },
                unboundChapterWidth,
            ),
        [visibleChapters, unboundChapterWidth],
    );

    const yearsSegments: NonEmptyArray<Segment> = useMemo(
        () =>
            toSegments(
                chapterDatesByYear(visibleChapters),
                ({ date, number }) => {
                    const year = date.getFullYear();
                    return {
                        colorValue: year,
                        label: year.toString(),
                        chapterNumber: number,
                    };
                },
                unboundChapterWidth,
            ),
        [visibleChapters, unboundChapterWidth],
    );
    const yearRange = useMemo(() => {
        const years = yearsSegments.map(seg => seg.colorValue);
        const minYear = Math.min(...years);
        const maxYear = Math.max(...years);
        return [minYear, maxYear] as const;
    }, [yearsSegments]);

    return (
        <>
            <TimelineSegment
                segments={yearsSegments}
                colorInterpolation={{
                    inputRange: yearRange,
                    outputGradient: [0x888888, 0xffffff],
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
