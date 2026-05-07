import { useId } from 'react';

import { useHoverContext } from '@shared/contexts/TouchHoverContext';
import { isMobileDevice } from '@shared/lib/util';

type Comparator = () => boolean;

type Handlers = () =>
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

type UseHover = [Comparator, Handlers];

const useHover = (): UseHover => {
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

export default useHover;
