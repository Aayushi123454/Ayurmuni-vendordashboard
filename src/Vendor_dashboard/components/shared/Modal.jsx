import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import useFocusTrap from "../../hooks/useFocusTrap";

const SIZE_CLASS = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-3xl",
};

export default function Modal({ open, onClose, title, subtitle, children, footer, size = "md" }) {
    const panelRef = useRef(null);
    useFocusTrap(panelRef, open);

    useEffect(() => {
        if (!open) return undefined;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e) => {
            if (e.key === "Escape") onClose?.();
        };
        document.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prev;
            document.removeEventListener("keydown", onKey);
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 ds-modal-backdrop"
            style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
            onClick={onClose}
            role="presentation"
        >
            <div
                ref={panelRef}
                className={`ds-modal-panel bg-white rounded-2xl w-full ${SIZE_CLASS[size] || SIZE_CLASS.md} max-h-[90vh] overflow-hidden flex flex-col shadow-2xl`}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4 flex justify-between items-start gap-4 z-[5]">
                    <div>
                        <h3 id="modal-title" className="text-lg font-semibold text-gray-900">{title}</h3>
                        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 flex-shrink-0 ds-focus"
                        aria-label="Close dialog"
                    >
                        <X size={18} className="text-gray-500" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto flex-1 ds-scroll">{children}</div>
                {footer && (
                    <div className="sticky bottom-0 bg-gray-50/95 backdrop-blur-sm border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
