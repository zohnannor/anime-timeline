import styled from 'styled-components';

import { EPISODE_HEIGHT, EPISODE_THUMBNAILS, scale } from '../constants';
import { getEpisodeWidthNew } from '../helpers';
import { Container } from './Container';
import { withShadow } from './ShadowWrapper';
import { ThumbnailImage } from './ThumbnailImage';

interface EpisodeProps {
    $width: number;
}

const Episode = withShadow(
    styled.div<EpisodeProps>`
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        height: ${scale(EPISODE_HEIGHT)}svh;
        width: ${({ $width }) => scale($width)}svh;

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
            transform: scale(1.2);
        }
    `
);

const OFFSETS = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 20, y: 0 },
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
        <Container>
            {EPISODE_THUMBNAILS.map((thumbnail, idx) => {
                const episodeWidth = getEpisodeWidthNew(idx + 1);
                let link = `https://chainsaw-man.fandom.com/wiki/Episode_${
                    idx + 1
                }`;

                return (
                    thumbnail && (
                        <Episode key={thumbnail} $width={episodeWidth}>
                            <a
                                href={link}
                                draggable={false}
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                <ThumbnailImage
                                    src={thumbnail}
                                    alt=''
                                    $offsetX={OFFSETS[idx]?.x ?? 0}
                                    $offsetY={OFFSETS[idx]?.y ?? 0}
                                />
                            </a>
                        </Episode>
                    )
                );
            })}
        </Container>
    );
