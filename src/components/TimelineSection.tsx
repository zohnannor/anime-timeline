import {
    TIMELINE,
    TimelineSectionItem,
    TimelineSectionType,
} from '../constants';
import { useSettings } from '../providers/SettingsProvider';
import { Timeline } from './Timeline';
import { TimelineContainer } from './TimelineContainer';
import { TimelineSectionItemComponent } from './TimelineSectionItemComponent';

export type TimelineSections = (
    | {
          [K in TimelineSectionType]: TimelineSectionItem<K>;
      }[TimelineSectionType]
    | {
          type: 'timeline';
      }
) & { specificIndex?: number };

export const TimelineSection: React.FC<TimelineSections> = timelineItem => {
    const { animeTitle } = useSettings();

    if (timelineItem.type === 'timeline')
        return <Timeline $animeTitle={animeTitle} />;

    const timeline = TIMELINE[animeTitle].data;

    const { type, specificIndex } = timelineItem;

    const entities = {
        arc: timeline.arcs,
        chapter: timeline.volumes.flatMap(v => v.chapters),
        season: timeline.seasons,
        episode: specificIndex
            ? timeline.seasons[specificIndex]!.episodes ?? []
            : timeline.seasons.flatMap(s => s.episodes ?? []),
        volume: timeline.volumes,
    };

    return (
        <TimelineContainer>
            {entities[type].map((entity, idx) => (
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
