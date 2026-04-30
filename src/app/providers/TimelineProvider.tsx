import {
    PropsWithChildren,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';

import { useSettings } from '@shared/contexts/SettingsContext';
import { TimelineContext } from '@shared/contexts/TimelineContext';
import { throwError, typedFromEntries } from '@shared/lib/util';
import { loadTimeline } from '@timelines/registry';
import { AnimeTitle, TITLES } from '@timelines/types';
import { ResolvedTimeline } from '@timelines/resolved';

export const TimelineProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const { animeTitle } = useSettings();
    const [timelines, setTimelines] = useState<
        Partial<Record<AnimeTitle, ResolvedTimeline>>
    >({});

    useEffect(() => {
        let cancelled = false;

        loadTimeline(animeTitle)
            .then(timeline => {
                if (cancelled) {
                    return;
                }
                setTimelines(current => ({
                    ...current,
                    [animeTitle]: timeline,
                }));
            })
            .catch(() => {
                console.error(`Failed to load \`${animeTitle}\` timeline`);
            });

        return () => {
            cancelled = true;
        };
    }, [animeTitle]);

    const loadAll = useCallback(async () => {
        const loaded = await Promise.all(TITLES.map(loadTimeline));
        setTimelines(
            typedFromEntries(
                TITLES.map((title, idx) => [
                    title,
                    loaded[idx] ??
                        throwError(`Failed to load timeline for ${title}`),
                ]),
            ),
        );
    }, []);

    const context = useMemo(
        () => ({
            timeline: timelines[animeTitle] ?? null,
            timelines,
            loadAll,
        }),
        [animeTitle, loadAll, timelines],
    );

    return <TimelineContext value={context}>{children}</TimelineContext>;
};
