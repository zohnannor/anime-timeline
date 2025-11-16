import {
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';

import { isMobileDevice } from '../util';

type HoverContextType = {
    hoveredItem: string | null;
    setHoveredItem: (item: string | null) => void;
    isLongPressMode: boolean;
    setIsLongPressMode: (mode: boolean) => void;
    touchTimer: React.RefObject<NodeJS.Timeout | null>;
};

const TouchHoverContext = createContext<HoverContextType>({
    hoveredItem: null,
    setHoveredItem: () => {},
    isLongPressMode: false,
    setIsLongPressMode: () => {},
    touchTimer: { current: null },
});

export const useHoverContext = () => useContext(TouchHoverContext);

export const TouchHoverProvider: React.FC<PropsWithChildren> = ({
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
                setHoveredItem(null);
                document.body.style.overflow = '';
                return;
            }

            e.preventDefault();

            const touch = e.touches[0];
            if (!touch) return;

            const foundItem = document
                .elementFromPoint(touch.clientX, touch.clientY)
                ?.closest('[data-hover-item]')
                ?.getAttribute('data-hover-item');

            if (foundItem !== hoveredItem) {
                navigator.vibrate && navigator.vibrate(5);
                setHoveredItem(foundItem ?? null);
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
