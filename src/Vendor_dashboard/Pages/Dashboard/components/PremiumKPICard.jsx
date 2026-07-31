import React from "react";
import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";
import AnimatedNumber from "../../../components/shared/AnimatedNumber";
import MiniSparkline from "./MiniSparkline";

const VARIANTS = {
    hero: {
        shell: "bg-gradient-to-br from-[#0D614E] to-[#094c3d] text-white border-0 shadow-lg shadow-[#0D614E]/20",
        label: "text-white/75",
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
        shell: "bg-gray-50/80 border border-gray-100",
        label: "text-gray-500",
        value: "text-gray-800",
        trend: "text-emerald-600",
        trendDown: "text-rose-500",
        icon: "bg-white text-gray-600 border border-gray-100",
        action: "bg-white hover:bg-gray-50 text-gray-600 border-gray-200",
        sparkColor: "#6b7280",
    },
    alert: {
        shell: "bg-gradient-to-br from-amber-50 to-white border border-amber-100",
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
    className = "",
}) {
    const v = VARIANTS[variant] || VARIANTS.soft;
    const TrendIcon = trendDirection === "down" ? TrendingDown : TrendingUp;

    return (
        <article
            className={`group relative flex h-full flex-col rounded-2xl p-5 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${v.shell} ${disabled ? "opacity-75" : ""} ${className}`}
        >
            {variant === "hero" && (
                <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            )}

            <div className="relative flex items-start justify-between gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${v.icon}`}>
                    {Icon && <Icon size={20} strokeWidth={2} />}
                </div>
                <div className="flex items-center gap-2">
                    {badge && (
                        <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-black/10 text-inherit">
                            {badge}
                        </span>
                    )}
                    {onAction && (
                        <button
                            type="button"
                            onClick={onAction}
                            disabled={disabled}
                            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all duration-200 active:scale-95 ds-focus ${v.action}`}
                        >
                            {actionLabel}
                            <ArrowUpRight size={12} />
                        </button>
                    )}
                </div>
            </div>

            <div className="relative mt-4">
                <p className={`text-xs font-medium uppercase tracking-wider ${v.label}`}>{label}</p>
                <p className={`mt-1 text-3xl font-bold tracking-tight ${v.value}`}>
                    {typeof value === "number" ? <AnimatedNumber value={value} /> : value}
                </p>
                {subtitle && <p className={`mt-1 text-sm ${v.label}`}>{subtitle}</p>}
            </div>

            <div className="relative mt-auto flex items-end justify-between gap-3 pt-3">
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-medium ${trendDirection === "down" ? v.trendDown : v.trend}`}>
                        <TrendIcon size={14} />
                        <span>{trend}</span>
                    </div>
                )}
                {sparkData.length > 0 && (
                    <div className="flex-1 max-w-[120px] opacity-80 group-hover:opacity-100 transition-opacity duration-200">
                        <MiniSparkline data={sparkData} color={v.sparkColor} id={label?.replace(/\s/g, "")} />
                    </div>
                )}
            </div>
        </article>
    );
}
