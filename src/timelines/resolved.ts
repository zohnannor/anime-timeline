import { tokyoDate } from '@shared/lib/helpers';
import {
    asNonEmpty,
    NonEmptyArray,
    sum,
    throwError,
    typedEntries,
    typedFromEntries,
    typedKeys,
    typedValues,
} from '@shared/lib/util';
import { TIMELINE_HEIGHT } from '@timelines/index';
import {
    Arc,
    Callback,
    Chapter,
    EntityCallback,
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
    TimelineSection,
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

type ResolvedEpisode = Omit<
    Episode,
    'title' | 'cover' | 'chapters' | 'date'
> & {
    date: Date;
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

export type ResolvedSectionItem<T extends TimelineSection> = Omit<
    TimelineSectionItem<T>,
    'titleProcessor' | 'numberProcessor' | 'wikiLink' | 'subTimeline'
> & {
    subTimeline?: T extends keyof SubtimelinesMap ?
        ResolvedSectionItem<SubtimelinesMap[T]>
    :   never;
};

type ResolveSectionItem<S extends keyof TimelineSectionLayout> =
    S extends TimelineSection ? ResolvedSectionItem<S>
    :   TimelineSectionLayout[S];

type ResolvedTimelineSectionLayout = {
    [S in keyof TimelineSectionLayout]: ResolveSectionItem<S>;
};

type ResolvedTimeline = {
    layout: ResolvedTimelineSectionLayout;
    data: ResolvedTimelineData;
    maxHeight: number;
    maxWidth: WidthResolver;
};

const DEFAULT_VOLUME_WIDTH = 1000;
const DEFAULT_VOLUME_PAGES = 180;

const maybeCallback = <T>(fn: Callback<T> | T, n: number): T =>
    typeof fn === 'function' ? (fn as Callback<T>)(n) : fn;
const maybeEntityCallback = <T>(
    fn: EntityCallback<T> | T,
    n: number,
    title: string,
): T => (typeof fn === 'function' ? (fn as EntityCallback<T>)(n, title) : fn);

// eslint-disable-next-line max-lines-per-function, max-statements
const resolveTimelineData = (
    {
        title,
        volumes: rawVolumes,
        sagas: rawSagas,
        seasons: rawSeasons,
        splitChapters,
        wikiBase,
        smallImages,
        socialLinks,
    }: TimelineData,
    {
        arc: arcTemplates,
        chapter: chapterTemplates,
        episode: episodeTemplates,
        saga: sagaTemplates,
        season: seasonTemplates,
        volume: volumeTemplates,
    }: ItemTemplates,
): ResolvedTimelineData => {
    const chapters: ResolvedChapter[] = [];
    const volumes: ResolvedVolume[] = [];
    const arcs: ResolvedArc[] = [];
    const sagas: ResolvedSaga[] = [];
    const seasons: ResolvedSeason[] = [];
    const episodes: ResolvedEpisode[] = [];

    let globalChapterIdx = 0;

    for (const [
        volumeIdx,
        { title: rawTitle, cover: rawCover, chapters: rawChapters },
    ] of rawVolumes.entries()) {
        const volumeNumber = volumeIdx + 1;
        const pagesInVolume = sum(rawChapters.map(ch => ch.pages));

        const volumeChapters: ResolvedChapter[] = [];
        for (const {
            title: rawTitle,
            date: rawDate,
            pages,
            cover,
        } of rawChapters) {
            // eslint-disable-next-line no-plusplus
            const chapterNumber = globalChapterIdx++ + 1;
            const titleString = maybeCallback(rawTitle, chapterNumber);
            const pagesInChapter = pages;
            const chapterWidthUnbound =
                pagesInChapter *
                (DEFAULT_VOLUME_WIDTH / DEFAULT_VOLUME_PAGES) *
                1.05;
            const chapterWidthBounded =
                pagesInChapter * (DEFAULT_VOLUME_WIDTH / pagesInVolume);

            const title = chapterTemplates.titleProcessor(
                titleString,
                chapterNumber,
            );
            volumeChapters.push({
                date: tokyoDate(rawDate),
                pages,
                cover,
                width: unboundChapterWidth =>
                    unboundChapterWidth ? chapterWidthUnbound : (
                        chapterWidthBounded
                    ),
                volume: volumeIdx,
                title,
                number: chapterTemplates.numberProcessor(chapterNumber),
                wikiLink: chapterTemplates.wikiLink(title, chapterNumber),
            });
        }
        chapters.push(...volumeChapters);

        const unboundVolumeWidth = sum(
            volumeChapters.map(ch => ch.width(true)),
        );
        const title =
            typeof rawTitle === 'number' ?
                (volumeChapters[rawTitle - 1]?.title ??
                throwError(`Chapter ${rawTitle - 1} not found`))
            :   maybeCallback(rawTitle, volumeNumber);
        // unprocessed `title` passed to `rawCover` and `wikiLink` - intentional
        volumes.push({
            cover: maybeEntityCallback(rawCover, volumeNumber, title),
            width: unboundChapterWidth =>
                unboundChapterWidth ? unboundVolumeWidth : DEFAULT_VOLUME_WIDTH,
            title: volumeTemplates.titleProcessor(title, volumeNumber),
            number: volumeTemplates.numberProcessor(volumeNumber),
            wikiLink: volumeTemplates.wikiLink(title, volumeNumber),
        });
    }

    const chaptersTotal = globalChapterIdx;

    for (const [sagaIdx, { arcs: rawArcs, title }] of rawSagas.entries()) {
        const sagaNumber = sagaIdx + 1;

        const sagaArcs: ResolvedArc[] = [];
        for (const [
            arcIdx,
            {
                chapters: { from, to },
                cover,
                title: rawTitle,
                offset,
            },
        ] of rawArcs.entries()) {
            const arcNumber = arcIdx + 1;
            const width: WidthResolver = unboundChapterWidth =>
                sum(
                    chapters
                        .slice(from - 1, to ?? chaptersTotal)
                        .map(ch => ch.width(unboundChapterWidth)),
                );
            const title = arcTemplates.titleProcessor(rawTitle, arcNumber);
            const number = arcTemplates.numberProcessor(arcNumber);
            const wikiLink = arcTemplates.wikiLink(title, arcNumber);
            if (cover === null) {
                sagaArcs.push({
                    cover: null,
                    width,
                    saga: sagaNumber,
                    title,
                    number,
                    wikiLink,
                });
            } else {
                sagaArcs.push({
                    cover,
                    offset,
                    width,
                    saga: sagaNumber,
                    title,
                    number,
                    wikiLink,
                });
            }
        }
        arcs.push(...sagaArcs);

        sagas.push({
            width: unboundChapterWidth =>
                sum(sagaArcs.map(arc => arc.width(unboundChapterWidth))),
            title: sagaTemplates.titleProcessor(title, sagaNumber),
            number: sagaTemplates.numberProcessor(sagaNumber),
            wikiLink: sagaTemplates.wikiLink(title, sagaNumber),
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

    if (rawSeasons !== undefined && seasonTemplates !== undefined) {
        for (const [
            seasonIdx,
            {
                title: rawTitle,
                cover: rawCover,
                offset,
                chapters: chaptersRange,
                episodes: rawEpisodes,
            },
        ] of rawSeasons.entries()) {
            const seasonNumber = seasonIdx + 1;
            const width = widthBasedOnPages(chaptersRange);
            const number = seasonTemplates.numberProcessor(seasonNumber);
            const title = seasonTemplates.titleProcessor(
                rawTitle ?? seasonNumber.toString(),
                seasonNumber,
            );
            const wikiLink = seasonTemplates.wikiLink(title, seasonNumber);
            if (rawCover === undefined) {
                seasons.push({
                    width,
                    title,
                    number,
                    wikiLink,
                });
            } else {
                seasons.push({
                    width,
                    cover: maybeCallback(rawCover, seasonNumber),
                    offset,
                    title,
                    number,
                    wikiLink,
                });
            }

            if (rawEpisodes === undefined || episodeTemplates === undefined) {
                continue;
            }

            for (const {
                title: rawTitle,
                cover: rawCover,
                offset,
                chapters: chaptersRange,
                date: rawDate,
            } of rawEpisodes) {
                // eslint-disable-next-line no-plusplus
                const episodeNumber = globalEpisodeIdx++ + 1;
                const title =
                    typeof rawTitle === 'number' ?
                        (chapters[rawTitle - 1]?.title ??
                        throwError(`Chapter ${rawTitle - 1} not found`))
                    :   maybeCallback(rawTitle, episodeNumber);
                episodes.push({
                    date: tokyoDate(rawDate),
                    cover: maybeCallback(rawCover, episodeNumber),
                    offset,
                    width: widthBasedOnPages(chaptersRange),
                    season: seasonNumber,
                    title: episodeTemplates.titleProcessor(
                        title,
                        episodeNumber,
                    ),
                    number: episodeTemplates.numberProcessor(episodeNumber),
                    wikiLink: episodeTemplates.wikiLink(title, episodeNumber),
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

type Templates = Required<
    Pick<
        TimelineSectionItem<TimelineSection>,
        'titleProcessor' | 'numberProcessor' | 'wikiLink'
    >
>;

type ItemTemplates = Partial<Record<'season' | 'episode', Templates>> &
    Record<Exclude<TimelineSection, 'season' | 'episode'>, Templates>;

const resolveTimelineSectionLayout = (
    rawLayout: TimelineSectionLayout,
): [ResolvedTimelineSectionLayout, ItemTemplates] => {
    const templates = {} as ItemTemplates;

    const resolveItem = <T extends TimelineSection>({
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
        if (rawItem === undefined) {
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

const resolveTimeline = <K extends PropertyKey>(
    raw: Record<K, Timeline>,
): Record<K, ResolvedTimeline> =>
    typedFromEntries(
        typedEntries(raw).map(([title, timeline]) => [
            title,
            resolve(timeline),
        ]),
    );

export default resolveTimeline;
