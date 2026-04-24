import { FC, HTMLAttributes } from 'react';
import styled from 'styled-components';

import { scale } from '@shared/lib/helpers';
import { Icon } from '@timelines/types';

import { ThumbnailImage } from './ThumbnailImage';

const IconWrapper = styled.div<{
    $filter: string | undefined;
}>`
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform bottom 0.2s ease-in-out;

    & img,
    & svg,
    & div {
        width: ${scale(160)};
        height: auto;
        filter: ${({ $filter }) =>
            $filter ?? `drop-shadow(0 0 ${scale(16)} rgba(0, 0, 0, 0.5))`};
        pointer-events: none;
    }

    & svg {
        background: #c2c2c2;
        border: ${scale(5)} solid black;
        border-radius: 50%;
        box-sizing: border-box;
        height: ${scale(160)};
        padding: ${scale(20)};
    }

    & div {
        height: 100%;
        position: absolute;
        inset: 0;
    }
`;

type IconButtonProps = {
    icon: Icon;
    filter?: string | undefined;
} & HTMLAttributes<HTMLDivElement>;

export const IconButton: FC<IconButtonProps> = ({
    icon: Icon,
    filter,
    ...props
}) => (
    <IconWrapper $filter={filter} {...props}>
        {typeof Icon === 'string' ?
            <ThumbnailImage src={Icon} />
        :   <Icon />}
    </IconWrapper>
);
