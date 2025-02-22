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
import { Link } from './Link';
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
        font-size: ${scale(60)}svh;

        writing-mode: vertical-lr;
        @supports (writing-mode: sideways-lr) {
            writing-mode: sideways-lr;
        }

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
    user-select: none;
`;

export const TimeLineHeaders: React.FC = () => {
    return (
        <Headers className='headers'>
            <Header className='header' $height={SEASON_HEIGHT} $invertBorder>
                <Link href='https://chainsaw-man.fandom.com/wiki/Chainsaw_Man_(Anime)'>
                    Anime Seasons
                </Link>
            </Header>
            <Header className='header' $height={ARC_HEIGHT} $invertBorder>
                <Link href='https://chainsaw-man.fandom.com/wiki/Story_Arcs'>
                    Story Arcs
                </Link>
            </Header>
            <Header
                className='header'
                $height={TIMELINE_HEIGHT + CHAPTER_HEIGHT}
                $invertBorder
            >
                <Link href='https://chainsaw-man.fandom.com/wiki/Chainsaw_Man_(Manga)#Chapters'>
                    Chapters
                </Link>
            </Header>
            <Header className='header' $height={VOLUME_HEIGHT} $invertBorder>
                <Link href='https://chainsaw-man.fandom.com/wiki/Chainsaw_Man_(Manga)#Chapters'>
                    Volumes
                </Link>
            </Header>
        </Headers>
    );
};
