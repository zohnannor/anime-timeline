import CSS from 'csstype';

import { WidthHelper } from '@shared/lib/helpers';
import { ExactUnion } from '@shared/lib/util';
import { TITLES } from '@timelines/constants';

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

export type SmallImages = {
    'scroller-or-favicon': string;
    'read-info': string;
    'toggle-unbounded-chapter-width': string;
    'toggle-cross-lines': string;
    'open-chapter-calendar': string;
    'toggle-always-show-titles': string;
    'capture-timeline': string;
};

export type SocialLink = {
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

export type AnimeTitle = (typeof TITLES)[number];

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
