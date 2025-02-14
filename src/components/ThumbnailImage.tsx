import { useState } from 'react';
import styled from 'styled-components';

import { scale } from '../constants';

interface Offset {
    $offsetX?: number | undefined;
    $offsetY?: number | undefined;
}

interface ThumbnailProps {
    $thumbnail: string;
}

const Thumbnail = styled.div<ThumbnailProps & Offset>`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    filter: blur(3px);
    background-image: url(${({ $thumbnail }) => $thumbnail});
    background-position: ${({ $offsetX, $offsetY }) =>
        `${-scale($offsetX ?? 0)}svh ${-scale($offsetY ?? 0)}svh`};
`;

interface ImageProps {
    $loading: boolean;
}

const Image = styled.img<ImageProps & Offset>`
    filter: blur(${({ $loading }) => ($loading ? 3 : 0)}px);
    transition: filter 0.4s ease-in-out;
    object-position: ${({ $offsetX, $offsetY }) =>
        `${-scale($offsetX ?? 0)}svh ${-scale($offsetY ?? 0)}svh`};
`;

export const ThumbnailImage: React.FC<
    React.ComponentProps<'img'> & Offset
> = props => {
    const [loading, setLoading] = useState(true);
    const { src, $offsetX, $offsetY, ...rest } = props;

    const realSrc = `./csm/${src}.webp`;
    const thumbnailSrc = `./thumbnails/${src}.webp`;

    return (
        <>
            {loading && (
                <Thumbnail
                    $thumbnail={thumbnailSrc}
                    $offsetX={$offsetX}
                    $offsetY={$offsetY}
                />
            )}
            <Image
                src={realSrc}
                loading='lazy'
                $loading={loading}
                onLoad={() => setLoading(false)}
                $offsetX={$offsetX}
                $offsetY={$offsetY}
                {...rest}
            />
        </>
    );
};
