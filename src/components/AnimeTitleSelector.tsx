import { useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

import { AnimeTitle, TIMELINE, TimelineData, TITLES } from '../constants';
import { chapterDates, chapters, scale } from '../helpers';
import { useSettings } from '../providers/SettingsProvider';
import { sum } from '../util';
import { RefreshIcon } from './icons/refresh';
import { ShuffleIcon } from './icons/shuffle';
import { Sort91Icon } from './icons/sort91';
import { SortAzIcon } from './icons/sortAZ';
import { SortLinesIcon } from './icons/sortLines';
import { ThumbnailImage } from './ThumbnailImage';
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
    display: flex;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -40%);
    z-index: 100;
    background: rgba(0, 0, 0, 0.85);
    padding: ${scale(40)} ${scale(190)};
    width: 80svw;
    max-width: ${scale(3000)};
    font-size: ${scale(75)};

    flex-direction: column;
    align-items: flex-start;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    inset: 0;
    padding: ${scale(100)};
    border-bottom: ${scale(5)} solid #333;
    width: 100%;

    & svg {
        height: ${scale(100)};
        width: ${scale(100)};
    }
`;

const Title = styled.h2`
    margin: 0;
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

const Button = styled.span`
    inset: 0;
    cursor: pointer;
    font-size: 1.5em;
    top: ${scale(100)};
    right: ${scale(100)};
    float: right;
    margin-left: ${scale(100)};
`;

const TitleButton = styled.div`
    cursor: pointer;
    color: white;
    font-size: ${scale(100)};
    border-color: white;
    display: flex;
    align-items: center;
    gap: ${scale(100)};
    padding: ${scale(50)} 0;

    & > img {
        width: ${scale(200)};
    }
`;

const chapterCount = (timeline: TimelineData) => chapters(timeline).length;
const pageCount = (timeline: TimelineData) =>
    sum(chapters(timeline).map(c => c.pages));
const recentlyUpdated = (title: AnimeTitle) =>
    Math.max(...chapterDates(title).map(date => date.getTime()));

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
        sorting === 'alphabetical'
            ? titleA.localeCompare(titleB)
            : sorting === 'chapter count'
            ? chapterCount(TIMELINE[titleB].data) -
              chapterCount(TIMELINE[titleA].data)
            : sorting === 'page count'
            ? pageCount(TIMELINE[titleB].data) -
              pageCount(TIMELINE[titleA].data)
            : sorting === 'recently updated'
            ? recentlyUpdated(titleB) - recentlyUpdated(titleA)
            : -1
    );

    return ReactDOM.createPortal(
        <>
            <ShadowOverlay
                className='shadow'
                onClick={() => setAnimeTitleSelectorOpen(false)}
            />
            <ModalContainer className='captureTimelineModal'>
                <Header>
                    <Title className='title'>Select a manga/anime title</Title>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <Button
                            onClick={() =>
                                setSorting(
                                    s =>
                                        ((
                                            {
                                                unsorted: 'alphabetical',
                                                alphabetical: 'chapter count',
                                                'chapter count': 'page count',
                                                'page count':
                                                    'recently updated',
                                                'recently updated': 'unsorted',
                                            } as const
                                        )[s])
                                )
                            }
                        >
                            <Tooltip
                                placement='bottom'
                                content={
                                    <TooltipContent>{sorting}</TooltipContent>
                                }
                            >
                                {
                                    {
                                        unsorted: <ShuffleIcon />,
                                        alphabetical: <SortAzIcon />,
                                        'chapter count': <Sort91Icon />,
                                        'page count': <SortLinesIcon />,
                                        'recently updated': <RefreshIcon />,
                                    }[sorting]
                                }
                            </Tooltip>
                        </Button>
                        <Button
                            onClick={() => setAnimeTitleSelectorOpen(false)}
                        >
                            &times;
                        </Button>
                    </div>
                </Header>
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
            </ModalContainer>
        </>,
        document.querySelector('#modal')!
    );
};
