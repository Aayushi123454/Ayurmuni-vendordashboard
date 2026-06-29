// src/components/Notification/Notification.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Bell,
  CheckCircle,
  Check,
  X,
  ShoppingBag,
  Package,
  Users,
  Settings,
  MessageCircle,
  AlertCircle,
  Loader,
  Clock,
  ChevronDown,
  Inbox,
} from "lucide-react";
import { doctorService } from "../../../services/doctorService";

const Notification = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications
  const fetchNotifications = useCallback(async (pageNum = 1, append = false) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        view: "list",
        page: pageNum,
        page_size: 20,
      });

      if (selectedTab !== "all") {
        params.append("category", selectedTab);
      }

      const response = await doctorService?.notificationget(params);
      const data = response.data.data;

      if (append) {
        setNotifications((prev) => [...prev, ...data.results]);
      } else {
        setNotifications(data.results);
      }

      setHasMore(data.next !== null);
      setUnreadCount(data.unread_count || 0);
    } catch (error) {
      toast.error("Failed to load notifications");
      console.error("Notification fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedTab]);

  // Load more notifications
  const loadMore = () => {
    if (!hasMore || loading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage, true);
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await doctorService?.notificationpost(notificationId);

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      toast.success("Marked as read");
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await doctorService?.notificationpostall("read");
      // Update local state
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, is_read: true }))
      );
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      await doctorService?.notificationpostdelete(notificationId);
      // Remove from local state
      setNotifications((prev) =>
        prev.filter((notif) => notif.id !== notificationId)
      );
      toast.success("Notification deleted");
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  // Clear all notifications
  const clearAll = async () => {
    try {
      await doctorService?.notificationpostall("clear");
      setNotifications([]);
      setUnreadCount(0);
      toast.success("All notifications cleared");
    } catch (error) {
      toast.error("Failed to clear notifications");
    }
  };

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    const icons = {
      order: <ShoppingBag className="w-6 h-6 text-[#0D614E]" />,
      inventory: <Package className="w-6 h-6 text-[#0D614E]" />,
      customer: <Users className="w-6 h-6 text-[#0D614E]" />,
      system: <Settings className="w-6 h-6 text-[#0D614E]" />,
      message: <MessageCircle className="w-6 h-6 text-[#0D614E]" />,
      success: <CheckCircle className="w-6 h-6 text-[#0D614E]" />,
      warning: <AlertCircle className="w-6 h-6 text-[#0D614E]" />,
    };
    return icons[type] || <Bell className="w-6 h-6 text-[#0D614E]" />;
  };

  // Get background color for icon
  const getIconBgColor = (type) => {
    const colors = {
      order: "bg-[#0D614E]/10",
      inventory: "bg-[#0D614E]/10",
      customer: "bg-[#0D614E]/10",
      system: "bg-[#0D614E]/10",
      message: "bg-[#0D614E]/10",
      success: "bg-[#0D614E]/10",
      warning: "bg-[#0D614E]/10",
    };
    return colors[type] || "bg-[#0D614E]/5";
  };

  // Get time ago
  const timeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now - past) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [key, value] of Object.entries(intervals)) {
      const count = Math.floor(diff / value);
      if (count >= 1) {
        return `${count} ${key}${count > 1 ? "s" : ""} ago`;
      }
    }
    return "Just now";
  };

  // Tabs configuration
  const tabs = [
    { id: "all", label: "All", icon: Bell },
    { id: "order", label: "Orders", icon: ShoppingBag },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "customer", label: "Customers", icon: Users },
    { id: "system", label: "System", icon: Settings },
  ];

  // Initial fetch
  useEffect(() => {
    setPage(1);
    fetchNotifications(1, false);
  }, [selectedTab, fetchNotifications]);

  return (
    <div className="min-h-screen  to-white py-4 sm:px-2 lg:px-2">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg shadow-[#0D614E]/10 p-6 mb-6 border border-[#0D614E]/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-[#0D614E] to-[#0D614E]/80 rounded-xl shadow-lg shadow-[#0D614E]/20">
                  <Bell className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                  <p className="text-sm text-gray-500">
                    Stay updated with your Ayurvedic practice
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {unreadCount > 0 && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-[#0D614E]/10 text-[#0D614E] border border-[#0D614E]/20">
                  <Bell className="w-4 h-4 mr-1.5" />
                  {unreadCount} unread
                </span>
              )}
              <button
                onClick={markAllAsRead}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#0D614E] to-[#0D614E]/80 hover:from-[#0D614E]/90 hover:to-[#0D614E] rounded-xl transition-all duration-200 shadow-md shadow-[#0D614E]/20 hover:shadow-lg hover:shadow-[#0D614E]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={unreadCount === 0}
              >
                <Check className="w-4 h-4" />
                Mark all as read
              </button>
              {notifications?.length > 0 && (
                <button
                  onClick={clearAll}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                  Clear all
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        {/* <div className="bg-white rounded-2xl shadow-lg shadow-[#0D614E]/10 p-2 mb-6 overflow-x-auto border border-[#0D614E]/10">
          <div className="flex gap-1 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${selectedTab === tab.id
                    ? "bg-gradient-to-r from-[#0D614E] to-[#0D614E]/80 text-white shadow-lg shadow-[#0D614E]/20"
                    : "text-gray-600 hover:bg-[#0D614E]/5 hover:text-[#0D614E]"
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.id === "all" && unreadCount > 0 && (
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-xs ${selectedTab === tab.id
                        ? "bg-white text-[#0D614E]"
                        : "bg-[#0D614E]/10 text-[#0D614E]"
                      }`}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div> */}

        {/* Notifications List */}
        <div className="space-y-4">
          {loading && notifications?.length === 0 ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg shadow-[#0D614E]/10 p-6 animate-pulse border border-[#0D614E]/10"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#0D614E]/10 rounded-xl"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-[#0D614E]/10 rounded w-1/4"></div>
                    <div className="h-4 bg-[#0D614E]/10 rounded w-3/4"></div>
                    <div className="h-4 bg-[#0D614E]/10 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))
          ) : notifications?.length === 0 ? (
            // Empty state
            <div className="bg-white rounded-2xl shadow-lg shadow-[#0D614E]/10 p-12 text-center border border-[#0D614E]/10">
              <div className="flex flex-col items-center">
                <div className="p-4 bg-[#0D614E]/10 rounded-full mb-4">
                  <Inbox className="w-12 h-12 text-[#0D614E]/40" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No notifications
                </h3>
                <p className="text-gray-500 max-w-sm">
                  You're all caught up! New notifications will appear here.
                </p>
              </div>
            </div>
          ) : (
            // Notification items
            notifications.map((notification, index) => (
              <div
                key={notification.id}
                className={`bg-white rounded-2xl shadow-lg shadow-[#0D614E]/10 hover:shadow-xl hover:shadow-[#0D614E]/20 transition-all duration-300 border ${!notification.is_read
                    ? "border-l-4 border-l-[#0D614E] border-[#0D614E]/10"
                    : "border-[#0D614E]/10"
                  } animate-slideIn`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`flex-shrink-0 p-3 rounded-xl transition-transform duration-200 hover:scale-105 ${getIconBgColor(
                        notification.type
                      )}`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-semibold text-gray-900">
                              {notification.title}
                            </h3>
                            {!notification.is_read && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#0D614E]/10 text-[#0D614E]">
                                New
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                            {notification.message}
                          </p>
                          {notification.action && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {notification.action.button && (
                                <button
                                  onClick={() => {
                                    if (notification.action.url) {
                                      navigate(notification.action.url);
                                    }
                                  }}
                                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#0D614E] to-[#0D614E]/80 hover:from-[#0D614E]/90 hover:to-[#0D614E] rounded-xl transition-all duration-200 shadow-md shadow-[#0D614E]/20 hover:shadow-lg hover:shadow-[#0D614E]/30"
                                >
                                  {notification.action.label || "View"}
                                </button>
                              )}
                              {notification.action.secondary && (
                                <button
                                  onClick={() =>
                                    notification.action.secondaryAction?.()
                                  }
                                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#0D614E] bg-[#0D614E]/10 hover:bg-[#0D614E]/20 rounded-xl transition-colors duration-200"
                                >
                                  {notification.action.secondary}
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-gray-400 whitespace-nowrap flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {timeAgo(notification.created_at)}
                          </span>
                          {!notification.is_read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1.5 text-[#0D614E] hover:bg-[#0D614E]/10 rounded-lg transition-colors duration-200"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            title="Delete"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Load more */}
          {hasMore && notifications?.length > 0 && (
            <div className="text-center pt-4">
              <button
                onClick={loadMore}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-[#0D614E] bg-white hover:bg-[#0D614E]/5 rounded-xl transition-all duration-200 shadow-lg shadow-[#0D614E]/10 hover:shadow-[#0D614E]/20 border border-[#0D614E]/10"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Load older notifications
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add custom animation */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Notification;