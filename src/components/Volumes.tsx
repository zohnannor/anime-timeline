import styled from 'styled-components';

import {
    CHAPTER_HEIGHT,
    scale,
    VOLUME_COVERS,
    VOLUME_HEIGHT,
} from '../constants';
import { getVolumeWidth } from '../helpers';
import { Chapters } from './Chapters';
import { TimelineContainer } from './Container';
import { withShadow } from './ShadowWrapper';
import { ThumbnailImage } from './ThumbnailImage';
import { withCrossLines } from './CrossLines';
import { useHover } from '../hooks/useHover';

interface VolumeProps {
    $width: number;
}

export const Volume = withCrossLines(
    styled.div<VolumeProps>`
        position: relative;
        height: ${scale(VOLUME_HEIGHT + CHAPTER_HEIGHT)}svh;
        width: ${({ $width }) => scale($width)}svh;

        display: flex;
        flex-direction: column;
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

export const Volumes: React.FC = () => {
    const [hoveredVolume, hoverHandlers] = useHover();

    return (
        <TimelineContainer>
            {VOLUME_COVERS.map((cover, idx) => {
                const volumeNumber = idx + 1;
                const volumeWidth = getVolumeWidth(volumeNumber);
                const link = `https://chainsaw-man.fandom.com/wiki/Volume_${volumeNumber}`;

                return (
                    <Volume
                        $width={volumeWidth}
                        key={cover || volumeNumber}
                        $visible={hoveredVolume === volumeNumber}
                        {...hoverHandlers(volumeNumber)}
                    >
                        <Chapters volume={volumeNumber} />
                        <VolumeCover $invertBorder={!cover}>
                            <a
                                href={link}
                                draggable={false}
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                {cover ? (
                                    <ThumbnailImage src={cover} alt='' />
                                ) : (
                                    volumeNumber
                                )}
                            </a>
                        </VolumeCover>
                    </Volume>
                );
            })}
        </TimelineContainer>
    );
};
