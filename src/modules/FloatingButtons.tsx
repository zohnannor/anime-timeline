import { PropsWithChildren } from 'react';
import styled from 'styled-components';

import {
    SETTINGS_FUNCTIONS,
    SettingsValues,
    useSettings,
} from '@shared/contexts/SettingsContext';
import { scale } from '@shared/lib/helpers';
import { IconButton, Tooltip } from '@shared/ui';
import { Icon } from '@timelines/types';

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

export const FloatingButtons: React.FC<PropsWithChildren> = ({ children }) => (
    <ButtonSection className='floatingButtons'>{children}</ButtonSection>
);

const FloatingIconButton = styled(IconButton)`
    position: relative;
    cursor: pointer;
    &:hover {
        transform: scale(1.05);
    }
`;

type ButtonProps = {
    icon: Icon;
    title: string;
    option: keyof SettingsValues;
};

export const FloatingButton: React.FC<ButtonProps> = ({
    icon,
    title,
    option,
}) => {
    const settings = useSettings();
    const value = settings[option];
    const setter = settings[SETTINGS_FUNCTIONS[option]];

    const filter =
        value ?
            'drop-shadow(0 0 3px white) drop-shadow(0 0 5px white)'
        :   undefined;

    return (
        <Tooltip
            placement='left'
            content={
                <FloatingButtonTooltip className='floatingButtonTooltip'>
                    {title}
                </FloatingButtonTooltip>
            }
        >
            <FloatingIconButton
                icon={icon}
                onClick={() => setter(state => !state)}
                filter={filter}
            />
        </Tooltip>
    );
};
