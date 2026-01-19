import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import styled, { css } from 'styled-components';

import {
    chapterDates,
    DAYS_GRADIENT,
    fetchNextChapterDate,
    hueGlow,
    interpolateColor,
    MONTHS,
    MONTHS_GRADIENT,
    scale,
} from '../helpers';
import { useSettings } from '../providers/SettingsProvider';
import { HeaderButton, Modal } from './Modal';
import { Tooltip } from './Tooltip';

const CalendarGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: ${scale(16)};
`;

const DayName = styled.div`
    text-align: center;
`;

type MonthProps = {
    $color: string;
};

const Month = styled.div<MonthProps>`
    color: ${({ $color: $background }) => $background};
`;

type DayProps = {
    $isChapter: boolean;
    $isToday: boolean;
    $isNextChapter: boolean;
    $background: string;
};

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
        $isNextChapter ?
            css`
                border: ${scale(15)} solid ${$isChapter ? `red` : $background};
                animation: ${hueGlow} 2s linear infinite;
            `
        : $isToday ?
            css`
                border: ${scale(15)} solid ${$isChapter ? `red` : $background};
            `
        :   null}

    &:focus {
        z-index: 1;
        outline: ${scale(20)} solid red;
        animation: ${hueGlow} 2s linear infinite;
    }
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

type MonthComponentProps = {
    month: Date;
    currentDate: Date;
    chapterDateMap: Map<string, number>;
    nextChapterDate: Date | null;
    onDayClick: (e: React.MouseEvent, chapterNumber: number | null) => void;
};

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
            MONTHS_GRADIENT,
        ).toString(16);

        const days: React.JSX.Element[] = [];

        for (let i = 0; i < lastDay; i++) {
            days.push(<div key={`empty-${month.getTime()}-${i}`} />);
        }

        for (let dayN = 1; dayN <= monthEnd.getDate(); dayN++) {
            const date = new Date(month);
            date.setDate(dayN);
            const dateStr = date.toISOString().split('T')[0]!;
            const chapterNumber = chapterDateMap.get(dateStr) ?? null;
            const isChapter = chapterNumber !== null;
            const isToday = date.toDateString() === currentDate.toDateString();
            const isNextChapter =
                date.toDateString() === nextChapterDate?.toDateString();

            const dayColor = interpolateColor(dayN, [1, 31], DAYS_GRADIENT)
                .toString(16)
                .padStart(6, '0');

            const dayKey = `day-${dateStr}-${chapterNumber || 'no-chapter'}`;

            let day = (
                <Day
                    id={`day-${chapterNumber}`}
                    key={dayKey}
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
                        key={`tooltip-${dayKey}`}
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
                            <DayName
                                className='dayName'
                                key={`dayname-${day}-${month.getTime()}`}
                            >
                                {day}
                            </DayName>
                        ),
                    )}
                    {days}
                </CalendarGrid>
            </Month>
        );
    },
);

export const CalendarModal: React.FC = () => {
    const { calendarOpen, setCalendarOpen, animeTitle } = useSettings();
    const [scrolledToBottom, setScrolledToBottom] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const [nextChapterDate, setNextChapterDate] = useState<Date | null>(null);

    useEffect(() => {
        (async () => {
            if (!calendarOpen) return;
            // fetch from Manga Plus only for csm
            if (animeTitle !== 'csm') return setNextChapterDate(null);
            setNextChapterDate(await fetchNextChapterDate());
        })();
    }, [calendarOpen, animeTitle]);

    useEffect(() => {
        if (calendarOpen && modalRef.current) {
            if (!scrolledToBottom) {
                modalRef.current.scrollTop = modalRef.current.scrollHeight;
            } else {
                modalRef.current.scrollTop = 0;
            }
        }
    }, [calendarOpen, scrolledToBottom]);

    const allChapterDates = chapterDates(animeTitle);
    const currentDate = new Date();
    const startDate = allChapterDates[0]!;

    const chapterDateMap = useMemo(() => {
        const map = new Map<string, number>();
        allChapterDates.forEach((date, index) => {
            const dateStr = date.toISOString().split('T')[0]!;
            map.set(dateStr, index + 1);
        });
        return map;
    }, [animeTitle]);

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

    const furthestDate =
        nextChapterDate ?
            currentDate > nextChapterDate ?
                currentDate
            :   nextChapterDate
        :   currentDate;

    const months = useMemo(
        () => getMonthsBetween(startDate, furthestDate),
        [furthestDate, startDate],
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
        [setCalendarOpen],
    );

    return (
        <Modal
            isOpen={calendarOpen}
            onClose={() => setCalendarOpen(false)}
            title='Chapter Calendar'
            modalRef={modalRef}
            additionalButtons={
                <HeaderButton onClick={() => setScrolledToBottom(p => !p)}>
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
                </HeaderButton>
            }
            $mobileFullscreen
        >
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
        </Modal>
    );
};
