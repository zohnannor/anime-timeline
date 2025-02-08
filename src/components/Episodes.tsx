import styled from 'styled-components';

import { EPISODE_THUMBNAILS, SCALE } from '../constants';
import { Container } from './Container';

const Episode = styled.div<{ $src: string }>`
    background-image: url(${({ $src }) => $src});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    max-height: ${SCALE * 242}px;
`;

export const Episodes: React.FC = () => (
    <Container>
        {EPISODE_THUMBNAILS.map(v => (
            <Container key={v}>
                <Episode $src={v} />
            </Container>
        ))}
    </Container>
);
