import { useCallback, useEffect } from 'react';
import styled from 'styled-components';

import { Arcs } from './components/Arcs';
import { CalendarModal, CalendarModalButton } from './components/CalendarModal';
import { ChapterWidthButton } from './components/ChapterWidthButton';
import { FloatingButtons } from './components/FloatingButtons';
import { InfoBox, InfoBoxButton, InfoBoxContent } from './components/InfoBox';
import { Scroller } from './components/Scroller';
import { Seasons } from './components/Seasons';
import { Timeline } from './components/Timeline';
import { TimeLineHeaders } from './components/TimeLineHeaders';
import { Volumes } from './components/Volumes';
import useWindowSize from './hooks/useWindowSize';
import { useSettings } from './providers/SettingsProvider';

const AppContainer = styled.div`
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

const App: React.FC = () => {
    const { width } = useWindowSize();
    const { infoBoxOpen, calendarOpen } = useSettings();

    const handleScroll = useCallback(
        (e: WheelEvent) => {
            if (infoBoxOpen || calendarOpen) return;
            document.body.scrollLeft += e.deltaY;
        },
        [infoBoxOpen, calendarOpen]
    );

    useEffect(() => {
        window.addEventListener('wheel', handleScroll);
        return () => window.removeEventListener('wheel', handleScroll);
    }, [handleScroll]);

    return (
        <>
            <TimeLineHeaders />
            <CalendarModal />
            <AppContainer className='appContainer'>
                <FloatingButtons>
                    <InfoBoxButton />
                    <ChapterWidthButton />
                    <CalendarModalButton />
                </FloatingButtons>
                <InfoBox containerSelector='#infoBox'>{InfoBoxContent}</InfoBox>
                <Seasons />
                <Arcs />
                <Timeline />
                <Volumes />
                {width > 768 && <Scroller />}
            </AppContainer>
        </>
    );
};

export default App;
