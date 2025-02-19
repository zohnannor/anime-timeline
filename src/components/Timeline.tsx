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
            line-height: ${scale(TIMELINE_HEIGHT / 3)}svh;
            transition: width 0.2s ease-in-out;
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
    display: flex;
    height: ${scale(TIMELINE_HEIGHT / 3)}svh;
    width: 100%;
`;

export const Timeline: React.FC = () => {
    const Days = () => {
        const [hoveredDay, hoverHandlers] = useHover();
        const { unboundedChapterWidth } = useSettings();

        return (
            <TimelineWrapper className='days'>
                {CHAPTER_DATES.map((date, idx) => {
                    const chapterNumber = idx + 1;
                    const chapterWidth = getChapterWidth(
                        chapterNumber,
                        unboundedChapterWidth
                    );
                    const day = date.getDate();

                    return (
                        <Timeframe
                            className='day'
                            $width={chapterWidth}
                            $visible={hoveredDay === idx + 1}
                            {...hoverHandlers(idx + 1)}
                            $background={`#${interpolateColor(
                                day,
                                [1, 31],
                                DAYS_GRADIENT
                            )
                                .toString(16)
                                .padStart(6, '0')}`}
                            key={chapterNumber}
                        >
                            <TimeFrameDate className='day'>{day}</TimeFrameDate>
                        </Timeframe>
                    );
                })}
            </TimelineWrapper>
        );
    };

    const Months = () => {
        const [hoveredMonth, hoverHandlers] = useHover();
        const { unboundedChapterWidth } = useSettings();

        return (
            <TimelineWrapper className='months'>
                {CHAPTER_DATES_BY_MONTH.map((dates, idx) => {
                    const monthWidth = dates.reduce(
                        (totalWidth, [dateIdx, _]) => {
                            const chapterWidth = getChapterWidth(
                                dateIdx + 1,
                                unboundedChapterWidth
                            );
                            return totalWidth + chapterWidth;
                        },
                        0
                    );
                    const month = dates[0]![1];

                    return (
                        <Timeframe
                            className='month'
                            $width={monthWidth}
                            $visible={hoveredMonth === idx + 1}
                            {...hoverHandlers(idx + 1)}
                            $background={`#${interpolateColor(
                                (month.getMonth() + 1) % 12,
                                [0, 11],
                                MONTHS_GRADIENT
                            ).toString(16)}`}
                            key={idx}
                        >
                            <TimeFrameDate className='month'>
                                {month.toLocaleString('default', {
                                    month: 'long',
                                })}
                            </TimeFrameDate>
                        </Timeframe>
                    );
                })}
            </TimelineWrapper>
        );
    };

    const Years = () => {
        const [hoveredYear, hoverHandlers] = useHover();
        const { unboundedChapterWidth } = useSettings();

        return (
            <TimelineWrapper className='years'>
                {CHAPTER_DATES_BY_YEAR.map((dates, idx) => {
                    const yearWidth = dates.reduce(
                        (totalWidth, [dateIdx, _]) => {
                            const chapterWidth = getChapterWidth(
                                dateIdx + 1,
                                unboundedChapterWidth
                            );
                            return totalWidth + chapterWidth;
                        },
                        0
                    );
                    const year = dates[0]![1].getFullYear();

                    return (
                        <Timeframe
                            className='year'
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
                            <TimeFrameDate className='year'>
                                {year}
                            </TimeFrameDate>
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
