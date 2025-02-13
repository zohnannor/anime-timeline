import { useEffect } from 'react';

import { Arcs } from './components/Arcs';
import { Container } from './components/Container';
import { Scroller } from './components/Scroller';
import { Seasons } from './components/Seasons';
import { Timeline } from './components/Timeline';
import { Volumes } from './components/Volumes';
import useWindowSize from './hooks/useWindowSize';

const App: React.FC = () => {
    const { width } = useWindowSize();

    const handleScroll = (e: WheelEvent) => {
        document.body.scrollLeft += e.deltaY;
    };

    useEffect(() => {
        window.addEventListener('wheel', handleScroll);
        return () => {
            window.removeEventListener('wheel', handleScroll);
        };
    }, []);

    return (
        <Container $dir='column'>
            <Seasons />
            <Arcs />
            <Timeline />
            <Volumes />
            {width > 768 && <Scroller />}
        </Container>
    );
};

export default App;
