import styled from 'styled-components';

import {
    CHAPTERS_PER_SEASON,
    PAGES_PER_CHAPTER,
    SCALE,
    SEASON_COVERS,
} from '../constants';
import { Container } from './Container';

interface SeasonProps {
    $src?: string;
    $flexGrow?: number;
    $offsetX?: number;
    $offsetY?: number;
}

const Season = styled.div<SeasonProps>`
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: url(${({ $src }) => $src});
    background-size: cover;
    background-position: center;
    box-shadow: inset 0px 0px 3px 2px rgba(0, 0, 0, 1);
    background-position-x: ${({ $offsetX }) => ($offsetX ? -$offsetX : 0)}px;
    background-position-y: ${({ $offsetY }) => ($offsetY ? -$offsetY : 0)}px;

    height: ${SCALE * 742}px;
    flex: ${({ $flexGrow }) => ($flexGrow ? `${$flexGrow} 1 0%` : '0 1 auto')};

    /* Invisible image that maintains aspect ratio */
    img {
        opacity: 0;
        max-width: 100%;
    }
`;

const OFFSETS = [
    [0, 600],
    [0, 150],
];

export const Seasons: React.FC = () => (
    <Container $width={'107%'}>
        {SEASON_COVERS.map((cover, idx) => {
            const [chapterFrom, chapterTo] = CHAPTERS_PER_SEASON[idx] ?? [0, 1];
            const allChapters = PAGES_PER_CHAPTER.reduce(
                (a, x) => [...a, ...x],
                []
            );
            const chapters = allChapters.slice(chapterFrom - 1, chapterTo);
            const pagesCount = chapters.reduce((a, x) => a + x, 0);

            return cover ? (
                <Season
                    key={cover}
                    $src={cover}
                    $flexGrow={pagesCount}
                    $offsetX={OFFSETS[idx]?.[0] ?? 0}
                    $offsetY={OFFSETS[idx]?.[1] ?? 0}
                >
                    <img src={cover} alt='' />
                </Season>
            ) : (
                <Season key={`empty-${idx}`} $flexGrow={pagesCount}>
                    SEASON {idx + 1}
                </Season>
            );
        })}
    </Container>
);
