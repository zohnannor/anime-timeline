import { PropsWithChildren } from 'react';
import { styled } from 'styled-components';

import { scale } from '../constants';

interface ShadowProps {
    $invertBorder?: boolean | undefined;
}

const Shadow = styled.div<ShadowProps>`
    position: absolute;
    width: 100%;
    height: 100%;
    box-shadow: inset 0 0 0 ${scale(5)}svh
        ${({ $invertBorder }) => ($invertBorder ? '#ffffff' : '#000000')};
    pointer-events: none;
`;

export const withShadow = <P,>(
    StyledComponent: React.ComponentType<P>
): React.FC<P & ShadowProps> => {
    return ({
        children,
        $invertBorder,
        ...rest
    }: PropsWithChildren<P & ShadowProps>) => (
        <StyledComponent {...(rest as P)}>
            {children}
            <Shadow className='shadow' $invertBorder={$invertBorder} />
        </StyledComponent>
    );
};
