import styled from 'styled-components';

import {
    ARC_HEIGHT,
    CHAPTER_HEIGHT,
    HEADERS_WIDTH,
    scale,
    SEASON_HEIGHT,
    TIMELINE_HEIGHT,
    VOLUME_HEIGHT,
} from '../constants';
import { withShadow } from './ShadowWrapper';

interface HeaderProps {
    $height: number;
}

const Header = withShadow(
    styled.div<HeaderProps>`
        position: relative;
        display: flex;
        width: 100%;
        height: ${({ $height }) => scale($height)}svh;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        writing-mode: sideways-lr;
        font-size: ${scale(70)}svh;

        & > a {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            cursor: pointer;
        }
    `
);

const Headers = styled.div`
    width: ${scale(HEADERS_WIDTH)}svh;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

export const TimeLineHeaders: React.FC = () => {
    return (
        <Headers className='headers'>
            <Header className='header' $height={SEASON_HEIGHT} $invertBorder>
                <a
                    href='https://chainsaw-man.fandom.com/wiki/Chainsaw_Man_(Anime)'
                    draggable={false}
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    Anime Seasons
                </a>
            </Header>
            <Header className='header' $height={ARC_HEIGHT} $invertBorder>
                <a
                    href='https://chainsaw-man.fandom.com/wiki/Story_Arcs'
                    draggable={false}
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    Story Arcs
                </a>
            </Header>
            <Header
                className='header'
                $height={TIMELINE_HEIGHT + CHAPTER_HEIGHT}
                $invertBorder
            >
                <a
                    href='https://chainsaw-man.fandom.com/wiki/Chainsaw_Man_(Manga)#Chapters'
                    draggable={false}
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    Chapters
                </a>
            </Header>
            <Header className='header' $height={VOLUME_HEIGHT} $invertBorder>
                <a
                    href='https://chainsaw-man.fandom.com/wiki/Chainsaw_Man_(Manga)#Chapters'
                    draggable={false}
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    Volumes
                </a>
            </Header>
        </Headers>
    );
};
