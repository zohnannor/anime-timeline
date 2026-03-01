import { Timeline } from '@modules/timeline/Timeline';
import { TimelineContainer } from '@modules/timeline/TimelineContainer';
import { TimelineSectionItemComponent } from '@modules/timeline/TimelineSectionItemComponent';
import { useSettings } from '@shared/contexts/SettingsContext';
import { StructOfArrays } from '@shared/lib/util';
import { TIMELINE } from '@timelines/registry';
import { ResolvedTimelineEntity } from '@timelines/resolved';
import { TimelineSectionItem, TimelineSectionType } from '@timelines/types';

type TimelineSections = (
    | {
          [K in TimelineSectionType]: TimelineSectionItem<K>;
      }[TimelineSectionType]
    | {
          type: 'timeline';
      }
) & { parentIndex?: number };

export const TimelineSection: React.FC<TimelineSections> = timelineItem => {
    const { animeTitle } = useSettings();

    const { type, parentIndex } = timelineItem;

    if (type === 'timeline') {
        return <Timeline animeTitle={animeTitle} />;
    }

    const { episodes, seasons, sagas, arcs, chapters, volumes } =
        TIMELINE[animeTitle].data;

    const entities: StructOfArrays<ResolvedTimelineEntity> = {
        episode: episodes.filter(ep => ep.season === parentIndex),
        season: seasons ?? [],
        saga: sagas,
        arc: arcs.filter(arc => arc.saga === parentIndex),
        chapter: chapters,
        volume: volumes,
    };

    return (
        <TimelineContainer>
            {entities[type].map((entity, idx) => (
                <TimelineSectionItemComponent
                    timelineSection={timelineItem}
                    entity={entity}
                    idx={idx}
                    key={`${entity.title ?? ''}-${idx + 1}`}
                />
            ))}
        </TimelineContainer>
    );
};
