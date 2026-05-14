import { PropsWithChildren } from 'react';
import styled, { css } from 'styled-components';

import { MOBILE_BREAKPOINT } from '@shared/config';
import { useSimpleHover } from '@shared/lib/hooks';

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';
type TooltipAnimation = 'fade' | 'grow';

type TooltipProps = {
    placement: TooltipPlacement;
    content: React.ReactNode;
    animation?: TooltipAnimation;
    visible?: boolean;
};

type TooltipWrapperProps = {
    $placement: TooltipPlacement;
};

type TooltipContentProps = TooltipWrapperProps & {
    $visible: boolean;
    $animation?: TooltipAnimation;
};

const OPPOSITE: Record<TooltipPlacement, TooltipPlacement> = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
};

const TooltipWrapper = styled.div<TooltipWrapperProps>`
    position: relative;
    display: flex;
    height: 100%;

    ${({ $placement }) =>
        ['top', 'bottom'].includes($placement) &&
        css`
            justify-content: center;
        `}

    ${({ $placement }) =>
        ['left', 'right'].includes($placement) &&
        css`
            align-items: center;
        `}
`;

const TooltipContent = styled.div.attrs<TooltipContentProps>(
    ({ $placement }) => ({
        style: {
            [OPPOSITE[$placement]]: '4rem',
        },
    }),
)`
    pointer-events: none;
    position: absolute;
    display: flex;
    color: white;
    line-height: 1;

    z-index: 100;

    ${({ $animation, $visible, $placement }) =>
        $animation === 'fade' ?
            css`
                opacity: ${$visible ? 1 : 0};
                transition: opacity 0.2s ease-in-out;
            `
        :   css`
                transform: scale(${$visible ? 1 : 0});
                transform-origin: ${OPPOSITE[$placement]};
                transition: all 0.2s ease-in-out;
            `}

    @media (max-width: ${MOBILE_BREAKPOINT}px) {
        font-size: 0.8rem;
    }
`;

export const Tooltip: React.FC<PropsWithChildren<TooltipProps>> = ({
    children,
    content,
    placement,
    animation = 'fade',
    visible,
}) => {
    const [hovered, handlers] = useSimpleHover();

    return (
        <TooltipWrapper
            className='tooltipWrapper'
            $placement={placement}
            {...(visible === undefined ? handlers() : {})}
        >
            <TooltipContent
                className='tooltipContent'
                $animation={animation}
                $visible={visible ?? hovered()}
                $placement={placement}
            >
                {content}
            </TooltipContent>
            {children}
        </TooltipWrapper>
    );
};
