import { keyframes } from 'styled-components';

import { TIMELINE_HEIGHT } from '../../timelines/constants';
import {
    Timeline,
    TimelineData,
    TimelineSectionType,
} from '../../timelines/types';
import { range, sum } from './util';

export { default as fetchNextChapterDate } from './ProtobufReader';

export const toTitleCase = (s: string) =>
    s.replace(/^_*(.)|_+(.)/g, (_, c, d) =>
        c ? c.toUpperCase() : ' ' + d.toUpperCase(),
    );

export const scale = (n: number) =>
    `calc(${n} * calc(100 / var(--max-height)) * 1svh)`;

export const tokyoDate = (d: string) =>
    new Date(`${d.replaceAll(/(st|nd|rd|th)/g, '')} GMT+9`); // Tokyo timezone

export const maxHeight = (timeline: Timeline) =>
    sum(
        Object.values(timeline.layout)
            .filter(s => s.type !== 'timeline')
            .map(s => s.height),
    ) + TIMELINE_HEIGHT;

export const chapterDates = (timeline: Timeline) =>
    timeline.data.volumes.flatMap(v => v.chapters).map(c => tokyoDate(c.date));

const groupBy = <T>(array: T[], getKey: (el: T) => number) =>
    array.reduce<[[number, T][][], number | null]>(
        ([groups, previous], date, idx) => {
            const key = getKey(date);
            if (key === previous) {
                groups[groups.length - 1]!.push([idx, date]);
            } else {
                groups.push([[idx, date]]);
            }
            return [groups, key];
        },
        [[], null],
    )[0];

export const chapterDatesByMonth = (timeline: Timeline) =>
    groupBy(
        chapterDates(timeline),
        date => date.getFullYear() + 1 + (date.getMonth() + 1) * 12,
    );

export const chapterDatesByYear = (timeline: Timeline) =>
    groupBy(chapterDates(timeline), date => date.getFullYear() + 1);

const chaptersVolumes = (timeline: TimelineData) =>
    timeline.volumes.flatMap((v, vi) => v.chapters.map(() => vi));
export const chapters = (timeline: TimelineData) =>
    timeline.volumes.flatMap(v => v.chapters);

export type WidthHelper = (
    timeline: TimelineData,
    idx: number,
    unboundedChapterWidth: boolean,
) => number;

export const getVolumeWidth: WidthHelper = (
    timeline,
    idx,
    unboundedChapterWidth,
) =>
    unboundedChapterWidth ?
        sum(
            chaptersVolumes(timeline)
                .map((vi, ci): [number, number] => [vi, ci])
                .filter(([vi, _]) => vi === idx)
                .map(([vi, ci]): [number, number] => [
                    vi,
                    getChapterWidth(timeline, ci, unboundedChapterWidth),
                ])
                .map(([_, cw]) => cw),
        )
    :   1000;

export const getVolumeByChapter = (timeline: TimelineData, idx: number) =>
    chaptersVolumes(timeline).find((_, ci) => ci === idx)!;
const pagesPerVolume = (timeline: TimelineData, idx: number) =>
    sum(timeline.volumes[idx]!.chapters.map(c => c.pages));

export const getChapterWidth: WidthHelper = (
    timeline,
    idx,
    unboundedChapterWidth,
) => {
    const pagesInChapter = chapters(timeline)[idx]!.pages;
    const volume = getVolumeByChapter(timeline, idx);
    return unboundedChapterWidth ?
            pagesInChapter * (1000 / 180) * 1.05
        :   pagesInChapter * (1000 / pagesPerVolume(timeline, volume));
};

export const getArcWidth: WidthHelper = (
    timeline,
    idx,
    unboundedChapterWidth,
) => {
    const { from, to } = timeline.sagas.flatMap(s => s.arcs)[idx]!.chapters;
    return sum(
        range(from - 1, to ?? chapters(timeline).length).map(i =>
            getChapterWidth(timeline, i, unboundedChapterWidth),
        ),
    );
};

export const getSagaWidth: WidthHelper = (
    timeline,
    idx,
    unboundedChapterWidth,
) =>
    sum(
        timeline.sagas
            .flatMap((s, si) => s.arcs.map(() => si))
            .map((si, ai) => [si, ai] as const)
            .filter(([si, _]) => si === idx)
            .map(([_, ai]) => getArcWidth(timeline, ai, unboundedChapterWidth)),
    );

const getChapterPageWidth = (
    timeline: TimelineData,
    chapter: number,
    unboundedChapterWidth: boolean,
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

const getEpisodePages = (timeline: TimelineData, idx: number) => {
    const chaptersSplit = chaptersWithPagesSplit(timeline);
    const chaptersTotal = chapters(timeline).length;

    const [start, end] = timeline.seasons
        .flatMap(season => season.episodes ?? [])
        .map(
            ({ chapters: { from, to } }) =>
                [from - 1, to ?? chaptersTotal] as const,
        )[idx]!;

    return range(start, end).map(ci => {
        const [_, [split, rest]] = chaptersSplit[ci]!;
        const pagesInEpisode =
            split !== 0 && ci === end - 1 ? split
            : rest !== 0 && ci === start ? rest
            : split + rest;
        return [pagesInEpisode, ci] as const;
    });
};

export const getEpisodeWidth: WidthHelper = (
    timeline,
    idx,
    unboundedChapterWidth,
) => {
    return sum(
        getEpisodePages(timeline, idx).map(([pagesInEpisode, ci]) => {
            return (
                pagesInEpisode *
                getChapterPageWidth(timeline, ci, unboundedChapterWidth)
            );
        }),
    );
};

export const getSeasonWidth: WidthHelper = (
    timeline,
    idx,
    unboundedChapterWidth,
) => {
    const { from, to } = timeline.seasons[idx]!.chapters;
    const startIdx = from - 1;
    const endIdx = (to ?? chapters(timeline).length) - 1;

    // TODO: rewrite the same way as getEpisodeWidth?
    return sum(
        chaptersWithPagesSplit(timeline)
            .slice(startIdx, endIdx + 1)
            .map(([ci, [split, rest]]) =>
                ci === startIdx && rest !== 0 ?
                    rest *
                    getChapterPageWidth(timeline, ci, unboundedChapterWidth)
                : ci === endIdx ?
                    split *
                    getChapterPageWidth(timeline, ci, unboundedChapterWidth)
                :   getChapterWidth(timeline, ci, unboundedChapterWidth),
            ),
    );
};

// thanks deepseek-r1 (he thought for 245+150+92 = 487 seconds in total)
export const interpolateColor = (
    value: number,
    inputRange: [number, number],
    colorRange: number[],
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
        segmentCount - 1,
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

export const HEADER_TITLES: Record<TimelineSectionType, string> = {
    season: 'Anime Seasons',
    episode: 'Episodes',
    saga: 'Story Arcs',
    arc: 'Story Arcs',
    chapter: 'Chapters',
    volume: 'Volumes',
};
