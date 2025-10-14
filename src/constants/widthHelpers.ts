import { range, sum } from '../util';
import { TimelineData } from '.';

type WidthHelper = (
    timeline: TimelineData,
    idx: number,
    unboundedChapterWidth: boolean
) => number;

export const getVolumeWidth: WidthHelper = (
    timeline,
    idx,
    unboundedChapterWidth
) =>
    unboundedChapterWidth
        ? sum(
              timeline.volumes
                  .flatMap((v, vi) => v.chapters.map(() => vi))
                  .map((vi, ci): [number, number] => [vi, ci])
                  .filter(([vi, _]) => vi === idx)
                  .map(([vi, ci]): [number, number] => [
                      vi,
                      getChapterWidth(timeline, ci, unboundedChapterWidth),
                  ])
                  .map(([_, cw]) => cw)
          )
        : 1000;

const getVolumeByChapter = (timeline: TimelineData, idx: number) =>
    timeline.volumes
        .flatMap((v, vi) => v.chapters.map(() => vi))
        .find((_, ci) => ci === idx)!;

const pagesPerVolume = (timeline: TimelineData, idx: number) =>
    sum(timeline.volumes[idx]!.chapters.map(c => c.pages));

export const getChapterWidth: WidthHelper = (
    timeline,
    idx,
    unboundedChapterWidth
) => {
    const pagesInChapter = timeline.volumes.flatMap(v => v.chapters)[idx]!
        .pages;
    const volume = getVolumeByChapter(timeline, idx);
    return unboundedChapterWidth
        ? pagesInChapter * (1000 / pagesPerVolume(timeline, 0)) * 1.05
        : pagesInChapter * (1000 / pagesPerVolume(timeline, volume));
};

export const getArcWidth: WidthHelper = (
    timeline,
    idx,
    unboundedChapterWidth
) => {
    const { from, to } = timeline.arcs[idx]!.chapters;

    return sum(
        range(
            from - 1,
            to ?? timeline.volumes.flatMap(v => v.chapters).length
        ).map(i => getChapterWidth(timeline, i, unboundedChapterWidth))
    );
};

const getChapterPageWidth = (
    timeline: TimelineData,
    chapter: number,
    unboundedChapterWidth: boolean
) => {
    const volume = getVolumeByChapter(timeline, chapter);
    return (
        getVolumeWidth(timeline, volume, unboundedChapterWidth) /
        pagesPerVolume(timeline, volume)
    );
};

export const getEpisodeWidth: WidthHelper = (
    timeline,
    idx,
    unboundedChapterWidth
) => {
    const allEpisodes = timeline.seasons.flatMap(season => season.episodes!);
    const chapters = allEpisodes[idx]!.chapters;
    const chaptersBefore = sum(
        allEpisodes.slice(0, idx).map(ep => ep.chapters)
    );
    return sum(
        range(chaptersBefore, chaptersBefore + chapters).map(ci =>
            getChapterWidth(timeline, ci, unboundedChapterWidth)
        )
    );
};

export const getSeasonWidth: WidthHelper = (
    timeline,
    idx,
    unboundedChapterWidth
) => {
    const season = timeline.seasons[idx]!;

    const { from, to } = season.chapters;
    const endChapter = to ?? timeline.volumes.flatMap(v => v.chapters).length;

    const splitChapters = season.splitChapters ?? {};
    const splitFirst = splitChapters[from];
    const splitLast = splitChapters[endChapter];

    return sum(
        range(from, endChapter).map(ci =>
            getChapterWidth(timeline, ci, unboundedChapterWidth)
        )
    );

    return sum(
        range(from, endChapter).map(ci => {
            const chapter = timeline.volumes.flatMap(v => v.chapters)[ci]!;

            const fullChapterWidth = getChapterWidth(
                timeline,
                ci,
                unboundedChapterWidth
            );
            const pageWidth = fullChapterWidth / chapter.pages;

            if (splitLast !== undefined && ci === endChapter) {
                return splitLast * pageWidth;
            } else if (splitFirst !== undefined && ci === from) {
                return splitFirst * pageWidth;
            } else {
                return fullChapterWidth;
            }
        })
    );
};
