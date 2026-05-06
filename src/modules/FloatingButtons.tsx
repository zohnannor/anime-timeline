import { PropsWithChildren } from 'react';
import styled from 'styled-components';

import {
    SETTINGS_FUNCTIONS,
    SettingsValues,
    useSettings,
} from '@shared/contexts/SettingsContext';
import { IconButton, Tooltip } from '@shared/ui';
import { Icon } from '@timelines/types';

const ButtonSection = styled.div`
    display: flex;
    position: fixed;
    background: rgba(0, 0, 0, 0.25);
    flex-direction: column;
    padding: 0.5rem;
    border-radius: 0.8rem;
    gap: 0.8rem;
    top: 1.26rem;
    right: 1.26rem;
    z-index: 100;
`;

const FloatingButtonTooltip = styled.div`
    display: flex;
    white-space: nowrap;
    width: 100%;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 0.8rem;
    padding: 0.5rem;
    font-size: 1.2rem;
    gap: 0.8rem;
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
