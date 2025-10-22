import React from 'react';

import {
    TIMELINE,
    TimelineSectionItem,
    TimelineSectionType,
} from '../constants';
import { useSettings } from '../providers/SettingsProvider';
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

    // TODO: refactor this???
    const withGlobalIndex = <T,>(xs: readonly T[]) =>
        xs.map((x, idx) => [idx, x] as const);
    const entities = {
        arc: withGlobalIndex(timeline.arcs),
        chapter: withGlobalIndex(timeline.volumes.flatMap(v => v.chapters)),
        season: withGlobalIndex(timeline.seasons),
        episode: timeline.seasons
            .flatMap((s, si) => (s.episodes ?? []).map(e => [si, e] as const))
            .map(([si, e], ei) => [si, ei, e] as const)
            .filter(([si]) => si === specificIndex)
            .map(([_, ei, e]) => [ei, e] as const),
        volume: withGlobalIndex(timeline.volumes),
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
