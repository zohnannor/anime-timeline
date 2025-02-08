import {
    SCALE,
    CHAPTERS_PER_ARC,
    CHAPTERS_PER_SEASON,
    CHAPTERS_PER_VOLUME,
    PAGES_PER_CHAPTER_FLAT,
    PAGES_PER_EPISODE_WITH_CHAPTERS,
    PAGES_PER_VOLUME,
} from './constants';
import { range, sum } from './util';

export const getChapterNumber = (volume: number, volumeChapter: number) =>
    sum(CHAPTERS_PER_VOLUME.slice(0, volume - 1)) + volumeChapter + 1;

export const getVolumeWidth = (volume: number) => (volume > 11 ? 1005 : 1000);

export const getVolumeByChapter = (chapter: number) =>
    CHAPTERS_PER_VOLUME.reduce<number[]>(
        (chapters, pages) => [
            ...chapters,
            pages + (chapters[chapters.length - 1] ?? 0),
        ],
        []
    ).findIndex(volume => volume >= chapter) + 1;

export const getChapterWidth = (chapter: number) => {
    const volume = getVolumeByChapter(chapter);
    const pagesInChapter = PAGES_PER_CHAPTER_FLAT?.[chapter - 1] ?? 19;
    return (
        (pagesInChapter / (PAGES_PER_VOLUME[volume - 1] ?? 0)) *
        getVolumeWidth(volume)
    );
};

export const getChapterPageWidth = (chapter: number) => {
    const volume = getVolumeByChapter(chapter);
    return (1 / (PAGES_PER_VOLUME[volume - 1] ?? 0)) * getVolumeWidth(volume);
};

export const getArcWidth = (arc: number) => {
    const [start, end] = CHAPTERS_PER_ARC[arc - 1] ?? [1, 1];
    return range(start, end + 1).reduce((acc, chapter) => {
        return acc + getChapterWidth(chapter);
    }, 0);
};

export const getSeasonWidth = (season: number) => {
    const [start, end] = CHAPTERS_PER_SEASON[season - 1] ?? [1, 1];
    return range(start, end + 1).reduce((acc, chapter) => {
        return acc + getChapterWidth(chapter);
    }, 0);
};

export const getEpisodeWidthNew = (episodeNumber: number) => {
    return (PAGES_PER_EPISODE_WITH_CHAPTERS[episodeNumber - 1] ?? []).reduce(
        (episodeWidth, [chapterNumber = 1, chapterPages = 0]) => {
            const chapterWidth =
                getChapterPageWidth(chapterNumber) * chapterPages;
            return episodeWidth + chapterWidth;
        },
        0
    );
};
