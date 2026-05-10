import CSS from 'csstype';
import { PropsWithChildren, useSyncExternalStore } from 'react';
import ReactDOM from 'react-dom';
import styled, { css } from 'styled-components';

import { MOBILE_BREAKPOINT } from '@shared/config/ui';
import { HeaderButton } from '@shared/ui/Modal';

const ShadowOverlay = styled.div`
    position: fixed;
    inset: 0;
    z-index: 100;
    background: rgba(0, 0, 0, 0.6);
    cursor: pointer;
`;

type ModalContainerProps = {
    $bgColor?: CSS.Property.Color | undefined;
    $mobileFullscreen?: boolean | undefined;
};

const ModalContainer = styled.div<ModalContainerProps>`
    position: fixed;
    z-index: 100;
    left: 50%;
    top: 40%;
    background: ${({ $bgColor }) => $bgColor ?? 'black'};
    overflow-x: hidden;
    overflow-y: auto;
    transform: translate(-50%, -40%);
    user-select: none;
    max-height: 90svh;

    ${({ $mobileFullscreen }) =>
        $mobileFullscreen &&
        css`
            @media (max-width: ${MOBILE_BREAKPOINT}px) {
                height: 100svh;
                max-height: 100svh;
                inset: 0;
                transform: none;
            }
        `}
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    inset: 0;
    background: black;
    padding: 2rem;
    border-bottom: 0.1rem solid #333;
    z-index: 10;

    & svg {
        height: 2rem;
        width: 2rem;
    }

    @media (max-width: ${MOBILE_BREAKPOINT}px) {
        padding: 1rem;
        border-bottom-width: 0.06rem;

        & svg {
            height: 1.2rem;
            width: 1.2rem;
        }
    }
`;

const Title = styled.h2`
    margin: 0;

    @media (max-width: ${MOBILE_BREAKPOINT}px) {
        font-size: 1rem;
    }
`;

const HeaderButtonContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;

    @media (max-width: ${MOBILE_BREAKPOINT}px) {
        gap: 0.5rem;
    }
`;

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    modalRef?: React.RefObject<HTMLDivElement | null>;
    additionalButtons?: React.ReactNode;
} & ModalContainerProps;

export const Modal: React.FC<PropsWithChildren<ModalProps>> = ({
    isOpen,
    onClose,
    title,
    modalRef,
    additionalButtons,
    children,
    $bgColor,
    $mobileFullscreen,
}) => {
    const modalElement = useSyncExternalStore(
        () => () => {
            /* empty */
        },
        () => document.querySelector('#modal'),
        () => null,
    );

    if (!isOpen || !modalElement) {
        return null;
    }

    return ReactDOM.createPortal(
        <>
            <ShadowOverlay className='shadow' onClick={onClose} />
            <ModalContainer
                className='modalContainer'
                ref={modalRef}
                $bgColor={$bgColor}
                $mobileFullscreen={$mobileFullscreen}
            >
                {
                    <Header className='header'>
                        <Title className='title'>{title}</Title>
                        <HeaderButtonContainer>
                            {additionalButtons}
                            <HeaderButton onClick={onClose}>
                                &times;
                            </HeaderButton>
                        </HeaderButtonContainer>
                    </Header>
                }
                {children}
            </ModalContainer>
        </>,
        modalElement,
    );
};
