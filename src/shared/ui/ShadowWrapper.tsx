import { PropsWithChildren } from 'react';
import styled from 'styled-components';

import { MOBILE_BREAKPOINT } from '@shared/config/ui';

type ShadowProps = {
    $invertBorder?: boolean | undefined;
};

// vscode-styled-components (ts-styled-plugin) extension formats this
// incorrectly and complains afterwards when this function is inlined
const getShadowColor = ({ $invertBorder }: ShadowProps) =>
    $invertBorder ? '#fff' : '#000';

const Shadow = styled.div<ShadowProps>`
    position: absolute;
    width: 100%;
    height: 100%;
    // TODO: maybe replace with:
    /* border: 0.1rem solid ${getShadowColor}; */
    box-shadow: inset 0 0 0 0.1rem ${getShadowColor};
    pointer-events: none;

    @media (max-width: ${MOBILE_BREAKPOINT}px) {
        box-shadow: inset 0 0 0 0.06rem ${getShadowColor};
    }
`;

export const withShadow = <P,>(
    StyledComponent: React.ComponentType<P>,
): React.FC<P & ShadowProps> =>
    function withShadow({
        children,
        $invertBorder,
        ...rest
    }: PropsWithChildren<P & ShadowProps>) {
        return (
            <StyledComponent {...(rest as P)}>
                {children}
                <Shadow className='shadow' $invertBorder={$invertBorder} />
            </StyledComponent>
        );
    };
