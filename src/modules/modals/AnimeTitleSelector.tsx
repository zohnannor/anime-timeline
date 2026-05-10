import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

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
`;

const TitleContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0.8rem 3.8rem;
    width: 80svw;
    max-width: 60rem;
    font-size: 1.5rem;
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
    episodes: ResolvedEpisode[] | undefined,
) =>
    Math.max(
        ...chapters.map(ch => ch.date.getTime()),
        ...(episodes
            ?.filter(ep => ep.date < new Date())
            .map(ep => ep.date.getTime()) ?? []),
    );

type Sorting =
    | 'unsorted'
    | 'alphabetical'
    | 'chapter count'
    | 'page count'
    | 'recently updated';

type SortData =
    | { type: 'string'; value: string; badge: string | null }
    | { type: 'number'; value: number; badge: string | null };

type Sort = {
    animeTitle: AnimeTitle;
    title: string;
    icon: Icon;
} & SortData;

const getSortStrategy = (
    animeTitle: AnimeTitle,
    { chapters, episodes }: ResolvedTimelineData,
    sorting: Sorting,
): SortData => {
    const variants = {
        alphabetical: () =>
            // note: sorting by anime title (code name) instead of actual title
            ({ type: 'string', value: animeTitle, badge: null }),
        'chapter count': () => {
            const count = totalChapterCount(chapters);
            return { type: 'number', value: count, badge: `${count} chapters` };
        },
        'page count': () => {
            const count = totalPageCount(chapters);
            return { type: 'number', value: count, badge: `${count} pages` };
        },
        'recently updated': () => {
            const time = recentlyUpdated(chapters, episodes);
            return {
                type: 'number',
                value: time,
                badge: new Date(time).toLocaleDateString(undefined, {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                }),
            };
        },
        unsorted: () => ({ type: 'number', value: 0, badge: null }),
    } as Record<Sorting, () => SortData>;
    return variants[sorting]();
};

const sortTitles = (titleA: Sort, titleB: Sort): number =>
    titleA.type === 'string' && titleB.type === 'string' ?
        titleA.value.localeCompare(titleB.value)
    : titleA.type === 'number' && titleB.type === 'number' ?
        titleB.value - titleA.value
    :   0;

export const AnimeTitleSelectorModal: React.FC = () => {
    const { animeTitleSelectorOpen, setAnimeTitleSelectorOpen, setAnimeTitle } =
        useSettings();
    const { timelines, loadAll } = useTimelineContext();
    const [sorting, setSorting] = useState<Sorting>('unsorted');

    useEffect(() => {
        loadAll().catch((err: unknown) =>
            console.error('Failed to load all timelines: ', err),
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
        return null;
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
                    onClick={() => setSorting(cur => nextSorting[cur])}
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
                            {badge && <BadgeWrapper>{badge}</BadgeWrapper>}
                        </TitleWrapper>
                    </TitleButton>
                ))}
            </TitleContainer>
        </Modal>
    );
};
