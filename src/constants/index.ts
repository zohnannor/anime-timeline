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

export const TITLES = ['csm', 'berserk'] as const;
export type AnimeTitle = (typeof TITLES)[number];

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
    chapters: Range;
};

export type Season = ExactUnion<
    | {
          title: string;
          cover: string;
          offset: Offset;
          chapters: Range;
          episodes: Episode[];
      }
    | { title: string; chapters: Range }
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

type SmallImages = {
    'scroller-or-favicon': string;
    'read-info': string;
    'toggle-unbounded-chapter-width': string;
    'toggle-cross-lines': string;
    'open-chapter-calendar': string;
    'toggle-always-show-titles': string;
    'capture-timeline': string;
};

type SocialLink = {
    name: string;
    url: string;
};

export type TimelineData = {
    title: string;
    volumes: readonly Volume[];
    arcs: readonly Arc[];
    seasons: readonly Season[];
    splitChapters: Record<number, number>;
    wikiBase: string;
    smallImages: SmallImages;
    socialLinks: SocialLink[];
};

export type Timeline = { layout: TimelineSectionLayout } & {
    data: TimelineData;
};

export const TIMELINE: Record<AnimeTitle, Timeline> = {
    berserk: BERSERK_TIMELINE,
    csm: CSM_TIMELINE,
};

export const FLOATING_BUTTONS: {
    filename: Exclude<keyof SmallImages, 'scroller-or-favicon'>;
    title: string;
    option: keyof SettingsValues;
}[] = [
    { filename: 'read-info', title: 'Read info', option: 'infoBoxOpen' },
    {
        filename: 'toggle-unbounded-chapter-width',
        title: 'Toggle unbounded chapter width',
        option: 'unboundedChapterWidth',
    },
    ...(!isMobileDevice() // include cross-lines button only on desktop
        ? [
              {
                  filename: 'toggle-cross-lines',
                  title: 'Toggle cross-lines',
                  option: 'showCrosslines',
              } as const,
          ]
        : []),
    {
        filename: 'open-chapter-calendar',
        title: 'Open chapter calendar',
        option: 'calendarOpen',
    },
    {
        filename: 'toggle-always-show-titles',
        title: 'Toggle always show titles',
        option: 'showTitles',
    },
    {
        filename: 'capture-timeline',
        title: 'Capture timeline (Save as a PNG)',
        option: 'captureTimelineModalOpen',
    },
];
