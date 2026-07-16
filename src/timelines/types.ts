import CSS from 'csstype';

import {
    EmptyObject,
    ExactUnion,
    NonEmptyArray,
    typedKeyTuple,
} from '@shared/lib/util';
import { TIMELINE_LOADERS } from '@timelines/registry';

type Offset = Readonly<{ x: number; y: number }>;

export type Range = Readonly<{ from: number; to?: number }>;

export type Callback<T> = (_n: number, _isExtra: boolean) => T;
export type EntityCallback<T> = (
    _n: number,
    _title: string,
    _isExtra: boolean,
) => T;

type CoverOffset<C> = Readonly<
    ExactUnion<{ cover: C; offset: Offset } | { cover: undefined }>
>;

export type Chapter = Readonly<{
    title: Callback<string>;
    date: string;
    pages: number;
    cover: string | undefined;
}>;

export type Volume = Readonly<
    ExactUnion<
        | {
              title: Callback<string> | number;
              cover: EntityCallback<string>;
          }
        | { cover: undefined }
    > & {
        chapters: NonEmptyArray<Chapter>;
    }
>;

export type Arc = Readonly<{
    title: string;
    chapters: Range;
}> &
    CoverOffset<string>;

export type Saga = Readonly<{
    title: string;
    arcs: NonEmptyArray<Arc>;
}>;

export type Episode = Readonly<{
    title: string | number;
    date: string;
    chapters: Range;
}> &
    CoverOffset<Callback<string>>;

export type Season = Readonly<
    ExactUnion<
        | (CoverOffset<Callback<string>> & {
              title: string;
              chapters: Range;
              episodes: Episode[];
          })
        | { chapters: Range }
    >
>;

// readonly FC is not a valid JSX component
// eslint-disable-next-line functional/type-declaration-immutability
export type Icon = string | React.FC<React.HTMLAttributes<HTMLElement>>;

export type Icons = Readonly<{
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
}>;

export type SocialLink = Readonly<{
    name: string;
    url: string;
}>;

export type TimelineData = Readonly<
    ExactUnion<
        | EmptyObject<'saga' | 'arc'>
        | { sagas: NonEmptyArray<Saga> }
        | { arcs: NonEmptyArray<Arc> }
    > & {
        title: string;
        volumes: NonEmptyArray<Volume>;
        extraChapters?: NonEmptyArray<Volume>;
        seasons?: NonEmptyArray<Season>;
        splitChapters: Record<number, number>;
        wikiBase: string;
        icons: Icons;
        socialLinks: readonly SocialLink[];
    }
>;

export type Timeline = Readonly<{
    layout: TimelineSectionLayout;
    data: TimelineData;
}>;

export const TITLES = typedKeyTuple(TIMELINE_LOADERS);

export type AnimeTitle = (typeof TITLES)[number];

export type TimelineSection =
    'season' | 'episode' | 'saga' | 'arc' | 'chapter' | 'volume';

export type SubtimelinesMap = Readonly<{
    season: 'episode';
    saga: 'arc';
}>;

export type TimelineSectionItem<T extends TimelineSection> = Readonly<{
    type: T;
    fit?: CSS.Property.ObjectFit;
    defaultCoverPosition?: CSS.Property.ObjectPosition;
    backgroundColor?: 'black' | 'white';
    scale?: number;
    sidewaysText?: boolean;
    blankfontSize: number;
    titleFontSize: number;
    titleProcessor?: (_title: string, _n: number, _isExtra: boolean) => string;
    numberProcessor?: (_n: number, _title: string, _isExtra: boolean) => string;
    height: number;
    sectionLink: string;
    wikiLink: (_title: string, _n: number, _isExtra: boolean) => string;
    focusable?: boolean;
}> &
    Readonly<
        T extends keyof SubtimelinesMap ?
            { subTimeline: TimelineSectionItem<SubtimelinesMap[T]> }
        :   { subTimeline?: never }
    >;

export type TimelineSectionLayout = Readonly<
    ExactUnion<
        | EmptyObject<'saga' | 'arc'>
        | { saga: TimelineSectionItem<'saga'> }
        | { arc: TimelineSectionItem<'arc'> }
    > & {
        season?: TimelineSectionItem<'season'>;
        chapter: TimelineSectionItem<'chapter'>;
        volume: TimelineSectionItem<'volume'>;
        timeline: {
            type: 'timeline';
        };
    }
>;
