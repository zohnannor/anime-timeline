import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import styled, { css } from 'styled-components';

import { MOBILE_BREAKPOINT } from '@shared/config';
import { useSettings } from '@shared/contexts/SettingsContext';
import { useTimeline } from '@shared/contexts/TimelineContext';
import {
    DAYS_GRADIENT,
    hueGlow,
    interpolateColor,
    MONTHS,
    MONTHS_GRADIENT,
    sanitizeId,
    scrollToId,
} from '@shared/lib/helpers';
import { Modal, Tooltip } from '@shared/ui';
import { HeaderButton } from '@shared/ui/Modal';

const getISODate = (date: Date): string => date.toISOString().slice(0, 10);

const CalendarGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.32rem;
`;

const DayName = styled.div`
    text-align: center;
`;

type MonthProps = Readonly<{
    $color: string;
}>;

const Month = styled.div<MonthProps>`
    color: ${({ $color: $background }) => $background};
`;

type DayProps = Readonly<{
    $isChapter: boolean;
    $isEpisode: boolean;
    $isToday: boolean;
    $isNextChapter: boolean;
    $background: string;
}>;

const Day = styled.a<DayProps>`
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    justify-content: center;
    color: ${({ $isChapter, $background }) =>
        $isChapter ? 'black' : $background};
    background-color: ${({ $isChapter, $background }) =>
        $isChapter ? $background : 'black'};
    cursor: ${({ $isChapter, $isEpisode }) =>
        $isChapter || $isEpisode ? 'pointer' : 'default'};
    width: 4rem;
    height: 4rem;

    ${({ $isToday, $background, $isChapter, $isEpisode, $isNextChapter }) =>
        $isNextChapter ?
            css`
                border: 0.3rem solid ${$isChapter ? 'red' : $background};
                animation: ${hueGlow} 2s linear infinite;
            `
        : $isToday ?
            css`
                border: 0.3rem solid ${$isChapter ? 'red' : $background};
            `
        : $isEpisode ?
            css`
                outline: 0.14rem dashed ${$isChapter ? 'black' : $background};
                outline-offset: -0.26rem;
                font-size: 0.9rem;
            `
        :   undefined}

    &:focus {
        z-index: 1;
        outline: 0.4rem solid red;
        animation: ${hueGlow} 2s linear infinite;
    }

    @media (max-width: ${MOBILE_BREAKPOINT}px) {
        font-size: 1rem;
        width: 2.5rem;
        height: 2.5rem;

        ${({ $isToday, $isEpisode, $isNextChapter }) =>
            $isNextChapter || $isToday ?
                css`
                    border-width: 0.15rem;
                `
            : $isEpisode ?
                css`
                    outline-width: 0.07rem;
                    outline-offset: -0.13rem;
                `
            :   undefined}

        &:focus {
            outline-width: 0.2rem;
        }
    }
`;

const CalendarContainer = styled.div`
    padding: 2rem;

    @media (max-width: ${MOBILE_BREAKPOINT}px) {
        padding: 1rem;
    }
`;

const TooltipContent = styled.div`
    display: flex;
    white-space: nowrap;
    width: 100%;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 0.8rem;
    padding: 0.5rem;
    font-size: 1.2rem;
    gap: 0.8rem;
`;

type EventMap = Map<
    string,
    | { chapter: string }
    | { episode: [string, number] }
    | { chapter: string; episode: [string, number] }
>;

type MonthComponentProps = Readonly<{
    month: Date;
    currentDate: Date;
    chapterDateMap: EventMap;
    nextChapterDate: Date | undefined;
    onDayClick: (
        _ev: React.MouseEvent,
        _event: { chapter: string } | { episode: [string, number] } | undefined,
    ) => void;
}>;

const MonthComponent: React.FC<MonthComponentProps> = React.memo(
    // so that react/display-name doesn't complain
    // eslint-disable-next-line prefer-arrow-callback, max-statements
    function MonthComponent({
        month,
        currentDate,
        chapterDateMap,
        nextChapterDate,
        onDayClick,
    }) {
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

        for (let idx = 0; idx < lastDay; idx++) {
            days.push(<div key={`empty-${month.getTime()}-${idx}`} />);
        }

        for (let dayNumber = 1; dayNumber <= monthEnd.getDate(); dayNumber++) {
            const date = new Date(month);
            date.setDate(dayNumber);
            const dateString = getISODate(date);
            const event = chapterDateMap.get(dateString);
            const isChapter = event !== undefined && 'chapter' in event;
            const isEpisode = event !== undefined && 'episode' in event;
            const isEvent = isChapter || isEpisode;
            const chapterNumber = isChapter ? event.chapter : undefined;
            const episodeNumber = isEpisode ? event.episode : undefined;
            const isToday = date.toDateString() === currentDate.toDateString();
            const isNextChapter =
                date.toDateString() === nextChapterDate?.toDateString();

            const dayColor = interpolateColor(dayNumber, [1, 31], DAYS_GRADIENT)
                .toString(16)
                .padStart(6, '0');

            const dayKey = `day-${chapterNumber ?? `${dateString}-no-chapter`}`;

            let day = (
                <Day
                    id={sanitizeId(dayKey)}
                    key={dayKey}
                    className='day'
                    $isChapter={isChapter}
                    $isEpisode={isEpisode}
                    $isToday={isToday}
                    $isNextChapter={isNextChapter}
                    $background={isChapter ? `#${dayColor}` : `#${monthColor}`}
                    onClick={ev => onDayClick(ev, event)}
                    tabIndex={isEvent ? -1 : undefined}
                >
                    <span>{dayNumber}</span>
                    {chapterNumber !== undefined && (
                        <span>#{chapterNumber}</span>
                    )}
                    {episodeNumber !== undefined && (
                        <span>
                            E{episodeNumber[0]} (S{episodeNumber[1]})
                        </span>
                    )}
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

const getMonthsBetween = (start: Date, end: Date) => {
    const months = [];
    const current = new Date(start);
    current.setDate(1);

    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);

    // false positive: mutated by `setMonth`
    // eslint-disable-next-line no-unmodified-loop-condition
    while (current <= endDate) {
        months.push(new Date(current));
        current.setMonth(current.getMonth() + 1);
    }

    return months;
};

export const CalendarModal: React.FC = () => {
    const { calendarOpen, setCalendarOpen } = useSettings();
    const {
        data: { chapters, episodes },
    } = useTimeline();
    const [scrolledToBottom, setScrolledToBottom] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    // previously, we fetched the next chapter date from Manga Plus for CSM. as
    // CSM has finished publication, this is no longer necessary. commented out
    // for now, but will be re-enabled if needed in the future for other ongoing
    // titles on Manga Plus.
    /* const [nextChapterDate, setNextChapterDate] = useState<Date >(
        undefined,
    );

    useEffect(() => {
        // `useEffect` awaits the promise
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        (async () => {
            if (!calendarOpen) {
                return;
            }
            // fetch from Manga Plus only for csm
            if (animeTitle !== 'csm') {
                setNextChapterDate(undefined);
                return;
            }
            setNextChapterDate(await fetchNextChapterDate());
        })();
    }, [calendarOpen, animeTitle]); */

    useEffect(() => {
        if (calendarOpen && modalRef.current) {
            modalRef.current.scrollTop =
                scrolledToBottom ? 0 : modalRef.current.scrollHeight;
        }
    }, [calendarOpen, scrolledToBottom]);

    const currentDate = useMemo(() => new Date(), []);
    const [first] = chapters;
    const startDate = first.date;

    const eventMap = useMemo(() => {
        const map: EventMap = new Map();
        for (const { date, number } of chapters) {
            const dateString = getISODate(date);
            map.set(dateString, { ...map.get(dateString), chapter: number });
        }
        for (const { date, number, season } of episodes) {
            const dateString = getISODate(date);
            map.set(dateString, {
                ...map.get(dateString),
                episode: [number, season],
            });
        }
        return map;
    }, [chapters, episodes]);

    // see comment above for why this is commented out
    /* const furthestDate =
        nextChapterDate ?
            currentDate > nextChapterDate ?
                currentDate
            :   nextChapterDate
        :   currentDate; */
    const furthestDate = currentDate;

    const months = useMemo(
        () => getMonthsBetween(startDate, furthestDate),
        [furthestDate, startDate],
    );

    const handleDayClick = useCallback(
        (
            ev: React.MouseEvent,
            event:
                | { chapter: string }
                | { episode: [string, number] }
                | undefined,
        ) => {
            ev.preventDefault();
            if (event === undefined) {
                return;
            }

            setCalendarOpen(false);
            if ('chapter' in event) {
                scrollToId(`chapter-${event.chapter}`);
            } else {
                const [episodeNumber, _season] = event.episode;
                scrollToId(`episode-${episodeNumber}`);
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
                <HeaderButton
                    onClick={() => setScrolledToBottom(state => !state)}
                >
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
                {months.map(month => (
                    <MonthComponent
                        key={`month-${month.toISOString()}`}
                        month={month}
                        currentDate={currentDate}
                        nextChapterDate={undefined /* nextChapterDate */}
                        chapterDateMap={eventMap}
                        onDayClick={handleDayClick}
                    />
                ))}
            </CalendarContainer>
        </Modal>
    );
};
