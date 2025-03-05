import { PropsWithChildren, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { HEADERS_WIDTH, pxToScale, scale } from '../constants';

interface PreviewProps {
    $hasPicture: boolean;
}

const Preview = styled.div<PreviewProps>`
    display: flex;
    height: ${({ $hasPicture }) => scale($hasPicture ? 600 : 250)}svh;
    width: ${scale(600)}svh;
    padding: ${scale(30)}svh;
    gap: ${scale(20)}svh;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: ${scale(50)}svh;
    box-shadow: 0 0 ${scale(15)}svh ${scale(6)}svh rgba(0, 0, 0, 0.4);
    background: white;
    color: black;
    border-radius: ${scale(40)}svh;

    & > img {
        object-fit: contain;
        max-height: 75%;
        max-width: 75%;
    }
`;

export const ChapterPreview: React.FC<
    React.ComponentProps<'div'> & PropsWithChildren<PreviewProps>
> = props => {
    const previewRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = previewRef.current;
        if (!element) return;

        const adjustPosition = () => {
            const { left: leftSrc } = element.getBoundingClientRect();
            const left = pxToScale(leftSrc);
            const padding = 50;
            const width = 600 / 2;
            const documentWidth = pxToScale(document.body.scrollWidth);

            const adjustX =
                left + width > documentWidth
                    ? documentWidth - (left + width)
                    : left - width < HEADERS_WIDTH
                    ? left
                    : 0;

            if (adjustX !== 0) {
                element.style.transform = `translateX(${scale(
                    adjustX - padding
                )}svh)`;
            }
        };

        adjustPosition();
    }, []);

    return <Preview ref={previewRef} {...props} />;
};
