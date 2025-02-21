import { PropsWithChildren } from 'react';
import styled, { css } from 'styled-components';
import { useHover } from '../hooks/useHover';
import { scale } from '../constants';

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';
type TooltipAnimation = 'fade' | 'grow';

interface TooltipProps {
    placement: TooltipPlacement;
    content: React.ReactNode;
    animation?: TooltipAnimation;
    visible?: boolean;
}

interface TooltipWrapperProps {
    $placement: TooltipPlacement;
}

interface TooltipContentProps extends TooltipWrapperProps {
    $visible: boolean;
    $animation?: TooltipAnimation;
}

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
    ({ $placement }) => {
        return {
            style: {
                [OPPOSITE[$placement]]: `${scale(200)}svh`,
            },
        };
    }
)`
    pointer-events: none;
    position: absolute;
    display: flex;
    color: white;
    line-height: 1;

    z-index: 100;

    ${({ $animation, $visible, $placement }) =>
        $animation === 'fade'
            ? css`
                  opacity: ${$visible ? 1 : 0};
                  transition: opacity 0.2s ease-in-out;
              `
            : css`
                  transform: scale(${$visible ? 1 : 0});
                  /* ${['top', 'bottom'].includes($placement)
                      ? 'translateY(-10px)'
                      : ''}
                      ${['left', 'right'].includes($placement)
                      ? 'translateX(-10px)'
                      : ''} */
                  transform-origin: ${OPPOSITE[$placement]};
                  transition: all 0.2s ease-in-out;
              `}
`;

export const Tooltip: React.FC<PropsWithChildren<TooltipProps>> = ({
    children,
    content,
    placement,
    animation = 'fade',
    visible,
}) => {
    const [hovered, handlers] = useHover();

    return (
        <TooltipWrapper
            className='tooltipWrapper'
            $placement={placement}
            {...(visible !== undefined ? {} : { ...handlers() })}
        >
            <TooltipContent
                className='tooltipContent'
                $animation={animation}
                $visible={visible !== undefined ? visible : hovered()}
                $placement={placement}
            >
                {content}
            </TooltipContent>
            {children}
        </TooltipWrapper>
    );
};
