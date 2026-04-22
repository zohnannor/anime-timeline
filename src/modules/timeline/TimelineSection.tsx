import styled from 'styled-components';

import { Timeline } from '@modules/timeline/Timeline';
import { TimelineSectionItemComponent } from '@modules/timeline/TimelineSectionItemComponent';
import { useSettings } from '@shared/contexts/SettingsContext';
import { TIMELINE } from '@timelines/registry';
import { ResolvedSectionItem } from '@timelines/resolved';
import { TimelineSection as TimelineSectionType } from '@timelines/types';

type ContainerProps = {
    $dir?: 'row' | 'column';
};

const TimelineContainer = styled.div.attrs<ContainerProps>({
    className: 'timelineContainer',
})`
    display: flex;
    flex-direction: ${({ $dir: dir }) => dir ?? 'row'};
    position: relative;
`;

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

    if (type === 'season' && seasons === undefined) {
        return null;
    }
    if (type === 'saga' && sagas === undefined) {
        return null;
    }

    const entities = () =>
        type === 'episode' ? episodes.filter(ep => ep.season === parentNumber)
        : type === 'season' ? (seasons ?? [])
        : type === 'saga' ? (sagas ?? [])
        : type === 'arc' ?
            parentNumber ? arcs.filter(arc => arc.saga === parentNumber)
            :   arcs
        : type === 'chapter' ? chapters
        : volumes;

    return (
        <TimelineContainer>
            {entities().map((entity, idx) => (
                <TimelineSectionItemComponent
                    timelineSection={timelineItem}
                    entity={entity}
                    num={idx + 1}
                    key={`${entity.title}-${idx + 1}`}
                />
            ))}
        </TimelineContainer>
    );
};
