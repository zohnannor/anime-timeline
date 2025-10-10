import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import ReactDOM from 'react-dom';
import styled, { css } from 'styled-components';

import { scale, TIMELINE } from '../constants';
import {
    DAYS_GRADIENT,
    fetchNextChapterDate,
    hueGlow,
    interpolateColor,
    MONTHS,
    MONTHS_GRADIENT,
} from '../helpers';
import { useSettings } from '../providers/SettingsProvider';
import { Tooltip } from './Tooltip';

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
    height: 90svh;
    overflow-y: auto;
    transform: translate(-50%, -40%);
    user-select: none;

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
    gap: ${scale(16)};
`;

const DayName = styled.div`
    text-align: center;
`;

interface MonthProps {
    $color: string;
}

const Month = styled.div<MonthProps>`
    color: ${({ $color: $background }) => $background};
`;

interface DayProps {
    $isChapter: boolean;
    $isToday: boolean;
    $isNextChapter: boolean;
    $background: string;
}

const Day = styled.a<DayProps>`
    display: flex;
    flex-direction: column;
    padding: ${scale(66)};
    text-align: center;
    align-items: center;
    justify-content: center;
    color: ${({ $isChapter, $background }) =>
        $isChapter ? 'black' : $background};
    background-color: ${({ $isChapter, $background }) =>
        $isChapter ? $background : 'black'};
    cursor: ${({ $isChapter }) => ($isChapter ? 'pointer' : 'default')};
    width: ${scale(200)};
    height: ${scale(200)};

    ${({ $isToday, $background, $isChapter, $isNextChapter }) =>
        $isNextChapter
            ? css`
                  border: ${scale(15)} solid ${$isChapter ? `red` : $background};
                  animation: ${hueGlow} 2s linear infinite;
              `
            : $isToday
            ? css`
                  border: ${scale(15)} solid ${$isChapter ? `red` : $background};
              `
            : null}

    &:focus {
        z-index: 1;
        outline: ${scale(20)} solid red;
        animation: ${hueGlow} 2s linear infinite;
    }
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    inset: 0;
    background: black;
    padding: ${scale(100)};
    border-bottom: ${scale(5)} solid #333;
`;

const CalendarContainer = styled.div`
    padding: ${scale(100)};
`;

const TooltipContent = styled.div`
    display: flex;
    white-space: nowrap;
    width: 100%;
    background: rgba(0, 0, 0, 0.5);
    border-radius: ${scale(40)};
    padding: ${scale(25)};
    font-size: ${scale(60)};
    gap: ${scale(40)};
`;

interface MonthComponentProps {
    month: Date;
    currentDate: Date;
    chapterDateMap: Map<string, number>;
    nextChapterDate: Date | null;
    onDayClick: (e: React.MouseEvent, chapterNumber: number | null) => void;
}

const MonthComponent: React.FC<MonthComponentProps> = React.memo(
    ({ month, currentDate, chapterDateMap, nextChapterDate, onDayClick }) => {
        const monthStart = new Date(month);
        monthStart.setDate(1);
        const monthEnd = new Date(month);
        monthEnd.setMonth(month.getMonth() + 1);
        monthEnd.setDate(0);
        const startDay = monthStart.getDay();
        const lastDay = startDay === 0 ? 6 : startDay - 1;

        const monthNumber = month.getMonth();
        const year = month.getFullYear();

        const monthColor = interpolateColor(
            (monthNumber + 1) % 12,
            [0, 11],
            MONTHS_GRADIENT
        ).toString(16);

        const days = [];

        for (let i = 0; i < lastDay; i++) {
            days.push(<div key={`empty-${month.getTime()}-${i}`} />);
        }

        for (let dayN = 1; dayN <= monthEnd.getDate(); dayN++) {
            const date = new Date(month);
            date.setDate(dayN);
            const dateStr = date.toISOString();
            const chapterNumber = chapterDateMap.get(dateStr) ?? null;
            const isChapter = chapterNumber !== null;
            const isToday = date.toDateString() === currentDate.toDateString();
            const isNextChapter =
                date.toDateString() === nextChapterDate?.toDateString();

            const dayColor = interpolateColor(dayN, [1, 31], DAYS_GRADIENT)
                .toString(16)
                .padStart(6, '0');

            let day = (
                <Day
                    id={`day-${chapterNumber}`}
                    key={`day-${month.getTime()}-${dayN}`}
                    className='day'
                    $isChapter={isChapter}
                    $isToday={isToday}
                    $isNextChapter={isNextChapter}
                    $background={isChapter ? `#${dayColor}` : `#${monthColor}`}
                    onClick={e => onDayClick(e, chapterNumber)}
                    tabIndex={isChapter ? -1 : undefined}
                >
                    <span>{dayN}</span>
                    {chapterNumber && <span>#{chapterNumber}</span>}
                </Day>
            );

            if (isNextChapter) {
                day = (
                    <Tooltip
                        content={<TooltipContent>Next chapter!</TooltipContent>}
                        placement='top'
                    >
                        {day}
                    </Tooltip>
                );
            }

            days.push(day);
        }

        return (
            <Month className='month' $color={`#${monthColor}`}>
                <h3>
                    {MONTHS[monthNumber]} {year}
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

const Button = styled.span`
    inset: 0;
    cursor: pointer;
    font-size: 1.5em;
    top: ${scale(100)};
    right: ${scale(100)};
    float: right;
    margin-left: ${scale(100)};
`;

export const CalendarModal: React.FC = () => {
    const { calendarOpen, setCalendarOpen, animeTitle } = useSettings();
    const [scrolledToBottom, setScrolledToBottom] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const [nextChapterDate, setNextChapterDate] = useState<Date | null>(null);

    useEffect(() => {
        (async () => {
            if (!calendarOpen) return;
            const date = await fetchNextChapterDate();
            setNextChapterDate(date);
        })();
    }, [calendarOpen]);

    useEffect(() => {
        if (calendarOpen && modalRef.current) {
            if (!scrolledToBottom) {
                modalRef.current.scrollTop = modalRef.current.scrollHeight;
            } else {
                modalRef.current.scrollTop = 0;
            }
        }
    }, [calendarOpen, scrolledToBottom]);

    const currentDate = new Date();
    const startDate = TIMELINE[animeTitle].extra.CHAPTER_DATES[0]!;

    const chapterDateMap = useMemo(() => {
        const map = new Map<string, number>();
        TIMELINE[animeTitle].extra.CHAPTER_DATES.forEach((date, index) => {
            const dateStr = date.toISOString();
            map.set(dateStr, index + 1);
        });
        return map;
    }, []);

    const getMonthsBetween = (start: Date, end: Date) => {
        const months = [];
        const current = new Date(start);
        current.setDate(1);

        const endDate = new Date(end);
        endDate.setHours(23, 59, 59, 999);

        while (current <= endDate) {
            months.push(new Date(current));
            current.setMonth(current.getMonth() + 1);
        }

        return months;
    };

    const furthestDate = nextChapterDate
        ? currentDate > nextChapterDate
            ? currentDate
            : nextChapterDate
        : currentDate;

    const months = useMemo(
        () => getMonthsBetween(startDate, furthestDate),
        [furthestDate, startDate]
    );

    const handleDayClick = useCallback(
        (e: React.MouseEvent, chapterNumber: number | null) => {
            e.preventDefault();
            if (!chapterNumber) return;

            setCalendarOpen(false);

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
        [setCalendarOpen]
    );

    if (!calendarOpen) return null;

    return ReactDOM.createPortal(
        <>
            <ShadowOverlay
                className='shadow'
                onClick={() => setCalendarOpen(false)}
            />
            <ModalContainer className='calendarModal' ref={modalRef}>
                <Header>
                    <Title className='title'>Chapter Calendar</Title>
                    <div>
                        <Button onClick={() => setCalendarOpen(false)}>
                            &times;
                        </Button>
                        <Button onClick={() => setScrolledToBottom(p => !p)}>
                            <Tooltip
                                placement='bottom'
                                content={
                                    <TooltipContent>
                                        {`Scroll to ${
                                            scrolledToBottom ? 'bottom' : 'top'
                                        }`}
                                    </TooltipContent>
                                }
                            >
                                {scrolledToBottom ? '⇈' : '⇊'}
                            </Tooltip>
                        </Button>
                    </div>
                </Header>
                <CalendarContainer>
                    {months.map((month, monthIdx) => (
                        <MonthComponent
                            key={`month-${monthIdx}`}
                            month={month}
                            currentDate={currentDate}
                            nextChapterDate={nextChapterDate}
                            chapterDateMap={chapterDateMap}
                            onDayClick={handleDayClick}
                        />
                    ))}
                </CalendarContainer>
            </ModalContainer>
        </>,
        document.querySelector('#calendarModal')!
    );
};
