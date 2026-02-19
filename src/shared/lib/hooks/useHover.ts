import { useState } from 'react';

import { isMobileDevice } from '@shared/lib/util';

type Comparator = (_item?: number) => boolean;

type Handlers = (_item?: number) => {
    onMouseOver: (_ev: React.MouseEvent) => void;
    onMouseOut: () => void;
};

type UseHover = [Comparator, Handlers];

const useHover = (): UseHover => {
    const [hoveredItem, setHoveredItem] = useState<number | null>(null);

    const hovered = (item?: number) => hoveredItem === (item ?? 1);

    if (isMobileDevice()) {
        const dummy = () => {
            /* empty */
        };
        return [
            () => false,
            () => ({
                onMouseOver: dummy,
                onMouseOut: dummy,
            }),
        ];
    }

    const handlers = (item?: number) => ({
        onMouseOver: (ev: React.MouseEvent) => {
            setHoveredItem(item ?? 1);
            ev.stopPropagation();
        },
        onMouseOut: () => setHoveredItem(null),
    });

    return [hovered, handlers];
};

export default useHover;
