import styled, { css } from 'styled-components';

import {
    CHAPTER_HEIGHT,
    CHAPTER_NAMES,
    CHAPTER_PICTURES_FLAT,
    scale,
    SMALL_FONT_SIZE,
} from '../constants';
import { getChapterWidth } from '../helpers';
import { useHover } from '../hooks/useHover';
import { useSettings } from '../providers/SettingsProvider';
import { TimelineContainer } from './Container';
import { withCrossLines } from './CrossLines';
import { Link } from './Link';
import { withShadow } from './ShadowWrapper';
import { ThumbnailImage } from './ThumbnailImage';
import { Tooltip } from './Tooltip';

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
            z-index: 10; // TODO: fix focus layering
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
    $firstChapter: boolean;
    $hasPicture: boolean;
}

const Preview = styled.div<PreviewProps>`
    display: flex;
    height: ${({ $hasPicture }) => scale($hasPicture ? 600 : 250)}svh;
    width: ${scale(600)}svh;
    padding: ${scale(30)}svh;
    gap: ${scale(20)}svh;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: ${scale(50)}svh;
    box-shadow: 0 0 ${scale(15)}svh ${scale(6)}svh rgba(0, 0, 0, 0.4);
    background: white;
    color: black;
    border-radius: ${scale(40)}svh;

    ${({ $firstChapter }) =>
        $firstChapter &&
        css`
            transform: translateX(${scale(200)}svh);
        `}

    & > img {
        object-fit: contain;
        max-height: 75%;
        max-width: 75%;
    }
`;

export const Chapters: React.FC = () => {
    const [hoveredChapter, hoverHandlers] = useHover();
    const { unboundedChapterWidth, showTitles, showCrosslines } = useSettings();

    return (
        <TimelineContainer>
            {CHAPTER_PICTURES_FLAT.map((picture, idx) => {
                const chapterNumber = idx + 1;
                const chapterWidth = getChapterWidth(
                    chapterNumber,
                    unboundedChapterWidth
                );
                const link = `https://chainsaw-man.fandom.com/wiki/Chapter_${chapterNumber}`;
                const chapterName = CHAPTER_NAMES[chapterNumber - 1];

                const chapterPreview = (
                    <Preview
                        className='preview'
                        $firstChapter={idx === 0}
                        $hasPicture={!!picture}
                    >
                        {picture && <ThumbnailImage src={picture} />}
                        {chapterName}
                    </Preview>
                );

                return (
                    <Chapter
                        id={`chapter-${chapterNumber}`}
                        className='chapter'
                        $width={chapterWidth}
                        key={picture || chapterNumber}
                        $crossLinesVisible={hoveredChapter(chapterNumber)}
                        {...hoverHandlers(chapterNumber)}
                        tabIndex={-1}
                    >
                        <Tooltip
                            placement='top'
                            animation='grow'
                            content={chapterPreview}
                            visible={
                                !showCrosslines && hoveredChapter(chapterNumber)
                            }
                        >
                            <ChapterCover className='chapterCover'>
                                <Link href={link}>
                                    {picture ? (
                                        <ThumbnailImage src={picture} />
                                    ) : (
                                        chapterNumber
                                    )}
                                </Link>
                            </ChapterCover>
                        </Tooltip>
                        {
                            <ChapterTitle
                                className='chapterTitle'
                                $visible={
                                    showTitles || hoveredChapter(chapterNumber)
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
