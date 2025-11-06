import { CSS } from 'styled-components/dist/types';

import { WidthHelper } from './helpers';
import { SettingsValues } from './providers/SettingsProvider';
import { AOT_TIMELINE } from './timelines/aot';
import { BERSERK_TIMELINE } from './timelines/berserk';
import { CSM_TIMELINE } from './timelines/csm';
import { DEATHNOTE_TIMELINE } from './timelines/deathnote';
import { EVA_TIMELINE } from './timelines/eva';
import { FP_TIMELINE } from './timelines/fp';
import { FRIEREN_TIMELINE } from './timelines/frieren';
import { OPM_TIMELINE } from './timelines/opm';
import { ExactUnion, isMobileDevice } from './util';

export const SCROLLER_WIDTH = 1300;
export const HEADERS_WIDTH = 150;

export const LARGE_FONT_SIZE = 500;
export const SMALL_FONT_SIZE = 45;

export const TIMELINE_HEIGHT = 200;

export const TITLES = [
    'csm',
    'berserk',
    'fp',
    'frieren',
    'eva',
    'aot',
    'opm',
    'deathnote',
] as const;
export type AnimeTitle = (typeof TITLES)[number];

export type Offset = { x: number; y: number };

type Range = { from: number; to?: number };

type Callback<T> = (timeline: TimelineData, idx: number) => T;

export type Chapter = {
    title: Callback<string>;
    date: string;
    pages: number;
    cover: string | null;
};

export type Volume = {
    title: Callback<string>;
    cover: Callback<string> | null;
    chapters: readonly Chapter[];
};

export type Saga = {
    title: string;
} & ({ cover: string; offset: Offset } | { cover: null }) & {
        chapters: Range;
        arcs: readonly Arc[];
    };

export type Arc = {
    title: string;
} & ({ cover: string; offset: Offset } | { cover: null }) & {
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
          cover: Callback<string>;
          offset: Offset;
          chapters: Range;
          episodes: Episode[];
      }
    | { chapters: Range }
>;

export type TimelineSectionType =
    | 'season'
    | 'episode'
    | 'saga'
    | 'arc'
    | 'chapter'
    | 'volume';

export type TimelineEntity = {
    season: Season;
    episode: Episode;
    saga: Saga;
    arc: Arc;
    chapter: Chapter;
    volume: Volume;
};

export type TimelineSectionItem<T extends TimelineSectionType> = {
    type: T;
    fit?: CSS.Property.ObjectFit;
    defaultCoverPosition?: CSS.Property.ObjectPosition;
    backgroundColor?: 'black' | 'white';
    scale?: number;
    sidewaysText?: boolean;
    blankfontSize: number;
    titleFontSize: number;
    titleProcessor?: (title: string, n: number) => string;
    numberProcessor?: (number: number) => string;
    height: number;
    width: WidthHelper;
    sectionLink: string;
    wikiLink: (title: string, n: number) => string;
    focusable?: boolean;
    subTimeline?: TimelineSectionItem<TimelineSectionType>;
};

export type TimelineSectionLayout = {
    season?: TimelineSectionItem<'season'>;
    saga: TimelineSectionItem<'saga'>;
    chapter: TimelineSectionItem<'chapter'>;
    volume: TimelineSectionItem<'volume'>;
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
    sagas: readonly Saga[];
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
    csm: CSM_TIMELINE,
    berserk: BERSERK_TIMELINE,
    fp: FP_TIMELINE,
    frieren: FRIEREN_TIMELINE,
    eva: EVA_TIMELINE,
    aot: AOT_TIMELINE,
    opm: OPM_TIMELINE,
    deathnote: DEATHNOTE_TIMELINE,
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
