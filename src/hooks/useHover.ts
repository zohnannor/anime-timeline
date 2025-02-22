import { useState } from 'react';
import { isMobileDevice } from '../util';

type Comparator = (item?: number) => boolean;

type Handlers = (item?: number) => {
    onMouseOver: (e: React.MouseEvent) => void;
    onMouseOut: () => void;
};

type UseHover = [Comparator, Handlers];

export function useHover(): UseHover {
    const [hoveredItem, setHoveredItem] = useState<number | null>(null);

    const hovered = (item?: number) => hoveredItem === (item ?? 1);

    if (isMobileDevice())
        return [
            () => false,
            () => ({
                onMouseOver: () => {},
                onMouseOut: () => {},
            }),
        ];

    const handlers = (item?: number) => ({
        onMouseOver: (e: React.MouseEvent) => {
            setHoveredItem(item ?? 1);
            e.stopPropagation();
        },
        onMouseOut: () => setHoveredItem(null),
    });

    return [hovered, handlers];
}
