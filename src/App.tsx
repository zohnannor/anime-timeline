import { useCallback, useEffect } from 'react';
import styled from 'styled-components';

import { CalendarModal } from './components/CalendarModal';
import { CaptureTimelineModal } from './components/CaptureTimelineModal';
import { FloatingButton, FloatingButtons } from './components/FloatingButtons';
import { InfoBox } from './components/InfoBox';
import { Scroller } from './components/Scroller';
import { TimeLineHeaders } from './components/TimeLineHeaders';
import { TimelineSection } from './components/TimelineSection';
import { FLOATING_BUTTONS, TIMELINE } from './constants';
import { maxHeight } from './helpers';
import useWindowSize from './hooks/useWindowSize';
import { useSettings } from './providers/SettingsProvider';

const AppContainer = styled.div`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    user-select: none;
`;

const App: React.FC = () => {
    const { width } = useWindowSize();
    const {
        infoBoxOpen,
        calendarOpen,
        captureTimelineModalOpen,
        animeTitle,
        setAnimeTitle,
    } = useSettings();

    console.log({ animeTitle, setAnimeTitle });

    const handleScroll = useCallback(
        (e: WheelEvent) => {
            if (infoBoxOpen || calendarOpen || captureTimelineModalOpen) return;
            document.body.scrollLeft += e.deltaY;
        },
        [infoBoxOpen, calendarOpen]
    );

    useEffect(() => {
        window.addEventListener('wheel', handleScroll);
        return () => window.removeEventListener('wheel', handleScroll);
    }, [handleScroll]);

    useEffect(() => {
        document.documentElement.style.setProperty(
            '--max-height',
            `${maxHeight(animeTitle)}`
        );
        document.title = `${TIMELINE[animeTitle].data.title} Timeline`;
        setAnimeTitle(animeTitle);
        // TODO: favicon
    }, [animeTitle]);

    // const entities = {
    //     arc: TIMELINE[animeTitle].data.arcs,
    //     chapter: TIMELINE[animeTitle].data.volumes.flatMap(v => v.chapters),
    //     season: TIMELINE[animeTitle].data.seasons,
    //     episode: TIMELINE[animeTitle].data.seasons.flatMap(
    //         s => s.episodes ?? []
    //     ),
    //     volume: TIMELINE[animeTitle].data.volumes,
    // };

    return (
        <>
            <TimeLineHeaders $animeTitle={animeTitle} />
            <CalendarModal />
            <CaptureTimelineModal />
            <InfoBox />
            <AppContainer className='appContainer'>
                <FloatingButtons>
                    {FLOATING_BUTTONS.map(({ filename, title, option }) => (
                        <FloatingButton
                            key={filename}
                            filename={filename}
                            title={title}
                            option={option}
                        />
                    ))}
                </FloatingButtons>
                {Object.values(TIMELINE[animeTitle].layout).map(item => (
                    <TimelineSection key={item.type} {...item} />
                ))}
                {/* {Object.values(TIMELINE[animeTitle].layout).map(item => (
                    <TimelineSection
                        type={item.type}
                        items={entities[item.type]}
                        {...item}
                    />  
                ))} */}
                {width > 768 && <Scroller />}
            </AppContainer>
        </>
    );
};

export default App;
