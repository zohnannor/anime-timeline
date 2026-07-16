import styled from 'styled-components';

import { MOBILE_BREAKPOINT } from '@shared/config';
import {
    SETTINGS_FUNCTIONS,
    SettingsValues,
    useSettings,
} from '@shared/contexts/SettingsContext';
import { IconButton, Tooltip } from '@shared/ui';
import { FloatingButtonConfig } from '@timelines/index';
import { Icon, Icons } from '@timelines/types';

const FloatingButtonTooltip = styled.div`
    display: flex;
    white-space: nowrap;
    width: 100%;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 0.8rem;
    padding: 0.5rem;
    font-size: 1.2rem;
    gap: 0.8rem;

    @media (max-width: ${MOBILE_BREAKPOINT}px) {
        font-size: 0.8rem;
        padding: 0.3rem;
        gap: 0.4rem;
    }
`;

const FloatingIconButton = styled(IconButton)`
    position: relative;
    cursor: pointer;
    &:hover {
        transform: scale(1.05);
    }
`;

type ButtonProps = Readonly<{
    icon: Icon;
    title: string;
    option: keyof SettingsValues;
}>;

const FloatingButton: React.FC<ButtonProps> = ({ icon, title, option }) => {
    const settings = useSettings();
    const isEnabled = settings[option];
    const setter = settings[SETTINGS_FUNCTIONS[option]];

    const filter =
        isEnabled ?
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

    @media (max-width: ${MOBILE_BREAKPOINT}px) {
        padding: 0.3rem;
        border-radius: 0.5rem;
        gap: 0.4rem;
        top: 0.6rem;
        right: 0.6rem;
    }
`;

type FloatingButtonsProps = Readonly<{
    buttons: readonly FloatingButtonConfig[];
    icons: Icons;
}>;

export const FloatingButtons: React.FC<FloatingButtonsProps> = ({
    buttons,
    icons,
}) => (
    <ButtonSection className='floatingButtons'>
        {buttons.map(({ icon, title, option }) => (
            <FloatingButton
                key={icon}
                icon={icons[icon]}
                option={option}
                title={title}
            />
        ))}
    </ButtonSection>
);
