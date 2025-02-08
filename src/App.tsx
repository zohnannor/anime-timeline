import { Arcs } from './components/Arcs';
import { Container } from './components/Container';
import { Seasons } from './components/Seasons';
import { Volumes } from './components/Volumes';

const App: React.FC = () => {
    return (
        <Container $wrap $dir='column'>
            <Seasons />
            <Arcs />
            <Volumes />
        </Container>
    );
};

export default App;
