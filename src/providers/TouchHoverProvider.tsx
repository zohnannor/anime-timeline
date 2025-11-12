import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';

import { isMobileDevice } from '../util';

interface HoverContextType {
    hoveredItem: string | null;
    setHoveredItem: (item: string | null) => void;
    isLongPressMode: boolean;
    setIsLongPressMode: (mode: boolean) => void;
    touchTimer: React.RefObject<NodeJS.Timeout | null>;
}

const TouchHoverContext = createContext<HoverContextType>({
    hoveredItem: null,
    setHoveredItem: () => {},
    isLongPressMode: false,
    setIsLongPressMode: () => {},
    touchTimer: { current: null },
});

export const useHoverContext = () => useContext(TouchHoverContext);

interface HoverProviderProps {
    children: React.ReactNode;
}

export const TouchHoverProvider: React.FC<HoverProviderProps> = ({
    children,
}) => {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [isLongPressMode, setIsLongPressMode] = useState(false);
    const touchTimer = useRef<NodeJS.Timeout | null>(null);

    const handleTouchMove = useCallback(
        (e: TouchEvent) => {
            if (!isLongPressMode) {
                clearTimeout(touchTimer.current ?? undefined);
                touchTimer.current = null;
                return;
            }

            e.preventDefault();

            const touch = e.touches[0];
            if (!touch) return;

            const element = document.elementFromPoint(
                touch.clientX,
                touch.clientY
            );
            let foundItem: string | null = null;

            let currentElement = element;
            while (currentElement) {
                const hoverItemAttr =
                    currentElement.getAttribute('data-hover-item');
                if (hoverItemAttr) {
                    foundItem = hoverItemAttr;
                    break;
                }
                currentElement = currentElement.parentElement;
            }

            if (foundItem !== hoveredItem) {
                setHoveredItem(foundItem);
                navigator.vibrate && navigator.vibrate(25);
            }
        },
        [isLongPressMode, hoveredItem]
    );

    useEffect(() => {
        if (!isMobileDevice()) return;

        document.addEventListener('touchmove', handleTouchMove, {
            passive: false,
        });

        return () => document.removeEventListener('touchmove', handleTouchMove);
    }, [handleTouchMove]);

    return (
        <TouchHoverContext.Provider
            value={{
                hoveredItem,
                setHoveredItem,
                isLongPressMode,
                setIsLongPressMode,
                touchTimer,
            }}
        >
            {children}
        </TouchHoverContext.Provider>
    );
};
