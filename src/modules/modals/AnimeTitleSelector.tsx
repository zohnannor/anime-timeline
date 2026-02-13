import { useState } from 'react';
import styled from 'styled-components';

import useSettings from '../../shared/contexts/SettingsContext';
import { chapterDates, chapters, scale } from '../../shared/lib/helpers';
import { sum } from '../../shared/lib/util';
import { Modal, ThumbnailImage, Tooltip } from '../../shared/ui';
import {
    ShuffleIcon,
    Sort91Icon,
    SortAzIcon,
    SortLinesIcon,
} from '../../shared/ui/icons';
import { RefreshIcon } from '../../shared/ui/icons/refresh';
import { HeaderButton } from '../../shared/ui/Modal';
import TIMELINE from '../../timelines';
import { TITLES } from '../../timelines/constants';
import { AnimeTitle, TimelineData } from '../../timelines/types';

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

const chapterCount = (timeline: TimelineData) => chapters(timeline).length;
const pageCount = (timeline: TimelineData) =>
    sum(chapters(timeline).map(c => c.pages));
const recentlyUpdated = (title: AnimeTitle) =>
    Math.max(...chapterDates(TIMELINE[title]).map(date => date.getTime()));

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

    if (!animeTitleSelectorOpen) return null;

    const titles = TITLES.toSorted((titleA, titleB) =>
        sorting === 'alphabetical' ? titleA.localeCompare(titleB)
        : sorting === 'chapter count' ?
            chapterCount(TIMELINE[titleB].data) -
            chapterCount(TIMELINE[titleA].data)
        : sorting === 'page count' ?
            pageCount(TIMELINE[titleB].data) - pageCount(TIMELINE[titleA].data)
        : sorting === 'recently updated' ?
            recentlyUpdated(titleB) - recentlyUpdated(titleA)
        :   -1,
    );

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
                <HeaderButton onClick={() => setSorting(s => nextSorting[s])}>
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
                {titles.map(title => (
                    <TitleButton
                        key={title}
                        onClick={() => {
                            setAnimeTitle(title);
                            setAnimeTitleSelectorOpen(false);
                        }}
                    >
                        <ThumbnailImage
                            className='animeTitleImage'
                            animeTitle={title}
                            src={
                                TIMELINE[title].data.smallImages[
                                    'scroller-or-favicon'
                                ]
                            }
                        />
                        {TIMELINE[title].data.title}
                    </TitleButton>
                ))}
            </TitleContainer>
        </Modal>
    );
};
