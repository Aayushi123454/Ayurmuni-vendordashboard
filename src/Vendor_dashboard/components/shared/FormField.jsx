import React, { useId } from "react";
import { AlertCircle } from "lucide-react";

const inputBase =
    "peer w-full px-4 pt-5 pb-2 border rounded-xl bg-white text-gray-900 text-sm transition-all duration-200 ds-focus disabled:bg-gray-50 disabled:text-gray-500";

export function FormSection({ title, description, children, className = "" }) {
    return (
        <section className={`ds-card p-6 sm:p-8 mb-6 ds-animate-in ${className}`}>
            {(title || description) && (
                <header className="mb-6 pb-4 border-b border-gray-100">
                    {title && <h2 className="text-lg font-semibold text-gray-800">{title}</h2>}
                    {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
                </header>
            )}
            {children}
        </section>
    );
}

export function FormInput({
    label,
    value,
    onChange,
    type = "text",
    required = false,
    disabled = false,
    error,
    helperText,
    placeholder = " ",
    autoFocus = false,
    id: propId,
    className = "",
    ...rest
}) {
    const uid = useId();
    const id = propId || uid;
    const hasError = Boolean(error);

    return (
        <div className={`relative ${className}`}>
            <input
                id={id}
                type={type}
                value={value ?? ""}
                onChange={onChange}
                disabled={disabled}
                required={required}
                placeholder={placeholder}
                autoFocus={autoFocus}
                aria-invalid={hasError}
                aria-describedby={hasError ? `${id}-error` : helperText ? `${id}-help` : undefined}
                className={`${inputBase} ${
                    hasError
                        ? "border-red-300 focus:border-red-400"
                        : "border-gray-200 focus:border-[#0D614E]"
                }`}
                {...rest}
            />
            <label
                htmlFor={id}
                className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none transition-all duration-200 peer-focus:top-3 peer-focus:text-xs peer-focus:text-[#0D614E] peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs ${
                    value ? "top-3 text-xs" : ""
                }`}
            >
                {label}
                {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            {hasError && (
                <p id={`${id}-error`} className="flex items-center gap-1 mt-1.5 text-xs text-red-600" role="alert">
                    <AlertCircle size={12} aria-hidden />
                    {error}
                </p>
            )}
            {!hasError && helperText && (
                <p id={`${id}-help`} className="mt-1.5 text-xs text-gray-500">
                    {helperText}
                </p>
            )}
        </div>
    );
}

export function FormSelect({
    label,
    value,
    onChange,
    options = [],
    required = false,
    disabled = false,
    error,
    placeholder = "Select an option",
    id: propId,
    className = "",
}) {
    const uid = useId();
    const id = propId || uid;
    const hasError = Boolean(error);

    return (
        <div className={className}>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
                {label}
                {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <select
                id={id}
                value={value ?? ""}
                onChange={onChange}
                disabled={disabled}
                required={required}
                aria-invalid={hasError}
                className={`w-full px-4 py-2.5 border rounded-xl bg-white text-sm transition-all duration-200 ds-focus disabled:bg-gray-50 ${
                    hasError ? "border-red-300" : "border-gray-200"
                }`}
            >
                <option value="">{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt.value ?? opt.id ?? opt} value={opt.value ?? opt.id ?? opt}>
                        {opt.label ?? opt.name ?? opt}
                    </option>
                ))}
            </select>
            {hasError && (
                <p className="flex items-center gap-1 mt-1.5 text-xs text-red-600" role="alert">
                    <AlertCircle size={12} aria-hidden />
                    {error}
                </p>
            )}
        </div>
    );
}

export function FormTextarea({
    label,
    value,
    onChange,
    required = false,
    disabled = false,
    error,
    rows = 4,
    placeholder,
    id: propId,
    className = "",
}) {
    const uid = useId();
    const id = propId || uid;
    const hasError = Boolean(error);

    return (
        <div className={className}>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
                {label}
                {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <textarea
                id={id}
                value={value ?? ""}
                onChange={onChange}
                disabled={disabled}
                required={required}
                rows={rows}
                placeholder={placeholder}
                aria-invalid={hasError}
                className={`w-full px-4 py-3 border rounded-xl bg-white text-sm resize-y min-h-[100px] transition-all duration-200 ds-focus disabled:bg-gray-50 ${
                    hasError ? "border-red-300" : "border-gray-200"
                }`}
            />
            {hasError && (
                <p className="flex items-center gap-1 mt-1.5 text-xs text-red-600" role="alert">
                    <AlertCircle size={12} aria-hidden />
                    {error}
                </p>
            )}
        </div>
    );
}

export function FormGrid({ children, cols = 2, className = "" }) {
    const colClass = cols === 1 ? "grid-cols-1" : cols === 3 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 md:grid-cols-2";
    return <div className={`grid ${colClass} gap-5 ${className}`}>{children}</div>;
}
