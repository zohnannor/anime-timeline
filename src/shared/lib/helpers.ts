// all indices passed to these functions are obtained from iterating over arrays
// themselves
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-bitwise */
import { keyframes } from 'styled-components';

import { sum } from '@shared/lib/util';
import { TIMELINE_HEIGHT } from '@timelines/index';
import { ResolvedTimeline } from '@timelines/resolved';
import {
    TimelineData,
    TimelineSectionLayout,
    TimelineSectionType,
} from '@timelines/types';

export { default as fetchNextChapterDate } from './ProtobufReader';

export const toTitleCase = (string: string) =>
    string.replace(
        /^(?<first>.)(?<rest>.*)$/u,
        (_, first: string, rest: string) => first.toUpperCase() + rest,
    );

export const scale = (n: number) =>
    `calc(${n} * calc(100 / var(--max-height)) * 1svh)`;

export const tokyoDate = (date: string) =>
    new Date(`${date.replaceAll(/st|nd|rd|th/gu, '')} GMT+9`); // Tokyo timezone

export const maxHeight = (layout: TimelineSectionLayout) =>
    sum(
        Object.values(layout)
            .filter(sec => sec.type !== 'timeline')
            .map(sec => sec.height),
    ) + TIMELINE_HEIGHT;

export const chapterDates = (timeline: ResolvedTimeline) =>
    timeline.data.chapters.map(ch => ch.date);

const groupBy = <T>(array: T[], getKey: (_el: T) => number) =>
    array.reduce<[[number, T][][], number | null]>(
        ([groups, previous], date, idx) => {
            const key = getKey(date);
            const lastGroup = groups.at(-1);
            if (key === previous && lastGroup) {
                lastGroup.push([idx, date]);
            } else {
                groups.push([[idx, date]]);
            }
            return [groups, key];
        },
        [[], null],
    )[0];

export const chapterDatesByMonth = (timeline: ResolvedTimeline) =>
    groupBy(
        chapterDates(timeline),
        date => date.getFullYear() + 1 + (date.getMonth() + 1) * 12,
    );

export const chapterDatesByYear = (timeline: ResolvedTimeline) =>
    groupBy(chapterDates(timeline), date => date.getFullYear() + 1);

const chaptersVolumes = (timeline: TimelineData) =>
    timeline.volumes.flatMap((vol, vi) => vol.chapters.map(() => vi));

export type WidthHelper = (
    _timeline: TimelineData,
    _idx: number,
    _unboundChapterWidth: boolean,
) => number;

export const getVolumeByChapter = (timeline: TimelineData, idx: number) =>
    chaptersVolumes(timeline).find((_, ci) => ci === idx)!;

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
    if (inputMin === inputMax) {
        // validated above
        return colorRange[0]!;
    }

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
