import styled from 'styled-components';

import { scale, SEASON_COVERS, SEASON_HEIGHT } from '../constants';
import { getSeasonWidth } from '../helpers';
import { useHover } from '../hooks/useHover';
import { TimelineContainer } from './Container';
import { withCrossLines } from './CrossLines';
import { Episodes } from './Episodes';
import { withShadow } from './ShadowWrapper';
import { ThumbnailImage } from './ThumbnailImage';

interface SeasonProps {
    $width: number;
}

interface SeasonCoverProps {
    $emptyCover?: boolean;
}

const Season = withCrossLines(
    styled.div<SeasonProps>`
        display: flex;
        position: relative;
        height: ${scale(SEASON_HEIGHT)}svh;
        width: ${({ $width }) => scale($width)}svh;
        align-items: flex-end;

        & > div {
            position: absolute;
        }
    `
);

const SeasonCover = withShadow(
    styled.div<SeasonCoverProps>`
        position: relative;
        display: flex;
        align-items: ${({ $emptyCover }) =>
            $emptyCover ? 'center' : 'flex-end'};
        justify-content: center;
        overflow: hidden;

        font-size: ${scale(250)}vh;
        height: 100%;
        width: 100%;
        cursor: default;
        user-select: none;

        & > a {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            cursor: pointer;
        }

        & > a > img {
            position: absolute;
            object-fit: cover;
            height: 100%;
            width: 100%;
            transition: 0.1s ease-in-out;
            pointer-events: none;
        }

        &:hover > a > img {
            transform: scale(1.05);
        }
    `
);

const OFFSETS = [
    { x: 0, y: 1900 },
    { x: 0, y: 800 },
];

export const Seasons: React.FC = () => {
    const [hoveredSeason, hoverHandlers] = useHover();

    return (
        <TimelineContainer>
            {SEASON_COVERS.map((cover, idx) => {
                const seasonNumber = idx + 1;
                const seasonWidth = getSeasonWidth(seasonNumber);
                let link = [
                    'https://chainsaw-man.fandom.com/wiki/Chainsaw_Man_(Anime)',
                    'https://chainsaw-man.fandom.com/wiki/Chainsaw_Man_%E2%80%93_The_Movie:_Reze_Arc',
                ][idx];

                return (
                    <Season
                        className='season'
                        $width={seasonWidth}
                        key={cover || seasonNumber}
                        $visible={hoveredSeason === seasonNumber}
                        {...hoverHandlers(seasonNumber)}
                    >
                        <SeasonCover
                            className='seasonCover'
                            $invertBorder={!cover}
                            $emptyCover={!cover}
                        >
                            {cover ? (
                                <a
                                    href={link}
                                    draggable={false}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    <ThumbnailImage
                                        src={cover}
                                        alt=''
                                        $offsetX={OFFSETS[idx]?.x ?? 0}
                                        $offsetY={OFFSETS[idx]?.y ?? 0}
                                    />
                                </a>
                            ) : (
                                `SEASON ${idx}`
                            )}
                        </SeasonCover>
                        <Episodes season={seasonNumber} />
                    </Season>
                );
            })}
        </TimelineContainer>
    );
};
