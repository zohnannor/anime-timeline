import { Timeline } from '@modules/timeline/Timeline';
import { TimelineContainer } from '@modules/timeline/TimelineContainer';
import { TimelineSectionItemComponent } from '@modules/timeline/TimelineSectionItemComponent';
import { useSettings } from '@shared/contexts/SettingsContext';
import { TIMELINE } from '@timelines/registry';
import {
    TimelineEntity,
    TimelineSectionItem,
    TimelineSectionType,
} from '@timelines/types';

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

    if (type === 'timeline') {
        return <Timeline animeTitle={animeTitle} />;
    }

    const timeline = TIMELINE[animeTitle].data;

    // maps every nested element's (local) index to the global index
    const withGlobalIndex = <T, U>(
        xs: readonly T[],
        inner: (_x: T) => readonly U[],
    ) =>
        xs
            .flatMap((x, xi) => inner(x).map(el => [xi, el] as const))
            .map(([xi, el], gi) => [xi, gi, el] as const)
            .filter(([xi]) => xi === (specificIndex ?? xi))
            .map(([_, ei, el]) => [ei, el] as const);

    const entities: {
        [K in keyof TimelineEntity]: (readonly [number, TimelineEntity[K]])[];
    } = {
        episode: withGlobalIndex(timeline.seasons, se => se.episodes ?? []),
        season: withGlobalIndex(timeline.seasons, se => [se]),
        saga: withGlobalIndex(timeline.sagas, saga => [saga]),
        arc: withGlobalIndex(timeline.sagas, saga => saga.arcs),
        chapter: withGlobalIndex(
            timeline.volumes.flatMap(vol => vol.chapters),
            ch => [ch],
        ),
        volume: withGlobalIndex(timeline.volumes, vol => [vol]),
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
