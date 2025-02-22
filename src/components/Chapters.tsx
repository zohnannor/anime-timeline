import styled, { css } from 'styled-components';

import { scale } from '../constants';

interface PreviewProps {
    $firstChapter: boolean;
    $hasPicture: boolean;
}

export const Preview = styled.div<PreviewProps>`
    display: flex;
    height: ${({ $hasPicture }) => scale($hasPicture ? 600 : 250)}svh;
    width: ${scale(600)}svh;
    padding: ${scale(30)}svh;
    gap: ${scale(20)}svh;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: ${scale(50)}svh;
    box-shadow: 0 0 ${scale(15)}svh ${scale(6)}svh rgba(0, 0, 0, 0.4);
    background: white;
    color: black;
    border-radius: ${scale(40)}svh;

    ${({ $firstChapter }) =>
        $firstChapter &&
        css`
            transform: translateX(${scale(200)}svh);
        `}

    & > img {
        object-fit: contain;
        max-height: 75%;
        max-width: 75%;
    }
`;
