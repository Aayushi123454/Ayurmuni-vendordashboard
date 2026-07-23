import React from "react";
import useAnimatedCounter from "../../hooks/useAnimatedCounter";

export default function AnimatedNumber({ value, className = "" }) {
    const numeric = Number(value);
    const animated = useAnimatedCounter(Number.isFinite(numeric) ? numeric : 0);
    const display = Number.isFinite(numeric) ? animated.toLocaleString() : value;
    return <span className={`tabular-nums ${className}`}>{display}</span>;
}
