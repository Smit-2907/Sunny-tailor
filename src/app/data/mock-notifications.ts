export interface Notification {
  id: string;
  type: "critical" | "warning" | "info" | "approval" | "success";
  category: "stock" | "order" | "payment" | "system" | "approval" | "production" | "dispatch";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  relatedEntity?: {
    type: string;
    id: string;
    name: string;
  };
}

// Empty array - no dummy notifications
export const mockNotifications: Notification[] = [];

export const getUnreadCount = () => {
  return mockNotifications.filter(n => !n.read).length;
};

export const getNotificationsByType = (type: Notification["type"]) => {
  return mockNotifications.filter(n => n.type === type);
};

export const getNotificationsByCategory = (category: Notification["category"]) => {
  return mockNotifications.filter(n => n.category === category);
};

export const markAsRead = (notificationId: string) => {
  const notification = mockNotifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
  }
};

export const markAllAsRead = () => {
  mockNotifications.forEach(n => n.read = true);
};