import styled from 'styled-components';

interface ContainerProps {
    $dir?: 'row' | 'column';
}

export const Container = styled.div<ContainerProps>`
    display: flex;
    flex-direction: ${({ $dir: dir }) => dir ?? 'row'};
`;
