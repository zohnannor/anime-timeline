import CSS from 'csstype';

import { ExactUnion, NonEmptyArray } from '@shared/lib/util';
import { TITLES } from '@timelines/registry';

export type Offset = { x: number; y: number };

export type Range = { from: number; to?: number };

export type Callback<T> = (_timeline: TimelineData, _idx: number) => T;

export type Chapter = {
    title: Callback<string>;
    date: string;
    pages: number;
    cover: string | null;
};

export type Volume = {
    title: Callback<string>;
    cover: Callback<string> | null;
    chapters: NonEmptyArray<Chapter>;
};

export type Arc = {
    title: string;
    chapters: Range;
} & ExactUnion<{ cover: string; offset: Offset } | { cover: null }>;

export type Saga = {
    title: string;
    chapters: Range;
    arcs: NonEmptyArray<Arc>;
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
    'toggle-unbound-chapter-width': string;
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
    volumes: NonEmptyArray<Volume>;
    sagas: NonEmptyArray<Saga>;
    seasons?: NonEmptyArray<Season>;
    splitChapters: Record<number, number>;
    wikiBase: string;
    smallImages: SmallImages;
    socialLinks: SocialLink[];
};

export type Timeline = { layout: TimelineSectionLayout; data: TimelineData };

export type AnimeTitle = (typeof TITLES)[number];

export type TimelineEntity = {
    season: Season;
    episode: Episode;
    saga: Saga;
    arc: Arc;
    chapter: Chapter;
    volume: Volume;
};

export type TimelineSectionType = keyof TimelineEntity;

export type SubtimelinesMap = {
    season: 'episode';
    saga: 'arc';
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
    titleProcessor?: (_title: string, _n: number) => string;
    numberProcessor?: (_number: number) => string;
    height: number;
    sectionLink: string;
    wikiLink: (_title: string, _n: number) => string;
    focusable?: boolean;
    subTimeline?: T extends keyof SubtimelinesMap ?
        TimelineSectionItem<SubtimelinesMap[T]>
    :   never;
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
