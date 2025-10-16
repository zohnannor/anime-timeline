import { keyframes } from 'styled-components';

import { AnimeTitle, TIMELINE, TIMELINE_HEIGHT } from './constants';
import { sum } from './util';

export const toTitleCase = (s: string) =>
    s.replace(/^_*(.)|_+(.)/g, (_, c, d) =>
        c ? c.toUpperCase() : ' ' + d.toUpperCase()
    );

export { fetchNextChapterDate } from './ProtobufReader';

export const scale = (n: number) =>
    `calc(${n} * calc(100 / var(--max-height)) * 1svh)`;

export const tokyoDate = (d: string) => new Date(`${d} GMT+9`); // Tokyo timezone

export const maxHeight = (animeTitle: AnimeTitle) =>
    sum(
        Object.values(TIMELINE[animeTitle].layout)
            .filter(s => s.type !== 'timeline')
            .map(s => s.height)
    ) + TIMELINE_HEIGHT;

export const chapterDates = (animeTitle: AnimeTitle) =>
    TIMELINE[animeTitle].data.volumes
        .flatMap(v => v.chapters)
        .map(c => tokyoDate(c.date));

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
        [[], null]
    )[0];

export const chapterDatesByMonth = (animeTitle: AnimeTitle) =>
    groupBy(chapterDates(animeTitle), date => date.getMonth() + 1);

export const chapterDatesByYear = (animeTitle: AnimeTitle) =>
    groupBy(chapterDates(animeTitle), date => date.getFullYear() + 1);

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
