import { Arcs } from './components/Arcs';
import { Container } from './components/Container';
import { Seasons } from './components/Seasons';
import { Volumes } from './components/Volumes';

const App: React.FC = () => (
    <Container $dir='column'>
        <Seasons />
        <Arcs />
        <Volumes />
    </Container>
);

export default App;
