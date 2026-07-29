import { useState, useEffect } from "react";
import {
  Bell,
  X,
  AlertTriangle,
  Info,
  CheckCircle2,
  Clock,
  Filter,
  Check,
  Package,
  DollarSign,
  ShoppingCart,
  Settings,
  UserCheck,
  Factory,
  Truck,
} from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { mockNotifications, type Notification } from "@/app/data/mock-notifications";

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<"all" | Notification["type"]>("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.type === filter);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getTypeConfig = (type: Notification["type"]) => {
    switch (type) {
      case "critical":
        return {
          icon: AlertTriangle,
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        };
      case "warning":
        return {
          icon: Clock,
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
        };
      case "approval":
        return {
          icon: UserCheck,
          color: "text-purple-600",
          bgColor: "bg-purple-50",
          borderColor: "border-purple-200",
        };
      case "success":
        return {
          icon: CheckCircle2,
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        };
      default:
        return {
          icon: Info,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        };
    }
  };

  const getCategoryIcon = (category: Notification["category"]) => {
    switch (category) {
      case "stock":
        return Package;
      case "order":
        return ShoppingCart;
      case "payment":
        return DollarSign;
      case "production":
        return Factory;
      case "dispatch":
        return Truck;
      case "approval":
        return UserCheck;
      default:
        return Settings;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Panel */}
          <div className="absolute right-0 mt-2 w-96 z-50 animate-fadeIn">
            <Card className="shadow-2xl border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-4 text-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    <h3 className="font-semibold text-lg">Notifications</h3>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="hover:bg-white/20 p-1 rounded transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                  <button
                    onClick={() => setFilter("all")}
                    className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                      filter === "all"
                        ? "bg-white text-indigo-600"
                        : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    All ({notifications.length})
                  </button>
                  <button
                    onClick={() => setFilter("critical")}
                    className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                      filter === "critical"
                        ? "bg-white text-red-600"
                        : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    Critical
                  </button>
                  <button
                    onClick={() => setFilter("approval")}
                    className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                      filter === "approval"
                        ? "bg-white text-purple-600"
                        : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    Approvals
                  </button>
                  <button
                    onClick={() => setFilter("warning")}
                    className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                      filter === "warning"
                        ? "bg-white text-yellow-600"
                        : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    Warnings
                  </button>
                </div>
              </div>

              {/* Mark All as Read */}
              {unreadCount > 0 && (
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                  >
                    <Check className="h-3 w-3" />
                    Mark all as read
                  </button>
                </div>
              )}

              {/* Notifications List */}
              <div className="max-h-[500px] overflow-y-auto">
                {filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No notifications</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredNotifications.map((notification) => {
                      const typeConfig = getTypeConfig(notification.type);
                      const TypeIcon = typeConfig.icon;
                      const CategoryIcon = getCategoryIcon(notification.category);

                      return (
                        <div
                          key={notification.id}
                          className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                            !notification.read ? "bg-blue-50/50" : ""
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex gap-3">
                            {/* Icon */}
                            <div
                              className={`flex-shrink-0 w-10 h-10 rounded-lg ${typeConfig.bgColor} ${typeConfig.borderColor} border flex items-center justify-center`}
                            >
                              <TypeIcon className={`h-5 w-5 ${typeConfig.color}`} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                                  {notification.title}
                                </h4>
                                {!notification.read && (
                                  <span className="flex-shrink-0 w-2 h-2 bg-indigo-600 rounded-full mt-1"></span>
                                )}
                              </div>

                              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                {notification.message}
                              </p>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <CategoryIcon className="h-3 w-3 text-gray-400" />
                                  <span className="text-xs text-gray-500">
                                    {formatTimestamp(notification.timestamp)}
                                  </span>
                                </div>

                                {notification.relatedEntity && (
                                  <span className="text-xs font-medium text-indigo-600">
                                    {notification.relatedEntity.id}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              {filteredNotifications.length > 0 && (
                <div className="p-3 bg-gray-50 border-t border-gray-200">
                  <button className="w-full py-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:bg-indigo-50 rounded-lg transition-colors">
                    View All Notifications
                  </button>
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
