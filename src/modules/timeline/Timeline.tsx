import { useCallback, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';

import { withCrossLines } from '@modules/timeline/CrossLines';
import useSettings from '@shared/contexts/SettingsContext';
import {
    chapterDates,
    chapterDatesByMonth,
    chapterDatesByYear,
    DAYS_GRADIENT,
    getChapterWidth,
    interpolateColor,
    MONTHS,
    MONTHS_GRADIENT,
    scale,
} from '@shared/lib/helpers';
import { useHover } from '@shared/lib/hooks';
import { sum } from '@shared/lib/util';
import { withShadow } from '@shared/ui';
import { TIMELINE } from '@timelines/registry';
import { SMALL_FONT_SIZE, TIMELINE_HEIGHT } from '@timelines/index';
import { AnimeTitle } from '@timelines/types';

type DayProps = {
    $width: number;
    $background: string;
    $variant: string;
};

const Timeframe = withCrossLines(
    withShadow(
        // a comment to have a line break, otherwise syntax highlighting breaks
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
    const [hoveredSegment, hoverHandlers] = useHover();
    const { unboundedChapterWidth, setCalendarOpen, animeTitle } =
        useSettings();
    const lastClickedChapter = useRef<number | null>(null);

    const handleDayClick = useCallback(
        (e: React.MouseEvent, chapterNumber: number | null) => {
            e.preventDefault();
            if (!chapterNumber) return;

            setCalendarOpen(true);
            lastClickedChapter.current = chapterNumber;
        },
        [setCalendarOpen],
    );

    useEffect(() => {
        if (lastClickedChapter.current === null) return;

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
                    chapterNumbers.map(ci =>
                        getChapterWidth(
                            TIMELINE[animeTitle].data,
                            ci - 1,
                            unboundedChapterWidth,
                        ),
                    ),
                );

                const color = interpolateColor(
                    colorValue,
                    inputRange,
                    outputGradient,
                );

                return (
                    <Timeframe
                        key={idx}
                        className={`frame-${variant}`}
                        $width={totalWidth}
                        $crossLinesVisible={hoveredSegment(idx + 1)}
                        {...hoverHandlers(idx + 1)}
                        $background={`#${color.toString(16).padStart(6, '0')}`}
                        onClick={
                            variant === 'days' ?
                                e => handleDayClick(e, idx + 1)
                            :   undefined
                        }
                        $variant={variant}
                        role={variant === 'days' ? 'button' : undefined}
                        tabIndex={variant === 'days' ? 0 : -1}
                        onKeyDown={
                            variant === 'days' ?
                                e =>
                                    // a11y: allow focusing with space or enter
                                    (e.key === 'Enter' || e.key === ' ') &&
                                    handleDayClick(
                                        e as unknown as React.MouseEvent,
                                        idx + 1,
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

export const Timeline: React.FC<{ $animeTitle: AnimeTitle }> = ({
    $animeTitle,
}) => {
    const daysSegments = useMemo(
        () =>
            chapterDates(TIMELINE[$animeTitle]).map((date, idx) => ({
                chapterNumbers: [idx + 1],
                colorValue: date.getDate(),
                label: date.getDate().toString(),
            })),
        [$animeTitle],
    );

    const monthsSegments = useMemo(
        () =>
            chapterDatesByMonth(TIMELINE[$animeTitle]).map(dates => {
                const month = dates[0]![1].getMonth();
                return {
                    chapterNumbers: dates.map(([dateIdx]) => dateIdx + 1),
                    colorValue: (month + 1) % 12,
                    label: MONTHS[month]!,
                };
            }),
        [$animeTitle],
    );

    const yearsSegments = useMemo(
        () =>
            chapterDatesByYear(TIMELINE[$animeTitle]).map(dates => {
                const yearDate = dates[0]![1];
                return {
                    chapterNumbers: dates.map(([dateIdx]) => dateIdx + 1),
                    colorValue: yearDate.getFullYear(),
                    label: yearDate.getFullYear().toString(),
                };
            }),
        [$animeTitle],
    );

    return (
        <>
            <TimelineSegment
                segments={yearsSegments}
                colorInterpolation={{
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
