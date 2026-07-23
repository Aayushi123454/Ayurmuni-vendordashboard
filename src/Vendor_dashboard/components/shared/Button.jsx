import React from "react";

const VARIANTS = {
    primary:
        "px-4 py-2 bg-[#0D614E] text-white rounded-lg hover:bg-[#0D614E]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
    secondary:
        "px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed",
    danger:
        "px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
    ghost:
        "p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed",
    pill:
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-[#0D614E]/10 text-[#0D614E] border border-[#0D614E]/15",
};

export default function Button({
    variant = "primary",
    className = "",
    children,
    type = "button",
    ...props
}) {
    return (
        <button
            type={type}
            className={`inline-flex items-center justify-center gap-2 text-sm font-medium ${VARIANTS[variant] || VARIANTS.primary} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

export function IconButton({ className = "", children, ...props }) {
    return (
        <button
            type="button"
            className={`w-9 h-9 rounded-full bg-[#0D614E]/10 hover:bg-[#0D614E]/20 flex items-center justify-center transition-all duration-200 hover:scale-105 text-[#0D614E] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
