import styled from 'styled-components';

import { Timeline } from '@modules/timeline/Timeline';
import { TimelineSectionItemComponent } from '@modules/timeline/TimelineSectionItemComponent';
import { useSettings } from '@shared/contexts/SettingsContext';
import { useTimeline } from '@shared/contexts/TimelineContext';
import { scale } from '@shared/lib/helpers';
import { ResolvedSectionItem } from '@timelines/resolved';
import { TimelineSection as TimelineSectionType } from '@timelines/types';

type ContainerProps = {
    $dir?: 'row' | 'column';
    $height: number;
};

const TimelineContainer = styled.div<ContainerProps>`
    display: flex;
    flex-direction: ${({ $dir }) => $dir ?? 'row'};
    position: relative;
    height: ${({ $height }) => scale($height)};
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
    const { type, parentNumber } = timelineItem;
    const {
        data: { episodes, seasons, sagas, arcs, chapters, volumes },
    } = useTimeline();
    const { showExtraChapters } = useSettings();

    if (type === 'timeline') {
        return <Timeline />;
    }

    const { height } = timelineItem;
    if (type === 'season' && seasons === undefined) {
        return null;
    }
    if (type === 'saga' && sagas === undefined) {
        return null;
    }
    if (type === 'arc' && arcs === undefined) {
        return null;
    }

    const entities = () =>
        type === 'episode' ? episodes.filter(ep => ep.season === parentNumber)
        : type === 'season' ? (seasons ?? [])
        : type === 'saga' ? (sagas ?? [])
        : type === 'arc' ?
            parentNumber ? (arcs ?? []).filter(arc => arc.saga === parentNumber)
            :   (arcs ?? [])
        : type === 'chapter' ?
            showExtraChapters ? chapters
            :   chapters.filter(ch => !ch.extra)
        : showExtraChapters ? volumes
        : volumes.filter(vol => !vol.extra);

    const entityList = entities();

    // do not create empty sections if there are no entities
    if (entityList.length === 0) {
        return null;
    }

    return (
        <TimelineContainer
            $height={height}
            className={`${type}TimelineContainer`}
        >
            {entityList.map((entity, idx) => (
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
