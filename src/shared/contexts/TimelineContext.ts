import { createContext, use } from 'react';

import { throwError } from '@shared/lib/util';
import { ResolvedTimeline } from '@timelines/resolved';
import { AnimeTitle } from '@timelines/types';

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
