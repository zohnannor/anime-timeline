import styled, { css } from 'styled-components';

import {
    scale,
    SEASON_COVERS,
    SEASON_HEIGHT,
    SEASON_OFFSETS,
    SEASON_TITLES,
} from '../constants';
import { getSeasonWidth } from '../helpers';
import { useHover } from '../hooks/useHover';
import { useSettings } from '../providers/SettingsProvider';
import { TimelineContainer } from './Container';
import { withCrossLines } from './CrossLines';
import { Episodes } from './Episodes';
import { Link } from './Link';
import { withShadow } from './ShadowWrapper';
import { ThumbnailImage } from './ThumbnailImage';

interface SeasonProps {
    $width: number;
}

const Season = withCrossLines(
    styled.div<SeasonProps>`
        display: flex;
        position: relative;
        align-items: flex-end;
        height: ${scale(SEASON_HEIGHT)}svh;
        width: ${({ $width }) => scale($width)}svh;
        transition: width 0.2s ease-in-out;

        & > div {
            position: absolute;
        }
    `
);

interface SeasonCoverProps {
    $emptyCover?: boolean;
}

const SeasonCover = withShadow(
    styled.div<SeasonCoverProps>`
        position: relative;
        display: flex;
        align-items: ${({ $emptyCover }) =>
            $emptyCover ? 'center' : 'flex-end'};
        justify-content: center;
        overflow: hidden;

        font-size: ${scale(250)}svh;
        height: 100%;
        width: 100%;
        cursor: default;

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
            transform: scale(1.05);
        }
    `
);

interface SeasonTitleProps {
    $visible: boolean;
}

const SeasonTitle = withShadow(
    styled.div<SeasonTitleProps>`
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-size: ${scale(100)}svh;
        color: white;
        background: transparent;
        pointer-events: none;
        opacity: 0;
        ${({ $visible }) =>
            $visible &&
            css`
                opacity: 1;
                background-color: rgba(0, 0, 0, 0.2);
                text-shadow: -1px -1px 0 black, 1px -1px 0 black,
                    -1px 1px 0 black, 1px 1px 0 black, 0 0 ${scale(10)}svh black,
                    0 0 ${scale(20)}svh rgba(0, 0, 0, 0.5),
                    0 0 ${scale(30)}svh rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(${scale(10)}svh);
            `}

        transition: all 0.2s ease-in-out;
    `
);

export const Seasons: React.FC = () => {
    const [hoveredSeason, hoverHandlers] = useHover();
    const { unboundedChapterWidth, showTitles } = useSettings();

    return (
        <TimelineContainer>
            {SEASON_COVERS.map((cover, idx) => {
                const seasonNumber = idx + 1;
                const seasonWidth = getSeasonWidth(
                    seasonNumber,
                    unboundedChapterWidth
                );
                let link = [
                    'https://chainsaw-man.fandom.com/wiki/Chainsaw_Man_(Anime)',
                    'https://chainsaw-man.fandom.com/wiki/Chainsaw_Man_%E2%80%93_The_Movie:_Reze_Arc',
                ][idx];

                return (
                    <Season
                        className='season'
                        $width={seasonWidth}
                        key={cover || seasonNumber}
                        $crossLinesVisible={hoveredSeason(seasonNumber)}
                        {...hoverHandlers(seasonNumber)}
                    >
                        <SeasonCover
                            className='seasonCover'
                            $invertBorder={!cover}
                            $emptyCover={!cover}
                        >
                            {cover ? (
                                <Link href={link}>
                                    <ThumbnailImage
                                        src={cover}
                                        $offsetX={SEASON_OFFSETS[idx]?.x ?? 0}
                                        $offsetY={SEASON_OFFSETS[idx]?.y ?? 0}
                                    />
                                </Link>
                            ) : (
                                `SEASON ${idx}`
                            )}
                        </SeasonCover>
                        {cover && (
                            <SeasonTitle
                                className='seasonTitle'
                                $visible={
                                    showTitles || hoveredSeason(seasonNumber)
                                }
                            >
                                {SEASON_TITLES[seasonNumber - 1]}
                            </SeasonTitle>
                        )}
                        <Episodes season={seasonNumber} />
                    </Season>
                );
            })}
        </TimelineContainer>
    );
};
