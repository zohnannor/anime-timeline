import styled from 'styled-components';

type ContainerProps = {
    $dir?: 'row' | 'column';
};

export const TimelineContainer = styled.div.attrs<ContainerProps>({
    className: 'timelineContainer',
})`
    display: flex;
    flex-direction: ${({ $dir: dir }) => dir ?? 'row'};
    position: relative;
`;
