import styled from 'styled-components';
import { CHAPTER_PICTURES, PAGES_PER_CHAPTER, SCALE } from '../constants';
import { Container } from './Container';

interface ChapterProps {
    $src?: string;
    $flexGrow?: number;
}

const Chapter = styled.div<ChapterProps>`
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: url(${({ $src }) => $src});
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    box-shadow: inset 0px 0px 3px 2px rgba(0, 0, 0, 1);

    height: ${SCALE * 100}px;
    flex: ${({ $flexGrow }) => ($flexGrow ? `${$flexGrow} 1 0%` : '0 1 auto')};

    /* Invisible image that maintains aspect ratio */
    img {
        opacity: 0;
        max-width: 100%;
    }
`;

interface ChaptersProps {
    $volume: number;
}

export const Chapters: React.FC<ChaptersProps> = ({ $volume: volume }) => (
    <Container $width={'100%'} $flexGrow={1}>
        {(CHAPTER_PICTURES[volume - 1] ?? []).map((picture, idx) => {
            const pagesInChapter = PAGES_PER_CHAPTER[volume - 1]?.[idx] ?? 19;
            const chapterNumber =
                PAGES_PER_CHAPTER.slice(0, volume - 1)
                    .map(v => v.length)
                    .reduce((a, x) => a + x, 0) +
                idx +
                1;

            return picture ? (
                <Chapter
                    key={picture}
                    $src={picture}
                    $flexGrow={pagesInChapter}
                >
                    <img src={picture} alt='' />
                </Chapter>
            ) : (
                <Chapter key={`empty-${idx}`} $flexGrow={pagesInChapter}>
                    {chapterNumber}
                </Chapter>
            );
        })}
    </Container>
);
