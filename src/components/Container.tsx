import styled from 'styled-components';

interface ContainerProps {
    $dir?: 'row' | 'column';
}

export const Container = styled.div<ContainerProps>`
    display: flex;
    flex-direction: ${({ $dir: dir }) => dir ?? 'row'};
`;

export const TimelineContainer = styled(Container)`
    position: relative;
    z-index: 1;
    &:hover {
        z-index: 2;
    }
`;
