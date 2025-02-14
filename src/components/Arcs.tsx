import styled from 'styled-components';

import { ARC_HEIGHT, ARC_IMAGES, ARC_NAMES, scale } from '../constants';
import { getArcWidth } from '../helpers';
import { TimelineContainer } from './Container';
import { withShadow } from './ShadowWrapper';
import { ThumbnailImage } from './ThumbnailImage';
import { withCrossLines } from './CrossLines';
import { useHover } from '../hooks/useHover';

interface ArcProps {
    $width: number;
}

interface ArcCoverProps {
    $offsetX?: number;
    $offsetY?: number;
}

const Arc = withCrossLines(
    styled.div<ArcProps>`
        position: relative;
        height: ${scale(ARC_HEIGHT)}svh;
        width: ${({ $width }) => scale($width)}svh;
    `
);

const ArcCover = withShadow(
    styled.div<ArcCoverProps>`
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        height: 100%;
        width: 100%;

        & > a {
            writing-mode: sideways-lr;
            align-items: center;
            display: flex;
            justify-content: center;
            font-size: ${scale(100)}svh;
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
    { x: 260, y: 0 },
    { x: 0, y: 0 },
    { x: 130, y: 0 },
    { x: 0, y: 150 },
    { x: 0, y: 80 },
    { x: 0, y: 700 },
    { x: 0, y: 100 },
    { x: 50, y: 0 },
    { x: 0, y: 0 },
    { x: 200, y: 0 },
    { x: 200, y: 0 },
    { x: 0, y: 350 },
    { x: 0, y: 300 },
];

export const Arcs: React.FC = () => {
    const [hoveredArc, hoverHandlers] = useHover();

    return (
        <TimelineContainer>
            {ARC_IMAGES.map((panel, idx) => {
                const arcWidth = getArcWidth(idx + 1);
                const arcName = ARC_NAMES[idx];
                const link = `https://chainsaw-man.fandom.com/wiki/${arcName}_arc`;

                return (
                    <Arc
                        $width={arcWidth}
                        key={panel || idx}
                        $visible={hoveredArc === idx + 1}
                        {...hoverHandlers(idx + 1)}
                    >
                        <ArcCover
                            $invertBorder={!panel}
                            $offsetX={OFFSETS[idx]?.x ?? 0}
                            $offsetY={OFFSETS[idx]?.y ?? 0}
                        >
                            <a
                                href={link}
                                draggable={false}
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                {panel ? (
                                    <ThumbnailImage
                                        src={panel}
                                        alt=''
                                        $offsetX={OFFSETS[idx]?.x ?? 0}
                                        $offsetY={OFFSETS[idx]?.y ?? 0}
                                    />
                                ) : (
                                    `${arcName} arc`
                                )}
                            </a>
                        </ArcCover>
                    </Arc>
                );
            })}
        </TimelineContainer>
    );
};
