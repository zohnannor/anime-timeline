import { maxHeight, tokyoDate } from '@shared/lib/helpers';
import {
    ExactUnion,
    NonEmptyArray,
    sum,
    typedEntries,
    typedFromEntries,
} from '@shared/lib/util';
import {
    AnimeTitle,
    Callback,
    Offset,
    OffsetWhenCover,
    Range,
    SmallImages,
    SocialLink,
    Timeline,
    TimelineSectionLayout,
} from '@timelines/types';

type WidthResolver = (_unboundChapterWidth: boolean) => number;

type ResolvedChapter = {
    title: string;
    date: Date;
    pages: number;
    cover: string | null;
    width: WidthResolver;
};

type ResolvedVolume = {
    title: string;
    cover: string | null;
    width: WidthResolver;
};

type ResolvedArc = OffsetWhenCover<{
    title: string;
    width: WidthResolver;
    saga: number;
}>;

type ResolvedSaga = {
    title: string;
    width: WidthResolver;
};

export type ResolvedEpisode = {
    title: string;
    cover: string;
    offset: Offset;
    width: WidthResolver;
    season: number;
};

type ResolvedSeason = ExactUnion<
    | {
          title: string;
          cover: string;
          offset: Offset;
          width: WidthResolver;
      }
    | {
          width: WidthResolver;
      }
>;

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
    maxHeight: number;
};

export type ResolvedTimeline = {
    layout: TimelineSectionLayout;
    data: ResolvedTimelineData;
};

const notEmpty = <T>(arr: readonly T[]): arr is NonEmptyArray<T> =>
    arr.length > 0;

const throwError = (message: string): never => {
    throw new Error(message);
};

const asNonEmpty = <T>(arr: readonly T[], name: string): NonEmptyArray<T> =>
    notEmpty(arr) ? arr : throwError(`Expected non-empty array ${name}`);

const DEFAULT_VOLUME_WIDTH = 1000;
const DEFAULT_VOLUME_PAGES = 180;

// eslint-disable-next-line max-statements, max-lines-per-function
const resolve = (raw: Timeline): ResolvedTimeline => {
    const { layout, data } = raw;
    const {
        title,
        volumes: volumesRaw,
        sagas: sagasRaw,
        seasons: seasonsRaw,
        splitChapters,
        wikiBase,
        smallImages,
        socialLinks,
    } = data;

    const maybeFunction = <T>(fn: Callback<T> | T, idx: number): T =>
        typeof fn === 'function' ? (fn as Callback<T>)(data, idx) : fn;

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
        const pagesInVolume = sum(chaptersRaw.map(ch => ch.pages));

        const volumeChapters: ResolvedChapter[] = [];
        for (const chapter of chaptersRaw) {
            // eslint-disable-next-line no-plusplus
            const chapterIdx = globalChapterIdx++;
            const {
                title: titleRaw,
                date: dateRaw,
                pages,
                cover: coverRaw,
            } = chapter;

            const title = maybeFunction(titleRaw, chapterIdx);

            const pagesInChapter = pages;
            const chapterWidthUnbound =
                pagesInChapter *
                (DEFAULT_VOLUME_WIDTH / DEFAULT_VOLUME_PAGES) *
                1.05;
            const chapterWidthBounded =
                pagesInChapter * (DEFAULT_VOLUME_WIDTH / pagesInVolume);

            volumeChapters.push({
                title,
                date: tokyoDate(dateRaw),
                pages,
                cover: coverRaw,
                width: unboundChapterWidth =>
                    unboundChapterWidth ? chapterWidthUnbound : (
                        chapterWidthBounded
                    ),
            });
        }
        chapters.push(...volumeChapters);

        const unboundVolumeWidth = sum(
            volumeChapters.map(ch => ch.width(true)),
        );
        volumes.push({
            title: maybeFunction(titleRaw, volumeIdx),
            cover: maybeFunction(coverRaw, volumeIdx),
            width: unboundChapterWidth =>
                unboundChapterWidth ? unboundVolumeWidth : DEFAULT_VOLUME_WIDTH,
        });
    }

    const chaptersTotal = globalChapterIdx;

    for (const [
        sagaIdx,
        // TODO: saga.chapters is not used, remove it?
        { arcs: arcsRaw, chapters: _, title },
    ] of sagasRaw.entries()) {
        const sagaArcs: ResolvedArc[] = [];
        for (const {
            chapters: { from, to },
            cover,
            title,
            offset,
        } of arcsRaw) {
            const width: WidthResolver = unboundChapterWidth =>
                sum(
                    chapters
                        .slice(from - 1, to ?? chaptersTotal)
                        .map(ch => ch.width(unboundChapterWidth)),
                );

            if (cover === null) {
                sagaArcs.push({
                    title,
                    cover: null,
                    width,
                    saga: sagaIdx,
                });
            } else {
                sagaArcs.push({
                    title,
                    cover,
                    offset,
                    width,
                    saga: sagaIdx,
                });
            }
        }
        arcs.push(...sagaArcs);

        sagas.push({
            title,
            width: unboundChapterWidth =>
                sum(sagaArcs.map(arc => arc.width(unboundChapterWidth))),
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
                    const pagesInSeason =
                        pages !== split && chapterIdx === start ? rest
                        : chapterIdx === end - 1 ? split
                        : pages;

                    return pagesInSeason * pageWidth;
                }),
            );
    };

    if (seasonsRaw !== undefined) {
        for (const [
            seasonIdx,
            { title, cover: coverRaw, offset, chapters, episodes: episodesRaw },
        ] of seasonsRaw.entries()) {
            const width = widthBasedOnPages(chapters);

            if (title === undefined) {
                seasons.push({
                    width,
                });
            } else {
                seasons.push({
                    title,
                    cover: maybeFunction(coverRaw, seasonIdx),
                    offset,
                    width,
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

                episodes.push({
                    title: maybeFunction(titleRaw, episodeIdx),
                    cover: maybeFunction(coverRaw, episodeIdx),
                    offset,
                    width: widthBasedOnPages(chapters),
                    season: seasonIdx,
                });
            }
        }
    }

    return {
        layout,
        data: {
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
            maxHeight: maxHeight(layout),
        },
    };
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
