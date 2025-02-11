import { PropsWithChildren } from 'react';
import { styled } from 'styled-components';

interface ShadowProps {
    $invertBorder?: boolean | undefined;
}

const Shadow = styled.div<ShadowProps>`
    position: absolute;
    width: 100%;
    height: 100%;
    box-shadow: inset 0px 0px 2px 2px
        ${({ $invertBorder }) =>
            $invertBorder ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)'};
    pointer-events: none;
`;

export const withShadow = <T extends PropsWithChildren<ShadowProps>>(
    StyledComponent: React.ComponentType<T>
): React.FC<T & ShadowProps> => {
    return (props: T) => (
        <StyledComponent {...props}>
            {props.children}
            <Shadow $invertBorder={props?.$invertBorder} />
        </StyledComponent>
    );
};
