/* eslint-disable no-bitwise */
import { keyframes } from 'styled-components';

import { SCALE_FACTOR_PROPERTY } from '@shared/config';
import {
    asNonEmpty,
    Mutable,
    NonEmptyArray,
    throwError,
} from '@shared/lib/util';
import { ResolvedChapter } from '@timelines/resolved';
import { TimelineSection } from '@timelines/types';

export { default as fetchNextChapterDate } from './ProtobufReader';

export const toTitleCase = (string: string) =>
    string.replace(
        /^(?<first>.)(?<rest>.*)$/u,
        (_, first: string, rest: string) => first.toUpperCase() + rest,
    );

export const scale = (n: number) =>
    `calc(${n} * var(${SCALE_FACTOR_PROPERTY}))`;

const isValidDate = (date: Date) => !Number.isNaN(date.getTime());

export const tokyoDate = (dateString: string): Temporal.PlainDate => {
    // `PlainDate` cannot parse '%m %d, %Y' format
    // eslint-disable-next-line unicorn/prefer-temporal
    const date = new Date(
        `${dateString.replaceAll(/st|nd|rd|th/gu, '')} GMT+9`, // Tokyo timezone
    );
    if (!isValidDate(date)) {
        return throwError(`Invalid date: ${dateString}`);
    }
    return new Temporal.PlainDate(
        date.getUTCFullYear(),
        date.getUTCMonth() + 1,
        date.getUTCDate(),
    );
};

export type Chunk<T> = NonEmptyArray<T>;

const INIT_SENTINEL = Symbol('init-sentinel');

const chunks = <T>(
    array: readonly T[],
    getKey: (_el: T) => number,
): NonEmptyArray<Chunk<T>> => {
    const list: Mutable<Chunk<T>>[] = [];
    let previous: number | typeof INIT_SENTINEL = INIT_SENTINEL;

    for (const el of array) {
        const key = getKey(el);
        const lastGroup = list.at(-1);

        if (lastGroup && key === previous) {
            lastGroup.push(el);
        } else {
            list.push([el]);
            previous = key;
        }
    }

    return asNonEmpty(list, 'chunk');
};

// TODO: move into `ResolvedTimeline`?
export const chapterDatesByMonth = (chapters: NonEmptyArray<ResolvedChapter>) =>
    chunks(chapters, ({ date }) => date.year + 1 + date.month * 12);

// TODO: move into `ResolvedTimeline`?
export const chapterDatesByYear = (chapters: NonEmptyArray<ResolvedChapter>) =>
    chunks(chapters, ({ date }) => date.year + 1);

export const sanitizeId = (id: string) => id.replaceAll(/[^\w]/gu, '-');

export const scrollToId = (id: string) => {
    const sanitizedId = sanitizeId(id);
    const element = document.querySelector<HTMLElement>(`#${sanitizedId}`);
    if (element) {
        console.debug(`Scrolling to \`#${sanitizedId}\``);
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
        });
        element.focus({ preventScroll: false });
    } else {
        console.warn(`No element found for \`#${sanitizedId}\``);
    }
};

// thanks deepseek-r1 (he thought for 245+150+92 = 487 seconds in total)
export const interpolateColor = (
    value: number,
    inputRange: readonly [number, number],
    colorRange: NonEmptyArray<number>,
) => {
    const [inputMin, inputMax] = inputRange;
    const colorCount = colorRange.length;

    if (colorCount < 2) {
        throwError('At least 2 colors required in colorRange');
    }

    // Handle single-value input range
    if (inputMin === inputMax) {
        return colorRange[0];
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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const colorStart = colorRange[segmentIndex]!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

export const MONTHS_GRADIENT = [
    0xd3_e3_f4, 0xf2_e9_7e, 0xb3_cd_53, 0xfa_ce_8a,
] as const;
export const DAYS_GRADIENT = [0xed_85_81, 0x9d_f6_97] as const;

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

export const HEADER_TITLES: Record<TimelineSection, string> = {
    season: 'Anime Seasons',
    episode: 'Episodes',
    saga: 'Story Arcs',
    arc: 'Story Arcs',
    chapter: 'Chapters',
    volume: 'Volumes',
};
