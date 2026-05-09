import { createContext, use } from 'react';

type HoverContextType = {
    hoveredItem: string | null;
    setHoveredItem: (_item: string | null) => void;
    isLongPressMode: boolean;
    setIsLongPressMode: (_mode: boolean) => void;
    touchTimer: React.RefObject<NodeJS.Timeout | null>;
};

const dummy = () => {
    /* empty */
};

export const TouchHoverContext = createContext<HoverContextType>({
    hoveredItem: null,
    setHoveredItem: dummy,
    isLongPressMode: false,
    setIsLongPressMode: dummy,
    touchTimer: { current: null },
});

export const useHoverContext = () => use(TouchHoverContext);
