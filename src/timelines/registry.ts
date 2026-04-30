import { throwError } from '@shared/lib/util';
import { ResolvedTimeline, resolveTimeline } from '@timelines/resolved';
import { AnimeTitle, Timeline } from '@timelines/types';

export const TIMELINE_LOADERS = {
    csm: () => import('@timelines/csm'),
    berserk: () => import('@timelines/berserk'),
    fp: () => import('@timelines/fp'),
    frieren: () => import('@timelines/frieren'),
    eva: () => import('@timelines/eva'),
    aot: () => import('@timelines/aot'),
    opm: () => import('@timelines/opm'),
    deathnote: () => import('@timelines/deathnote'),
    jr: () => import('@timelines/jr'),
    hxh: () => import('@timelines/hxh'),
    jojo: () => import('@timelines/jojo'),
    dhd: () => import('@timelines/dhd'),
};

const getModule = (
    title: AnimeTitle,
    mod: Record<string, unknown>,
): Timeline => {
    const key = `${title.toUpperCase()}_TIMELINE`;
    const timeline = mod[key];
    if (timeline === undefined) {
        throwError(`\`@timelines/${title}\` doesn't export \`${key}\``);
    }
    return timeline as Timeline;
};

const timelineCache = new Map<AnimeTitle, ResolvedTimeline>();

export const loadTimeline = async (
    title: AnimeTitle,
): Promise<ResolvedTimeline> => {
    const cached = timelineCache.get(title);
    if (cached !== undefined) {
        return cached;
    }
    const mod = await TIMELINE_LOADERS[title]();
    const timeline = resolveTimeline(getModule(title, mod));
    timelineCache.set(title, timeline);
    return timeline;
};
