import styled, { css } from 'styled-components';

import {
    EPISODE_HEIGHT,
    EPISODE_OFFSETS,
    EPISODE_THUMBNAILS,
    EPISODE_TITLES,
    scale,
} from '../constants';
import { getEpisodeWidth } from '../helpers';
import { useHover } from '../hooks/useHover';
import { useSettings } from '../providers/SettingsProvider';
import { TimelineContainer } from './Container';
import { withCrossLines } from './CrossLines';
import { Link } from './Link';
import { withShadow } from './ShadowWrapper';
import { ThumbnailImage } from './ThumbnailImage';

interface EpisodeProps {
    $width: number;
}

const Episode = withCrossLines(
    styled.div<EpisodeProps>`
        position: relative;
        height: ${scale(EPISODE_HEIGHT)}svh;
        width: ${({ $width }) => scale($width)}svh;
        transition: width 0.2s ease-in-out;
    `
);

const EpisodeCover = withShadow(
    styled.div`
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        height: 100%;
        width: 100%;

        & > a {
            position: absolute;
            inset: 0;
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

interface EpisodeTitleProps {
    $visible: boolean;
}

const EpisodeTitle = withShadow(
    styled.div<EpisodeTitleProps>`
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-size: ${scale(42)}svh;
        color: white;
        background: transparent;
        pointer-events: none;
        opacity: 0;
        ${({ $visible }) =>
            $visible &&
            css`
                opacity: 1;
                text-shadow: -1px -1px 0 black, 1px -1px 0 black,
                    -1px 1px 0 black, 1px 1px 0 black, 0 0 ${scale(10)}svh black,
                    0 0 ${scale(20)}svh rgba(0, 0, 0, 0.5),
                    0 0 ${scale(30)}svh rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(${scale(10)}svh);
            `}

        transition: all 0.2s ease-in-out;
    `
);

interface EpisodesProps {
    season: number;
}

export const Episodes: React.FC<EpisodesProps> = ({ season }) => {
    const [hoveredEpisode, handlers] = useHover();
    const { unboundedChapterWidth, showTitles } = useSettings();

    if (season !== 1) return null;

    return (
        <TimelineContainer>
            {EPISODE_THUMBNAILS.map((thumbnail, idx) => {
                const episodeWidth = getEpisodeWidth(
                    idx + 1,
                    unboundedChapterWidth
                );
                let link = `https://chainsaw-man.fandom.com/wiki/Episode_${
                    idx + 1
                }`;

                return (
                    thumbnail && (
                        <Episode
                            className='episode'
                            $width={episodeWidth}
                            key={thumbnail}
                            $crossLinesVisible={hoveredEpisode === idx + 1}
                            {...handlers(idx + 1)}
                        >
                            <EpisodeCover className='episodeCover'>
                                <Link href={link}>
                                    <ThumbnailImage
                                        src={thumbnail}
                                        $offsetX={EPISODE_OFFSETS[idx]?.x ?? 0}
                                        $offsetY={EPISODE_OFFSETS[idx]?.y ?? 0}
                                    />
                                </Link>
                            </EpisodeCover>
                            {thumbnail && (
                                <EpisodeTitle
                                    className='episodeTitle'
                                    $visible={
                                        showTitles || hoveredEpisode === idx + 1
                                    }
                                >
                                    {EPISODE_TITLES[idx]}
                                    <br />
                                    (Episode {idx + 1})
                                </EpisodeTitle>
                            )}
                        </Episode>
                    )
                );
            })}
        </TimelineContainer>
    );
};
