import styled from 'styled-components';

import { scale } from '@shared/lib/helpers';
import { Icon } from '@timelines/types';

import { ThumbnailImage } from './ThumbnailImage';

type IconWrapperProps = {
    $filter: string | undefined;
};

const IconWrapper = styled.div<IconWrapperProps>`
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
    animeTitle?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const IconButton: React.FC<IconButtonProps> = ({
    icon: Icon,
    filter,
    animeTitle,
    ...props
}) => (
    <IconWrapper $filter={filter} {...props}>
        {typeof Icon === 'string' ?
            <ThumbnailImage {...props} animeTitle={animeTitle} src={Icon} />
        :   <Icon {...props} />}
    </IconWrapper>
);
