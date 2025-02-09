import styled from 'styled-components';

import { ARC_IMAGES, ARC_NAMES, SCALE } from '../constants';
import { getArcWidth } from '../helpers';
import { Container } from './Container';
import { withShadow } from './ShadowWrapper';

interface ArcProps {
    $width: number;
    $offsetX?: number;
    $offsetY?: number;
}

const Arc = withShadow(
    styled.div<ArcProps>`
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        height: ${SCALE * 1579}px;
        width: ${({ $width }) => $width * SCALE}px;

        & > a {
            writing-mode: sideways-lr;
            align-items: center;
            display: flex;
            justify-content: center;
            font-size: ${SCALE * 100}px;
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
    { x: 40, y: 0 },
    { x: 0, y: 0 },
    { x: 30, y: 0 },
    { x: 0, y: 60 },
    { x: 0, y: 30 },
    { x: 0, y: 230 },
    { x: 0, y: 30 },
    { x: 20, y: 0 },
    { x: 0, y: 0 },
    { x: 70, y: 0 },
    { x: 60, y: 0 },
    { x: 0, y: 120 },
    { x: 0, y: 100 },
];

export const Arcs: React.FC = () => (
    <Container>
        {ARC_IMAGES.map((panel, idx) => {
            const arcWidth = getArcWidth(idx + 1);
            const arcName = ARC_NAMES[idx];
            const link = `https://chainsaw-man.fandom.com/wiki/${arcName}_arc`;

            return (
                <Arc
                    key={panel || idx}
                    $invertBorder={!panel}
                    $width={arcWidth}
                    $offsetX={OFFSETS[idx]?.x ?? 0}
                    $offsetY={OFFSETS[idx]?.y ?? 0}
                >
                    <a href={link} target='_blank' rel='noopener noreferrer'>
                        {panel ? <img src={panel} alt='' /> : `${arcName} arc`}
                    </a>
                </Arc>
            );
        })}
    </Container>
);
