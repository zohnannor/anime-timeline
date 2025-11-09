import { PropsWithChildren } from 'react';
import ReactDOM from 'react-dom';
import styled, { css } from 'styled-components';
import { CSS } from 'styled-components/dist/types';

import { scale } from '../helpers';

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
            @media (max-width: 480px) {
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
    padding: ${scale(100)};
    border-bottom: ${scale(5)} solid #333;

    & svg {
        height: ${scale(100)};
        width: ${scale(100)};
    }
`;

const Title = styled.h2`
    margin: 0;
`;

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

const HeaderButtonContainer = styled.div`
    display: flex;
    align-items: center;
    gap: ${scale(50)};
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
    if (!isOpen) return null;

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
        document.querySelector('#modal')!
    );
};
