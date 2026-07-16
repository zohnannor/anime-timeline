import { useEffect, useState } from 'react';

const useMousePosition = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const updateMousePosition = (ev: MouseEvent) => {
            setMousePosition({ x: ev.clientX, y: ev.clientY });
        };
        addEventListener('mousemove', updateMousePosition);
        return () => removeEventListener('mousemove', updateMousePosition);
    }, []);

    return mousePosition;
};

export default useMousePosition;
