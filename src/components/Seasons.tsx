import styled from 'styled-components';

import { SCALE, SEASON_COVERS } from '../constants';
import { getSeasonWidth } from '../helpers';
import { Container } from './Container';
import { Episodes } from './Episodes';
import { withShadow } from './ShadowWrapper';

interface SeasonProps {
    $width: number;
    $emptyCover?: boolean;
    $offsetX?: number;
    $offsetY?: number;
}

const Season = withShadow(
    styled.div<SeasonProps>`
        position: relative;
        display: flex;
        align-items: ${({ $emptyCover }) =>
            $emptyCover ? 'center' : 'flex-end'};
        justify-content: center;
        overflow: hidden;

        font-size: ${SCALE * 250}px;
        height: ${SCALE * 742}px;
        width: ${({ $width }) => $width * SCALE}px;
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

            object-position: ${({ $offsetX, $offsetY }) =>
                `${-($offsetX ?? 0)}px ${-($offsetY ?? 0)}px`};
        }

        &:hover > a > img {
            transform: scale(1.05);
        }
    `
);

const OFFSETS = [
    { x: 0, y: 610 },
    { x: 0, y: 260 },
];

export const Seasons: React.FC = () => (
    <Container>
        {SEASON_COVERS.map((cover, idx) => {
            const seasonNumber = idx + 1;
            const seasonWidth = getSeasonWidth(seasonNumber);
            let link = [
                'https://chainsaw-man.fandom.com/wiki/Chainsaw_Man_(Anime)',
                'https://chainsaw-man.fandom.com/wiki/Chainsaw_Man_%E2%80%93_The_Movie:_Reze_Arc',
            ][idx];

            return (
                <Season
                    key={cover || seasonNumber}
                    $invertBorder={!cover}
                    $emptyCover={!cover}
                    $width={seasonWidth}
                    $offsetX={OFFSETS[idx]?.x ?? 0}
                    $offsetY={OFFSETS[idx]?.y ?? 0}
                >
                    {cover ? (
                        <>
                            <a
                                href={link}
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                <img src={cover} alt='' />
                            </a>
                            <Episodes season={seasonNumber} />
                        </>
                    ) : (
                        `SEASON ${idx}`
                    )}
                </Season>
            );
        })}
    </Container>
);
