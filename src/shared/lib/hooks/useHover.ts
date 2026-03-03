import { useState } from 'react';

import { isMobileDevice } from '@shared/lib/util';

type Comparator<T> = (_item: T) => boolean;

type Handlers<T> = (_item: T) => {
    onMouseOver: (_ev: React.MouseEvent) => void;
    onMouseOut: () => void;
};

type UseHover<T> = [Comparator<T>, Handlers<T>];

const useHover = <T extends string | number>(): UseHover<T> => {
    const [hoveredItem, setHoveredItem] = useState<T | null>(null);

    const hovered = (item: T) => hoveredItem === item;

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

    const handlers = (item: T) => ({
        onMouseOver: (ev: React.MouseEvent) => {
            if (item) {
                setHoveredItem(item);
            }
            ev.stopPropagation();
        },
        onMouseOut: () => setHoveredItem(null),
    });

    return [hovered, handlers];
};

type UseSimpleHover<T> = [
    () => ReturnType<Comparator<T>>,
    () => ReturnType<Handlers<T>>,
];

export const useSimpleHover = (): UseSimpleHover<number> => {
    const [hovered, handlers] = useHover<number>();
    return [() => hovered(1), () => handlers(1)];
};

export default useHover;
