import styled from 'styled-components';

import { ARC_HEIGHT, ARC_IMAGES, ARC_NAMES, scale } from '../constants';
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

        height: ${scale(ARC_HEIGHT)}vh;
        width: ${({ $width }) => scale($width)}vh;

        & > a {
            writing-mode: sideways-lr;
            align-items: center;
            display: flex;
            justify-content: center;
            font-size: ${scale(100)}vh;
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
                `${-scale($offsetX ?? 0)}vh ${-scale($offsetY ?? 0)}vh`};
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
                    <a
                        href={link}
                        draggable={false}
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        {panel ? <img src={panel} alt='' /> : `${arcName} arc`}
                    </a>
                </Arc>
            );
        })}
    </Container>
);
