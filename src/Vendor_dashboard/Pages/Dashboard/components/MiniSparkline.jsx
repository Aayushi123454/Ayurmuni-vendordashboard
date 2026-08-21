import React from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

export default function MiniSparkline({ data = [], color = "#0D614E", height = 40, id = "spark" }) {
    const points = data.length > 1 ? data : [...data, ...data.map((d, i) => ({ ...d, v: (d.v || 0) + i }))];
    const gradId = `spark-${id}`;

    return (
        <div className="w-full" style={{ height }} aria-hidden>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={points} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                            <stop offset="100%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <Area
                        type="monotone"
                        dataKey="v"
                        stroke={color}
                        strokeWidth={2}
                        fill={`url(#${gradId})`}
                        isAnimationActive
                        animationDuration={600}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
