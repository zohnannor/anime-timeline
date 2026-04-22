import CSS from 'csstype';

import { EmptyObject, ExactUnion, NonEmptyArray } from '@shared/lib/util';
import { TIMELINE } from '@timelines/registry';

type Offset = { x: number; y: number };

export type Range = { from: number; to?: number };

export type Callback<T> = (_n: number) => T;
export type EntityCallback<T> = (_n: number, _title: string) => T;

type CoverOffset<C> = ExactUnion<
    { cover: C; offset: Offset } | { cover: null }
>;

export type Chapter = {
    title: Callback<string>;
    date: string;
    pages: number;
    cover: string | null;
};

export type Volume = ExactUnion<
    | {
          title: Callback<string> | number;
          cover: EntityCallback<string>;
      }
    | { cover: null }
> & {
    chapters: NonEmptyArray<Chapter>;
};

export type Arc = {
    title: string;
    chapters: Range;
} & CoverOffset<string>;

export type Saga = {
    title: string;
    arcs: NonEmptyArray<Arc>;
};

export type Episode = {
    title: string | number;
    date: string;
    chapters: Range;
} & CoverOffset<Callback<string>>;

export type Season = ExactUnion<
    | ({
          title: string;
          chapters: Range;
          episodes: Episode[];
      } & CoverOffset<Callback<string>>)
    | { chapters: Range }
>;

export type SmallImages = {
    'favicon': string;
    'scroller': string;
    'select-title': string;
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
} & ExactUnion<
    | { sagas: NonEmptyArray<Saga> }
    | { arcs: NonEmptyArray<Arc> }
    | EmptyObject<'saga' | 'arc'>
> & {
        seasons?: NonEmptyArray<Season>;
        splitChapters: Record<number, number>;
        wikiBase: string;
        smallImages: SmallImages;
        socialLinks: SocialLink[];
    };

export type Timeline = { layout: TimelineSectionLayout; data: TimelineData };

export type AnimeTitle = keyof typeof TIMELINE;

export type TimelineSection =
    | 'season'
    | 'episode'
    | 'saga'
    | 'arc'
    | 'chapter'
    | 'volume';

export type SubtimelinesMap = {
    season: 'episode';
    saga: 'arc';
};

export type TimelineSectionItem<T extends TimelineSection> = {
    type: T;
    fit?: CSS.Property.ObjectFit;
    defaultCoverPosition?: CSS.Property.ObjectPosition;
    backgroundColor?: 'black' | 'white';
    scale?: number;
    sidewaysText?: boolean;
    blankfontSize: number;
    titleFontSize: number;
    titleProcessor?: (_title: string, _n: number) => string;
    numberProcessor?: (_number: number, _title: string) => string;
    height: number;
    sectionLink: string;
    wikiLink: (_title: string, _n: number) => string;
    focusable?: boolean;
} & (T extends keyof SubtimelinesMap ?
    { subTimeline: TimelineSectionItem<SubtimelinesMap[T]> }
:   { subTimeline?: never });

export type TimelineSectionLayout = {
    season?: TimelineSectionItem<'season'>;
} & ExactUnion<
    | { saga: TimelineSectionItem<'saga'> }
    | { arc: TimelineSectionItem<'arc'> }
    | EmptyObject<'saga' | 'arc'>
> & {
        chapter: TimelineSectionItem<'chapter'>;
        volume: TimelineSectionItem<'volume'>;
        timeline: {
            type: 'timeline';
        };
    };
