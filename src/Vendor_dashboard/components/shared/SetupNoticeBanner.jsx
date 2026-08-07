import React from "react";
import { AlertTriangle } from "lucide-react";

export default function SetupNoticeBanner({ message, action, className = "" }) {
    if (!message) return null;
    return (
        <div className={`rounded-lg border border-amber-100 bg-amber-50 px-3 py-2.5 text-xs text-amber-800 flex items-start gap-2 ${className}`}>
            <AlertTriangle size={14} className="shrink-0 mt-0.5 text-amber-600" />
            <div className="flex-1 min-w-0">
                <p>{message}</p>
                {action && <div className="mt-2">{action}</div>}
            </div>
        </div>
    );
}
