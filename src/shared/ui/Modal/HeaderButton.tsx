import styled from 'styled-components';

import { MOBILE_BREAKPOINT } from '@shared/config/ui';

export const HeaderButton = styled.span`
    position: sticky;
    inset: 0;
    cursor: pointer;
    font-size: 2rem;
    top: 2rem;
    right: 2rem;
    z-index: 101;
    float: left;
    margin-left: 2rem;

    @media (max-width: ${MOBILE_BREAKPOINT}px) {
        font-size: 1.2rem;
        top: 1rem;
        right: 1rem;
        margin-left: 1rem;
    }
`;
