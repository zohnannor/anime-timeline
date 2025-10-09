import { SettingsValues } from '../providers/SettingsProvider';
import { isMobileDevice } from '../util';
import { BERSERK_TIMELINE_INFO, BERSERK_TIMELINE_INFO_EXTRA } from './berserk';
import { CSM_TIMELINE_INFO, CSM_TIMELINE_INFO_EXTRA } from './csm';

export const SCROLLER_WIDTH = 1300;
export const HEADERS_WIDTH = 150;

export const LARGE_FONT_SIZE = 500;
export const SMALL_FONT_SIZE = 45;

export const TIMELINE_HEIGHT = 200;

export type AnimeTitle = 'csm' | 'berserk';

export const TITLES: AnimeTitle[] = ['csm', 'berserk'];

export type Offset = { x: number; y: number };

type Covers = {
    season: readonly (string | null)[];
    episode: readonly string[];
    arc: readonly (string | null)[];
    chapter: readonly (string | null)[];
    volume: readonly (string | null)[];
};

type Titles = {
    season: readonly string[];
    episode: readonly string[];
    arc: readonly string[];
    chapter: readonly string[];
    volume: readonly (string | null)[];
};

type Offsets = {
    season: readonly Offset[];
    episode: readonly Offset[];
    arc: readonly Offset[];
};

type TimelineInfoType = 'season' | 'episode' | 'arc' | 'chapter' | 'volume';

type TimelineInfoMap = {
    [K in TimelineInfoType]: {
        type: K;
        covers: Covers[K];
        fit?: 'contain' | 'cover';
        backgroundColor?: 'black' | 'white';
        scale?: number;
        titles: Titles[K];
        sidewaysText?: boolean;
        blankfontSize: number;
        titleFontSize: number;
        titleProcessor?: (title: string, n: number) => string;
        height: number;
        widthHandler: (
            itemNumber: number,
            unboundedChapterWidth: boolean
        ) => number;
        wikiLink: (name: string, n: number) => string;
        offsets?: K extends keyof Offsets ? Offsets[K] : undefined;
        focusable?: boolean;
        timeline?: TimelineInfoItem;
    };
}[TimelineInfoType];

export type TimelineInfoItem = { type: 'timeline' } | TimelineInfoMap;

export type TimelineInfo = {
    [K in 'timeline' | TimelineInfoType]?: TimelineInfoItem;
};

export type TimelineInfoExtra = {
    title: string;
    MAX_HEIGHT: number;
    CHAPTER_DATES: Date[];
    CHAPTERS_TOTAL: number;
    CHAPTERS_PER_ARC: [number, number][];
    CHAPTERS_PER_SEASON: [number, number][];
    CHAPTERS_PER_VOLUME: number[];
    PAGES_PER_CHAPTER_FLAT: number[];
    PAGES_PER_VOLUME: number[];
    SPLIT_CHAPTERS: Record<number, number>;
    ARC_HEIGHT: number;
    CHAPTER_HEIGHT: number;
    SEASON_HEIGHT: number;
    VOLUME_HEIGHT: number;
    CHAPTERS_PER_EPISODE: readonly number[];
};

export const scale = (n: number) =>
    `calc(${n} * calc(100 / var(--max-height)) * 1svh)`;

export const TIMELINE_INFO: Record<AnimeTitle, TimelineInfo> = {
    berserk: BERSERK_TIMELINE_INFO,
    csm: CSM_TIMELINE_INFO,
};

export const TIMELINE_INFO_EXTRA: Record<AnimeTitle, TimelineInfoExtra> = {
    berserk: BERSERK_TIMELINE_INFO_EXTRA,
    csm: CSM_TIMELINE_INFO_EXTRA,
};

export const MAX_HEIGHT: Record<AnimeTitle, number> = {
    csm: CSM_TIMELINE_INFO_EXTRA.MAX_HEIGHT,
    berserk: BERSERK_TIMELINE_INFO_EXTRA.MAX_HEIGHT,
};

export const CHAPTER_DATES: Record<AnimeTitle, Date[]> = {
    csm: CSM_TIMELINE_INFO_EXTRA.CHAPTER_DATES,
    berserk: BERSERK_TIMELINE_INFO_EXTRA.CHAPTER_DATES,
};

export const CHAPTERS_TOTAL: Record<AnimeTitle, number> = {
    csm: CSM_TIMELINE_INFO_EXTRA.CHAPTERS_TOTAL,
    berserk: BERSERK_TIMELINE_INFO_EXTRA.CHAPTERS_TOTAL,
};

export const CHAPTERS_PER_ARC: Record<AnimeTitle, [number, number][]> = {
    csm: CSM_TIMELINE_INFO_EXTRA.CHAPTERS_PER_ARC,
    berserk: BERSERK_TIMELINE_INFO_EXTRA.CHAPTERS_PER_ARC,
};

export const CHAPTERS_PER_SEASON: Record<AnimeTitle, [number, number][]> = {
    csm: CSM_TIMELINE_INFO_EXTRA.CHAPTERS_PER_SEASON,
    berserk: BERSERK_TIMELINE_INFO_EXTRA.CHAPTERS_PER_SEASON,
};

export const CHAPTERS_PER_VOLUME: Record<AnimeTitle, number[]> = {
    csm: CSM_TIMELINE_INFO_EXTRA.CHAPTERS_PER_VOLUME,
    berserk: BERSERK_TIMELINE_INFO_EXTRA.CHAPTERS_PER_VOLUME,
};

export const PAGES_PER_CHAPTER_FLAT: Record<AnimeTitle, number[]> = {
    csm: CSM_TIMELINE_INFO_EXTRA.PAGES_PER_CHAPTER_FLAT,
    berserk: BERSERK_TIMELINE_INFO_EXTRA.PAGES_PER_CHAPTER_FLAT,
};

const CHAPTERS_PER_EPISODE: Record<AnimeTitle, readonly number[]> = {
    csm: CSM_TIMELINE_INFO_EXTRA.CHAPTERS_PER_EPISODE,
    berserk: BERSERK_TIMELINE_INFO_EXTRA.CHAPTERS_PER_EPISODE,
};

const CHAPTERS_WITH_PAGES = (animeTitle: AnimeTitle) =>
    PAGES_PER_CHAPTER_FLAT[animeTitle].map(
        (pages, chapterIdx) => [chapterIdx + 1, pages] as const
    );

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

export const CHAPTER_DATES_BY_MONTH = (animeTitle: AnimeTitle) =>
    groupBy(CHAPTER_DATES[animeTitle], date => date.getMonth() + 1);

export const CHAPTER_DATES_BY_YEAR = (animeTitle: AnimeTitle) =>
    groupBy(CHAPTER_DATES[animeTitle], date => date.getFullYear() + 1);

export const PAGES_PER_EPISODE_WITH_CHAPTERS = (animeTitle: AnimeTitle) =>
    CHAPTERS_PER_EPISODE[animeTitle].reduce<[number[][][], number]>(
        ([groups, cursor], chapterCount) => {
            const episodeChapters = CHAPTERS_SPLIT_FOR_EPISODES(
                animeTitle
            ).slice(cursor, cursor + chapterCount);
            return [[...groups, episodeChapters], cursor + chapterCount];
        },
        [[], 0]
    )[0];

const CHAPTERS_SPLIT_FOR_EPISODES = (animeTitle: AnimeTitle) =>
    CHAPTERS_WITH_PAGES(animeTitle)
        .slice(0, 38 + 1)
        .reduce(
            (a, [chapter = 0, pages = 0]) => [
                ...a,
                // make two of the same "chapter" if it needs to be split
                ...(chapter in SPLIT_CHAPTERS[animeTitle]
                    ? [
                          [chapter, SPLIT_CHAPTERS[animeTitle][chapter]!],
                          [
                              chapter,
                              pages - SPLIT_CHAPTERS[animeTitle][chapter]!,
                          ],
                      ]
                    : // leave as is
                      [[chapter, pages]]),
            ],
            [] as number[][]
        );

export const PAGES_PER_VOLUME: Record<AnimeTitle, number[]> = {
    csm: CSM_TIMELINE_INFO_EXTRA.PAGES_PER_VOLUME,
    berserk: BERSERK_TIMELINE_INFO_EXTRA.PAGES_PER_VOLUME,
};

export const SPLIT_CHAPTERS: Record<AnimeTitle, Record<number, number>> = {
    csm: CSM_TIMELINE_INFO_EXTRA.SPLIT_CHAPTERS,
    berserk: BERSERK_TIMELINE_INFO_EXTRA.SPLIT_CHAPTERS,
};

export const ARC_HEIGHT: Record<AnimeTitle, number> = {
    csm: CSM_TIMELINE_INFO_EXTRA.ARC_HEIGHT,
    berserk: BERSERK_TIMELINE_INFO_EXTRA.ARC_HEIGHT,
};

export const CHAPTER_HEIGHT: Record<AnimeTitle, number> = {
    csm: CSM_TIMELINE_INFO_EXTRA.CHAPTER_HEIGHT,
    berserk: BERSERK_TIMELINE_INFO_EXTRA.CHAPTER_HEIGHT,
};

export const SEASON_HEIGHT: Record<AnimeTitle, number> = {
    csm: CSM_TIMELINE_INFO_EXTRA.SEASON_HEIGHT,
    berserk: BERSERK_TIMELINE_INFO_EXTRA.SEASON_HEIGHT,
};

export const VOLUME_HEIGHT: Record<AnimeTitle, number> = {
    csm: CSM_TIMELINE_INFO_EXTRA.VOLUME_HEIGHT,
    berserk: BERSERK_TIMELINE_INFO_EXTRA.VOLUME_HEIGHT,
};

export const FLOATING_BUTTONS: {
    filename: string;
    title: string;
    option: keyof SettingsValues;
}[] = [
    { filename: 'pochita2', title: 'Read info', option: 'infoBoxOpen' },

    {
        filename: 'pochita3',
        title: 'Toggle unbounded chapter width',
        option: 'unboundedChapterWidth',
    },
    ...(!isMobileDevice() // include cross-lines button only on desktop
        ? [
              {
                  filename: 'pochita6',
                  title: 'Toggle cross-lines',
                  option: 'showCrosslines',
              } as const,
          ]
        : []),
    {
        filename: 'pochita4',
        title: 'Open chapter calendar',
        option: 'calendarOpen',
    },
    {
        filename: 'pochita5',
        title: 'Toggle always show titles',
        option: 'showTitles',
    },
    {
        filename: 'pochita7',
        title: 'Capture timeline (Save as a PNG)',
        option: 'captureTimelineModalOpen',
    },
];
