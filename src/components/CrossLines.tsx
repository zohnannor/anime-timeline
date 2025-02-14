import { FC, PropsWithChildren } from 'react';
import styled from 'styled-components';

import { useSettings } from '../providers/SettingsProvider';

interface CrossLinesProps {
    $visible?: boolean | undefined;
}

const CrossLinesWrapper = styled.div<CrossLinesProps>`
    position: absolute;
    top: 0;
    left: 0;
    z-index: ${({ $visible }) => ($visible ? 5 : 1)};
    width: 100%;
    height: 0px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
`;

const CrossLine = styled.div`
    height: 200vh;
    position: relative;
    top: -100vh;
    box-shadow: 0 0 2px 2px rgba(255, 0, 0, 0.8);
`;

export const CrossLines: FC<CrossLinesProps> = ({ $visible }) => {
    const settings = useSettings();

    const crosslinesVisible = settings?.showCrosslines && $visible;

    return (
        <CrossLinesWrapper className='crosslines' $visible={crosslinesVisible}>
            {crosslinesVisible ? (
                <>
                    <CrossLine />
                    <CrossLine />
                </>
            ) : (
                <></>
            )}
        </CrossLinesWrapper>
    );
};

export const withCrossLines = <T extends PropsWithChildren<CrossLinesProps>>(
    StyledComponent: React.ComponentType<T>
): React.FC<T & CrossLinesProps> => {
    return (props: T) => (
        <StyledComponent {...props}>
            {props.children}
            <CrossLines $visible={props?.$visible} />
        </StyledComponent>
    );
};
