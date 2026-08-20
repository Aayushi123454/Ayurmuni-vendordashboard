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
  Calendar,
  User,
  Video,
  MapPin,
  FileText,
  RefreshCw,
  Heart,
  Stethoscope,
  Pill,
  Activity,
  Zap,
  AlertTriangle,
  Info,
  Phone,
  Mail,
  ExternalLink,
} from "lucide-react";
import { notificationService } from "../../../services/notificationService";

const Notification = () => {
  const navigate = useNavigate();
  const role = sessionStorage.getItem("role") || "doctor";
  const isVendor = role === "vendor";
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [actionLoading, setActionLoading] = useState({});
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

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
        params.append("notification_type", selectedTab);
      }

      const response = await notificationService.get(params);
      const data = response?.data?.data;

      if (data) {
        const results = data.results || [];
        if (append) {
          setNotifications((prev) => [...prev, ...results]);
        } else {
          setNotifications(results);
        }
        setTotalCount(data.count || 0);
        setHasMore(data.next !== null);
        setUnreadCount((prev) => prev + (results?.filter(n => !n.is_read).length || 0));
      }
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
      setActionLoading(prev => ({ ...prev, [notificationId]: 'read' }));
      await notificationService.markRead(notificationId);

      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      toast.success("Marked as read");
      window.location.reload(); // Refresh the page to reflect changes
    } catch (error) {
      toast.error("Failed to mark as read");
    } finally {
      setActionLoading(prev => ({ ...prev, [notificationId]: undefined }));
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      setActionLoading(prev => ({ ...prev, all: true }));
      await notificationService.markAllRead();

      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, is_read: true }))
      );
      setUnreadCount(0);
      toast.success("All notifications marked as read");
      window.location.reload(); // Refresh the page to reflect changes
    } catch (error) {
      toast.error("Failed to mark all as read");
    } finally {
      setActionLoading(prev => ({ ...prev, all: false }));
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      setActionLoading(prev => ({ ...prev, [notificationId]: 'delete' }));
      await notificationService.delete(notificationId);

      setNotifications((prev) =>
        prev.filter((notif) => notif.id !== notificationId)
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      toast.success("Notification deleted");
      window.location.reload(); // Refresh the page to reflect changes
    } catch (error) {
      toast.error("Failed to delete notification");
    } finally {
      setActionLoading(prev => ({ ...prev, [notificationId]: undefined }));
    }
  };

  // Clear all notifications
  const clearAll = async () => {
    try {
      setActionLoading(prev => ({ ...prev, clearAll: true }));
      await notificationService.clearAll();

      setNotifications([]);
      setUnreadCount(0);
      toast.success("All notifications cleared");
      window.location.reload(); // Refresh the page to reflect changes
    } catch (error) {
      toast.error("Failed to clear notifications");
    } finally {
      setActionLoading(prev => ({ ...prev, clearAll: false }));
    }
  };

  // Get status color based on notification type and event
  const getStatusColor = (notification) => {
    const type = notification.notification_type;
    const event = notification.data?.event;

    // Priority-based colors
    const priorityColors = {
      'appointment.booked': '#10B981', // Green - Success/New
      'appointment.cancellation_requested': '#EF4444', // Red - Urgent
      'appointment.reschedule_requested': '#F59E0B', // Yellow - Warning
      'appointment.rescheduled_by_admin': '#3B82F6', // Blue - Info
      'appointment.rescheduled': '#8B5CF6', // Purple - Update
    };

    // Type-based colors
    const typeColors = {
      appointment: '#3B82F6',
      order: '#F59E0B',
      inventory: '#8B5CF6',
      customer: '#EC4899',
      system: '#6B7280',
      success: '#10B981',
      warning: '#F59E0B',
      message: '#3B82F6',
    };

    return priorityColors[event] || typeColors[type] || '#6B7280';
  };

  // Get status background color
  const getStatusBgColor = (notification) => {
    const color = getStatusColor(notification);
    return `${color}15`;
  };

  // Get icon based on notification type and event
  const getNotificationIcon = (notification) => {
    const type = notification.notification_type;
    const event = notification.data?.event;

    const iconMap = {
      'appointment.booked': <Calendar className="w-5 h-5 text-white" />,
      'appointment.cancellation_requested': <X className="w-5 h-5 text-white" />,
      'appointment.reschedule_requested': <RefreshCw className="w-5 h-5 text-white" />,
      'appointment.rescheduled_by_admin': <RefreshCw className="w-5 h-5 text-white" />,
      'appointment.rescheduled': <RefreshCw className="w-5 h-5 text-white" />,
    };

    const typeIconMap = {
      appointment: <Stethoscope className="w-5 h-5 text-white" />,
      order: <ShoppingBag className="w-5 h-5 text-white" />,
      inventory: <Package className="w-5 h-5 text-white" />,
      customer: <Users className="w-5 h-5 text-white" />,
      system: <Settings className="w-5 h-5 text-white" />,
      message: <MessageCircle className="w-5 h-5 text-white" />,
      success: <CheckCircle className="w-5 h-5 text-white" />,
      warning: <AlertCircle className="w-5 h-5 text-white" />,
    };

    return iconMap[event] || typeIconMap[type] || <Bell className="w-5 h-5 text-white" />;
  };

  // Get icon background color
  const getIconBgColor = (notification) => {
    const color = getStatusColor(notification);
    return {
      backgroundColor: color,
    };
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

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format date for modal
  const formatDateLong = (date) => {
    return new Date(date).toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setShowDetailModal(true);
  };

  // Handle action button click
  const handleActionClick = (notification) => {
    if (isVendor) {
      const entityType = notification.data?.entity_type || notification.data?.profile_type;
      if (entityType === "vendor" || notification.data?.event?.includes("approval")) {
        navigate("/vendor/profile");
      } else if (notification.notification_type === "order") {
        navigate("/vendor/orders");
      } else {
        navigate("/vendor/dashboard");
      }
    } else if (notification.data?.appointment_id) {
      navigate(`/doctor/appointments/appointment/${notification.data.appointment_id}`);
    }
    setShowDetailModal(false);
  };

  // Get event type label
  const getEventLabel = (event) => {
    const labels = {
      'appointment.booked': 'New Appointment',
      'appointment.cancellation_requested': 'Cancellation Requested',
      'appointment.reschedule_requested': 'Reschedule Requested',
      'appointment.rescheduled_by_admin': 'Rescheduled by Admin',
      'appointment.rescheduled': 'Rescheduled',
      'PROFILE_SUBMITTED': 'Profile Submitted',
      'APPROVAL_STATUS_CHANGED': 'Approval Update',
      'USER_REGISTERED': 'Registration',
    };
    return labels[event] || event || 'Update';
  };

  // Get event type color
  const getEventColor = (event) => {
    const colors = {
      'appointment.booked': 'bg-green-100 text-green-700',
      'appointment.cancellation_requested': 'bg-red-100 text-red-700',
      'appointment.reschedule_requested': 'bg-yellow-100 text-yellow-700',
      'appointment.rescheduled_by_admin': 'bg-blue-100 text-blue-700',
      'appointment.rescheduled': 'bg-purple-100 text-purple-700',
    };
    return colors[event] || 'bg-gray-100 text-gray-700';
  };

  // Tabs configuration
  const tabs = [
    { id: "all", label: "All", icon: Bell },
    { id: "appointment", label: "Appointments", icon: Calendar },
    { id: "order", label: "Orders", icon: ShoppingBag },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "system", label: "System", icon: Settings },
  ];

  // Initial fetch
  useEffect(() => {
    setPage(1);
    fetchNotifications(1, false);
  }, [selectedTab, fetchNotifications]);

  // Close modal on escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowDetailModal(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div className="min-h-screen py-4 px-2 sm:px-6 lg:px-4">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg shadow-[#0D614E]/10 p-6 mb-6 border border-[#0D614E]/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-[#0D614E] to-[#0D614E]/80 rounded-xl shadow-lg shadow-[#0D614E]/20">
                <Bell className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isVendor ? "Vendor Notifications" : "Notifications"}
                </h1>
                <p className="text-sm text-gray-500">
                  {totalCount > 0 ? `You have ${totalCount} notification${totalCount > 1 ? 's' : ''}` : 'No notifications yet'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {/* {unreadCount > 0 && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-[#0D614E]/10 text-[#0D614E] border border-[#0D614E]/20">
                  <Bell className="w-4 h-4 mr-1.5" />
                  {unreadCount} unread
                </span>
              )} */}
              <button
                onClick={markAllAsRead}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#0D614E] to-[#0D614E]/80 hover:from-[#0D614E]/90 hover:to-[#0D614E] rounded-xl transition-all duration-200 shadow-md shadow-[#0D614E]/20 hover:shadow-lg hover:shadow-[#0D614E]/30 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={unreadCount === 0 || actionLoading.all}
              >
                {actionLoading.all ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Mark all as read
              </button>
              {notifications?.length > 0 && (
                <button
                  onClick={clearAll}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={actionLoading.clearAll}
                >
                  {actionLoading.clearAll ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
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
            notifications.map((notification, index) => {
              const eventLabel = notification.data?.event ? getEventLabel(notification.data.event) : notification.notification_type || 'Update';
              const statusColor = getStatusColor(notification);
              const eventColorClass = getEventColor(notification.data?.event);

              return (
                <div
                  key={notification.id}
                  className={`bg-white rounded-2xl shadow-lg shadow-[#0D614E]/10 hover:shadow-xl hover:shadow-[#0D614E]/20 transition-all duration-300 border ${!notification.is_read
                    ? `border-l-4 border-l-[${statusColor}] border-[#0D614E]/10`
                    : "border-[#0D614E]/10"
                    } animate-slideIn cursor-pointer`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    borderLeftColor: !notification.is_read ? statusColor : undefined
                  }}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Icon with status color */}
                      <div
                        className="flex-shrink-0 p-3 rounded-xl transition-transform duration-200 hover:scale-105"
                        style={getIconBgColor(notification)}
                      >
                        {getNotificationIcon(notification)}
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
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${eventColorClass}`}>
                                {eventLabel}
                              </span>
                              {/* Status indicator dot */}
                              <span
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                                style={{
                                  backgroundColor: `${statusColor}20`,
                                  color: statusColor
                                }}
                              >
                                <span
                                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                                  style={{ backgroundColor: statusColor }}
                                />
                                {notification.is_read ? 'Read' : 'Unread'}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-600 leading-relaxed line-clamp-2">
                              {notification.message}
                            </p>
                            {notification.data?.appointment_id && (
                              <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
                                <span className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  {notification.data?.patient_name || 'Patient'}
                                </span>
                                {notification.data?.appointment_date && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(notification.data.appointment_date)}
                                  </span>
                                )}
                                {notification.data?.consultation_type && (
                                  <span className="flex items-center gap-1">
                                    <Video className="w-3 h-3" />
                                    {notification.data.consultation_type}
                                  </span>
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                                className="p-1.5 text-[#0D614E] hover:bg-[#0D614E]/10 rounded-lg transition-colors duration-200"
                                title="Mark as read"
                                disabled={actionLoading[notification.id] === 'read'}
                              >
                                {actionLoading[notification.id] === 'read' ? (
                                  <Loader className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Check className="w-4 h-4" />
                                )}
                              </button>
                            )}
                            {/* <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              title="Delete"
                              disabled={actionLoading[notification.id] === 'delete'}
                            >
                              {actionLoading[notification.id] === 'delete' ? (
                                <Loader className="w-4 h-4 animate-spin" />
                              ) : (
                                <X className="w-4 h-4" />
                              )}
                            </button> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
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

      {/* Notification Detail Modal */}
      {showDetailModal && selectedNotification && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowDetailModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with status color */}
            <div
              className="sticky top-0 bg-white border-b p-4 flex items-center justify-between"
              style={{
                borderBottomColor: getStatusColor(selectedNotification),
                borderBottomWidth: '3px'
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="p-2.5 rounded-xl"
                  style={getIconBgColor(selectedNotification)}
                >
                  {getNotificationIcon(selectedNotification)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedNotification.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-sm text-gray-500">
                      {formatDateLong(selectedNotification.created_at)}
                    </p>
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${getStatusColor(selectedNotification)}20`,
                        color: getStatusColor(selectedNotification)
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: getStatusColor(selectedNotification) }}
                      />
                      {selectedNotification.is_read ? 'Read' : 'Unread'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Status Banner */}
              <div
                className="rounded-xl p-4 flex items-start gap-3"
                style={{
                  backgroundColor: `${getStatusColor(selectedNotification)}15`,
                  border: `1px solid ${getStatusColor(selectedNotification)}30`
                }}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {selectedNotification.is_read ? (
                    <CheckCircle className="w-5 h-5" style={{ color: getStatusColor(selectedNotification) }} />
                  ) : (
                    <Bell className="w-5 h-5" style={{ color: getStatusColor(selectedNotification) }} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: getStatusColor(selectedNotification) }}>
                    {selectedNotification.is_read ? 'This notification has been read' : 'This notification is unread'}
                  </p>
                  <p className="text-xs opacity-75" style={{ color: getStatusColor(selectedNotification) }}>
                    {selectedNotification.is_read
                      ? `Read on ${formatDateLong(selectedNotification.read_at || selectedNotification.updated_at)}`
                      : 'Mark as read to remove this status'
                    }
                  </p>
                </div>
              </div>

              {/* Message */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Message
                </h4>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-800 leading-relaxed">{selectedNotification.message}</p>
                </div>
              </div>

              {/* Event Type */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Event Type
                </h4>
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getEventColor(selectedNotification.data?.event)}`}>
                  {getEventLabel(selectedNotification.data?.event)}
                </span>
              </div>

              {/* Details */}
              {selectedNotification.data && Object.keys(selectedNotification.data).length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Details
                  </h4>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2 divide-y divide-gray-200/50">
                    {selectedNotification.data.patient_name && (
                      <div className="flex items-center gap-3 py-2 first:pt-0 last:pb-0">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          <span className="font-medium">Patient:</span> {selectedNotification.data.patient_name}
                        </span>
                      </div>
                    )}
                    {selectedNotification.data.doctor_name && (
                      <div className="flex items-center gap-3 py-2 first:pt-0 last:pb-0">
                        <Stethoscope className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          <span className="font-medium">Doctor:</span> {selectedNotification.data.doctor_name}
                        </span>
                      </div>
                    )}
                    {selectedNotification.data.appointment_date && (
                      <div className="flex items-center gap-3 py-2 first:pt-0 last:pb-0">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          <span className="font-medium">Date:</span> {formatDateLong(selectedNotification.data.appointment_date)}
                        </span>
                      </div>
                    )}
                    {selectedNotification.data.slot && (
                      <div className="flex items-center gap-3 py-2 first:pt-0 last:pb-0">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          <span className="font-medium">Slot:</span> {selectedNotification.data.slot}
                        </span>
                      </div>
                    )}
                    {selectedNotification.data.concern && (
                      <div className="flex items-start gap-3 py-2 first:pt-0 last:pb-0">
                        <AlertCircle className="w-4 h-4 text-gray-400 mt-0.5" />
                        <span className="text-sm text-gray-600">
                          <span className="font-medium">Concern:</span> {selectedNotification.data.concern}
                        </span>
                      </div>
                    )}
                    {selectedNotification.data.reason && (
                      <div className="flex items-start gap-3 py-2 first:pt-0 last:pb-0">
                        <AlertTriangle className="w-4 h-4 text-gray-400 mt-0.5" />
                        <span className="text-sm text-gray-600">
                          <span className="font-medium">Reason:</span> {selectedNotification.data.reason}
                        </span>
                      </div>
                    )}
                    {selectedNotification.data.location && (
                      <div className="flex items-center gap-3 py-2 first:pt-0 last:pb-0">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          <span className="font-medium">Location:</span> {selectedNotification.data.location}
                        </span>
                      </div>
                    )}
                    {selectedNotification.data.appointment_status && (
                      <div className="flex items-center gap-3 py-2 first:pt-0 last:pb-0">
                        <Activity className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          <span className="font-medium">Status:</span>
                          <span className="ml-1 capitalize">{selectedNotification.data.appointment_status.replace('_', ' ')}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                {selectedNotification.data?.deep_link && !isVendor && (
                  <button
                    onClick={() => handleActionClick(selectedNotification)}
                    className="flex-1 px-4 py-3 text-white bg-gradient-to-r from-[#0D614E] to-[#0D614E]/80 hover:from-[#0D614E]/90 hover:to-[#0D614E] rounded-xl transition-all duration-200 shadow-md shadow-[#0D614E]/20 hover:shadow-lg hover:shadow-[#0D614E]/30 flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Appointment
                  </button>
                )}
                {isVendor && (
                  <button
                    onClick={() => handleActionClick(selectedNotification)}
                    className="flex-1 px-4 py-3 text-white bg-gradient-to-r from-[#0D614E] to-[#0D614E]/80 rounded-xl flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open in Dashboard
                  </button>
                )}
                {!selectedNotification.is_read && (
                  <button
                    onClick={() => {
                      markAsRead(selectedNotification.id);
                      setShowDetailModal(false);
                    }}
                    className="flex-1 px-4 py-3 text-[#0D614E] bg-[#0D614E]/10 hover:bg-[#0D614E]/20 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Mark as Read
                  </button>
                )}
                {/* <button
                  onClick={() => {
                    deleteNotification(selectedNotification.id);
                    setShowDetailModal(false);
                  }}
                  className="px-4 py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                </button> */}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
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
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out forwards;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Notification;