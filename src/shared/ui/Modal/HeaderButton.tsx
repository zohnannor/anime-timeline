import styled from 'styled-components';

import { scale } from '@shared/lib/helpers';

export const HeaderButton = styled.span`
    position: sticky;
    inset: 0;
    cursor: pointer;
    font-size: ${scale(100)};
    top: ${scale(100)};
    right: ${scale(100)};
    z-index: 101;
    float: left;
    margin-left: ${scale(100)};
`;
