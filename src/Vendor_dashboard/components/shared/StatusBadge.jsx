import React from "react";
import {
    AlertCircle,
    CheckCircle,
    Clock,
    Cloud,
    CloudOff,
    Lock,
    Package,
    XCircle,
} from "lucide-react";

const STATUS_CONFIG = {
    approved: { color: "bg-green-100 text-green-700", icon: CheckCircle },
    active: { color: "bg-green-100 text-green-700", icon: CheckCircle },
    success: { color: "bg-green-100 text-green-700", icon: CheckCircle },
    instock: { color: "bg-green-100 text-green-700", icon: Package },
    "in-stock": { color: "bg-green-100 text-green-700", icon: Package },
    pending: { color: "bg-violet-100 text-violet-700", icon: Clock },
    "pending-approval": { color: "bg-violet-100 text-violet-700", icon: Clock },
    confirmed: { color: "bg-green-100 text-green-700", icon: CheckCircle },
    processing: { color: "bg-blue-100 text-blue-700", icon: Package },
    shipped: { color: "bg-sky-100 text-sky-700", icon: Package },
    delivered: { color: "bg-emerald-100 text-emerald-700", icon: CheckCircle },
    cancelled: { color: "bg-red-100 text-red-700", icon: XCircle },
    returned: { color: "bg-amber-100 text-amber-700", icon: AlertCircle },
    failed: { color: "bg-red-100 text-red-700", icon: XCircle },
    rejected: { color: "bg-red-100 text-red-700", icon: XCircle },
    suspended: { color: "bg-red-100 text-red-700", icon: XCircle },
    inactive: { color: "bg-gray-100 text-gray-600", icon: AlertCircle },
    draft: { color: "bg-gray-100 text-gray-600", icon: AlertCircle },
    locked: { color: "bg-gray-100 text-gray-600", icon: Lock },
    "low-stock": { color: "bg-amber-100 text-amber-700", icon: AlertCircle },
    "out-of-stock": { color: "bg-red-100 text-red-700", icon: XCircle },
    "awaiting-sync": { color: "bg-orange-100 text-orange-700", icon: Cloud },
    "sync-failed": { color: "bg-orange-100 text-orange-700", icon: CloudOff },
    "not-added": { color: "bg-gray-100 text-gray-600", icon: Package },
    order: { color: "bg-amber-100 text-amber-700", icon: Package },
    inventory: { color: "bg-violet-100 text-violet-700", icon: Package },
    system: { color: "bg-gray-100 text-gray-600", icon: AlertCircle },
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
