import styled from 'styled-components';

import {
    ARC_IMAGES,
    CHAPTERS_PER_ARC,
    PAGES_PER_CHAPTER,
    SCALE,
} from '../constants';
import { Container } from './Container';

interface ArcProps {
    $src: string;
    $flexGrow?: number;
    $offsetX?: number;
    $offsetY?: number;
}

const Arc = styled.div<ArcProps>`
    background-image: url(${({ $src }) => $src});
    background-size: cover;
    background-position: center;
    box-shadow: inset 0px 0px 3px 2px rgba(0, 0, 0, 1);
    background-position-x: ${({ $offsetX }) => ($offsetX ? -$offsetX : 0)}px;
    background-position-y: ${({ $offsetY }) => ($offsetY ? -$offsetY : 0)}px;

    height: ${SCALE * 1579}px;
    flex: ${({ $flexGrow }) => ($flexGrow ? `${$flexGrow} 1 0%` : '0 1 auto')};

    /* Invisible image that maintains aspect ratio */
    img {
        opacity: 0;
        width: 100%;
    }
`;

const OFFSETS = [
    [90, 0],
    [0, 0],
    [40, 0],
    [0, 0],
    [0, 40],
    [0, 350],
    [0, 60],
    [30, 0],
    [0, 0],
    [90, 0],
    [80, 0],
    [0, 170],
    [0, 180],
];

export const Arcs: React.FC = () => (
    // idk why this is 107% but it works
    <Container $width={'107%'}>
        {ARC_IMAGES.map((panel, idx) => {
            const [chapterFrom, chapterTo] = CHAPTERS_PER_ARC[idx] ?? [0, 1];
            const allChapters = PAGES_PER_CHAPTER.reduce(
                (a, x) => [...a, ...x],
                []
            );
            const chapters = allChapters.slice(chapterFrom - 1, chapterTo);
            const pagesCount = chapters.reduce((a, x) => a + x, 0);

            return (
                <Arc
                    key={panel}
                    $src={panel}
                    $flexGrow={pagesCount}
                    $offsetX={OFFSETS[idx]?.[0] ?? 0}
                    $offsetY={OFFSETS[idx]?.[1] ?? 0}
                >
                    <img src={panel} alt='' />
                </Arc>
            );
        })}
    </Container>
);
