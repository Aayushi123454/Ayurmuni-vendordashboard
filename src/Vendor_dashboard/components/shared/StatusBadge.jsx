import React from "react";
import {
    AlertCircle,
    CheckCircle,
    Clock,
    Package,
    XCircle,
} from "lucide-react";

const STATUS_CONFIG = {
    approved: { color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
    active: { color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
    instock: { color: "bg-emerald-100 text-emerald-700", icon: Package },
    "in-stock": { color: "bg-emerald-100 text-emerald-700", icon: Package },
    pending: { color: "bg-purple-100 text-purple-700", icon: Clock },
    rejected: { color: "bg-rose-100 text-rose-700", icon: XCircle },
    suspended: { color: "bg-rose-100 text-rose-700", icon: XCircle },
    inactive: { color: "bg-gray-100 text-gray-700", icon: AlertCircle },
    draft: { color: "bg-gray-100 text-gray-700", icon: AlertCircle },
    "low-stock": { color: "bg-amber-100 text-amber-700", icon: AlertCircle },
    "out-of-stock": { color: "bg-rose-100 text-rose-700", icon: XCircle },
    "not-added": { color: "bg-gray-100 text-gray-600", icon: Package },
    order: { color: "bg-amber-100 text-amber-700", icon: Package },
    inventory: { color: "bg-purple-100 text-purple-700", icon: Package },
    system: { color: "bg-gray-100 text-gray-700", icon: AlertCircle },
};

export default function StatusBadge({ status, label, className = "" }) {
    const key = (status || "").toLowerCase().replace(/\s+/g, "-");
    const config = STATUS_CONFIG[key] || STATUS_CONFIG.inactive;
    const Icon = config.icon;
    const display = label || (status ? String(status).replace(/_/g, " ") : "—");

    return (
        <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${config.color} ${className}`}>
            <Icon size={12} />
            <span>{display}</span>
        </span>
    );
}
