import React from "react";
import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";
import AnimatedNumber from "../../../components/shared/AnimatedNumber";
import MiniSparkline from "./MiniSparkline";

const VARIANTS = {
    hero: {
        shell: "bg-gradient-to-br from-[#0D614E] to-[#094c3d] text-white border-0 shadow-md shadow-[#0D614E]/15",
        label: "text-white/70",
        value: "text-white",
        trend: "text-emerald-200",
        trendDown: "text-rose-200",
        icon: "bg-white/15 text-white",
        action: "bg-white/15 hover:bg-white/25 text-white border-white/20",
        sparkColor: "#ffffff",
    },
    soft: {
        shell: "bg-white border border-gray-100 shadow-sm",
        label: "text-gray-500",
        value: "text-gray-900",
        trend: "text-emerald-600",
        trendDown: "text-rose-500",
        icon: "bg-[#0D614E]/10 text-[#0D614E]",
        action: "bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200",
        sparkColor: "#0D614E",
    },
    accent: {
        shell: "bg-[#0D614E]/[0.04] border border-[#0D614E]/15",
        label: "text-[#0D614E]/70",
        value: "text-[#0D614E]",
        trend: "text-emerald-600",
        trendDown: "text-rose-500",
        icon: "bg-[#0D614E] text-white",
        action: "bg-white hover:bg-[#0D614E]/5 text-[#0D614E] border-[#0D614E]/20",
        sparkColor: "#10B981",
    },
    muted: {
        shell: "bg-white border border-gray-100 shadow-sm",
        label: "text-gray-500",
        value: "text-gray-800",
        trend: "text-emerald-600",
        trendDown: "text-rose-500",
        icon: "bg-gray-100 text-gray-600",
        action: "bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200",
        sparkColor: "#6b7280",
    },
    alert: {
        shell: "bg-amber-50/80 border border-amber-100",
        label: "text-amber-700/80",
        value: "text-amber-900",
        trend: "text-amber-600",
        trendDown: "text-rose-500",
        icon: "bg-amber-100 text-amber-700",
        action: "bg-white hover:bg-amber-50 text-amber-800 border-amber-200",
        sparkColor: "#F59E0B",
    },
};

export default function PremiumKPICard({
    variant = "soft",
    icon: Icon,
    label,
    value,
    subtitle,
    trend,
    trendDirection = "up",
    sparkData = [],
    onAction,
    actionLabel = "View",
    disabled = false,
    badge,
    compact = false,
    className = "",
}) {
    const v = VARIANTS[variant] || VARIANTS.soft;
    const TrendIcon = trendDirection === "down" ? TrendingDown : TrendingUp;

    return (
        <article
            className={`group relative flex h-full flex-col rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md ${compact ? "p-3.5" : "p-4"} ${v.shell} ${disabled ? "opacity-75" : ""} ${className}`}
        >
            {variant === "hero" && (
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            )}

            <div className="relative flex items-center justify-between gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${v.icon}`}>
                    {Icon && <Icon size={16} strokeWidth={2} />}
                </div>
                <div className="flex items-center gap-1.5">
                    {badge && (
                        <span className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-black/10 text-inherit">
                            {badge}
                        </span>
                    )}
                    {onAction && (
                        <button
                            type="button"
                            onClick={onAction}
                            disabled={disabled}
                            className={`inline-flex items-center gap-0.5 rounded-md border px-2 py-1 text-[11px] font-medium transition-all duration-200 active:scale-95 ds-focus ${v.action}`}
                        >
                            {actionLabel}
                            <ArrowUpRight size={11} />
                        </button>
                    )}
                </div>
            </div>

            <div className="relative mt-2.5">
                <p className={`text-[10px] font-semibold uppercase tracking-wider ${v.label}`}>{label}</p>
                <p className={`mt-0.5 text-2xl font-bold tracking-tight leading-tight ${v.value}`}>
                    {typeof value === "number" ? <AnimatedNumber value={value} /> : value}
                </p>
                {subtitle && <p className={`mt-0.5 text-xs ${v.label}`}>{subtitle}</p>}
            </div>

            {(trend || sparkData.length > 0) && (
                <div className="relative mt-auto flex items-end justify-between gap-2 pt-2">
                    {trend && (
                        <div className={`flex items-center gap-0.5 text-[11px] font-medium ${trendDirection === "down" ? v.trendDown : v.trend}`}>
                            <TrendIcon size={12} />
                            <span className="truncate">{trend}</span>
                        </div>
                    )}
                    {sparkData.length > 0 && (
                        <div className="flex-1 max-w-[90px] opacity-70 group-hover:opacity-100 transition-opacity">
                            <MiniSparkline data={sparkData} color={v.sparkColor} id={label?.replace(/\s/g, "")} />
                        </div>
                    )}
                </div>
            )}
        </article>
    );
}
