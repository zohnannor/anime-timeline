import { useCallback, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';

import { withCrossLines } from '@modules/timeline/CrossLines';
import { useSettings } from '@shared/contexts/SettingsContext';
import {
    chapterDates,
    chapterDatesByMonth,
    chapterDatesByYear,
    DAYS_GRADIENT,
    interpolateColor,
    MONTHS,
    MONTHS_GRADIENT,
    scale,
} from '@shared/lib/helpers';
import { useHover } from '@shared/lib/hooks';
import { sum } from '@shared/lib/util';
import { withShadow } from '@shared/ui';
import { SMALL_FONT_SIZE, TIMELINE_HEIGHT } from '@timelines/index';
import { TIMELINE } from '@timelines/registry';
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
    chapterNumbers: number[];
    colorValue: number;
    label: string;
};

type TimelineSegmentProps = {
    segments: Segment[];
    colorInterpolation: {
        inputRange: [number, number];
        outputGradient: number[];
    };
    variant: 'years' | 'months' | 'days';
};

const TimelineSegment: React.FC<TimelineSegmentProps> = ({
    segments,
    colorInterpolation,
    variant,
}) => {
    const [hoveredSegment, hoverHandlers] = useHover<number>();
    const { unboundChapterWidth, setCalendarOpen, animeTitle } = useSettings();
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
                const { chapterNumbers, colorValue, label } = segment;
                const { inputRange, outputGradient } = colorInterpolation;

                const totalWidth = sum(
                    chapterNumbers.map(
                        ci =>
                            // TODO: fix this! refactor `Segment`.
                            TIMELINE[animeTitle].data.chapters[ci - 1]?.width(
                                unboundChapterWidth,
                            ) ?? 0,
                    ),
                );

                const color = interpolateColor(
                    colorValue,
                    inputRange,
                    outputGradient,
                );

                const chapter = idx + 1;
                return (
                    <Timeframe
                        key={chapter}
                        className={`frame-${variant}`}
                        $width={totalWidth}
                        $crossLinesVisible={hoveredSegment(chapter)}
                        {...hoverHandlers(chapter)}
                        $background={`#${color.toString(16).padStart(6, '0')}`}
                        onClick={
                            variant === 'days' ?
                                ev => handleDayClick(ev, chapter)
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
                                        chapter,
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

export const Timeline: React.FC<TimelineProps> = ({ animeTitle }) => {
    const daysSegments = useMemo(
        () =>
            chapterDates(TIMELINE[animeTitle]).map((date, idx) => ({
                chapterNumbers: [idx + 1],
                colorValue: date.getDate(),
                label: date.getDate().toString(),
            })),
        [animeTitle],
    );

    const monthsSegments = useMemo(
        () =>
            chapterDatesByMonth(TIMELINE[animeTitle]).map(dates => {
                // each month in the array has at least one day
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const month = dates[0]![1].getMonth();
                return {
                    chapterNumbers: dates.map(([dateIdx]) => dateIdx + 1),
                    colorValue: (month + 1) % 12,
                    // can't be out of bounds, obtained from `getMonth`
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    label: MONTHS[month]!,
                };
            }),
        [animeTitle],
    );

    const yearsSegments = useMemo(
        () =>
            chapterDatesByYear(TIMELINE[animeTitle]).map(dates => {
                // each month has at least one day
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const [, yearDate] = dates[0]!;
                return {
                    chapterNumbers: dates.map(([dateIdx]) => dateIdx + 1),
                    colorValue: yearDate.getFullYear(),
                    label: yearDate.getFullYear().toString(),
                };
            }),
        [animeTitle],
    );

    return (
        <>
            <TimelineSegment
                segments={yearsSegments}
                colorInterpolation={{
                    // TODO: get start/end from timeline
                    inputRange: [2018, 2025],
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
