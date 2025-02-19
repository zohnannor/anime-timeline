import React, { useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import styled, { css } from 'styled-components';

import { CHAPTER_DATES, scale } from '../constants';
import { DAYS_GRADIENT, interpolateColor, MONTHS_GRADIENT } from '../helpers';
import { useSettings } from '../providers/SettingsProvider';
import { ThumbnailImage } from './ThumbnailImage';

const ShadowOverlay = styled.div`
    position: fixed;
    inset: 0;
    z-index: 100;
    background: rgba(0, 0, 0, 0.6);
    cursor: pointer;
`;

const ModalContainer = styled.div`
    position: fixed;
    z-index: 100;
    left: 50%;
    top: 40%;
    background: black;
    padding: ${scale(100)}svh;
    height: 90svh;
    overflow-y: auto;
    transform: translate(-50%, -40%);

    @media (max-width: 480px) {
        height: 100svh;
        inset: 0;
        transform: none;
    }
`;

const Title = styled.h2`
    margin: 0;
`;

const CalendarGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: ${scale(16)}svh;
`;

const DayName = styled.div`
    text-align: center;
`;

interface MonthProps {
    $color: string;
}

const Month = styled.div<MonthProps>`
    color: ${({ $color: $background }) => $background};
    padding: ${scale(66)}svh;
`;

interface DayProps {
    $isChapter: boolean;
    $isToday: boolean;
    $background: string;
}

const Day = styled.a<DayProps>`
    padding: ${scale(66)}svh;
    text-align: center;
    color: ${({ $isChapter, $background }) =>
        $isChapter ? 'black' : $background};
    background-color: ${({ $isChapter, $background }) =>
        $isChapter ? $background : 'black'};
    cursor: ${({ $isChapter }) => ($isChapter ? 'pointer' : 'default')};

    ${({ $isToday, $background }) =>
        $isToday &&
        css`
            border: ${scale(10)}svh solid ${$background};
        `}
`;

interface MonthComponentProps {
    month: Date;
    currentDate: Date;
    chapterDateMap: Map<string, number>;
    onDayClick: (e: React.MouseEvent, chapterNumber: number | null) => void;
}

const MonthComponent: React.FC<MonthComponentProps> = React.memo(
    ({ month, currentDate, chapterDateMap, onDayClick }) => {
        const monthStart = new Date(month);
        monthStart.setDate(1);
        const monthEnd = new Date(month);
        monthEnd.setMonth(month.getMonth() + 1);
        monthEnd.setDate(0);
        const startDay = monthStart.getDay();
        const lastDay = startDay === 0 ? 6 : startDay - 1;

        const monthColor = interpolateColor(
            (month.getMonth() + 1) % 12,
            [0, 11],
            MONTHS_GRADIENT
        ).toString(16);

        const days = [];

        for (let i = 0; i < lastDay; i++) {
            days.push(<div key={`empty-${month.getTime()}-${i}`} />);
        }

        for (let day = 1; day <= monthEnd.getDate(); day++) {
            const date = new Date(month);
            date.setDate(day);
            const dateStr = date.toISOString();
            const chapterNumber = chapterDateMap.get(dateStr) ?? null;
            const isChapter = chapterNumber !== null;
            const isToday = date.toDateString() === currentDate.toDateString();

            const dayColor = interpolateColor(day, [1, 31], DAYS_GRADIENT)
                .toString(16)
                .padStart(6, '0');

            days.push(
                <Day
                    className='day'
                    key={`day-${month.getTime()}-${day}`}
                    $isChapter={isChapter}
                    $isToday={isToday}
                    $background={isChapter ? `#${dayColor}` : `#${monthColor}`}
                    onClick={e => onDayClick(e, chapterNumber)}
                >
                    {day}
                </Day>
            );
        }

        return (
            <Month className='month' $color={`#${monthColor}`}>
                <h3>
                    {month.toLocaleString('default', {
                        month: 'long',
                        year: 'numeric',
                    })}
                </h3>
                <CalendarGrid className='calendarGrid'>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
                        day => (
                            <DayName className='dayName' key={day}>
                                {day}
                            </DayName>
                        )
                    )}
                    {days}
                </CalendarGrid>
            </Month>
        );
    }
);

export const CalendarModal: React.FC = () => {
    const { calendarOpen, openCalendar } = useSettings();

    const currentDate = new Date();
    const startDate = CHAPTER_DATES[0];

    const chapterDateMap = useMemo(() => {
        const map = new Map<string, number>();
        CHAPTER_DATES.forEach((date, index) => {
            const dateStr = date.toISOString();
            map.set(dateStr, index + 1);
        });
        return map;
    }, []);

    const getMonthsBetween = (start: Date, end: Date) => {
        const months = [];
        const current = new Date(start);
        current.setDate(1);

        while (current <= end) {
            months.push(new Date(current));
            current.setMonth(current.getMonth() + 1);
        }

        return months;
    };

    const months = useMemo(
        () => getMonthsBetween(startDate, currentDate),
        [currentDate, startDate]
    );

    const handleDayClick = useCallback(
        (e: React.MouseEvent, chapterNumber: number | null) => {
            e.preventDefault();
            if (!chapterNumber) return;

            openCalendar(false);

            const element = document.querySelector(`#chapter-${chapterNumber}`);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center',
                });
                (element as HTMLElement).focus({ preventScroll: false });
            }
        },
        [openCalendar]
    );

    if (!calendarOpen) return null;

    return ReactDOM.createPortal(
        <>
            <ShadowOverlay
                className='shadow'
                onClick={() => openCalendar(false)}
            />
            <ModalContainer className='calendarModal'>
                <Title className='title'>Chapter Calendar</Title>
                {months.map((month, monthIdx) => (
                    <MonthComponent
                        key={`month-${monthIdx}`}
                        month={month}
                        currentDate={currentDate}
                        chapterDateMap={chapterDateMap}
                        onDayClick={handleDayClick}
                    />
                ))}
            </ModalContainer>
        </>,
        document.querySelector('#calendarModal')!
    );
};

export const CalendarModalButton: React.FC = () => {
    const { openCalendar } = useSettings();

    return (
        <ThumbnailImage
            src='pochita4'
            draggable={false}
            onClick={() => openCalendar(true)}
            title='Open chapters calendar'
            style={{ cursor: 'pointer' }}
        />
    );
};
