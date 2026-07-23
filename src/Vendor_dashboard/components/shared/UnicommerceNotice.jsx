import React from "react";

export default function UnicommerceNotice({ children }) {
    return (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 leading-relaxed">
            {children}
        </div>
    );
}
