import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { MOBILE_BREAKPOINT } from '@shared/config';
import { useSettings } from '@shared/contexts/SettingsContext';
import { useTimelineContext } from '@shared/contexts/TimelineContext';
import { sum, typedEntries } from '@shared/lib/util';
import { IconButton, Modal, Tooltip } from '@shared/ui';
import {
    RefreshIcon,
    ShuffleIcon,
    Sort91Icon,
    SortAzIcon,
    SortLinesIcon,
} from '@shared/ui/icons';
import { HeaderButton } from '@shared/ui/Modal';
import {
    ResolvedChapter,
    ResolvedEpisode,
    ResolvedTimelineData,
} from '@timelines/resolved';
import { AnimeTitle, Icon } from '@timelines/types';

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

const TitleButton = styled.div`
    cursor: pointer;
    color: white;
    border-color: white;
    display: flex;
    align-items: center;
    gap: 2rem;
    padding: 1rem 0;
    width: 100%;

    & > img {
        width: 4rem;
    }

    @media (max-width: ${MOBILE_BREAKPOINT}px) {
        gap: 1rem;
        padding: 0.5rem 0;

        & > img {
            width: 2.5rem;
        }
    }
`;

const TitleContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0.8rem 3.8rem;
    width: 80svw;
    max-width: 60rem;
    font-size: 1.5rem;

    @media (max-width: ${MOBILE_BREAKPOINT}px) {
        padding: 0.4rem 1rem;
        width: 90svw;
        font-size: 1rem;
    }
`;

const TitleWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
`;

const BadgeWrapper = styled.span`
    opacity: 0.6;
    font-size: 0.9em;
`;

const totalChapterCount = (chapters: readonly ResolvedChapter[]) =>
    chapters.length;
const totalPageCount = (chapters: readonly ResolvedChapter[]) =>
    sum(chapters.map(ch => ch.pages));
const recentlyUpdated = (
    chapters: readonly ResolvedChapter[],
    episodes: readonly ResolvedEpisode[],
): Temporal.PlainDate => {
    const now = Temporal.Now.plainDateISO();
    const sorted = [
        ...chapters.map(ch => ch.date),
        ...episodes
            .map(ep => ep.date)
            .filter(date => Temporal.PlainDate.compare(date, now) <= 0),
    ].toSorted((left, right) => Temporal.PlainDate.compare(left, right));

    return sorted.at(-1) ?? now;
};

type Sorting =
    | 'unsorted'
    | 'alphabetical'
    | 'chapter count'
    | 'page count'
    | 'recently updated';

type SortData = Readonly<
    | { type: 'string'; value: string; badge: string | undefined }
    | { type: 'number'; value: number; badge: string | undefined }
    | { type: 'date'; value: Temporal.PlainDate; badge: string | undefined }
>;

type Sort = SortData &
    Readonly<{
        animeTitle: AnimeTitle;
        title: string;
        icon: Icon;
    }>;

const getSortStrategy = (
    animeTitle: AnimeTitle,
    { chapters, episodes }: ResolvedTimelineData,
    sorting: Sorting,
): SortData => {
    const variants = {
        alphabetical: () =>
            // note: sorting by anime title (code name) instead of actual title
            ({ type: 'string', value: animeTitle, badge: undefined }),
        'chapter count': () => {
            const count = totalChapterCount(chapters);
            return { type: 'number', value: count, badge: `${count} chapters` };
        },
        'page count': () => {
            const count = totalPageCount(chapters);
            return { type: 'number', value: count, badge: `${count} pages` };
        },
        'recently updated': () => {
            const date = recentlyUpdated(chapters, episodes);
            return {
                type: 'date',
                value: date,
                badge: date.toLocaleString(undefined, {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                }),
            };
        },
        unsorted: () => ({ type: 'number', value: 0, badge: undefined }),
    } as Record<Sorting, () => SortData>;
    return variants[sorting]();
};

const sortTitles = (titleA: Sort, titleB: Sort): number =>
    titleA.type === 'string' && titleB.type === 'string' ?
        titleA.value.localeCompare(titleB.value)
    : titleA.type === 'number' && titleB.type === 'number' ?
        titleB.value - titleA.value
    : titleA.type === 'date' && titleB.type === 'date' ?
        Temporal.PlainDate.compare(titleB.value, titleA.value)
    :   0;

export const AnimeTitleSelectorModal: React.FC = () => {
    const { animeTitleSelectorOpen, setAnimeTitleSelectorOpen, setAnimeTitle } =
        useSettings();
    const { timelines, loadAll } = useTimelineContext();
    const [sorting, setSorting] = useState<Sorting>('unsorted');

    useEffect(() => {
        loadAll().catch((err: unknown) =>
            console.error('Failed to load all timelines:', err),
        );
    }, [loadAll]);

    const titles = useMemo(
        () =>
            typedEntries(timelines)
                .map(([animeTitle, { data }]) => ({
                    animeTitle,
                    title: data.title,
                    icon: data.icons.favicon,
                    ...getSortStrategy(animeTitle, data, sorting),
                }))
                .toSorted(sortTitles),
        [sorting, timelines],
    );

    if (!animeTitleSelectorOpen) {
        return <></>;
    }

    const nextSorting = {
        unsorted: 'alphabetical',
        alphabetical: 'chapter count',
        'chapter count': 'page count',
        'page count': 'recently updated',
        'recently updated': 'unsorted',
    } as const;

    const sortingIcon = {
        unsorted: <ShuffleIcon />,
        alphabetical: <SortAzIcon />,
        'chapter count': <Sort91Icon />,
        'page count': <SortLinesIcon />,
        'recently updated': <RefreshIcon />,
    }[sorting];

    return (
        <Modal
            isOpen={animeTitleSelectorOpen}
            onClose={() => setAnimeTitleSelectorOpen(false)}
            title='Select a manga/anime title'
            additionalButtons={
                <HeaderButton
                    onClick={() => setSorting(current => nextSorting[current])}
                >
                    <Tooltip
                        placement='bottom'
                        content={<TooltipContent>{sorting}</TooltipContent>}
                    >
                        {sortingIcon}
                    </Tooltip>
                </HeaderButton>
            }
            $bgColor='rgba(0, 0, 0, 0.85)'
        >
            <TitleContainer>
                {titles.map(({ animeTitle, title, icon, badge }) => (
                    <TitleButton
                        key={animeTitle}
                        onClick={() => {
                            setAnimeTitle(animeTitle);
                            setAnimeTitleSelectorOpen(false);
                        }}
                    >
                        <IconButton
                            className='animeTitleImage'
                            animeTitle={animeTitle}
                            icon={icon}
                        />
                        <TitleWrapper>
                            {title}
                            {badge !== undefined && (
                                <BadgeWrapper>{badge}</BadgeWrapper>
                            )}
                        </TitleWrapper>
                    </TitleButton>
                ))}
            </TitleContainer>
        </Modal>
    );
};
