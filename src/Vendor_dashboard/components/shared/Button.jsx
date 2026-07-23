import React from "react";

const BASE =
    "inline-flex items-center justify-center gap-2 text-sm font-medium rounded-lg ds-btn-press ds-focus transition-all duration-200 ease-out";

const VARIANTS = {
    primary:
        "px-4 py-2.5 bg-[#0D614E] text-white shadow-sm hover:bg-[#0D614E]/90 hover:shadow-md active:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
    secondary:
        "px-4 py-2.5 border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed",
    danger:
        "px-4 py-2.5 bg-rose-500 text-white shadow-sm hover:bg-rose-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed",
    ghost:
        "p-2 border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed",
    pill:
        "px-3 py-1.5 rounded-full text-sm font-medium bg-[#0D614E]/10 text-[#0D614E] border border-[#0D614E]/15 hover:bg-[#0D614E]/15",
};

export default function Button({
    variant = "primary",
    className = "",
    children,
    type = "button",
    loading = false,
    ...props
}) {
    return (
        <button
            type={type}
            disabled={loading || props.disabled}
            className={`${BASE} ${VARIANTS[variant] || VARIANTS.primary} ${className}`}
            {...props}
        >
            {loading ? (
                <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span>Loading...</span>
                </>
            ) : (
                children
            )}
        </button>
    );
}

export function IconButton({ className = "", children, ...props }) {
    return (
        <button
            type="button"
            className={`w-9 h-9 rounded-full bg-[#0D614E]/10 hover:bg-[#0D614E]/20 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 text-[#0D614E] ds-focus disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
