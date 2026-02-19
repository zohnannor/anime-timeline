import { PropsWithChildren } from 'react';

import {
    CrossLines,
    CrossLinesProps,
} from '@modules/timeline/CrossLines/CrossLines';

export const withCrossLines = <P,>(
    StyledComponent: React.ComponentType<P>,
): React.FC<P & CrossLinesProps> =>
    function withCrossLines({
        children,
        $crossLinesVisible,
        ...rest
    }: PropsWithChildren<P & CrossLinesProps>) {
        return (
            <StyledComponent {...(rest as P)}>
                {children}
                <CrossLines $crossLinesVisible={$crossLinesVisible} />
            </StyledComponent>
        );
    };
