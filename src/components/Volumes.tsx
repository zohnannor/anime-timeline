import styled from 'styled-components';

import { scale, VOLUME_COVERS, VOLUME_HEIGHT } from '../constants';
import { getVolumeWidth } from '../helpers';
import { Chapters } from './Chapters';
import { Container } from './Container';
import { withShadow } from './ShadowWrapper';
import { ThumbnailImage } from './ThumbnailImage';

interface VolumeProps {
    $width: number;
}

export const Volume = withShadow(
    styled.div<VolumeProps>`
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        font-size: ${scale(500)}svh;
        height: ${scale(VOLUME_HEIGHT)}svh;
        width: ${({ $width }) => scale($width)}svh;

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

export const Volumes: React.FC = () => (
    <Container>
        {VOLUME_COVERS.map((cover, idx) => {
            const volumeNumber = idx + 1;
            const volumeWidth = getVolumeWidth(volumeNumber);
            const link = `https://chainsaw-man.fandom.com/wiki/Volume_${volumeNumber}`;

            return (
                <Container $dir='column' key={cover || volumeNumber}>
                    <Chapters volume={volumeNumber} />
                    <Volume $invertBorder={!cover} $width={volumeWidth}>
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
                    </Volume>
                </Container>
            );
        })}
    </Container>
);
