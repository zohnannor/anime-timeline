import { Timeline } from '@modules/timeline/Timeline';
import { TimelineContainer } from '@modules/timeline/TimelineContainer';
import { TimelineSectionItemComponent } from '@modules/timeline/TimelineSectionItemComponent';
import { useSettings } from '@shared/contexts/SettingsContext';
import { StructOfArrays } from '@shared/lib/util';
import { TIMELINE } from '@timelines/registry';
import {
    ResolvedSectionItem,
    ResolvedTimelineEntity,
} from '@timelines/resolved';
import { TimelineSectionType } from '@timelines/types';

type TimelineSections = (
    | {
          [K in TimelineSectionType]: ResolvedSectionItem<K>;
      }[TimelineSectionType]
    | {
          type: 'timeline';
      }
) & { parentNumber?: number };

export const TimelineSection: React.FC<TimelineSections> = timelineItem => {
    const { animeTitle } = useSettings();

    const { type, parentNumber } = timelineItem;

    if (type === 'timeline') {
        return <Timeline animeTitle={animeTitle} />;
    }

    const {
        data: { episodes, seasons, sagas, arcs, chapters, volumes },
    } = TIMELINE[animeTitle];

    const entities: StructOfArrays<ResolvedTimelineEntity> = {
        episode: episodes.filter(ep => ep.season === parentNumber),
        season: seasons ?? [],
        saga: sagas,
        arc: arcs.filter(arc => arc.saga === parentNumber),
        chapter: chapters,
        volume: volumes,
    };

    return (
        <TimelineContainer>
            {entities[type].map((entity, idx) => (
                <TimelineSectionItemComponent
                    timelineSection={timelineItem}
                    entity={entity}
                    num={idx}
                    key={`${entity.title}-${idx + 1}`}
                />
            ))}
        </TimelineContainer>
    );
};
