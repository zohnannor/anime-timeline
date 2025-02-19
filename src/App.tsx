import { useCallback, useEffect } from 'react';
import styled from 'styled-components';

import { Arcs } from './components/Arcs';
import { ChapterWidthButton } from './components/ChapterWidthButton';
import { FloatingButtons } from './components/FloatingButtons';
import { InfoBox, InfoBoxButton } from './components/InfoBox';
import { Scroller } from './components/Scroller';
import { Seasons } from './components/Seasons';
import { Timeline } from './components/Timeline';
import { TimeLineHeaders } from './components/TimeLineHeaders';
import { Volumes } from './components/Volumes';
import useWindowSize from './hooks/useWindowSize';
import { SettingsProvider } from './providers/SettingsProvider';

const AppContainer = styled.div`
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

const App: React.FC = () => {
    const { width } = useWindowSize();

    const handleScroll = useCallback((e: WheelEvent) => {
        document.body.scrollLeft += e.deltaY;
    }, []);

    useEffect(() => {
        window.addEventListener('wheel', handleScroll);
        return () => window.removeEventListener('wheel', handleScroll);
    }, [handleScroll]);

    return (
        <SettingsProvider>
            <TimeLineHeaders />
            <AppContainer className='appContainer'>
                <FloatingButtons>
                    <InfoBoxButton />
                    <ChapterWidthButton />
                </FloatingButtons>
                <InfoBox />
                <Seasons />
                <Arcs />
                <Timeline />
                <Volumes />
                {width > 768 && <Scroller />}
            </AppContainer>
        </SettingsProvider>
    );
};

export default App;
