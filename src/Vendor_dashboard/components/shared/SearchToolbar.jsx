import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import Button from "./Button";

export default function SearchToolbar({
    value,
    onChange,
    onSubmit,
    onClear,
    placeholder = "Search...",
    children,
    submitLabel = "Search",
    live = false,
}) {
    const [focused, setFocused] = useState(false);

    useEffect(() => {
        if (!live || !onSubmit) return undefined;
        const timer = setTimeout(() => onSubmit(), 350);
        return () => clearTimeout(timer);
    }, [value, live, onSubmit]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit?.(e);
    };

    return (
        <div className={`ds-card p-4 sm:p-5 mb-6 transition-shadow duration-200 ${focused ? "shadow-md ring-1 ring-[#0D614E]/10" : ""}`}>
            <form className="flex flex-wrap gap-3 sm:gap-4 items-center" onSubmit={handleSubmit}>
                {children}
                <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            size={18}
                            aria-hidden
                        />
                        <input
                            type="search"
                            placeholder={placeholder}
                            value={value}
                            onChange={onChange}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            aria-label="Search"
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0D614E]/30 focus:border-[#0D614E]/40"
                        />
                    </div>
                </div>
                {!live && (
                    <div className="flex items-center gap-2">
                        <Button type="submit" variant="primary">{submitLabel}</Button>
                        {onClear && value && (
                            <Button type="button" variant="secondary" onClick={onClear}>Clear</Button>
                        )}
                    </div>
                )}
            </form>
        </div>
    );
}

export function SelectFilter({ value, onChange, options, placeholder, className = "", "aria-label": ariaLabel }) {
    return (
        <select
            value={value}
            onChange={onChange}
            aria-label={ariaLabel || placeholder}
            className={`px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E]/30 bg-white text-sm transition-all duration-200 ds-focus ${className}`}
        >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
                <option key={opt.value ?? opt} value={opt.value ?? opt}>
                    {opt.label ?? opt}
                </option>
            ))}
        </select>
    );
}
