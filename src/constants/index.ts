import { SettingsValues } from '../providers/SettingsProvider';
import { ExactUnion } from '../types';
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

type Range = { from: number; to?: number };

export type Chapter = {
    title: string;
    date: string;
    pages: number;
    cover: string | null;
};

type Callback<T> = (timeline: TimelineData, idx: number) => T;

export type Volume = {
    title: Callback<string>;
    cover: Callback<string> | null;
    chapters: Chapter[];
};

export type Arc = {
    title: string;
    cover: string | null;
    offset: Offset;
    chapters: Range;
};

export type Episode = {
    title: Callback<string>;
    cover: Callback<string>;
    offset: Offset;
    chapters: number;
};

export type Season = ExactUnion<
    | {
          title: string;
          cover: string;
          offset: Offset;
          chapters: Range;
          splitChapters: Record<number, number>;
          episodes: Episode[];
      }
    | { chapters: Range }
>;

export type TimelineSectionType =
    | 'season'
    | 'episode'
    | 'arc'
    | 'chapter'
    | 'volume';

export type TimelineSectionItem<T extends TimelineSectionType> = {
    type: T;
    fit?: 'contain' | 'cover';
    backgroundColor?: 'black' | 'white';
    scale?: number;
    sidewaysText?: boolean;
    blankfontSize: number;
    titleFontSize: number;
    titleProcessor?: (title: string, idx: number) => string;
    height: number;
    width: (
        timeline: TimelineData,
        idx: number,
        unboundedChapterWidth: boolean
    ) => number;
    wikiLink: (name: string, idx: number) => string;
    focusable?: boolean;
    subTimeline?: TimelineSectionItem<'episode'>;
};

export type TimelineSectionLayout = {
    arc: TimelineSectionItem<'arc'>;
    chapter: TimelineSectionItem<'chapter'>;
    volume: TimelineSectionItem<'volume'>;
} & {
    season?: TimelineSectionItem<'season'>;
} & {
    timeline: {
        type: 'timeline';
    };
};

export type TimelineData = {
    title: string;
    volumes: readonly Volume[];
    arcs: readonly Arc[];
    seasons: readonly Season[];
};

export type Timeline = { layout: TimelineSectionLayout } & {
    data: TimelineData;
};

export const TIMELINE: Record<AnimeTitle, Timeline> = {
    berserk: BERSERK_TIMELINE,
    csm: CSM_TIMELINE,
};

// const pagesPerChapterFlat = (animeTitle: AnimeTitle) =>
//     TIMELINE[animeTitle].extra.volumes
//         .flatMap(v => v.chapters)
//         .map(c => c.pages);

// const CHAPTERS_WITH_PAGES = (animeTitle: AnimeTitle) =>
//     pagesPerChapterFlat(animeTitle).map(
//         (pages, chapterIdx) => [chapterIdx + 1, pages] as const
//     );

// const tokyoDate = (d: string) => new Date(`${d} GMT+9`); // Tokyo timezone

// export const pagesPerEpisodeWithChapters = (animeTitle: AnimeTitle) =>
//     TIMELINE[animeTitle].extra.seasons
//         .flatMap(s => s.episodes ?? [])
//         .map(e => e?.chapters)
//         .reduce<[number[][][], number]>(
//             ([groups, cursor], chapterCount) => {
//                 const episodeChapters = chaptersSplitForEpisodes(
//                     animeTitle
//                 ).slice(cursor, cursor + chapterCount);
//                 return [[...groups, episodeChapters], cursor + chapterCount];
//             },
//             [[], 0]
//         )[0];

// const chaptersSplitForEpisodes = (animeTitle: AnimeTitle) => {
//     const splitChapters =
//         TIMELINE[animeTitle].extra.seasons[0]?.splitChapters ?? {};
//     return CHAPTERS_WITH_PAGES(animeTitle)
//         .slice(0, 38 + 1)
//         .reduce(
//             (a, [chapter = 0, pages = 0]) => [
//                 ...a,
//                 // make two of the same "chapter" if it needs to be split
//                 ...(chapter in splitChapters
//                     ? [
//                           [chapter, splitChapters[chapter]!],
//                           [chapter, pages - splitChapters[chapter]!],
//                       ]
//                     : // leave as is
//                       [[chapter, pages]]),
//             ],
//             [] as number[][]
//         );
// };

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
