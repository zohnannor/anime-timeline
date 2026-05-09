import { useId } from 'react';

import { useHoverContext } from '@shared/contexts/TouchHoverContext';
import { isMobileDevice } from '@shared/lib/util';

type Comparator<T> = (_item?: T) => boolean;

type Handlers<T> = (_item?: T) =>
    | {
          onMouseOver: (_ev: React.MouseEvent) => void;
          onMouseOut: () => void;
      }
    | {
          onTouchStart: () => void;
          onTouchEnd: () => void;
          onContextMenu: (_ev: React.MouseEvent) => void;
          'data-hover-item': string;
      };

type UseHover<T> = [Comparator<T>, Handlers<T>];

const useHover = <T extends string | number>(): UseHover<T> => {
    const { hoveredItem, setIsLongPressMode, touchTimer, setHoveredItem } =
        useHoverContext();
    const elementId = useId();

    const hovered = () => hoveredItem === elementId;

    const handlers = () =>
        isMobileDevice() ?
            {
                onTouchStart: () => {
                    clearTimeout(touchTimer.current ?? undefined);
                    touchTimer.current = setTimeout(() => {
                        setHoveredItem(elementId);
                        setIsLongPressMode(true);
                        document.body.style.overflow = 'hidden';
                    }, 200);
                },
                onTouchEnd: () => {
                    clearTimeout(touchTimer.current ?? undefined);
                    touchTimer.current = null;
                    setHoveredItem(null);
                    setIsLongPressMode(false);
                    document.body.style.overflow = '';
                },
                onContextMenu: (ev: React.MouseEvent) => {
                    ev.preventDefault();
                    ev.stopPropagation();
                },
                'data-hover-item': elementId,
            }
        :   {
                onMouseOver: (ev: React.MouseEvent) => {
                    setHoveredItem(elementId);
                    ev.stopPropagation();
                },
                onMouseOut: () => setHoveredItem(null),
            };

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
