import styled from 'styled-components';

import { SCALE, VOLUME_COVERS } from '../constants';
import { Chapters } from './Chapters';
import { Container } from './Container';

interface VolumeProps {
    $src: string;
}

export const Volume = styled.div<VolumeProps>`
    background-image: url(${({ $src }) => $src});
    background-size: cover;
    background-position: center;
    box-shadow: inset 0px 0px 3px 2px rgba(0, 0, 0, 1);

    /* Invisible image that maintains aspect ratio */
    img {
        opacity: 0;
        height: ${SCALE * 1579}px;
        display: block;
    }
`;

export const Volumes: React.FC = () => (
    <Container>
        {VOLUME_COVERS.map((cover, idx) => (
            <Container $dir='column' key={cover} $flexGrow={1}>
                <Chapters $volume={idx + 1} />
                {cover && (
                    <Volume $src={cover}>
                        <img src={cover} alt='' />
                    </Volume>
                )}
            </Container>
        ))}
    </Container>
);
