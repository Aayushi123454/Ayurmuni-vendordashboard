import React, { memo } from "react";
import useAnimatedCounter from "../../hooks/useAnimatedCounter";

function StatCardInner({
    title,
    value,
    numericValue,
    icon: Icon,
    iconBg = "bg-emerald-50",
    iconColor = "text-[#0D614E]",
    trend,
    onClick,
}) {
    const animated = useAnimatedCounter(numericValue != null ? numericValue : null);
    const displayValue = numericValue != null ? animated.toLocaleString() : value;

    return (
        <div
            className={`ds-card ds-card-interactive p-6 ${onClick ? "cursor-pointer" : ""}`}
            onClick={onClick}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={
                onClick
                    ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              onClick(e);
                          }
                      }
                    : undefined
            }
        >
            <div className="flex justify-between items-start gap-3">
                <div className="min-w-0">
                    <p className="text-gray-500 text-sm font-medium truncate">{title}</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1 tabular-nums">{displayValue}</p>
                    {trend && <p className="text-xs text-gray-500 mt-2">{trend}</p>}
                </div>
                {Icon && (
                    <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105`}>
                        <Icon size={20} className={iconColor} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default memo(StatCardInner);
