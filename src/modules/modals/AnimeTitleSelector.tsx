import { useState } from 'react';
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
import { ResolvedChapter } from '@timelines/resolved';

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

const totalChapterCount = (chapters: readonly ResolvedChapter[]) =>
    chapters.length;
const totalPageCount = (chapters: readonly ResolvedChapter[]) =>
    sum(chapters.map(ch => ch.pages));
const recentlyUpdated = (chapters: readonly ResolvedChapter[]) =>
    Math.max(...chapters.map(ch => ch.date.getTime()));

export const AnimeTitleSelectorModal: React.FC = () => {
    const { animeTitleSelectorOpen, setAnimeTitleSelectorOpen, setAnimeTitle } =
        useSettings();
    const [sorting, setSorting] = useState<
        | 'unsorted'
        | 'alphabetical'
        | 'chapter count'
        | 'page count'
        | 'recently updated'
    >('unsorted');

    if (!animeTitleSelectorOpen) {
        return null;
    }

    const titles = TITLES.toSorted((titleA, titleB) => {
        const {
            data: { chapters: chaptersA },
        } = TIMELINE[titleA];
        const {
            data: { chapters: chaptersB },
        } = TIMELINE[titleB];
        return (
            sorting === 'alphabetical' ? titleA.localeCompare(titleB)
            : sorting === 'chapter count' ?
                totalChapterCount(chaptersB) - totalChapterCount(chaptersA)
            : sorting === 'page count' ?
                totalPageCount(chaptersB) - totalPageCount(chaptersA)
            : sorting === 'recently updated' ?
                recentlyUpdated(chaptersB) - recentlyUpdated(chaptersA)
            :   0
        );
    });

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
                {titles.map(animeTitle => {
                    const {
                        data: { title, smallImages },
                    } = TIMELINE[animeTitle];
                    return (
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
                                src={smallImages['scroller-or-favicon']}
                            />
                            {title}
                        </TitleButton>
                    );
                })}
            </TitleContainer>
        </Modal>
    );
};
