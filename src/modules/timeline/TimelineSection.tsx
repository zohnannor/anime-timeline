import styled from 'styled-components';

import { Timeline } from '@modules/timeline/Timeline';
import { TimelineSectionItemComponent } from '@modules/timeline/TimelineSectionItemComponent';
import { useSettings } from '@shared/contexts/SettingsContext';
import { useTimeline } from '@shared/contexts/TimelineContext';
import { scale } from '@shared/lib/helpers';
import { ResolvedSectionItem } from '@timelines/resolved';
import { TimelineSection as TimelineSectionType } from '@timelines/types';

type ContainerProps = Readonly<{
    $dir?: 'row' | 'column';
    $height: number;
}>;

const TimelineContainer = styled.div<ContainerProps>`
    display: flex;
    flex-direction: ${({ $dir }) => $dir ?? 'row'};
    position: relative;
    height: ${({ $height }) => scale($height)};
`;

type TimelineSectionProps = Readonly<{
    item:
        | NonNullable<ResolvedSectionItem<TimelineSectionType>>
        | Readonly<{
              type: 'timeline';
              height: number;
          }>;
    parentNumber?: number;
}>;

export const TimelineSection: React.FC<TimelineSectionProps> = ({
    item,
    parentNumber,
}) => {
    const {
        data: { episodes, seasons, sagas, arcs, chapters, volumes },
    } = useTimeline();
    const { showExtraChapters } = useSettings();

    const { type, height } = item;
    if (type === 'timeline') {
        return <Timeline />;
    }

    if (type === 'season' && seasons === undefined) {
        return <></>;
    }
    if (type === 'saga' && sagas === undefined) {
        return <></>;
    }
    if (type === 'arc' && arcs === undefined) {
        return <></>;
    }

    const entities = () =>
        type === 'episode' ? episodes.filter(ep => ep.season === parentNumber)
        : type === 'season' ? (seasons ?? [])
        : type === 'saga' ? (sagas ?? [])
        : type === 'arc' ?
            parentNumber !== undefined ?
                (arcs ?? []).filter(arc => arc.saga === parentNumber)
            :   (arcs ?? [])
        : type === 'chapter' ?
            showExtraChapters ? chapters
            :   chapters.filter(ch => !ch.extra)
        : showExtraChapters ? volumes
        : volumes.filter(vol => !vol.extra);

    const entityList = entities();

    // do not create empty sections if there are no entities
    if (entityList.length === 0) {
        return <></>;
    }

    return (
        <TimelineContainer
            $height={height}
            className={`${type}TimelineContainer`}
        >
            {entityList.map((entity, idx) => (
                <TimelineSectionItemComponent
                    timelineSection={item}
                    entity={entity}
                    num={idx + 1}
                    key={`${entity.title}-${idx + 1}`}
                />
            ))}
        </TimelineContainer>
    );
};
