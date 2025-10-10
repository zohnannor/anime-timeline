import { SettingsValues } from '../providers/SettingsProvider';
import { isMobileDevice } from '../util';
import { BERSERK_TIMELINE } from './berserk';
import { CSM_TIMELINE } from './csm';

export const SCROLLER_WIDTH = 1300;
export const HEADERS_WIDTH = 150;

export const LARGE_FONT_SIZE = 500;
export const SMALL_FONT_SIZE = 45;

export const TIMELINE_HEIGHT = 200;

export type AnimeTitle = 'csm' | 'berserk';
export const TITLES: AnimeTitle[] = ['csm', 'berserk'];

export type Offset = { x: number; y: number };

type Covers = {
    season: (string | null)[];
    episode: string[];
    arc: (string | null)[];
    chapter: (string | null)[];
    volume: (string | null)[];
};

type Titles = {
    season: string[];
    episode: string[];
    arc: string[];
    chapter: string[];
    volume: (string | null)[];
};

type Offsets = {
    season: Offset[];
    episode: Offset[];
    arc: Offset[];
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

type TimelineInfo = {
    [K in 'timeline' | TimelineInfoType]?: TimelineInfoItem;
};

type TimelineInfoExtra = {
    title: string;

    SEASON_HEIGHT: number;
    ARC_HEIGHT: number;
    CHAPTER_HEIGHT: number;
    VOLUME_HEIGHT: number;
    MAX_HEIGHT: number;

    CHAPTERS_TOTAL: number;
    ARCS_TOTAL: number;
    EPISODES_TOTAL: number;
    VOLUMES_RELEASED_TOTAL: number;
    VOLUMES_TOTAL: number;
    SEASONS_TOTAL: number;

    CHAPTER_DATES: Date[];
    CHAPTERS_PER_ARC: [number, number][];
    PAGES_PER_CHAPTER_FLAT: number[];
    PAGES_PER_VOLUME: number[];
    CHAPTERS_PER_VOLUME: number[];

    CHAPTERS_PER_EPISODE: number[];
    CHAPTERS_PER_SEASON: [number, number][];
    SPLIT_CHAPTERS: Record<number, number>;
    CHAPTER_PICTURES: (string | null)[][];
    PAGES_PER_CHAPTER_PER_VOLUME: number[][];
};

export type TimelineTitle = {
    info: TimelineInfo;
    extra: TimelineInfoExtra;
};

export const TIMELINE: Record<AnimeTitle, TimelineTitle> = {
    berserk: BERSERK_TIMELINE,
    csm: CSM_TIMELINE,
};

export const scale = (n: number) =>
    `calc(${n} * calc(100 / var(--max-height)) * 1svh)`;

const CHAPTERS_WITH_PAGES = (animeTitle: AnimeTitle) =>
    TIMELINE[animeTitle].extra.PAGES_PER_CHAPTER_FLAT.map(
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
    groupBy(
        TIMELINE[animeTitle].extra.CHAPTER_DATES,
        date => date.getMonth() + 1
    );

export const CHAPTER_DATES_BY_YEAR = (animeTitle: AnimeTitle) =>
    groupBy(
        TIMELINE[animeTitle].extra.CHAPTER_DATES,
        date => date.getFullYear() + 1
    );

export const PAGES_PER_EPISODE_WITH_CHAPTERS = (animeTitle: AnimeTitle) =>
    TIMELINE[animeTitle].extra.CHAPTERS_PER_EPISODE.reduce<
        [number[][][], number]
    >(
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
                ...(chapter in TIMELINE[animeTitle].extra.SPLIT_CHAPTERS
                    ? [
                          [
                              chapter,
                              TIMELINE[animeTitle].extra.SPLIT_CHAPTERS[
                                  chapter
                              ]!,
                          ],
                          [
                              chapter,
                              pages -
                                  TIMELINE[animeTitle].extra.SPLIT_CHAPTERS[
                                      chapter
                                  ]!,
                          ],
                      ]
                    : // leave as is
                      [[chapter, pages]]),
            ],
            [] as number[][]
        );

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
