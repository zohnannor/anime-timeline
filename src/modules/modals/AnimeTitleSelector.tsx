import { useMemo, useState } from 'react';
import styled from 'styled-components';

import { useSettings } from '@shared/contexts/SettingsContext';
import { scale } from '@shared/lib/helpers';
import { sum } from '@shared/lib/util';
import { Modal, ThumbnailImage, Tooltip } from '@shared/ui';
import {
    ShuffleIcon,
    Sort91Icon,
    SortAzIcon,
    SortLinesIcon,
} from '@shared/ui/icons';
import { RefreshIcon } from '@shared/ui/icons/refresh';
import { HeaderButton } from '@shared/ui/Modal';
import { TIMELINE, TITLES } from '@timelines/registry';
import { ResolvedChapter, ResolvedEpisode } from '@timelines/resolved';
import { AnimeTitle, SmallImages } from '@timelines/types';

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

const TitleButton = styled.div`
    cursor: pointer;
    color: white;
    border-color: white;
    display: flex;
    align-items: center;
    gap: ${scale(100)};
    padding: ${scale(50)} 0;
    width: 100%;

    & > img {
        width: ${scale(200)};
    }
`;

const TitleContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: ${scale(40)} ${scale(190)};
    width: 80svw;
    max-width: ${scale(3000)};
    font-size: ${scale(75)};
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
    smallImages: SmallImages;
} & SortData;

export const AnimeTitleSelectorModal: React.FC = () => {
    const { animeTitleSelectorOpen, setAnimeTitleSelectorOpen, setAnimeTitle } =
        useSettings();
    const [sorting, setSorting] = useState<Sorting>('unsorted');

    const titles = useMemo(
        () =>
            TITLES.map(animeTitle => {
                const {
                    data: { chapters, episodes, title, smallImages },
                } = TIMELINE[animeTitle];
                const strategies: Record<Sorting, () => SortData> = {
                    alphabetical: () => ({
                        type: 'string',
                        value: animeTitle,
                        badge: null,
                    }),
                    'chapter count': () => {
                        const count = totalChapterCount(chapters);
                        return {
                            type: 'number',
                            value: count,
                            badge: `${count} chapters`,
                        };
                    },
                    'page count': () => {
                        const count = totalPageCount(chapters);
                        return {
                            type: 'number',
                            value: count,
                            badge: `${count} pages`,
                        };
                    },
                    'recently updated': () => {
                        const time = recentlyUpdated(chapters, episodes);
                        return {
                            type: 'number',
                            value: time,
                            badge: new Date(time).toLocaleDateString(
                                undefined,
                                {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                },
                            ),
                        };
                    },
                    unsorted: () => ({ type: 'number', value: 0, badge: null }),
                };
                return {
                    animeTitle,
                    title,
                    smallImages,
                    ...strategies[sorting](),
                } satisfies Sort;
            }).toSorted((titleA, titleB) =>
                titleA.type === 'string' && titleB.type === 'string' ?
                    titleA.value.localeCompare(titleB.value)
                : titleA.type === 'number' && titleB.type === 'number' ?
                    titleB.value - titleA.value
                :   0,
            ),
        [sorting],
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
                {titles.map(({ animeTitle, title, smallImages, badge }) => (
                    <TitleButton
                        key={animeTitle}
                        onClick={() => {
                            setAnimeTitle(animeTitle);
                            setAnimeTitleSelectorOpen(false);
                        }}
                    >
                        <ThumbnailImage
                            className='animeTitleImage'
                            animeTitle={animeTitle}
                            src={smallImages.favicon}
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
