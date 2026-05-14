import styled from 'styled-components';

import { MOBILE_BREAKPOINT } from '@shared/config';

export const IconWrapper = styled.div<{ $filter?: string | undefined }>`
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform bottom 0.2s ease-in-out;

    & img,
    & svg,
    & div {
        width: 3.2rem;
        height: auto;
        filter: ${({ $filter }) =>
            $filter ?? `drop-shadow(0 0 0.32rem rgba(0, 0, 0, 0.5))`};
        pointer-events: none;
    }

    & svg {
        background: #c2c2c2;
        border: 0.1rem solid black;
        border-radius: 50%;
        box-sizing: border-box;
        height: 3.2rem;
        padding: 0.4rem;
    }

    & div {
        height: 100%;
        position: absolute;
        inset: 0;
    }

    @media (max-width: ${MOBILE_BREAKPOINT}px) {
        & img,
        & svg,
        & div {
            width: 2rem;
        }

        & svg {
            height: 2rem;
            padding: 0.25rem;
            border-width: 0.06rem;
        }
    }
`;
