import { useState } from 'react';

import { isMobileDevice } from '@shared/lib/util';

type Comparator<T> = (_item: T) => boolean;

type Handlers<T> = (_item: T) => Readonly<{
    onMouseOver: (_ev: React.MouseEvent) => void;
    onMouseOut: () => void;
}>;

type UseHover<T> = readonly [Comparator<T>, Handlers<T>];

const useHover = <T extends string | number>(): UseHover<T> => {
    const [hoveredItem, setHoveredItem] = useState<T>();

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
            setHoveredItem(item);
            ev.stopPropagation();
        },
        onMouseOut: () => setHoveredItem(undefined),
    });

    return [hovered, handlers];
};

type UseSimpleHover<T> = readonly [
    () => ReturnType<Comparator<T>>,
    () => ReturnType<Handlers<T>>,
];

export const useSimpleHover = (): UseSimpleHover<number> => {
    const [hovered, handlers] = useHover<number>();
    return [() => hovered(1), () => handlers(1)];
};

export default useHover;
