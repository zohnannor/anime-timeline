import styled from 'styled-components';

import { SCALE, EPISODE_THUMBNAILS } from '../constants';
import { getEpisodeWidthNew } from '../helpers';
import { Container } from './Container';
import { withShadow } from './ShadowWrapper';

interface EpisodeProps {
    $width: number;
    $offsetX?: number;
    $offsetY?: number;
}

const Episode = withShadow(
    styled.div<EpisodeProps>`
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        height: ${SCALE * 242}px;
        width: ${({ $width }) => $width * SCALE}px;

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
            transform: scale(1.2);
        }
    `
);

const OFFSETS = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
];

interface EpisodesProps {
    season: number;
}

export const Episodes: React.FC<EpisodesProps> = ({ season }) =>
    season === 1 && (
        <Container $width={'100%'}>
            {EPISODE_THUMBNAILS.map((thumbnail, idx) => {
                const episodeWidth = getEpisodeWidthNew(idx + 1);
                let link = `https://chainsaw-man.fandom.com/wiki/Episode_${
                    idx + 1
                }`;

                return (
                    thumbnail && (
                        <Episode
                            key={thumbnail}
                            $width={episodeWidth}
                            $offsetX={OFFSETS[idx]?.x ?? 0}
                            $offsetY={OFFSETS[idx]?.y ?? 0}
                        >
                            <a
                                href={link}
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                <img src={thumbnail} alt='' />
                            </a>
                        </Episode>
                    )
                );
            })}
        </Container>
    );
