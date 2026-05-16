import CSS from 'csstype';

import {
    EmptyObject,
    ExactUnion,
    NonEmptyArray,
    typedKeyTuple,
} from '@shared/lib/util';
import { TIMELINE_LOADERS } from '@timelines/registry';

type Offset = { x: number; y: number };

export type Range = { from: number; to?: number };

export type Callback<T> = (_n: number, _extra: boolean) => T;
export type EntityCallback<T> = (
    _n: number,
    _title: string,
    _extra: boolean,
) => T;

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

export type Icon = string | React.FC<React.HTMLAttributes<HTMLElement>>;

export type Icons = {
    favicon: Icon;
    scroller: Icon;
    'select-title': Icon;
    'read-info': Icon;
    'toggle-unbound-chapter-width': Icon;
    'toggle-cross-lines': Icon;
    'open-chapter-calendar': Icon;
    'toggle-always-show-titles': Icon;
    'toggle-extra-chapters': Icon;
    'capture-timeline': Icon;
};

export type SocialLink = {
    name: string;
    url: string;
};

export type TimelineData = {
    title: string;
    volumes: NonEmptyArray<Volume>;
    extraChapters?: NonEmptyArray<Volume>;
} & ExactUnion<
    | { sagas: NonEmptyArray<Saga> }
    | { arcs: NonEmptyArray<Arc> }
    | EmptyObject<'saga' | 'arc'>
> & {
        seasons?: NonEmptyArray<Season>;
        splitChapters: Record<number, number>;
        wikiBase: string;
        icons: Icons;
        socialLinks: SocialLink[];
    };

export type Timeline = { layout: TimelineSectionLayout; data: TimelineData };

export const TITLES = typedKeyTuple(TIMELINE_LOADERS);

export type AnimeTitle = (typeof TITLES)[number];

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
    titleProcessor?: (_title: string, _n: number, _extra: boolean) => string;
    numberProcessor?: (_n: number, _title: string, _extra: boolean) => string;
    height: number;
    sectionLink: string;
    wikiLink: (_title: string, _n: number, _extra: boolean) => string;
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
