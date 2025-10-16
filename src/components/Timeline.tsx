import { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';

import {
    AnimeTitle,
    SMALL_FONT_SIZE,
    TIMELINE,
    TIMELINE_HEIGHT,
} from '../constants';
import { getChapterWidth } from '../constants/widthHelpers';
import {
    chapterDates,
    chapterDatesByMonth,
    chapterDatesByYear,
    DAYS_GRADIENT,
    interpolateColor,
    MONTHS,
    MONTHS_GRADIENT,
    scale,
} from '../helpers';
import useHover from '../hooks/useHover';
import { useSettings } from '../providers/SettingsProvider';
import { sum } from '../util';
import { withCrossLines } from './CrossLines';
import { withShadow } from './ShadowWrapper';

interface DayProps {
    $width: number;
    $background: string;
    $variant: string;
}

const Timeframe = withCrossLines(
    withShadow(
        styled.div<DayProps>`
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            height: ${scale(TIMELINE_HEIGHT / 3)};
            width: ${({ $width }) => scale($width)};
            background: ${({ $background }) => $background};
            color: black;
            font-size: ${scale(SMALL_FONT_SIZE)};
            line-height: ${scale(TIMELINE_HEIGHT / 3)};
            transition: width 0.2s ease-in-out;
            cursor: ${({ $variant }) =>
                $variant === 'days' ? 'pointer' : 'default'};
        `
    )
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

interface TimelineSegmentProps {
    segments: Segment[];
    colorInterpolation: {
        inputRange: [number, number];
        outputGradient: number[];
    };
    variant: string;
}

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
        [setCalendarOpen]
    );

    useEffect(() => {
        if (lastClickedChapter.current === null) return;

        const element = document.querySelector(
            `#day-${lastClickedChapter.current}`
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
        <TimelineWrapper className={variant}>
            {segments.map((segment, idx) => {
                const { chapterNumbers, colorValue, label } = segment;
                const { inputRange, outputGradient } = colorInterpolation;
                const totalWidth = sum(
                    chapterNumbers.map(ci =>
                        getChapterWidth(
                            TIMELINE[animeTitle].data,
                            ci - 1,
                            unboundedChapterWidth
                        )
                    )
                );

                const color = interpolateColor(
                    colorValue,
                    inputRange,
                    outputGradient
                );

                return (
                    <Timeframe
                        key={idx}
                        className={variant}
                        $width={totalWidth}
                        $crossLinesVisible={hoveredSegment(idx + 1)}
                        {...hoverHandlers(idx + 1)}
                        $background={`#${color.toString(16).padStart(6, '0')}`}
                        onClick={
                            variant === 'days'
                                ? e => handleDayClick(e, idx + 1)
                                : undefined
                        }
                        $variant={variant}
                    >
                        <TimeframeDate className={variant}>
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
    const daysSegments = chapterDates($animeTitle).map((date, idx) => ({
        chapterNumbers: [idx + 1],
        colorValue: date.getDate(),
        label: date.getDate().toString(),
    }));

    const monthsSegments = chapterDatesByMonth($animeTitle).map(dates => {
        const month = dates[0]![1].getMonth();
        return {
            chapterNumbers: dates.map(([dateIdx]) => dateIdx + 1),
            colorValue: (month + 1) % 12,
            label: MONTHS[month]!,
        };
    });

    const yearsSegments = chapterDatesByYear($animeTitle).map(dates => {
        const yearDate = dates[0]![1];
        return {
            chapterNumbers: dates.map(([dateIdx]) => dateIdx + 1),
            colorValue: yearDate.getFullYear(),
            label: yearDate.getFullYear().toString(),
        };
    });

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
