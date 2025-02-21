import { PropsWithChildren } from 'react';
import styled from 'styled-components';
import { CSS } from 'styled-components/dist/types';

import { scale } from '../constants';
import { FunctionSettings, useSettings } from '../providers/SettingsProvider';
import { ThumbnailImage } from './ThumbnailImage';
import { Tooltip } from './Tooltip';

const ButtonSection = styled.div`
    display: flex;
    position: fixed;
    background: rgba(0, 0, 0, 0.25);
    flex-direction: column;
    padding: ${scale(25)}svh;
    border-radius: ${scale(40)}svh;
    gap: ${scale(40)}svh;
    top: ${scale(63)}svh;
    right: ${scale(63)}svh;
    z-index: 100;

    & > div > img {
        width: ${scale(160)}svh;
        height: ${scale(160)}svh;
        filter: drop-shadow(0 0 ${scale(16)}svh rgba(0, 0, 0, 1));
    }

    & > div > img:hover {
        transform: scale(1.05);
    }
`;

const FloatingButtonTooltip = styled.div`
    display: flex;
    white-space: nowrap;
    width: 100%;
    background: rgba(0, 0, 0, 0.5);
    border-radius: ${scale(40)}svh;
    padding: ${scale(25)}svh;
    font-size: ${scale(60)}svh;
    gap: ${scale(40)}svh;
`;

export const FloatingButtons: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <ButtonSection className='floatingButtons'>{children}</ButtonSection>
    );
};

interface ButtonProps {
    filename: string;
    title: string;
    option: keyof FunctionSettings;
    cursor?: CSS.Property.Cursor;
}

export const FloatingButton: React.FC<PropsWithChildren<ButtonProps>> = ({
    filename,
    title,
    option,
    cursor = 'pointer',
}) => {
    const settings = useSettings();
    const selectedOption = settings[option];

    return (
        <Tooltip
            placement='left'
            content={
                <FloatingButtonTooltip className='floatingButtonTooltip'>
                    {title}
                </FloatingButtonTooltip>
            }
        >
            <ThumbnailImage
                src={filename}
                onClick={() => selectedOption(p => !p)}
                title={title}
                style={{ cursor }}
            />
        </Tooltip>
    );
};
