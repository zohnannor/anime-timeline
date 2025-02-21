import { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';

import {
    CHAPTER_DATES,
    CHAPTER_DATES_BY_MONTH,
    CHAPTER_DATES_BY_YEAR,
    scale,
    SMALL_FONT_SIZE,
    TIMELINE_HEIGHT,
} from '../constants';
import {
    DAYS_GRADIENT,
    getChapterWidth,
    interpolateColor,
    MONTHS_GRADIENT,
} from '../helpers';
import { useHover } from '../hooks/useHover';
import { useSettings } from '../providers/SettingsProvider';
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
            height: ${scale(TIMELINE_HEIGHT / 3)}svh;
            width: ${({ $width }) => scale($width)}svh;
            background: ${({ $background }) => $background};
            color: black;
            font-size: ${scale(SMALL_FONT_SIZE)}svh;
            line-height: ${scale(TIMELINE_HEIGHT / 3)}svh;
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
    height: ${scale(TIMELINE_HEIGHT / 3)}svh;
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
    const { unboundedChapterWidth, setCalendarOpen } = useSettings();
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
                const totalWidth = chapterNumbers.reduce(
                    (total, chapterNumber) =>
                        total +
                        getChapterWidth(chapterNumber, unboundedChapterWidth),
                    0
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

export const Timeline: React.FC = () => {
    const daysSegments = CHAPTER_DATES.map((date, idx) => ({
        chapterNumbers: [idx + 1],
        colorValue: date.getDate(),
        label: date.getDate().toString(),
    }));

    const monthsSegments = CHAPTER_DATES_BY_MONTH.map(dates => {
        const monthDate = dates[0]![1];
        return {
            chapterNumbers: dates.map(([dateIdx]) => dateIdx + 1),
            colorValue: (monthDate.getMonth() + 1) % 12,
            label: monthDate.toLocaleString('default', { month: 'long' }),
        };
    });

    const yearsSegments = CHAPTER_DATES_BY_YEAR.map(dates => {
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
