import styled from 'styled-components';

import {
    AnimeTitle,
    HEADERS_WIDTH,
    TIMELINE,
    TIMELINE_HEIGHT,
} from '../constants';
import { scale } from '../helpers';
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
        height: ${({ $height }) => scale($height)};
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: ${scale(60)};

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
    width: ${scale(HEADERS_WIDTH)};
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    user-select: none;
`;

export const TimeLineHeaders: React.FC<{ $animeTitle: AnimeTitle }> = ({
    $animeTitle,
}) => {
    const wikiBase = TIMELINE[$animeTitle].data.wikiBase;
    const seasonHeight = TIMELINE[$animeTitle].layout.season?.height;
    return (
        <Headers className='headers'>
            {seasonHeight && (
                <Header className='header' $height={seasonHeight} $invertBorder>
                    <Link href={`${wikiBase}Chainsaw_Man_(Anime)`}>
                        Anime Seasons
                    </Link>
                </Header>
            )}
            <Header
                className='header'
                $height={TIMELINE[$animeTitle].layout.arc.height}
                $invertBorder
            >
                <Link href={`${wikiBase}Story_Arcs`}>Story Arcs</Link>
            </Header>
            <Header
                className='header'
                $height={
                    TIMELINE_HEIGHT +
                    TIMELINE[$animeTitle].layout.chapter.height
                }
                $invertBorder
            >
                <Link href={`${wikiBase}Chainsaw_Man_(Manga)#Chapters`}>
                    Chapters
                </Link>
            </Header>
            <Header
                className='header'
                $height={TIMELINE[$animeTitle].layout.volume.height}
                $invertBorder
            >
                <Link href={`${wikiBase}Chainsaw_Man_(Manga)#Chapters`}>
                    Volumes
                </Link>
            </Header>
        </Headers>
    );
};
