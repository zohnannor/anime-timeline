import { useEffect } from 'react';
import styled from 'styled-components';

import { Arcs } from './components/Arcs';
import { InfoBox, InfoBoxButton } from './components/InfoBox';
import { Scroller } from './components/Scroller';
import { Seasons } from './components/Seasons';
import { Timeline } from './components/Timeline';
import { Volumes } from './components/Volumes';
import { APP_MAX_WIDTH, scale } from './constants';
import useWindowSize from './hooks/useWindowSize';
import { SettingsProvider } from './providers/SettingsProvider';

interface AppContainerProps {
    $maxWidth: number;
}

const AppContainer = styled.div<AppContainerProps>`
    display: flex;
    flex-direction: column;
    max-width: ${({ $maxWidth }) => scale($maxWidth)}svh;
    overflow: hidden;
`;

const App: React.FC = () => {
    const { width } = useWindowSize();

    const handleScroll = (e: WheelEvent) => {
        document.body.scrollLeft += e.deltaY;
    };

    useEffect(() => {
        window.addEventListener('wheel', handleScroll);
        return () => window.removeEventListener('wheel', handleScroll);
    }, []);

    return (
        <SettingsProvider>
            <AppContainer className='appContainer' $maxWidth={APP_MAX_WIDTH}>
                <InfoBoxButton />
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
