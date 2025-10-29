import { PropsWithChildren } from 'react';
import styled from 'styled-components';
import { CSS } from 'styled-components/dist/types';

import { scale } from '../helpers';
import {
    SETTINGS_FUNCTIONS,
    SettingsValues,
    useSettings,
} from '../providers/SettingsProvider';
import { ThumbnailImage } from './ThumbnailImage';
import { Tooltip } from './Tooltip';

const ButtonSection = styled.div`
    display: flex;
    position: fixed;
    background: rgba(0, 0, 0, 0.25);
    flex-direction: column;
    padding: ${scale(25)};
    border-radius: ${scale(40)};
    gap: ${scale(40)};
    top: ${scale(63)};
    right: ${scale(63)};
    z-index: 100;

    & > div > img {
        width: ${scale(160)};
        filter: drop-shadow(0 0 ${scale(16)} rgba(0, 0, 0, 1));
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
    border-radius: ${scale(40)};
    padding: ${scale(25)};
    font-size: ${scale(60)};
    gap: ${scale(40)};
`;

export const FloatingButtons: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <ButtonSection className='floatingButtons'>{children}</ButtonSection>
    );
};

type ButtonProps = {
    filename: string;
    title: string;
    option: keyof SettingsValues;
    cursor?: CSS.Property.Cursor;
};

export const FloatingButton: React.FC<PropsWithChildren<ButtonProps>> = ({
    filename,
    title,
    option,
    cursor = 'pointer',
}) => {
    const settings = useSettings();
    const value = settings[option];
    const setter = settings[SETTINGS_FUNCTIONS[option]];

    const filter = value
        ? 'drop-shadow(0 0 3px white) drop-shadow(0 0 5px white)'
        : undefined;

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
                onClick={() => setter(p => !p)}
                title={title}
                style={{ cursor, filter }}
            />
        </Tooltip>
    );
};
