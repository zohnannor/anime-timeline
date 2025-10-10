import { useCallback, useEffect } from 'react';
import styled from 'styled-components';

import { CalendarModal } from './components/CalendarModal';
import { CaptureTimelineModal } from './components/CaptureTimelineModal';
import { FloatingButton, FloatingButtons } from './components/FloatingButtons';
import { InfoBox } from './components/InfoBox';
import { Scroller } from './components/Scroller';
import { TimeLineHeaders } from './components/TimeLineHeaders';
import { TimelineSection } from './components/TimelineSection';
import { FLOATING_BUTTONS, TIMELINE, TIMELINE_HEIGHT } from './constants';
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
            `${TIMELINE[animeTitle].extra.MAX_HEIGHT + TIMELINE_HEIGHT}`
        );
        // set title
        document.title = `${TIMELINE[animeTitle].extra.title} Timeline`;
    }, [animeTitle]);

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
                {Object.values(TIMELINE[animeTitle].info).map(item => (
                    <TimelineSection key={item.type} {...item} />
                ))}
                {width > 768 && <Scroller />}
            </AppContainer>
        </>
    );
};

export default App;
