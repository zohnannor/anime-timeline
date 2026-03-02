import { useState } from 'react';

import { isMobileDevice } from '@shared/lib/util';

type Comparator<T> = (_item?: T) => boolean;

type Handlers<T> = (_item?: T) => {
    onMouseOver: (_ev: React.MouseEvent) => void;
    onMouseOut: () => void;
};

type UseHover<T> = [Comparator<T>, Handlers<T>];

const useHover = <T extends string | number>(): UseHover<T> => {
    const [hoveredItem, setHoveredItem] = useState<T | null>(null);

    const hovered = (item?: T) => hoveredItem === (item ?? 1);

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

    const handlers = (item?: T) => ({
        onMouseOver: (ev: React.MouseEvent) => {
            // TODO: TEST THIS
            if (item) {
                setHoveredItem(item);
            }
            ev.stopPropagation();
        },
        onMouseOut: () => setHoveredItem(null),
    });

    return [hovered, handlers];
};

export default useHover;
