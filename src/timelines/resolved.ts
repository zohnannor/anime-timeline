import { tokyoDate } from '@shared/lib/helpers';
import {
    asNonEmpty,
    NonEmptyArray,
    sum,
    typedEntries,
    typedFromEntries,
    typedKeys,
    typedValues,
} from '@shared/lib/util';
import { TIMELINE_HEIGHT } from '@timelines/index';
import {
    AnimeTitle,
    Arc,
    Callback,
    Chapter,
    Episode,
    Range,
    Saga,
    Season,
    SmallImages,
    SocialLink,
    SubtimelinesMap,
    Timeline,
    TimelineData,
    TimelineSectionItem,
    TimelineSectionLayout,
    TimelineSectionType,
    Volume,
} from '@timelines/types';

type WidthResolver = (_unboundChapterWidth: boolean) => number;

type ResolvedTemplates = {
    title: string;
    number: string;
    wikiLink: string;
};

export type ResolvedChapter = Omit<Chapter, 'title' | 'date'> & {
    date: Date;
    width: WidthResolver;
    volume: number;
} & ResolvedTemplates;

type ResolvedVolume = Omit<Volume, 'title' | 'cover' | 'chapters'> & {
    cover: string | null;
    width: WidthResolver;
} & ResolvedTemplates;

type ResolvedArc = Omit<Arc, 'chapters'> & {
    width: WidthResolver;
    saga: number;
} & ResolvedTemplates;

type ResolvedSaga = Omit<Saga, 'chapters' | 'arcs'> & {
    width: WidthResolver;
} & ResolvedTemplates;

export type ResolvedEpisode = Omit<Episode, 'title' | 'cover' | 'chapters'> & {
    cover: string;
    width: WidthResolver;
    season: number;
} & ResolvedTemplates;

type ResolvedSeason = Omit<Season, 'cover' | 'chapters' | 'episodes'> & {
    cover?: string;
    width: WidthResolver;
} & ResolvedTemplates;

export type ResolvedTimelineEntity = {
    season: ResolvedSeason;
    episode: ResolvedEpisode;
    saga: ResolvedSaga;
    arc: ResolvedArc;
    chapter: ResolvedChapter;
    volume: ResolvedVolume;
};

export type ResolvedTimelineData = {
    title: string;
    chapters: NonEmptyArray<ResolvedChapter>;
    volumes: NonEmptyArray<ResolvedVolume>;
    arcs: NonEmptyArray<ResolvedArc>;
    sagas: NonEmptyArray<ResolvedSaga>;
    episodes: ResolvedEpisode[];
    seasons?: ResolvedSeason[];
    wikiBase: string;
    smallImages: SmallImages;
    socialLinks: SocialLink[];
};

export type ResolvedSectionItem<T extends TimelineSectionType> = Omit<
    TimelineSectionItem<T>,
    'titleProcessor' | 'numberProcessor' | 'wikiLink' | 'subTimeline'
> & {
    subTimeline?: T extends keyof SubtimelinesMap ?
        ResolvedSectionItem<SubtimelinesMap[T]>
    :   never;
};

type ResolveSectionItem<S extends keyof TimelineSectionLayout> =
    S extends TimelineSectionType ? ResolvedSectionItem<S>
    :   TimelineSectionLayout[S];

type ResolvedTimelineSectionLayout = {
    [S in keyof TimelineSectionLayout]: ResolveSectionItem<S>;
};

export type ResolvedTimeline = {
    layout: ResolvedTimelineSectionLayout;
    data: ResolvedTimelineData;
    maxHeight: number;
    maxWidth: WidthResolver;
};

const DEFAULT_VOLUME_WIDTH = 1000;
const DEFAULT_VOLUME_PAGES = 180;

// eslint-disable-next-line max-lines-per-function, max-statements
const resolveTimelineData = (
    rawData: TimelineData,
    templates: ItemTemplates,
): ResolvedTimelineData => {
    const {
        title,
        volumes: volumesRaw,
        sagas: sagasRaw,
        seasons: seasonsRaw,
        splitChapters,
        wikiBase,
        smallImages,
        socialLinks,
    } = rawData;

    const maybeFunction = <T>(fn: Callback<T> | T, idx: number): T =>
        typeof fn === 'function' ? (fn as Callback<T>)(rawData, idx) : fn;

    const chapters: ResolvedChapter[] = [];
    const volumes: ResolvedVolume[] = [];
    const arcs: ResolvedArc[] = [];
    const sagas: ResolvedSaga[] = [];
    const seasons: ResolvedSeason[] = [];
    const episodes: ResolvedEpisode[] = [];

    let globalChapterIdx = 0;

    for (const [
        volumeIdx,
        { title: titleRaw, cover: coverRaw, chapters: chaptersRaw },
    ] of volumesRaw.entries()) {
        const volumeNumber = volumeIdx + 1;
        const pagesInVolume = sum(chaptersRaw.map(ch => ch.pages));

        const volumeChapters: ResolvedChapter[] = [];
        for (const {
            title: titleRaw,
            date: dateRaw,
            pages,
            cover,
        } of chaptersRaw) {
            // eslint-disable-next-line no-plusplus
            const chapterIdx = globalChapterIdx++;
            const chapterNumber = chapterIdx + 1;

            const title = maybeFunction(titleRaw, chapterNumber);

            const pagesInChapter = pages;
            const chapterWidthUnbound =
                pagesInChapter *
                (DEFAULT_VOLUME_WIDTH / DEFAULT_VOLUME_PAGES) *
                1.05;
            const chapterWidthBounded =
                pagesInChapter * (DEFAULT_VOLUME_WIDTH / pagesInVolume);

            volumeChapters.push({
                date: tokyoDate(dateRaw),
                pages,
                cover,
                width: unboundChapterWidth =>
                    unboundChapterWidth ? chapterWidthUnbound : (
                        chapterWidthBounded
                    ),
                volume: volumeIdx,
                title: templates.chapter.titleProcessor(title, chapterNumber),
                number: templates.chapter.numberProcessor(chapterNumber),
                wikiLink: templates.chapter.wikiLink(title, chapterNumber),
            });
        }
        chapters.push(...volumeChapters);

        const unboundVolumeWidth = sum(
            volumeChapters.map(ch => ch.width(true)),
        );
        const title = maybeFunction(titleRaw, volumeNumber);
        volumes.push({
            cover: maybeFunction(coverRaw, volumeNumber),
            width: unboundChapterWidth =>
                unboundChapterWidth ? unboundVolumeWidth : DEFAULT_VOLUME_WIDTH,
            title: templates.volume.titleProcessor(title, volumeNumber),
            number: templates.volume.numberProcessor(volumeNumber),
            wikiLink: templates.volume.wikiLink(title, volumeNumber),
        });
    }

    const chaptersTotal = globalChapterIdx;

    for (const [sagaIdx, { arcs: arcsRaw, title }] of sagasRaw.entries()) {
        const sagaNumber = sagaIdx + 1;

        const sagaArcs: ResolvedArc[] = [];
        for (const [
            arcIdx,
            {
                chapters: { from, to },
                cover,
                title,
                offset,
            },
        ] of arcsRaw.entries()) {
            const arcNumber = arcIdx + 1;
            const width: WidthResolver = unboundChapterWidth =>
                sum(
                    chapters
                        .slice(from - 1, to ?? chaptersTotal)
                        .map(ch => ch.width(unboundChapterWidth)),
                );

            if (cover === null) {
                sagaArcs.push({
                    cover: null,
                    width,
                    saga: sagaIdx,
                    title: templates.arc.titleProcessor(title, arcNumber),
                    number: templates.arc.numberProcessor(arcNumber),
                    wikiLink: templates.arc.wikiLink(title, arcNumber),
                });
            } else {
                sagaArcs.push({
                    cover,
                    offset,
                    width,
                    saga: sagaIdx,
                    title: templates.arc.titleProcessor(title, arcNumber),
                    number: templates.arc.numberProcessor(arcNumber),
                    wikiLink: templates.arc.wikiLink(title, arcNumber),
                });
            }
        }
        arcs.push(...sagaArcs);

        sagas.push({
            width: unboundChapterWidth =>
                sum(sagaArcs.map(arc => arc.width(unboundChapterWidth))),
            title: templates.saga.titleProcessor(title, sagaNumber),
            number: templates.saga.numberProcessor(sagaNumber),
            wikiLink: templates.saga.wikiLink(title, sagaNumber),
        });
    }

    let globalEpisodeIdx = 0;

    const widthBasedOnPages = ({ from, to }: Range): WidthResolver => {
        const [start, end] = [from - 1, to ?? chaptersTotal];
        return unboundChapterWidth =>
            sum(
                chapters.slice(start, end).map(({ pages, width }, idx) => {
                    const chapterIdx = start + idx;
                    const pageWidth = width(unboundChapterWidth) / pages;
                    const split = splitChapters[chapterIdx + 1] ?? pages;
                    const rest = pages - split;
                    const pagesInSegment =
                        rest !== 0 && chapterIdx === start ? rest
                        : chapterIdx === end - 1 ? split
                        : pages;

                    return pagesInSegment * pageWidth;
                }),
            );
    };

    if (seasonsRaw !== undefined) {
        for (const [
            seasonIdx,
            { title, cover: coverRaw, offset, chapters, episodes: episodesRaw },
        ] of seasonsRaw.entries()) {
            const seasonNumber = seasonIdx + 1;

            const width = widthBasedOnPages(chapters);

            if (title === undefined) {
                seasons.push({
                    width,
                    title: templates.season.titleProcessor(
                        seasonNumber.toString(),
                        seasonNumber,
                    ),
                    number: templates.season.numberProcessor(seasonNumber),
                    wikiLink: templates.season.wikiLink(
                        seasonNumber.toString(),
                        seasonNumber,
                    ),
                });
            } else {
                seasons.push({
                    cover: maybeFunction(coverRaw, seasonNumber),
                    offset,
                    width,
                    title: templates.season.titleProcessor(title, seasonNumber),
                    number: templates.season.numberProcessor(seasonNumber),
                    wikiLink: templates.season.wikiLink(title, seasonNumber),
                });
            }

            if (episodesRaw === undefined) {
                continue;
            }

            for (const {
                title: titleRaw,
                cover: coverRaw,
                offset,
                chapters,
            } of episodesRaw) {
                // eslint-disable-next-line no-plusplus
                const episodeIdx = globalEpisodeIdx++;
                const episodeNumber = episodeIdx + 1;

                const title = maybeFunction(titleRaw, episodeNumber);
                episodes.push({
                    cover: maybeFunction(coverRaw, episodeNumber),
                    offset,
                    width: widthBasedOnPages(chapters),
                    season: seasonIdx,
                    title: templates.episode.titleProcessor(
                        title,
                        episodeNumber,
                    ),
                    number: templates.episode.numberProcessor(episodeNumber),
                    wikiLink: templates.episode.wikiLink(title, episodeNumber),
                });
            }
        }
    }

    return {
        title,
        chapters: asNonEmpty(chapters, 'chapters'),
        volumes: asNonEmpty(volumes, 'volumes'),
        arcs: asNonEmpty(arcs, 'arcs'),
        sagas: asNonEmpty(sagas, 'sagas'),
        episodes,
        seasons,
        wikiBase,
        smallImages,
        socialLinks,
    };
};

type Templates = Pick<
    TimelineSectionItem<TimelineSectionType>,
    'titleProcessor' | 'numberProcessor' | 'wikiLink'
>;

type ItemTemplates = Record<
    TimelineSectionType,
    {
        [K in keyof Templates]-?: Templates[K];
    }
>;

const resolveTimelineSectionLayout = (
    rawLayout: TimelineSectionLayout,
): [ResolvedTimelineSectionLayout, ItemTemplates] => {
    const templates = {} as ItemTemplates;

    const resolveItem = <T extends TimelineSectionType>({
        type,
        fit,
        defaultCoverPosition,
        backgroundColor,
        scale,
        sidewaysText,
        blankfontSize,
        titleFontSize,
        titleProcessor,
        numberProcessor,
        height,
        sectionLink,
        wikiLink,
        focusable,
        subTimeline: _,
    }: TimelineSectionItem<T>): ResolvedSectionItem<T> => {
        templates[type] = {
            titleProcessor: titleProcessor ?? ((title: string) => title),
            numberProcessor: numberProcessor ?? (num => num.toString()),
            wikiLink,
        };

        return {
            type,
            fit,
            defaultCoverPosition,
            backgroundColor,
            scale,
            sidewaysText,
            blankfontSize,
            titleFontSize,
            height,
            sectionLink,
            focusable,
        } as ResolvedSectionItem<T>;
    };

    const layout = {} as ResolvedTimelineSectionLayout;

    // TODO: introduce the odering for sections
    typedKeys(rawLayout).forEach(key => {
        if (key === 'timeline') {
            layout.timeline = rawLayout.timeline;
            return;
        }

        const rawItem = rawLayout[key];
        if (!rawItem) {
            return;
        }

        const resolved = resolveItem(rawItem);
        if (rawItem.subTimeline) {
            resolved.subTimeline = resolveItem(rawItem.subTimeline);
        }

        Object.assign(layout, { [key]: resolved });
    });

    return [layout, templates];
};

const resolve = ({
    layout: rawLayout,
    data: rawData,
}: Timeline): ResolvedTimeline => {
    const [layout, templates] = resolveTimelineSectionLayout(rawLayout);
    const data = resolveTimelineData(rawData, templates);

    const maxHeight =
        sum(
            typedValues(layout)
                .filter(sec => sec.type !== 'timeline')
                .map(sec => sec.height),
        ) + TIMELINE_HEIGHT;
    const maxWidth: WidthResolver = unboundChapterWidth =>
        sum(data.volumes.map(vol => vol.width(unboundChapterWidth)));

    return { layout, data, maxHeight, maxWidth };
};

const resolveTimeline = (
    raw: Record<AnimeTitle, Timeline>,
): Record<AnimeTitle, ResolvedTimeline> =>
    typedFromEntries(
        typedEntries(raw).map(([title, timeline]) => [
            title,
            resolve(timeline),
        ]),
    );

export default resolveTimeline;
