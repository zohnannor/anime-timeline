import { range, sum } from '../util';
import { TimelineData } from './';

const chaptersVolumes = (timeline: TimelineData) =>
    timeline.volumes.flatMap((v, vi) => v.chapters.map(() => vi));

const chapters = (timeline: TimelineData) =>
    timeline.volumes.flatMap(v => v.chapters);

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
              chaptersVolumes(timeline)
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
    chaptersVolumes(timeline).find((_, ci) => ci === idx)!;

const pagesPerVolume = (timeline: TimelineData, idx: number) =>
    sum(timeline.volumes[idx]!.chapters.map(c => c.pages));

export const getChapterWidth: WidthHelper = (
    timeline,
    idx,
    unboundedChapterWidth
) => {
    const pagesInChapter = chapters(timeline)[idx]!.pages;
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
        range(from - 1, to ?? chapters(timeline).length).map(i =>
            getChapterWidth(timeline, i, unboundedChapterWidth)
        )
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
    const chaptersWithPagesSplit = timeline.volumes
        .flatMap(v => v.chapters)
        .map((c, ci) => {
            const split = timeline.splitChapters[ci + 1] ?? c.pages;
            return [split, c.pages - split] as const;
        });
    const chaptersTotal = chapters(timeline).length;

    return timeline.seasons
        .flatMap(season => season.episodes ?? [])
        .map(({ chapters: { from, to } }) => {
            return [from - 1, to ?? chaptersTotal] as const;
        })
        .map(([start, end]) =>
            range(start, end).map(ci => {
                const [split, rest] = chaptersWithPagesSplit[ci]!;
                return split !== 0 && ci === end - 1
                    ? split *
                          getChapterPageWidth(
                              timeline,
                              ci,
                              unboundedChapterWidth
                          )
                    : rest !== 0 && ci === start
                    ? rest *
                      getChapterPageWidth(timeline, ci, unboundedChapterWidth)
                    : getChapterWidth(timeline, ci, unboundedChapterWidth);
            })
        )
        .map(sum)[idx]!;
};

export const getSeasonWidth: WidthHelper = (
    timeline,
    idx,
    unboundedChapterWidth
) => {
    const season = timeline.seasons[idx]!;
    const { from, to } = season.chapters;
    const start = from - 1;
    const end = (to ?? chapters(timeline).length) - 1;
    const splitChapters = timeline.splitChapters;
    const splitFirst = splitChapters[start];
    const splitLast = splitChapters[end + 1];
    return sum(
        range(start, end + 1).map(ci => {
            return splitFirst && ci === start
                ? splitFirst *
                      getChapterPageWidth(timeline, ci, unboundedChapterWidth)
                : splitLast && ci === end
                ? splitLast *
                  getChapterPageWidth(timeline, ci, unboundedChapterWidth)
                : getChapterWidth(timeline, ci, unboundedChapterWidth);
        })
    );
};
