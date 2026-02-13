import React, { PropsWithChildren } from 'react';
import styled, { css } from 'styled-components';

import { scale } from '../../shared/lib/helpers';
import { useSettings } from '../../app/providers/SettingsProvider';

type CrossLinesProps = {
    $crossLinesVisible?: boolean | undefined;
};

const CrossLinesWrapper = styled.div<CrossLinesProps>`
    position: absolute;
    top: 0;
    left: 0;
    z-index: ${({ $crossLinesVisible }) => ($crossLinesVisible ? 5 : 1)};
    width: 100%;
    height: 0;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
`;

type CrossLineProps = {
    $side: 'left' | 'right';
};

const CrossLine = styled.div<CrossLineProps>`
    position: relative;
    height: 200svh;
    top: -100svh;
    box-shadow: 0 0 ${scale(6)} ${scale(6)} rgba(255, 0, 0, 0.8);

    &::after {
        content: '';
        display: block;
        position: absolute;
        pointer-events: none;

        ${({ $side }) =>
            $side === 'right' ?
                css`
                    left: 0;
                `
            :   css`
                    right: 0;
                `}

        top: 0;
        height: 200svh;
        width: 100svw;
        background: rgba(0, 0, 0, 0.5);
    }
`;

export const CrossLines: React.FC<CrossLinesProps> = ({
    $crossLinesVisible,
}) => {
    const { showCrosslines } = useSettings();

    const crossLinesVisible = showCrosslines && $crossLinesVisible;

    return (
        <CrossLinesWrapper
            className='crosslines'
            $crossLinesVisible={crossLinesVisible}
        >
            {crossLinesVisible && (
                <>
                    <CrossLine className='crosslineLeft' $side='left' />
                    <CrossLine className='crosslineRight' $side='right' />
                </>
            )}
        </CrossLinesWrapper>
    );
};

export const withCrossLines = <P,>(
    StyledComponent: React.ComponentType<P>,
): React.FC<P & CrossLinesProps> => {
    return ({
        children,
        $crossLinesVisible,
        ...rest
    }: PropsWithChildren<P & CrossLinesProps>) => (
        <StyledComponent {...(rest as P)}>
            {children}
            <CrossLines $crossLinesVisible={$crossLinesVisible} />
        </StyledComponent>
    );
};
