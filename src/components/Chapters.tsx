import { useState } from 'react';
import styled, { css } from 'styled-components';

import { CHAPTER_PICTURES, scale } from '../constants';
import { getChapterNumber, getChapterWidth } from '../helpers';
import { Container } from './Container';
import { withShadow } from './ShadowWrapper';

interface ChapterProps {
    $width: number;
}

const ChapterWrapper = styled.div<ChapterProps>`
    position: relative;
    height: ${scale(100)}vh;
    width: ${({ $width }) => scale($width)}vh;
`;

const Chapter = withShadow(
    styled.div`
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: 0.1s ease-in-out;
        overflow: hidden;

        font-size: ${scale(32)}vh;
        height: 100%;
        width: 100%;
        background-color: #fff;
        color: black;

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
            object-fit: contain;
            height: 100%;
            pointer-events: none;
        }
    `
);

interface PreviewProps {
    $hovered: boolean;
    $chapterNumber: number;
}

const Preview = styled.div<PreviewProps>`
    position: absolute;
    width: ${scale(120)}vh;
    height: ${scale(100)}vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: 0.25s ease-in-out;
    transform: ${({ $chapterNumber }) =>
            $chapterNumber === 1 ? 'translateX(70px)' : ''}
        translateY(-35px) scale(0);
    font-size: ${scale(12)}vh;
    color: black;
    background: white;
    box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.4);

    & > img {
        object-fit: contain;
        width: 100%;
        height: 80%;
    }

    ${({ $hovered: hovered, $chapterNumber: chapterNumber }) =>
        hovered &&
        css`
            transform: ${chapterNumber === 1 ? 'translateX(70px)' : ''}
                translateY(-110px) scale(5);
        `}
`;
interface ChaptersProps {
    volume: number;
}

export const Chapters: React.FC<ChaptersProps> = ({ volume: volume }) => {
    const [hoveredChapter, setHoveredChapter] = useState(0);

    return (
        <Container>
            {(CHAPTER_PICTURES[volume - 1] ?? []).map((picture, idx) => {
                const chapterNumber = getChapterNumber(volume, idx);
                const chapterWidth = getChapterWidth(chapterNumber);
                const link = `https://chainsaw-man.fandom.com/wiki/Chapter_${chapterNumber}`;

                return (
                    <ChapterWrapper
                        $width={chapterWidth}
                        key={picture || chapterNumber}
                    >
                        {picture && (
                            <Preview
                                $hovered={hoveredChapter === chapterNumber}
                                $chapterNumber={chapterNumber}
                            >
                                <img src={picture} />
                                Chapter {chapterNumber}.
                            </Preview>
                        )}
                        <Chapter
                            onMouseOver={() => setHoveredChapter(chapterNumber)}
                            onMouseOut={() => setHoveredChapter(0)}
                        >
                            <a
                                href={link}
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                {picture ? (
                                    <img src={picture} alt='' />
                                ) : (
                                    chapterNumber
                                )}
                            </a>
                        </Chapter>
                    </ChapterWrapper>
                );
            })}
        </Container>
    );
};
