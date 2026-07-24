import { useEffect, useRef, useState } from "react";

export default function useAnimatedCounter(target, duration = 600) {
    const [display, setDisplay] = useState(0);
    const frameRef = useRef(null);
    const startRef = useRef(null);
    const fromRef = useRef(0);

    useEffect(() => {
        const to = Number(target) || 0;
        fromRef.current = display;
        startRef.current = null;

        const animate = (timestamp) => {
            if (!startRef.current) startRef.current = timestamp;
            const elapsed = timestamp - startRef.current;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - (1 - progress) ** 3;
            const value = Math.round(fromRef.current + (to - fromRef.current) * eased);
            setDisplay(value);
            if (progress < 1) frameRef.current = requestAnimationFrame(animate);
        };

        frameRef.current = requestAnimationFrame(animate);
        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [target, duration]);

    return display;
}
