import React from "react";
import {
    AlertTriangle,
    ArrowRight,
    Bell,
    // BookOpen,
    Clock,
    // Image,
    Layers,
    Package,
    ShoppingBag,
    Star,
} from "lucide-react";
import StatusBadge from "../../../components/shared/StatusBadge";

function PanelCard({ title, action, actionLabel, children, className = "" }) {
    return (
        <div className={`rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md ${className}`}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
                {action && (
                    <button
                        type="button"
                        onClick={action}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#0D614E] hover:text-[#094c3d] transition-colors duration-200 ds-focus rounded-md px-1 py-0.5"
                    >
                        {actionLabel || "View all"}
                        <ArrowRight size={12} />
                    </button>
                )}
            </div>
            <div className="p-4">{children}</div>
        </div>
    );
}

function EmptyPanel({ message }) {
    return <p className="text-sm text-gray-400 text-center py-6">{message}</p>;
}

export default function DashboardRightPanel({
    notifications = [],
    lowStockItems = [],
    pendingVariants = [],
    approvalStatus,
    onNavigate,
}) {
    const quickLinks = [
        { label: "Add Product", icon: Package, path: "/vendor/new-product" },
        { label: "Stock Management", icon: Layers, path: "/vendor/stock" },
        // { label: "Banners", icon: Image, path: "/vendor/banners" },
        // { label: "Catalog Reference", icon: BookOpen, path: "/vendor/catalog" },
    ];

    return (
        <aside className="space-y-4 lg:space-y-5">
            <PanelCard title="Recent Orders" action={() => onNavigate("/vendor/orders")} actionLabel="Orders">
                <div className="flex flex-col items-center py-4 text-center">
                    <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center mb-2">
                        <ShoppingBag size={18} className="text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-600">Orders coming soon</p>
                    <p className="text-xs text-gray-400 mt-1">Order management is on the roadmap</p>
                    <span className="mt-2 text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Soon</span>
                </div>
            </PanelCard>

            <PanelCard title="Notifications" action={() => onNavigate("/vendor/notifications")}>
                {notifications.length > 0 ? (
                    <ul className="space-y-3">
                        {notifications.slice(0, 4).map((n) => (
                            <li key={n.id} className="flex gap-3 group cursor-pointer" onClick={() => onNavigate("/vendor/notifications")} role="button" tabIndex={0}>
                                <div className="h-8 w-8 rounded-lg bg-[#0D614E]/10 flex items-center justify-center flex-shrink-0">
                                    <Bell size={14} className="text-[#0D614E]" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-800 truncate group-hover:text-[#0D614E] transition-colors">{n.title || n.message?.slice(0, 40)}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{n.timeAgo}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <EmptyPanel message="You're all caught up" />
                )}
            </PanelCard>

            <PanelCard title="Approval Timeline">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Account status</span>
                        <StatusBadge status={approvalStatus} />
                    </div>
                    {pendingVariants.length > 0 ? (
                        <ul className="space-y-2 border-l-2 border-[#0D614E]/20 pl-3">
                            {pendingVariants.slice(0, 3).map((v) => (
                                <li key={v.id} className="relative">
                                    <span className="absolute -left-[17px] top-1.5 h-2 w-2 rounded-full bg-amber-400 ring-2 ring-white" />
                                    <p className="text-sm font-medium text-gray-800 truncate">{v.title}</p>
                                    <p className="text-xs text-gray-400">Pending review</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                            <Clock size={14} className="text-emerald-500" />
                            No pending variant approvals
                        </p>
                    )}
                </div>
            </PanelCard>

            <PanelCard title="Inventory Alerts">
                {lowStockItems.length > 0 ? (
                    <ul className="space-y-2">
                        {lowStockItems.slice(0, 4).map((item) => (
                            <li
                                key={item.id || item.sku}
                                className="flex items-center justify-between gap-2 rounded-xl bg-amber-50/80 border border-amber-100 px-3 py-2 cursor-pointer hover:bg-amber-50 transition-colors duration-200"
                                onClick={() => onNavigate("/vendor/stock")}
                                role="button"
                                tabIndex={0}
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <AlertTriangle size={14} className="text-amber-600 flex-shrink-0" />
                                    <span className="text-sm text-gray-800 truncate">{item.name}</span>
                                </div>
                                <span className="text-xs font-semibold text-amber-700">{item.qty} left</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <EmptyPanel message="All stock levels healthy" />
                )}
            </PanelCard>

            <PanelCard title="Recent Reviews" action={() => onNavigate("/vendor/ratings")}>
                <div className="flex flex-col items-center py-3 text-center">
                    <Star size={20} className="text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">Reviews coming soon</p>
                </div>
            </PanelCard>

            <PanelCard title="Quick Links">
                <div className="grid grid-cols-2 gap-2">
                    {quickLinks.map((link) => (
                        <button
                            key={link.path}
                            type="button"
                            onClick={() => onNavigate(link.path)}
                            className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50/50 px-3 py-2.5 text-left text-xs font-medium text-gray-700 hover:bg-[#0D614E]/5 hover:border-[#0D614E]/20 hover:text-[#0D614E] transition-all duration-200 active:scale-[0.98] ds-focus"
                        >
                            <link.icon size={14} />
                            {link.label}
                        </button>
                    ))}
                </div>
            </PanelCard>
        </aside>
    );
}
