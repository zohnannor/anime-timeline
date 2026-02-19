import { useEffect, useRef, useState } from 'react';

const useWindowScroll = () => {
    const { body } = document;
    const [scrollX, setScrollX] = useState(body.scrollLeft);
    const [scrollY, setScrollY] = useState(body.scrollTop);
    const [scrolling, setScrolling] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout>(undefined);

    useEffect(() => {
        const handleScroll = () => {
            setScrolling(true);
            setScrollX(body.scrollLeft);
            setScrollY(body.scrollTop);
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => setScrolling(false), 400);
        };

        body.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            body.removeEventListener('scroll', handleScroll);
            clearTimeout(timeoutRef.current);
        };
    }, [body]);

    return {
        scrollX,
        scrollY,
        setScrollX: (offset: number) => {
            body.scrollLeft = offset;
            setScrollX(offset);
        },
        setScrollY: (offset: number) => {
            body.scrollTop = offset;
            setScrollY(offset);
        },
        scrolling,
    };
};

export default useWindowScroll;
