import styled from 'styled-components';

import {
    CHAPTER_DATES,
    CHAPTER_DATES_BY_MONTH,
    CHAPTER_DATES_BY_YEAR,
    scale,
    SMALL_FONT_SIZE,
    TIMELINE_HEIGHT,
} from '../constants';
import { getChapterWidth, interpolateColor } from '../helpers';
import { withShadow } from './ShadowWrapper';
import { useHover } from '../hooks/useHover';
import { withCrossLines } from './CrossLines';

interface DayProps {
    $width: number;
    $background?: string;
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
            background: ${({ $background }) => $background ?? 'white'};
            color: black;
            font-size: ${scale(SMALL_FONT_SIZE)}svh;
        `
    )
);

const TimeFrameDate = styled.div`
    width: 100%;
    height: 100%;
    text-align: center;
    overflow: hidden;
`;

const TimelineWrapper = styled.div`
    position: relative;
    z-index: 1;
    display: flex;
    height: ${scale(TIMELINE_HEIGHT / 3)}svh;
    width: 100%;

    &:hover {
        z-index: 2;
    }
`;

export const Timeline: React.FC = () => {
    const Days = () => {
        const [hoveredDay, hoverHandlers] = useHover();

        return (
            <TimelineWrapper>
                {CHAPTER_DATES.map((date, idx) => {
                    const chapterNumber = idx + 1;
                    const chapterWidth = getChapterWidth(chapterNumber);
                    const day = date.getDate();

                    return (
                        <Timeframe
                            $width={chapterWidth}
                            $visible={hoveredDay === idx + 1}
                            {...hoverHandlers(idx + 1)}
                            $background={`#${interpolateColor(
                                day,
                                [1, 31],
                                [0xed8581, 0x9df697]
                            )
                                .toString(16)
                                .padStart(6, '0')}`}
                            key={chapterNumber}
                        >
                            <TimeFrameDate>{day}</TimeFrameDate>
                        </Timeframe>
                    );
                })}
            </TimelineWrapper>
        );
    };

    const Months = () => {
        const [hoveredMonth, hoverHandlers] = useHover();

        return (
            <TimelineWrapper>
                {CHAPTER_DATES_BY_MONTH.map((dates, idx) => {
                    const monthWidth = dates.reduce(
                        (totalWidth, [dateIdx, _]) => {
                            const chapterWidth = getChapterWidth(dateIdx + 1);
                            return totalWidth + chapterWidth;
                        },
                        0
                    );
                    const month = dates[0]![1].getMonth();

                    return (
                        <Timeframe
                            $width={monthWidth}
                            $visible={hoveredMonth === idx + 1}
                            {...hoverHandlers(idx + 1)}
                            $background={`#${interpolateColor(
                                (month + 1) % 12,
                                [0, 11],
                                [0xd3e3f4, 0xf2e97e, 0xb3cd53, 0xface8a]
                            ).toString(16)}`}
                            key={idx}
                        >
                            <TimeFrameDate>{MONTHS[month]}</TimeFrameDate>
                        </Timeframe>
                    );
                })}
            </TimelineWrapper>
        );
    };

    const Years = () => {
        const [hoveredYear, hoverHandlers] = useHover();

        return (
            <TimelineWrapper>
                {CHAPTER_DATES_BY_YEAR.map((dates, idx) => {
                    const yearWidth = dates.reduce(
                        (totalWidth, [dateIdx, _]) => {
                            const chapterWidth = getChapterWidth(dateIdx + 1);
                            return totalWidth + chapterWidth;
                        },
                        0
                    );
                    const year = dates[0]![1].getFullYear();

                    return (
                        <Timeframe
                            $width={yearWidth}
                            $visible={hoveredYear === idx + 1}
                            {...hoverHandlers(idx + 1)}
                            $background={`#${interpolateColor(
                                year,
                                [2018, 2025],
                                [0xaaaaaa, 0xffffff]
                            ).toString(16)}`}
                            key={idx}
                        >
                            <TimeFrameDate>{year}</TimeFrameDate>
                        </Timeframe>
                    );
                })}
            </TimelineWrapper>
        );
    };

    return (
        <>
            <Years />
            <Months />
            <Days />
        </>
    );
};

const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];
