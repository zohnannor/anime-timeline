import { createContext, use } from 'react';

import { AnimeTitle } from '@timelines/types';
import { ResolvedTimeline } from '@timelines/resolved';
import { throwError } from '@shared/lib/util';

export type TimelineContextValue = {
    timeline: ResolvedTimeline | null;
    timelines: Partial<Record<AnimeTitle, ResolvedTimeline>>;
    loadAll: () => Promise<void>;
};

export const TimelineContext = createContext<TimelineContextValue>({
    timeline: null,
    timelines: {},
    loadAll: async () => {
        /* empty */
    },
});

export const useTimelineContext = (): TimelineContextValue =>
    use(TimelineContext);

export const useTimeline = () => {
    const { timeline } = use(TimelineContext);
    return timeline ?? throwError('Timeline is not loaded');
};
