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
import { range } from '@shared/lib/util';
import { Modal, Tooltip } from '@shared/ui';
import { HeaderButton } from '@shared/ui/Modal';

const getISODate = (plainDate: Temporal.PlainDate): string =>
    plainDate.toString();

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
    month: Temporal.PlainDate;
    currentDate: Temporal.PlainDate;
    chapterDateMap: EventMap;
    nextChapterDate: Temporal.PlainDate | undefined;
    onDayClick: (
        _ev: React.MouseEvent,
        _event: undefined | { episode: [string, number] } | { chapter: string },
    ) => void;
}>;

const MonthComponent: React.FC<MonthComponentProps> = React.memo(
    // so that react/display-name doesn't complain
    // eslint-disable-next-line prefer-arrow-callback
    function MonthComponent({
        month,
        currentDate,
        chapterDateMap,
        nextChapterDate,
        onDayClick,
    }) {
        const monthStart = month.with({ day: 1 });
        const startDay = monthStart.dayOfWeek === 7 ? 0 : monthStart.dayOfWeek;
        const lastDay = startDay === 0 ? 6 : startDay - 1;

        const monthNumber = month.month - 1;
        const { year } = month;

        const monthColor = interpolateColor(
            (monthNumber + 1) % 12,
            [0, 11],
            MONTHS_GRADIENT,
        ).toString(16);

        const days: React.JSX.Element[] = [];

        for (let idx = 0; idx < lastDay; idx++) {
            days.push(<div key={`empty-${month.toString()}-${idx}`} />);
        }

        for (let dayNumber = 1; dayNumber <= month.daysInMonth; dayNumber++) {
            const date = month.with({ day: dayNumber });
            const dateString = getISODate(date);
            const event = chapterDateMap.get(dateString);
            const isChapter = event !== undefined && 'chapter' in event;
            const isEpisode = event !== undefined && 'episode' in event;
            const isEvent = isChapter || isEpisode;
            const chapterNumber = isChapter ? event.chapter : undefined;
            const episodeData = isEpisode ? event.episode : undefined;
            const isToday = date.equals(currentDate);
            const isNextChapter =
                nextChapterDate !== undefined && date.equals(nextChapterDate);

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
                    {episodeData !== undefined && (
                        <span>
                            E{episodeData[0]} (S{episodeData[1]})
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
                                key={`dayname-${day}-${month.toString()}`}
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

const getMonthsBetween = (
    start: Temporal.PlainDate,
    end: Temporal.PlainDate,
) => {
    const currentStart = start.with({ day: 1 });
    const currentEnd = end.with({ day: 1 });

    const totalMonths = currentStart.until(currentEnd, {
        largestUnit: 'months',
    }).months;

    return range(0, totalMonths + 1).map(offset =>
        currentStart.add({ months: offset }),
    );
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

    const currentDate = useMemo(() => Temporal.Now.plainDateISO(), []);
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
                undefined | { chapter: string } | { episode: [string, number] },
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
                        key={`month-${month.toString()}`}
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
