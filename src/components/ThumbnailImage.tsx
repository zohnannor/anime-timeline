import { useState } from 'react';
import styled from 'styled-components';
import { CSS } from 'styled-components/dist/types';

import { scale } from '../helpers';
import { useSettings } from '../providers/SettingsProvider';

type Offset = {
    $offsetX?: number | undefined;
    $offsetY?: number | undefined;
    $defaultPosition?: CSS.Property.ObjectPosition | undefined;
};

type ThumbnailProps = {
    $thumbnail: string;
};

const Thumbnail = styled.div.attrs<ThumbnailProps & Offset>(
    ({ $thumbnail }) => ({
        style: {
            backgroundImage: `url("${$thumbnail}")`,
        },
    })
)`
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    filter: blur(${scale(20)});
    background-position: ${({ $offsetX, $offsetY }) =>
        `${scale($offsetX ?? 0)}
         ${scale($offsetY ?? 0)}`};
`;

type ImageProps = {
    $loading: boolean;
};

export const Image = styled.img<ImageProps & Offset>`
    filter: blur(${({ $loading }) => scale($loading ? 10 : 0)});
    transition: filter 0.4s ease-in-out;
    object-position: ${({ $offsetX, $offsetY, $defaultPosition = 'center' }) =>
        $offsetX || $offsetY
            ? `${scale($offsetX !== undefined ? -$offsetX : 0)}
               ${scale($offsetY !== undefined ? -$offsetY : 0)}`
            : $defaultPosition}; // TODO: refactor?
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
        $defaultPosition,
        animeTitle = currentAnimeTitle,
        ...rest
    } = props;

    const realSrc = `./${animeTitle}/${src}.webp`;
    const thumbnailSrc = `./${animeTitle}-thumbnails/${src}.webp`;

    return (
        <>
            <Image
                className='thumbnailImage'
                src={realSrc}
                alt=''
                loading='lazy'
                $loading={loading}
                onLoad={() => setLoading(false)}
                $offsetX={$offsetX}
                $offsetY={$offsetY}
                $defaultPosition={$defaultPosition}
                draggable={false}
                {...rest}
            />
            {loading && (
                <Thumbnail
                    className='thumbnail'
                    $thumbnail={thumbnailSrc}
                    $offsetX={$offsetX ? -$offsetX : $offsetX}
                    $offsetY={$offsetY ? -$offsetY : $offsetY}
                    $defaultPosition={$defaultPosition}
                    draggable={false}
                />
            )}
        </>
    );
};
