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
    const layout = TIMELINE[$animeTitle].layout;
    return (
        <Headers className='headers'>
            {layout.season && (
                <Header
                    className='header'
                    $height={layout.season.height}
                    $invertBorder
                >
                    <Link href={`${wikiBase}${layout.season.sectionLink}`}>
                        Anime Seasons
                    </Link>
                </Header>
            )}
            <Header
                className='header'
                $height={layout.arc.height}
                $invertBorder
            >
                <Link href={`${wikiBase}${layout.arc.sectionLink}`}>
                    Story Arcs
                </Link>
            </Header>
            <Header
                className='header'
                $height={TIMELINE_HEIGHT + layout.chapter.height}
                $invertBorder
            >
                <Link href={`${wikiBase}${layout.chapter.sectionLink}`}>
                    Chapters
                </Link>
            </Header>
            <Header
                className='header'
                $height={layout.volume.height}
                $invertBorder
            >
                <Link href={`${wikiBase}${layout.volume.sectionLink}`}>
                    Volumes
                </Link>
            </Header>
        </Headers>
    );
};
