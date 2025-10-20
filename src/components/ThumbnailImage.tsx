import { useState } from 'react';
import styled, { css } from 'styled-components';

import { scale } from '../helpers';
import { useSettings } from '../providers/SettingsProvider';

interface Offset {
    $offsetX?: number | undefined;
    $offsetY?: number | undefined;
}

interface ThumbnailProps {
    $thumbnail: string;
}

const Thumbnail = styled.div<ThumbnailProps & Offset>`
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    filter: blur(${scale(10)});
    background-image: url(${({ $thumbnail }) => $thumbnail});
    background-position: ${({ $offsetX, $offsetY }) =>
        `${scale($offsetX ?? 0)}
         ${scale($offsetY ?? 0)}`};
`;

interface ImageProps {
    $loading: boolean;
}

export const Image = styled.img<ImageProps & Offset>`
    filter: blur(${({ $loading }) => scale($loading ? 10 : 0)});
    transition: filter 0.4s ease-in-out;
    ${({ $offsetX, $offsetY }) =>
        ($offsetX || $offsetY) &&
        css`
            object-position: ${scale($offsetX ? -$offsetX : 0)}
                ${scale($offsetY ? -$offsetY : 0)} !important;
        `}; // TODO: refactor?
`;

export const ThumbnailImage: React.FC<
    React.ComponentProps<'img'> & Offset & { animeTitle?: string }
> = props => {
    const { animeTitle: currentAnimeTitle } = useSettings();
    const [loading, setLoading] = useState(true);
    const {
        src,
        $offsetX,
        $offsetY,
        animeTitle = currentAnimeTitle,
        ...rest
    } = props;

    const realSrc = `./${animeTitle}/${src}.webp`;
    const thumbnailSrc = `./${animeTitle}-thumbnails/${src}.webp`;

    return (
        <>
            {loading && (
                <Thumbnail
                    className='thumbnail'
                    $thumbnail={thumbnailSrc}
                    $offsetX={$offsetX ? -$offsetX : $offsetX}
                    $offsetY={$offsetY ? -$offsetY : $offsetY}
                    draggable={false}
                />
            )}
            <Image
                className='thumbnailImage'
                src={realSrc}
                alt=''
                loading='lazy'
                $loading={loading}
                onLoad={() => setLoading(false)}
                $offsetX={$offsetX}
                $offsetY={$offsetY}
                draggable={false}
                {...rest}
            />
        </>
    );
};
