import { keyframes } from 'styled-components';

import {
    AnimeTitle,
    PAGES_PER_EPISODE_WITH_CHAPTERS,
    TIMELINE,
} from './constants';
import { map, range, sum } from './util';

export { fetchNextChapterDate } from './ProtobufReader';

const getPagesInChapter = (animeTitle: AnimeTitle, chapter: number) =>
    TIMELINE[animeTitle].extra.PAGES_PER_CHAPTER_FLAT?.[chapter - 1] ?? 19;

const getChapterNumber = (
    animeTitle: AnimeTitle,
    volume: number,
    volumeChapter: number
) =>
    sum(
        (TIMELINE[animeTitle].extra.CHAPTERS_PER_VOLUME ?? []).slice(
            0,
            volume - 1
        )
    ) +
    volumeChapter +
    1;

export const getVolumeWidth = (
    animeTitle: AnimeTitle,
    volume: number,
    unboundedChapterWidth: boolean
): number => {
    const volumeWidth = volume > 11 ? 1005 : 1000;
    return unboundedChapterWidth
        ? sum(
              map(
                  range(
                      0,
                      (TIMELINE[animeTitle].extra.CHAPTERS_PER_VOLUME ?? [])[
                          volume - 1
                      ] ?? 0
                  ),
                  volumeChapters =>
                      getChapterWidth(
                          animeTitle,
                          getChapterNumber(animeTitle, volume, volumeChapters),
                          unboundedChapterWidth
                      )
              )
          )
        : volumeWidth;
};

const getVolumeByChapter = (animeTitle: AnimeTitle, chapter: number) =>
    (TIMELINE[animeTitle].extra.CHAPTERS_PER_VOLUME ?? [])
        .reduce<number[]>(
            (chapters, pages) => [
                ...chapters,
                pages + (chapters[chapters.length - 1] ?? 0),
            ],
            []
        )
        .findIndex(volume => volume >= chapter) + 1;

export const getChapterWidth = (
    animeTitle: AnimeTitle,
    chapter: number,
    unboundedChapterWidth: boolean
): number => {
    const volume = getVolumeByChapter(animeTitle, chapter);
    const pagesInChapter = getPagesInChapter(animeTitle, chapter);
    return unboundedChapterWidth
        ? pagesInChapter *
              (1000 / TIMELINE[animeTitle].extra.PAGES_PER_VOLUME[0]!) *
              1.05
        : (pagesInChapter /
              (TIMELINE[animeTitle].extra.PAGES_PER_VOLUME[volume - 1] ?? 0)) *
              getVolumeWidth(animeTitle, volume, false);
};

const getChapterPageWidth = (
    animeTitle: AnimeTitle,
    chapter: number,
    unboundedChapterWidth: boolean
) => {
    const volume = getVolumeByChapter(animeTitle, chapter);
    return (
        (1 / (TIMELINE[animeTitle].extra.PAGES_PER_VOLUME[volume - 1] ?? 0)) *
        getVolumeWidth(animeTitle, volume, unboundedChapterWidth)
    );
};

export const getArcWidth = (
    animeTitle: AnimeTitle,
    arc: number,
    unboundedChapterWidth: boolean
) => {
    const [start, end] = TIMELINE[animeTitle].extra.CHAPTERS_PER_ARC[
        arc - 1
    ] ?? [1, 1];
    return range(start, end + 1).reduce((acc, chapter) => {
        return (
            acc + getChapterWidth(animeTitle, chapter, unboundedChapterWidth)
        );
    }, 0);
};

export const getSeasonWidth = (
    animeTitle: AnimeTitle,
    season: number,
    unboundedChapterWidth: boolean
) => {
    const [start, end] = (TIMELINE[animeTitle].extra.CHAPTERS_PER_SEASON ?? [])[
        season - 1
    ] ?? [1, 1];
    const splitFirst = (TIMELINE[animeTitle].extra.SPLIT_CHAPTERS ?? [])[
        start - 1
    ];
    const splitLast = (TIMELINE[animeTitle].extra.SPLIT_CHAPTERS ?? [])[end];
    // shorten/lengthen the season if it doesn't cover the whole chapter
    return range(start, end + 1).reduce((acc, chapter) => {
        return (
            acc +
            (splitLast && chapter === end
                ? splitLast *
                  getChapterPageWidth(animeTitle, end, unboundedChapterWidth)
                : splitFirst && chapter === start
                ? splitFirst *
                  getChapterPageWidth(
                      animeTitle,
                      start - 1,
                      unboundedChapterWidth
                  )
                : getChapterWidth(animeTitle, chapter, unboundedChapterWidth))
        );
    }, 0);
};

export const getEpisodeWidth = (
    animeTitle: AnimeTitle,
    episodeNumber: number,
    unboundedChapterWidth: boolean
) => {
    return (
        PAGES_PER_EPISODE_WITH_CHAPTERS(animeTitle)[episodeNumber - 1] ?? []
    ).reduce((episodeWidth, [chapterNumber = 1, chapterPages = 0]) => {
        const chapterWidth =
            getChapterPageWidth(
                animeTitle,
                chapterNumber,
                unboundedChapterWidth
            ) * chapterPages;
        return episodeWidth + chapterWidth;
    }, 0);
};

// thanks deepseek-r1 (he thought for 245+150+92 = 487 seconds in total)
export const interpolateColor = (
    value: number,
    inputRange: [number, number],
    colorRange: number[]
) => {
    const [inputMin, inputMax] = inputRange;
    const colorCount = colorRange.length;

    if (colorCount < 2) {
        throw new Error('At least 2 colors required in colorRange');
    }

    // Handle single-value input range
    if (inputMin === inputMax) return colorRange[0]!;

    // Calculate global interpolation factor (0-1)
    let tGlobal = (value - inputMin) / (inputMax - inputMin);
    tGlobal = Math.max(0, Math.min(1, tGlobal));

    // Determine which color segment we're in
    const segmentCount = colorCount - 1;
    const segmentIndex = Math.min(
        Math.floor(tGlobal * segmentCount),
        segmentCount - 1
    );

    // Calculate local t for this segment
    const tLocal = tGlobal * segmentCount - segmentIndex;

    // Get colors for this segment
    const colorStart = colorRange[segmentIndex]!;
    const colorEnd = colorRange[segmentIndex + 1]!;

    // Extract RGB components
    const startR = (colorStart >> 16) & 0xff;
    const startG = (colorStart >> 8) & 0xff;
    const startB = colorStart & 0xff;

    const endR = (colorEnd >> 16) & 0xff;
    const endG = (colorEnd >> 8) & 0xff;
    const endB = colorEnd & 0xff;

    // Interpolate each channel
    const r = Math.round(startR + tLocal * (endR - startR));
    const g = Math.round(startG + tLocal * (endG - startG));
    const b = Math.round(startB + tLocal * (endB - startB));

    // Combine back into hex color
    return (r << 16) | (g << 8) | b;
};

export const MONTHS_GRADIENT = [0xd3e3f4, 0xf2e97e, 0xb3cd53, 0xface8a];
export const DAYS_GRADIENT = [0xed8581, 0x9df697];

export const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
] as const;

export const hueGlow = keyframes`
    0% {
        filter: hue-rotate(0deg);
    }
    100% {
        filter: hue-rotate(360deg);
    }
`;
