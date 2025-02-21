import { PropsWithChildren } from 'react';
import styled from 'styled-components';

import { scale } from '../constants';

const ButtonSection = styled.div`
    display: flex;
    position: fixed;
    background: rgba(0, 0, 0, 0.25);
    flex-direction: column;
    padding: ${scale(25)}svh;
    border-radius: ${scale(40)}svh;
    gap: ${scale(40)}svh;
    top: ${scale(63)}svh;
    right: ${scale(63)}svh;
    z-index: 100;

    & > img {
        width: ${scale(160)}svh;
        height: ${scale(160)}svh;
        filter: drop-shadow(0 0 ${scale(16)}svh rgba(0, 0, 0, 1));
    }

    & > img:hover {
        transform: scale(1.05);
    }
`;

export const FloatingButtons: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <ButtonSection className='floatingButtons'>{children}</ButtonSection>
    );
};
