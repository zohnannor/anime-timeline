import { PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react';

import { isMobileDevice } from '@shared/lib/util';
import { TouchHoverContext } from '@shared/contexts/TouchHoverContext';

export const TouchHoverProvider: React.FC<PropsWithChildren> = ({
    children,
}) => {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [isLongPressMode, setIsLongPressMode] = useState(false);
    const touchTimer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!isMobileDevice()) {
            return undefined;
        }

        const handleTouchMove = (ev: TouchEvent) => {
            if (!isLongPressMode) {
                clearTimeout(touchTimer.current ?? undefined);
                touchTimer.current = null;
                return;
            }

            ev.preventDefault();

            const [touch] = ev.touches;
            if (!touch) {
                return;
            }

            const foundItem = document
                .elementFromPoint(touch.clientX, touch.clientY)
                ?.closest('[data-hover-item]')
                ?.getAttribute('data-hover-item');

            if (foundItem !== hoveredItem) {
                navigator.vibrate(5);
                setHoveredItem(foundItem ?? null);
            }
        };

        document.addEventListener('touchmove', handleTouchMove, {
            passive: false,
        });

        return () => document.removeEventListener('touchmove', handleTouchMove);
    }, [hoveredItem, isLongPressMode]);

    const context = useMemo(
        () => ({
            hoveredItem,
            setHoveredItem,
            isLongPressMode,
            setIsLongPressMode,
            touchTimer,
        }),
        [hoveredItem, isLongPressMode],
    );

    return <TouchHoverContext value={context}>{children}</TouchHoverContext>;
};
