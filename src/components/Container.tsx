import styled from 'styled-components';
import type { Property } from 'csstype';
import { PropsWithChildren } from 'react';

interface ContainerProps {
    $wrap?: boolean;
    $dir?: 'row' | 'column';
    $width?: Property.Width;
    $height?: Property.Height;
    $justify?: Property.JustifyContent;
    $flexGrow?: Property.FlexGrow;
    $alignItems?: Property.AlignItems;
}

export const Container = styled.div<ContainerProps>`
    display: flex;
    flex-direction: ${({ $dir: dir }) => dir ?? 'row'};
    flex-wrap: ${({ $wrap: wrap }) => (wrap ? 'wrap' : 'nowrap')};
    flex-grow: ${({ $flexGrow: grow }) => grow ?? null};
    justify-content: ${({ $justify: justify }) => justify ?? 'flex-start'};
    align-items: ${({ $alignItems: alignItems }) => alignItems ?? 'flex-start'};
    white-space: nowrap;

    width: ${({ $width: width }) => width ?? null};
    height: ${({ $height: height }) => height ?? null};
`;
