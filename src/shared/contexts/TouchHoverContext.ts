import { createContext, use } from 'react';

type HoverContextType = {
    hoveredItem: string | null;
    setHoveredItem: (_item: string | null) => void;
    isLongPressMode: boolean;
    setIsLongPressMode: (_mode: boolean) => void;
    touchTimer: React.RefObject<NodeJS.Timeout | null>;
};

export const TouchHoverContext = createContext<HoverContextType>({
    hoveredItem: null,
    setHoveredItem: () => {
        /* empty */
    },
    isLongPressMode: false,
    setIsLongPressMode: () => {
        /* empty */
    },
    touchTimer: { current: null },
});

export const useHoverContext = () => use(TouchHoverContext);
