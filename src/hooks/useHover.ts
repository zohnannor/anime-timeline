import { useId } from 'react';

import { useHoverContext } from '../providers/TouchHoverProvider';
import { isMobileDevice } from '../util';

type Comparator = () => boolean;

type Handlers = () =>
    | {
          onMouseOver: (e: React.MouseEvent) => void;
          onMouseOut: () => void;
      }
    | {
          onTouchStart: () => void;
          onTouchEnd: () => void;
          onContextMenu: (e: React.MouseEvent) => void;
          'data-hover-item': string;
      };

type UseHover = [Comparator, Handlers];

const useHover = (): UseHover => {
    const { hoveredItem, setIsLongPressMode, touchTimer, setHoveredItem } =
        useHoverContext();
    const elementId = useId();

    const hovered = () => hoveredItem === elementId;

    const handlers = () =>
        isMobileDevice()
            ? {
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
                  onContextMenu: (e: React.MouseEvent) => {
                      e.preventDefault();
                      e.stopPropagation();
                  },
                  'data-hover-item': elementId,
              }
            : {
                  onMouseOver: (e: React.MouseEvent) => {
                      setHoveredItem(elementId);
                      e.stopPropagation();
                  },
                  onMouseOut: () => setHoveredItem(null),
              };

    return [hovered, handlers];
};

export default useHover;
