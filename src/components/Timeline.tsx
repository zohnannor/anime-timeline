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

interface DayProps {
    $width: number;
    $background?: string;
}

const Timeframe = withShadow(
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
        overflow: hidden;
    `
);

const TimelineWrapper = styled.div`
    position: relative;
    display: flex;
    height: ${scale(TIMELINE_HEIGHT / 3)}svh;
    width: 100%;
`;

export const Timeline: React.FC = () => {
    const Days = () => (
        <TimelineWrapper>
            {CHAPTER_DATES.map((date, idx) => {
                const chapterNumber = idx + 1;
                const chapterWidth = getChapterWidth(chapterNumber);
                const day = date.getDate();

                return (
                    <Timeframe
                        $width={chapterWidth}
                        $background={`#${interpolateColor(
                            day,
                            [1, 31],
                            [0xed8581, 0x9df697]
                        )
                            .toString(16)
                            .padStart(6, '0')}`}
                        key={chapterNumber}
                    >
                        {day}
                    </Timeframe>
                );
            })}
        </TimelineWrapper>
    );

    const Months = () => (
        <TimelineWrapper>
            {CHAPTER_DATES_BY_MONTH.map((dates, idx) => {
                const monthWidth = dates.reduce((totalWidth, [dateIdx, _]) => {
                    const chapterWidth = getChapterWidth(dateIdx + 1);
                    return totalWidth + chapterWidth;
                }, 0);
                const month = dates[0]![1].getMonth();

                return (
                    <Timeframe
                        $width={monthWidth}
                        $background={`#${interpolateColor(
                            (month + 1) % 12,
                            [0, 11],
                            [0xd3e3f4, 0xf2e97e, 0xb3cd53, 0xface8a]
                        ).toString(16)}`}
                        key={idx}
                    >
                        {MONTHS[month]}
                    </Timeframe>
                );
            })}
        </TimelineWrapper>
    );

    const Years = () => (
        <TimelineWrapper>
            {CHAPTER_DATES_BY_YEAR.map((dates, idx) => {
                const yearWidth = dates.reduce((totalWidth, [dateIdx, _]) => {
                    const chapterWidth = getChapterWidth(dateIdx + 1);
                    return totalWidth + chapterWidth;
                }, 0);
                const year = dates[0]![1].getFullYear();

                return (
                    <Timeframe
                        $width={yearWidth}
                        $background={`#${interpolateColor(
                            year,
                            [2018, 2025],
                            [0xaaaaaa, 0xffffff]
                        ).toString(16)}`}
                        key={idx}
                    >
                        {year}
                    </Timeframe>
                );
            })}
        </TimelineWrapper>
    );

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
