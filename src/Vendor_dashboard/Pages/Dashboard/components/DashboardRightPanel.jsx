import React from "react";
import {
    AlertTriangle,
    ArrowRight,
    Bell,
    Clock,
    Layers,
    Package,
    ShoppingBag,
    Star,
} from "lucide-react";
import StatusBadge from "../../../components/shared/StatusBadge";

function PanelCard({ title, action, actionLabel, children, className = "" }) {
    return (
        <div className={`rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden ${className}`}>
            <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-gray-50">
                <h3 className="text-xs font-semibold text-gray-800 uppercase tracking-wide">{title}</h3>
                {action && (
                    <button
                        type="button"
                        onClick={action}
                        className="inline-flex items-center gap-0.5 text-[11px] font-medium text-[#0D614E] hover:text-[#094c3d] transition-colors ds-focus rounded px-1"
                    >
                        {actionLabel || "View"}
                        <ArrowRight size={11} />
                    </button>
                )}
            </div>
            <div className="p-3">{children}</div>
        </div>
    );
}

function EmptyPanel({ message }) {
    return <p className="text-xs text-gray-400 text-center py-4">{message}</p>;
}

export default function DashboardRightPanel({
    notifications = [],
    recentOrders = [],
    recentReviews = [],
    lowStockItems = [],
    pendingVariants = [],
    approvalStatus,
    onNavigate,
}) {
    const quickLinks = [
        { label: "Add Product", icon: Package, path: "/vendor/new-product" },
        { label: "Stock", icon: Layers, path: "/vendor/stock" },
    ];

    return (
        <aside className="space-y-3">
            <PanelCard title="Recent Orders" action={() => onNavigate("/vendor/orders")} actionLabel="Orders">
                {recentOrders.length > 0 ? (
                    <ul className="space-y-2">
                        {recentOrders.slice(0, 4).map((order) => (
                            <li
                                key={order.order_item_id || `${order.order_id}-${order.sku_code}`}
                                className="flex gap-2.5 group cursor-pointer"
                                onClick={() => onNavigate(`/vendor/orders/${order.order_id}`)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        onNavigate(`/vendor/orders/${order.order_id}`);
                                    }
                                }}
                                role="button"
                                tabIndex={0}
                            >
                                <div className="h-7 w-7 rounded-md bg-[#0D614E]/10 flex items-center justify-center flex-shrink-0">
                                    <ShoppingBag size={12} className="text-[#0D614E]" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-1.5">
                                        <p className="text-xs font-medium text-gray-800 truncate group-hover:text-[#0D614E] transition-colors">
                                            {order.order_display_code || order.order_code || "Order"}
                                        </p>
                                        <StatusBadge status={order.status} className="!px-1.5 !py-0 !text-[10px] shrink-0" />
                                    </div>
                                    <p className="text-[11px] text-gray-400 truncate">
                                        {order.product_name || "Product"}
                                        {order.quantity != null ? ` · ${order.quantity}` : ""}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <EmptyPanel message="No recent orders" />
                )}
            </PanelCard>

            <PanelCard title="Alerts" action={() => onNavigate("/vendor/stock")} actionLabel="Stock">
                <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Account</span>
                        <StatusBadge status={approvalStatus} className="!text-[10px] !px-1.5 !py-0" />
                    </div>

                    {pendingVariants.length > 0 && (
                        <div className="space-y-1.5">
                            <p className="text-[11px] font-medium text-amber-700 flex items-center gap-1">
                                <Clock size={11} /> {pendingVariants.length} pending approval
                            </p>
                            {pendingVariants.slice(0, 2).map((v) => (
                                <p key={v.id} className="text-xs text-gray-600 truncate pl-3.5">{v.title}</p>
                            ))}
                        </div>
                    )}

                    {lowStockItems.length > 0 ? (
                        <ul className="space-y-1.5">
                            {lowStockItems.slice(0, 3).map((item) => (
                                <li
                                    key={item.id || item.sku}
                                    className="flex items-center justify-between gap-2 rounded-lg bg-amber-50/80 border border-amber-100 px-2.5 py-1.5 cursor-pointer hover:bg-amber-50"
                                    onClick={() => onNavigate("/vendor/stock")}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <AlertTriangle size={12} className="text-amber-600 flex-shrink-0" />
                                        <span className="text-xs text-gray-800 truncate">{item.name}</span>
                                    </div>
                                    <span className="text-[11px] font-semibold text-amber-700">{item.qty}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        !pendingVariants.length && <EmptyPanel message="All clear — no alerts" />
                    )}
                </div>
            </PanelCard>

            <PanelCard title="Notifications" action={() => onNavigate("/vendor/notifications")}>
                {notifications.length > 0 ? (
                    <ul className="space-y-2">
                        {notifications.slice(0, 3).map((n) => (
                            <li
                                key={n.id}
                                className="flex gap-2.5 group cursor-pointer"
                                onClick={() => onNavigate("/vendor/notifications")}
                                role="button"
                                tabIndex={0}
                            >
                                <div className="h-7 w-7 rounded-md bg-[#0D614E]/10 flex items-center justify-center flex-shrink-0">
                                    <Bell size={12} className="text-[#0D614E]" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-medium text-gray-800 truncate group-hover:text-[#0D614E]">{n.title || n.message?.slice(0, 40)}</p>
                                    <p className="text-[11px] text-gray-400">{n.timeAgo}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <EmptyPanel message="You're all caught up" />
                )}
            </PanelCard>

            <PanelCard title="Reviews" action={() => onNavigate("/vendor/ratings")}>
                {recentReviews.length > 0 ? (
                    <ul className="space-y-2">
                        {recentReviews.slice(0, 3).map((review) => (
                            <li
                                key={review.id}
                                className="flex gap-2.5 group cursor-pointer"
                                onClick={() => onNavigate("/vendor/ratings")}
                                role="button"
                                tabIndex={0}
                            >
                                <div className="h-7 w-7 rounded-md bg-amber-50 flex items-center justify-center flex-shrink-0">
                                    <Star size={12} className="text-amber-500 fill-amber-500" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-medium text-gray-800 truncate group-hover:text-[#0D614E]">
                                        {review.reviewer_name || "Customer"}
                                    </p>
                                    <p className="text-[11px] text-gray-400 truncate">
                                        {review.product_name || "Product"}
                                        {review.rating != null ? ` · ${review.rating}★` : ""}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <EmptyPanel message="No reviews yet" />
                )}
            </PanelCard>

            <PanelCard title="Quick Links">
                <div className="grid grid-cols-2 gap-1.5">
                    {quickLinks.map((link) => (
                        <button
                            key={link.path}
                            type="button"
                            onClick={() => onNavigate(link.path)}
                            className="flex items-center gap-1.5 rounded-lg border border-gray-100 bg-gray-50/50 px-2.5 py-2 text-left text-[11px] font-medium text-gray-700 hover:bg-[#0D614E]/5 hover:border-[#0D614E]/20 hover:text-[#0D614E] transition-all active:scale-[0.98] ds-focus"
                        >
                            <link.icon size={12} />
                            {link.label}
                        </button>
                    ))}
                </div>
            </PanelCard>
        </aside>
    );
}
