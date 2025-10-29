import { useEffect, useState } from 'react';

const useWindowScroll = () => {
    const [scrollX, setScrollX] = useState(0);
    const [scrollY, setScrollY] = useState(0);
    const [scrolling, setScrolling] = useState(false);
    const body = document.body;

    let timeout: NodeJS.Timeout;
    const handleScroll = () => {
        setScrolling(true);
        setScrollX(body.scrollLeft);
        setScrollY(body.scrollTop);
        clearTimeout(timeout);
        timeout = setTimeout(() => setScrolling(false), 400);
    };

    useEffect(() => {
        body.addEventListener('scroll', handleScroll);
        return () => {
            body.removeEventListener('scroll', handleScroll);
            clearTimeout(timeout);
        };
    }, [handleScroll]);

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
