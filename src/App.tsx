import { useEffect } from 'react';
import { Arcs } from './components/Arcs';
import { Container } from './components/Container';
import { Seasons } from './components/Seasons';
import { Volumes } from './components/Volumes';
import { Scroller } from './components/Scroller';
import useWindowSize from './hooks/useWindowSize';

const App: React.FC = () => {
    const { width } = useWindowSize()

    const handleScroll = (e: WheelEvent) => {
        document.body.scrollLeft += e.deltaY;
    }

    useEffect(() => {
        window.addEventListener('wheel', handleScroll); 
        return () => {
            window.removeEventListener('wheel', handleScroll)    
        };
    }, []);

    return <Container $dir='column'>
        <Seasons />
        <Arcs />
        <Volumes />
        {width > 768 && <Scroller/>}
    </Container>
};

export default App;
