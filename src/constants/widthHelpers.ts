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
    const chaptersWithPagesSplit = timeline.volumes
        .flatMap(v => v.chapters)
        .map((c, ci) => {
            const split = timeline.splitChapters[ci + 1] ?? c.pages;
            return [split, c.pages - split] as const;
        });

    return timeline.seasons
        .flatMap(season => season.episodes ?? [])
        .map(e => {
            return [
                e.chapters.from - 1,
                e.chapters.to ??
                    timeline.volumes.flatMap(v => v.chapters).length,
            ] as const;
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
    const end = (to ?? timeline.volumes.flatMap(v => v.chapters).length) - 1;
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
