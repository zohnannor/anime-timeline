import {
    getArcWidth,
    getChapterWidth,
    getEpisodeWidth,
    getSagaWidth,
    getSeasonWidth,
    getVolumeWidth,
    tokyoDate,
} from '@shared/lib/helpers';
import { ExactUnion, NonEmptyArray } from '@shared/lib/util';
import {
    Offset,
    OffsetWhenCover,
    SmallImages,
    SocialLink,
    TimelineData,
} from '@timelines/types';

type WidthResolver = (_unboundedChapterWidth: boolean) => number;

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

type ResolvedTimelineData = {
    title: string;
    chapters: NonEmptyArray<ResolvedChapter>;
    volumes: NonEmptyArray<ResolvedVolume>;
    arcs: NonEmptyArray<ResolvedArc>;
    sagas: NonEmptyArray<ResolvedSaga>;
    seasons?: NonEmptyArray<ResolvedSeason>;
    wikiBase: string;
    smallImages: SmallImages;
    socialLinks: SocialLink[];
};

const notEmpty = <T>(arr: readonly T[]): arr is NonEmptyArray<T> =>
    arr.length > 0;

const throwError = (message: string): never => {
    throw new Error(message);
};

const asNonEmpty = <T>(arr: readonly T[]): NonEmptyArray<T> =>
    notEmpty(arr) ? arr : throwError('Expected non-empty array');

// eslint-disable-next-line max-statements
const resolveTimeline = (raw: TimelineData): ResolvedTimelineData => {
    const {
        title,
        volumes: volumesRaw,
        sagas: sagasRaw,
        seasons: seasonsRaw,
        splitChapters,
        wikiBase,
        smallImages,
        socialLinks,
    } = raw;

    const chapters: ResolvedChapter[] = [];
    const volumes: ResolvedVolume[] = [];
    const arcs: ResolvedArc[] = [];
    const sagas: ResolvedSaga[] = [];
    const seasons: ResolvedSeason[] = [];
    const episodes: ResolvedEpisode[] = [];

    for (const [vi, volume] of volumesRaw.entries()) {
        const {
            title: titleRaw,
            cover: coverRaw,
            chapters: chaptersRaw,
        } = volume;

        const title =
            typeof titleRaw === 'function' ? titleRaw(raw, vi) : titleRaw;
        const cover =
            typeof coverRaw === 'function' ? coverRaw(raw, vi) : coverRaw;
        const width = (unboundedChapterWidth: boolean) =>
            getVolumeWidth(raw, vi, unboundedChapterWidth);

        volumes.push({
            title,
            cover,
            width,
        });

        for (const [ci, chapter] of chaptersRaw.entries()) {
            const {
                title: titleRaw,
                date: dateRaw,
                pages,
                cover: coverRaw,
            } = chapter;

            const title =
                typeof titleRaw === 'function' ? titleRaw(raw, ci) : titleRaw;
            const width = (unboundedChapterWidth: boolean) =>
                getChapterWidth(raw, ci, unboundedChapterWidth);

            chapters.push({
                title,
                date: tokyoDate(dateRaw),
                pages,
                cover: coverRaw,
                width,
            });
        }
    }

    for (const [si, saga] of sagasRaw.entries()) {
        const { arcs: arcsRaw, chapters, title } = saga;
        const width = (unboundedChapterWidth: boolean) =>
            getSagaWidth(raw, si, unboundedChapterWidth);

        sagas.push({
            title,
            width,
        });

        for (const [ai, arc] of arcsRaw.entries()) {
            const { chapters, cover, title, offset } = arc;

            const width = (unboundedChapterWidth: boolean) =>
                getArcWidth(raw, ai, unboundedChapterWidth);

            if (cover === null) {
                arcs.push({
                    title,
                    width,
                    cover: null,
                });
            } else {
                arcs.push({
                    title,
                    cover,
                    offset,
                    width,
                });
            }
        }
    }

    if (seasonsRaw !== undefined) {
        for (const [si, season] of seasonsRaw.entries()) {
            const {
                title,
                cover: coverRaw,
                offset,
                chapters,
                episodes: episodesRaw,
            } = season;

            const cover =
                typeof coverRaw === 'function' ? coverRaw(raw, si) : coverRaw;
            const width = (unboundedChapterWidth: boolean) =>
                getSeasonWidth(raw, si, unboundedChapterWidth);

            if (title !== undefined && cover !== undefined) {
                seasons.push({
                    title,
                    cover,
                    offset,
                    width,
                });
            } else {
                seasons.push({
                    width,
                });
            }

            if (episodesRaw === undefined) {
                continue;
            }

            for (const [ei, episode] of episodesRaw.entries()) {
                const {
                    title: titleRaw,
                    cover: coverRaw,
                    offset,
                    chapters,
                } = episode;

                const title =
                    typeof titleRaw === 'function' ?
                        titleRaw(raw, ei)
                    :   titleRaw;
                const cover =
                    typeof coverRaw === 'function' ?
                        coverRaw(raw, ei)
                    :   coverRaw;
                const width = (unboundedChapterWidth: boolean) =>
                    getEpisodeWidth(raw, ei, unboundedChapterWidth);

                episodes.push({
                    title,
                    cover,
                    offset,
                    width,
                });
            }
        }
    }

    const timeline: ResolvedTimelineData = {
        title,
        chapters: asNonEmpty(chapters),
        volumes: asNonEmpty(volumes),
        arcs: asNonEmpty(arcs),
        sagas: asNonEmpty(sagas),
        seasons: asNonEmpty(seasons),
        wikiBase,
        smallImages,
        socialLinks,
    };

    return timeline;
};

export default resolveTimeline;
