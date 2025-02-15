import styled, { css } from 'styled-components';

import {
    CHAPTER_HEIGHT,
    CHAPTER_PICTURES,
    scale,
    SMALL_FONT_SIZE,
} from '../constants';
import { getChapterNumber, getChapterWidth } from '../helpers';
import { useHover } from '../hooks/useHover';
import { TimelineContainer } from './Container';
import { withCrossLines } from './CrossLines';
import { withShadow } from './ShadowWrapper';
import { ThumbnailImage } from './ThumbnailImage';

interface ChapterProps {
    $width: number;
}

const Chapter = withCrossLines(
    styled.div<ChapterProps>`
        position: relative;
        height: ${scale(CHAPTER_HEIGHT)}svh;
        width: ${({ $width }) => scale($width)}svh;
    `
);

const ChapterCover = withShadow(
    styled.div`
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: 0.1s ease-in-out;
        overflow: hidden;

        font-size: ${scale(SMALL_FONT_SIZE)}svh;
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
    width: ${scale(120)}svh;
    height: ${scale(100)}svh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: 0.25s ease-in-out;
    transform: ${({ $chapterNumber }) =>
            $chapterNumber === 1 ? 'translateX(70px)' : ''}
        translateY(-35px) scale(0);
    font-size: ${scale(12)}svh;
    color: black;
    background: white;
    box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.4);
    z-index: 10;

    & > img {
        object-fit: contain;
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
    const [hoveredChapter, hoverHandlers] = useHover();

    return (
        <TimelineContainer>
            {(CHAPTER_PICTURES[volume - 1] ?? []).map((picture, idx) => {
                const chapterNumber = getChapterNumber(volume, idx);
                const chapterWidth = getChapterWidth(chapterNumber);
                const link = `https://chainsaw-man.fandom.com/wiki/Chapter_${chapterNumber}`;

                return (
                    <Chapter
                        className='chapter'
                        $width={chapterWidth}
                        key={picture || chapterNumber}
                        $visible={hoveredChapter === chapterNumber}
                        {...hoverHandlers(chapterNumber)}
                    >
                        {picture && (
                            <Preview
                                className='preview'
                                $hovered={hoveredChapter === chapterNumber}
                                $chapterNumber={chapterNumber}
                            >
                                <ThumbnailImage src={picture} />
                                Chapter {chapterNumber}.
                            </Preview>
                        )}
                        <ChapterCover className='chapterCover'>
                            <a
                                href={link}
                                draggable={false}
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                {picture ? (
                                    <ThumbnailImage src={picture} alt='' />
                                ) : (
                                    chapterNumber
                                )}
                            </a>
                        </ChapterCover>
                    </Chapter>
                );
            })}
        </TimelineContainer>
    );
};
