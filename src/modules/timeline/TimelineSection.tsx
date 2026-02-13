import React from 'react';

import {
    TIMELINE,
    TimelineEntity,
    TimelineSectionItem,
    TimelineSectionType,
} from '../../timelines';
import useSettings from '../../shared/contexts/SettingsContext';
import { Timeline } from './Timeline';
import { TimelineContainer } from './TimelineContainer';
import { TimelineSectionItemComponent } from './TimelineSectionItemComponent';

type TimelineSections = (
    | {
          [K in TimelineSectionType]: TimelineSectionItem<K>;
      }[TimelineSectionType]
    | {
          type: 'timeline';
      }
) & { specificIndex?: number };

export const TimelineSection: React.FC<TimelineSections> = timelineItem => {
    const { animeTitle } = useSettings();

    const { type, specificIndex } = timelineItem;

    if (type === 'timeline') return <Timeline $animeTitle={animeTitle} />;

    const timeline = TIMELINE[animeTitle].data;

    const withGlobalIndex = <T, U>(
        xs: readonly T[],
        inner: (x: T) => readonly U[],
    ) =>
        xs
            .flatMap((x, xi) => inner(x).map(el => [xi, el] as const))
            .map(([xi, el], gi) => [xi, gi, el] as const)
            .filter(([xi]) => xi === (specificIndex ?? xi))
            .map(([_, ei, e]) => [ei, e] as const);

    const entities: {
        [K in keyof TimelineEntity]: (readonly [number, TimelineEntity[K]])[];
    } = {
        episode: withGlobalIndex(timeline.seasons, s => s.episodes ?? []),
        season: withGlobalIndex(timeline.seasons, s => [s]),
        saga: withGlobalIndex(timeline.sagas, s => [s]),
        arc: withGlobalIndex(timeline.sagas, s => s.arcs),
        chapter: withGlobalIndex(
            timeline.volumes.flatMap(v => v.chapters),
            c => [c],
        ),
        volume: withGlobalIndex(timeline.volumes, v => [v]),
    };

    return (
        <TimelineContainer>
            {entities[type].map(([idx, entity]) => (
                <TimelineSectionItemComponent
                    timelineSection={timelineItem}
                    entity={entity}
                    idx={idx}
                    key={idx}
                />
            ))}
        </TimelineContainer>
    );
};
