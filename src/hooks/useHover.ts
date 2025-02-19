import { useState } from 'react';

export function useHover(): [number, (item: number) => any] {
    const [hoveredItem, setHoveredItem] = useState(0);

    const handlers = (item: number) => ({
        onMouseOver: (e: React.MouseEvent) => {
            setHoveredItem(item);
            e.stopPropagation();
        },
        onMouseOut: () => {
            setHoveredItem(0);
        },
    });

    return [hoveredItem, handlers];
}
