import styled, { css } from 'styled-components';

import {
    CHAPTER_HEIGHT,
    CHAPTER_PICTURES,
    scale,
    SMALL_FONT_SIZE,
} from '../constants';
import { getChapterNumber, getChapterWidth } from '../helpers';
import { useHover } from '../hooks/useHover';
import { useSettings } from '../providers/SettingsProvider';
import { TimelineContainer } from './Container';
import { withCrossLines } from './CrossLines';
import { Link } from './Link';
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
        transition: all 0.2s ease-in-out;

        &:focus {
            outline: ${scale(20)}svh solid red;
            z-index: 1;
        }
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
            inset: 0;
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

interface ChapterTitleProps {
    $visible: boolean;
}

const ChapterTitle = withShadow(
    styled.div<ChapterTitleProps>`
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-size: ${scale(SMALL_FONT_SIZE)}svh;
        color: white;
        background: transparent;
        pointer-events: none;
        opacity: 0;
        ${({ $visible }) =>
            $visible &&
            css`
                opacity: 1;
                text-shadow: -1px -1px 0 black, 1px -1px 0 black,
                    -1px 1px 0 black, 1px 1px 0 black, 0 0 ${scale(10)}svh black,
                    0 0 ${scale(20)}svh rgba(0, 0, 0, 0.5),
                    0 0 ${scale(30)}svh rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(${scale(10)}svh);
            `}

        transition: all 0.2s ease-in-out;
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
            $chapterNumber === 1 ? `translateX(${scale(220)}svh)` : ''}
        translateY(${scale(11)}svh) scale(0);
    font-size: ${scale(12)}svh;
    color: black;
    background: white;
    box-shadow: 0 0 ${scale(15)}svh ${scale(6)}svh rgba(0, 0, 0, 0.4);
    z-index: 10;

    & > img {
        object-fit: contain;
        height: 80%;
    }

    ${({ $hovered, $chapterNumber }) =>
        $hovered &&
        css`
            transform: ${$chapterNumber === 1
                    ? `translateX(${scale(220)}svh)`
                    : ''}
                translateY(-${scale(350)}svh) scale(5);
        `}
`;
interface ChaptersProps {
    volume: number;
}

export const Chapters: React.FC<ChaptersProps> = ({ volume: volume }) => {
    const [hoveredChapter, hoverHandlers] = useHover();
    const { unboundedChapterWidth, showTitles } = useSettings();

    return (
        <TimelineContainer>
            {(CHAPTER_PICTURES[volume - 1] ?? []).map((picture, idx) => {
                const chapterNumber = getChapterNumber(volume, idx);
                const chapterWidth = getChapterWidth(
                    chapterNumber,
                    unboundedChapterWidth
                );
                const link = `https://chainsaw-man.fandom.com/wiki/Chapter_${chapterNumber}`;

                return (
                    <Chapter
                        id={`chapter-${chapterNumber}`}
                        className='chapter'
                        $width={chapterWidth}
                        key={picture || chapterNumber}
                        $crossLinesVisible={hoveredChapter === chapterNumber}
                        {...hoverHandlers(chapterNumber)}
                        tabIndex={-1}
                    >
                        {picture && (
                            <Preview
                                className='preview'
                                $hovered={hoveredChapter === chapterNumber}
                                $chapterNumber={chapterNumber}
                            >
                                <ThumbnailImage src={picture} />
                                Chapter {chapterNumber}
                            </Preview>
                        )}
                        <ChapterCover className='chapterCover'>
                            <Link href={link}>
                                {picture ? (
                                    <ThumbnailImage src={picture} />
                                ) : (
                                    chapterNumber
                                )}
                            </Link>
                        </ChapterCover>
                        {
                            <ChapterTitle
                                className='chapterTitle'
                                $visible={
                                    showTitles ||
                                    hoveredChapter === chapterNumber
                                }
                            >
                                {chapterNumber}
                            </ChapterTitle>
                        }
                    </Chapter>
                );
            })}
        </TimelineContainer>
    );
};
