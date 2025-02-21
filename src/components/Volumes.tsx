import styled, { css } from 'styled-components';

import {
    CHAPTER_HEIGHT,
    scale,
    VOLUME_COVERS,
    VOLUME_HEIGHT,
    VOLUME_TITLES,
} from '../constants';
import { getVolumeWidth } from '../helpers';
import { useHover } from '../hooks/useHover';
import { useSettings } from '../providers/SettingsProvider';
import { TimelineContainer } from './Container';
import { withCrossLines } from './CrossLines';
import { Link } from './Link';
import { withShadow } from './ShadowWrapper';
import { ThumbnailImage } from './ThumbnailImage';

interface VolumeProps {
    $width: number;
}

export const Volume = withCrossLines(
    styled.div<VolumeProps>`
        display: flex;
        flex-direction: column;
        position: relative;
        height: ${scale(VOLUME_HEIGHT + CHAPTER_HEIGHT)}svh;
        width: ${({ $width }) => scale($width)}svh;
        transition: width 0.2s ease-in-out;
    `
);

export const VolumeCover = withShadow(
    styled.div`
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        font-size: ${scale(500)}svh;
        height: 100%;
        width: 100%;

        & > a {
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
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

interface VolumeTitleProps {
    $visible: boolean;
}

const VolumeTitle = withShadow(
    styled.div<VolumeTitleProps>`
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

        transition: opacity 0.2s ease-in-out;
    `
);

export const Volumes: React.FC = () => {
    const [hoveredVolume, hoverHandlers] = useHover();
    const { unboundedChapterWidth, showTitles } = useSettings();

    return (
        <TimelineContainer>
            {VOLUME_COVERS.map((cover, idx) => {
                const volumeNumber = idx + 1;
                const volumeWidth = getVolumeWidth(
                    volumeNumber,
                    unboundedChapterWidth
                );
                const link = `https://chainsaw-man.fandom.com/wiki/Volume_${volumeNumber}`;

                return (
                    <Volume
                        className='volume'
                        $width={volumeWidth}
                        key={cover || volumeNumber}
                        $crossLinesVisible={hoveredVolume(volumeNumber)}
                        {...hoverHandlers(volumeNumber)}
                    >
                        <VolumeCover
                            className='volumeCover'
                            $invertBorder={!cover}
                        >
                            <Link href={link}>
                                {cover ? (
                                    <ThumbnailImage src={cover} />
                                ) : (
                                    volumeNumber
                                )}
                            </Link>
                        </VolumeCover>
                        {cover && (
                            <VolumeTitle
                                className='volumeTitle'
                                $visible={
                                    showTitles || hoveredVolume(volumeNumber)
                                }
                            >
                                {VOLUME_TITLES[volumeNumber - 1]}
                                <br />
                                (Volume {volumeNumber})
                            </VolumeTitle>
                        )}
                    </Volume>
                );
            })}
        </TimelineContainer>
    );
};
