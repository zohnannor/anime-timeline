import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import styled, { css } from 'styled-components';

import { MOBILE_BREAKPOINT } from '@shared/config/ui';
import { useSettings } from '@shared/contexts/SettingsContext';
import { useTimeline } from '@shared/contexts/TimelineContext';
import {
    DAYS_GRADIENT,
    hueGlow,
    interpolateColor,
    MONTHS,
    MONTHS_GRADIENT,
    sanitizeId,
    scale,
    scrollToId,
} from '@shared/lib/helpers';
import { Modal, Tooltip } from '@shared/ui';
import { HeaderButton } from '@shared/ui/Modal';

const getISODate = (date: Date): string => {
    const iso = date.toISOString();
    return iso.substring(0, 10);
};

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
    $isEpisode: boolean;
    $isToday: boolean;
    $isNextChapter: boolean;
    $background: string;
};

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
    width: ${scale(200)};
    height: ${scale(200)};

    ${({ $isToday, $background, $isChapter, $isEpisode, $isNextChapter }) =>
        $isNextChapter ?
            css`
                border: ${scale(15)} solid ${$isChapter ? 'red' : $background};
                animation: ${hueGlow} 2s linear infinite;
            `
        : $isToday ?
            css`
                border: ${scale(15)} solid ${$isChapter ? 'red' : $background};
            `
        : $isEpisode ?
            css`
                outline: ${scale(7)} dashed
                    ${$isChapter ? 'black' : $background};
                outline-offset: ${scale(-13)};
                font-size: ${scale(45)};
            `
        :   null}

    &:focus {
        z-index: 1;
        outline: ${scale(20)} solid red;
        animation: ${hueGlow} 2s linear infinite;
    }

    @media (max-width: ${MOBILE_BREAKPOINT}px) {
        font-size: ${scale(50)};
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

type EventMap = Map<
    string,
    | { chapter: string }
    | { episode: [string, number] }
    | { chapter: string; episode: [string, number] }
>;

type MonthComponentProps = {
    month: Date;
    currentDate: Date;
    chapterDateMap: EventMap;
    nextChapterDate: Date | null;
    onDayClick: (
        _ev: React.MouseEvent,
        _event: { chapter: string } | { episode: [string, number] } | null,
    ) => void;
};

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

        for (let i = 0; i < lastDay; i++) {
            days.push(<div key={`empty-${month.getTime()}-${i}`} />);
        }

        for (let dayN = 1; dayN <= monthEnd.getDate(); dayN++) {
            const date = new Date(month);
            date.setDate(dayN);
            const dateStr = getISODate(date);
            const event = chapterDateMap.get(dateStr) ?? null;
            const isChapter = event !== null && 'chapter' in event;
            const isEpisode = event !== null && 'episode' in event;
            const isEvent = isChapter || isEpisode;
            const chapterNumber = isChapter ? event.chapter : null;
            const episodeNumber = isEpisode ? event.episode : null;
            const isToday = date.toDateString() === currentDate.toDateString();
            const isNextChapter =
                date.toDateString() === nextChapterDate?.toDateString();

            const dayColor = interpolateColor(dayN, [1, 31], DAYS_GRADIENT)
                .toString(16)
                .padStart(6, '0');

            const dayKey = `day-${chapterNumber ?? `${dateStr}-no-chapter`}`;

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
                    <span>{dayN}</span>
                    {chapterNumber !== null && <span>#{chapterNumber}</span>}
                    {episodeNumber !== null && (
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
    /* const [nextChapterDate, setNextChapterDate] = useState<Date | null>(null);

    useEffect(() => {
        // `useEffect` awaits the promise
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        (async () => {
            if (!calendarOpen) {
                return;
            }
            // fetch from Manga Plus only for csm
            if (animeTitle !== 'csm') {
                setNextChapterDate(null);
                return;
            }
            setNextChapterDate(await fetchNextChapterDate());
        })();
    }, [calendarOpen, animeTitle]); */

    useEffect(() => {
        if (calendarOpen && modalRef.current) {
            if (scrolledToBottom) {
                modalRef.current.scrollTop = 0;
            } else {
                modalRef.current.scrollTop = modalRef.current.scrollHeight;
            }
        }
    }, [calendarOpen, scrolledToBottom]);

    const currentDate = useMemo(() => new Date(), []);
    const [first] = chapters;
    const startDate = first.date;

    const eventMap = useMemo(() => {
        const map: EventMap = new Map();
        chapters.forEach(({ date, number }) => {
            const dateStr = getISODate(date);
            map.set(dateStr, { ...map.get(dateStr), chapter: number });
        });
        episodes.forEach(({ date, number, season }) => {
            const dateStr = getISODate(date);
            map.set(dateStr, {
                ...map.get(dateStr),
                episode: [number, season],
            });
        });
        return map;
    }, [chapters, episodes]);

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
            event: { chapter: string } | { episode: [string, number] } | null,
        ) => {
            ev.preventDefault();
            if (event === null) {
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
                        nextChapterDate={null /* nextChapterDate */}
                        chapterDateMap={eventMap}
                        onDayClick={handleDayClick}
                    />
                ))}
            </CalendarContainer>
        </Modal>
    );
};
