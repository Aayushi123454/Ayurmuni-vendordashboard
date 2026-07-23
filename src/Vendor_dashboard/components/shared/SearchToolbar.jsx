import React from "react";
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
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit?.(e);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
            <form className="flex flex-wrap gap-4 items-center justify-between" onSubmit={handleSubmit}>
                {children}
                <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder={placeholder}
                            value={value}
                            onChange={onChange}
                            aria-label="Search"
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E] text-sm"
                        />
                    </div>
                </div>
                {!live && (
                    <div className="flex items-center gap-3">
                        <Button type="submit" variant="primary">
                            {submitLabel}
                        </Button>
                        {onClear && value && (
                            <Button type="button" variant="secondary" onClick={onClear}>
                                Clear
                            </Button>
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
            className={`px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D614E] bg-white text-sm ${className}`}
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
