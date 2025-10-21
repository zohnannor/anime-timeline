import { range, sum } from '../util';
import { TimelineData, WidthHelper } from './';

const chaptersVolumes = (timeline: TimelineData) =>
    timeline.volumes.flatMap((v, vi) => v.chapters.map(() => vi));

const chapters = (timeline: TimelineData) =>
    timeline.volumes.flatMap(v => v.chapters);

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

export const getVolumeByChapter = (timeline: TimelineData, idx: number) =>
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
        ? pagesInChapter * (1000 / 180) * 1.05
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

const chaptersWithPagesSplit = (timeline: TimelineData) =>
    timeline.volumes
        .flatMap(v => v.chapters)
        .map((c, ci) => {
            const split = timeline.splitChapters[ci + 1] ?? c.pages;
            return [ci, [split, c.pages - split]] as const;
        });

export const getEpisodeWidth: WidthHelper = (
    timeline,
    idx,
    unboundedChapterWidth
) => {
    const chaptersSplit = chaptersWithPagesSplit(timeline);
    const chaptersTotal = chapters(timeline).length;

    return timeline.seasons
        .flatMap(season => season.episodes ?? [])
        .map(({ chapters: { from, to } }) => {
            return [from - 1, to ?? chaptersTotal] as const;
        })
        .map(([start, end]) =>
            range(start, end).map(ci => {
                const [_, [split, rest]] = chaptersSplit[ci]!;
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
    const { from, to } = timeline.seasons[idx]!.chapters;
    const startIdx = from - 1;
    const endIdx = (to ?? chapters(timeline).length) - 1;

    return sum(
        chaptersWithPagesSplit(timeline)
            .slice(startIdx, endIdx + 1)
            .map(([ci, [split, rest]]) =>
                ci === startIdx && rest !== 0
                    ? rest *
                      getChapterPageWidth(timeline, ci, unboundedChapterWidth)
                    : ci === endIdx
                    ? split *
                      getChapterPageWidth(timeline, ci, unboundedChapterWidth)
                    : getChapterWidth(timeline, ci, unboundedChapterWidth)
            )
    );
};
