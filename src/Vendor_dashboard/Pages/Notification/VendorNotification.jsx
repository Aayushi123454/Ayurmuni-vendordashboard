import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
    Bell,
    Check,
    ChevronDown,
    ExternalLink,
    Inbox,
    Loader,
    Package,
    Settings,
    ShoppingBag,
} from "lucide-react";
import { notificationService } from "../../../services/notificationService";
import DashboardPageShell from "../../components/shared/DashboardPageShell";
import StatusBadge from "../../components/shared/StatusBadge";
import Modal from "../../components/shared/Modal";
import Button from "../../components/shared/Button";
import { PageEmpty, PageLoader } from "../../components/shared/PageState";

const VENDOR_TABS = [
    { id: "all", label: "All", icon: Bell },
    { id: "order", label: "Orders", icon: ShoppingBag },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "system", label: "System", icon: Settings },
];

const EVENT_LABELS = {
    PROFILE_SUBMITTED: "Profile Submitted",
    APPROVAL_STATUS_CHANGED: "Approval Update",
    USER_REGISTERED: "Registration",
};

function timeAgo(date) {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    const units = [
        ["year", 31536000],
        ["month", 2592000],
        ["week", 604800],
        ["day", 86400],
        ["hour", 3600],
        ["minute", 60],
    ];
    for (const [label, seconds] of units) {
        const count = Math.floor(diff / seconds);
        if (count >= 1) return `${count} ${label}${count > 1 ? "s" : ""} ago`;
    }
    return "Just now";
}

function formatDateLong(date) {
    return new Date(date).toLocaleString("en-IN", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getIcon(type) {
    const map = { order: ShoppingBag, inventory: Package, system: Settings };
    const Icon = map[type] || Bell;
    return <Icon className="h-5 w-5 text-white" />;
}

function resolveVendorRoute(notification) {
    const type = notification.notification_type;
    const event = notification.data?.event || "";
    if (event.includes("approval") || notification.data?.entity_type === "vendor") return "/vendor/profile";
    if (type === "order") return "/vendor/orders";
    if (type === "inventory") return "/vendor/stock";
    return "/vendor/dashboard";
}

export default function VendorNotification() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState("all");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [unreadCount, setUnreadCount] = useState(0);
    const [actionLoading, setActionLoading] = useState({});
    const [selected, setSelected] = useState(null);

    const fetchNotifications = useCallback(async (pageNum = 1, append = false) => {
        try {
            setLoading(true);
            const params = new URLSearchParams({ view: "list", page: pageNum, page_size: 20 });
            if (selectedTab !== "all") params.append("notification_type", selectedTab);

            const response = await notificationService.get(params);
            const data = response?.data?.data;
            const results = data?.results || [];

            setNotifications((prev) => (append ? [...prev, ...results] : results));
            setTotalCount(data?.count || 0);
            setHasMore(Boolean(data?.next));
            setUnreadCount(results.filter((n) => !n.is_read).length);
        } catch {
            toast.error("Failed to load notifications");
        } finally {
            setLoading(false);
        }
    }, [selectedTab]);

    useEffect(() => {
        setPage(1);
        fetchNotifications(1, false);
    }, [selectedTab, fetchNotifications]);

    const markAsRead = async (notificationId) => {
        try {
            setActionLoading((prev) => ({ ...prev, [notificationId]: "read" }));
            await notificationService.markRead(notificationId);
            setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n)));
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch {
            toast.error("Failed to mark as read");
        } finally {
            setActionLoading((prev) => ({ ...prev, [notificationId]: undefined }));
        }
    };

    const markAllAsRead = async () => {
        try {
            setActionLoading((prev) => ({ ...prev, all: true }));
            await notificationService.markAllRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
            setUnreadCount(0);
            toast.success("All notifications marked as read");
        } catch {
            toast.error("Failed to mark all as read");
        } finally {
            setActionLoading((prev) => ({ ...prev, all: false }));
        }
    };

    const loadMore = () => {
        if (!hasMore || loading) return;
        const next = page + 1;
        setPage(next);
        fetchNotifications(next, true);
    };

    const eventLabel = (notification) => {
        const event = notification.data?.event;
        return EVENT_LABELS[event] || event || notification.notification_type || "Update";
    };

    const subtitle = totalCount > 0
        ? `${totalCount} notification${totalCount > 1 ? "s" : ""} — stay updated on orders, inventory, and account status.`
        : "Stay updated on orders, inventory, and account status.";

    return (
        <DashboardPageShell
            title="Vendor"
            accent="Notifications"
            subtitle={subtitle}
            actions={
                <>
                    {unreadCount > 0 && <Button variant="pill"><Bell size={14} /> {unreadCount} unread</Button>}
                    <Button disabled={unreadCount === 0 || actionLoading.all} onClick={markAllAsRead}>
                        {actionLoading.all ? <Loader className="animate-spin" size={16} /> : <Check size={16} />}
                        Mark all read
                    </Button>
                </>
            }
        >
            <div className="flex flex-wrap gap-2 mb-6">
                {VENDOR_TABS.map((tab) => (
                    <Button
                        key={tab.id}
                        variant={selectedTab === tab.id ? "primary" : "secondary"}
                        onClick={() => setSelectedTab(tab.id)}
                    >
                        <tab.icon size={15} /> {tab.label}
                    </Button>
                ))}
            </div>

            {loading && notifications.length === 0 ? (
                <PageLoader message="Loading notifications..." />
            ) : notifications.length === 0 ? (
                <PageEmpty
                    title="No notifications"
                    description="You're all caught up. New vendor alerts will appear here."
                    icon={Inbox}
                />
            ) : (
                <div className="space-y-4">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md transition-shadow ${
                                !notification.is_read ? "border-l-4 border-l-[#0D614E]" : ""
                            }`}
                            onClick={() => setSelected(notification)}
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 rounded-xl bg-[#0D614E] p-3">{getIcon(notification.notification_type)}</div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <h3 className="text-sm font-semibold text-gray-900">{notification.title}</h3>
                                                {!notification.is_read && <StatusBadge status="pending" label="New" />}
                                                <StatusBadge status={notification.is_read ? "inactive" : "active"} label={notification.is_read ? "Read" : "Unread"} />
                                            </div>
                                            <p className="text-sm text-gray-600 line-clamp-2">{notification.message}</p>
                                            <p className="mt-2 text-xs text-gray-400">{eventLabel(notification)} · {timeAgo(notification.created_at)}</p>
                                        </div>
                                        {!notification.is_read && (
                                            <Button
                                                variant="ghost"
                                                className="!w-auto !h-auto !rounded-lg"
                                                disabled={actionLoading[notification.id] === "read"}
                                                onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}
                                            >
                                                {actionLoading[notification.id] === "read" ? <Loader className="animate-spin" size={14} /> : <Check size={14} />}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {hasMore && (
                        <div className="text-center pt-2">
                            <Button variant="secondary" disabled={loading} onClick={loadMore}>
                                {loading ? <><Loader className="animate-spin" size={16} /> Loading...</> : <><ChevronDown size={16} /> Load older</>}
                            </Button>
                        </div>
                    )}
                </div>
            )}

            <Modal
                open={Boolean(selected)}
                onClose={() => setSelected(null)}
                title={selected?.title}
                subtitle={selected ? formatDateLong(selected.created_at) : ""}
                footer={
                    selected && (
                        <>
                            <Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>
                            {!selected.is_read && (
                                <Button variant="secondary" onClick={() => { markAsRead(selected.id); setSelected(null); }}>
                                    <Check size={16} /> Mark read
                                </Button>
                            )}
                            <Button onClick={() => { navigate(resolveVendorRoute(selected)); setSelected(null); }}>
                                <ExternalLink size={16} /> Open in dashboard
                            </Button>
                        </>
                    )
                }
            >
                {selected && (
                    <div className="space-y-4">
                        <div className="rounded-xl bg-gray-50 p-4 text-sm leading-relaxed text-gray-700">{selected.message}</div>
                        <div className="flex flex-wrap gap-2">
                            <StatusBadge status={selected.notification_type} label={selected.notification_type} />
                            <StatusBadge status={selected.is_read ? "inactive" : "active"} label={eventLabel(selected)} />
                        </div>
                        {selected.data?.reason && (
                            <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-sm text-amber-900">
                                <strong>Reason:</strong> {selected.data.reason}
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </DashboardPageShell>
    );
}
