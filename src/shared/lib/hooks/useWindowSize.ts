import { useLayoutEffect, useState } from 'react';

const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState(() => ({
        width: window.innerWidth,
        height: window.innerHeight,
    }));

    useLayoutEffect(() => {
        const observer = new ResizeObserver(() => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        });
        observer.observe(document.documentElement);
        return () => observer.disconnect();
    }, []);

    return windowSize;
};

export default useWindowSize;
