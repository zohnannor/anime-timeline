import { useEffect, useState } from 'react';

const useWindowScroll = () => {
    const [scrollX, setScrollX] = useState(0);
    const [scrollY, setScrollY] = useState(0);
    const body = document.body;

    useEffect(() => {
        const handleScroll = () => {
            setScrollX(body.scrollLeft);
            setScrollY(body.scrollTop);
        };
        body.addEventListener('scroll', handleScroll);
        return () => body.removeEventListener('scroll', handleScroll);
    }, []);

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
    };
};

export default useWindowScroll;
