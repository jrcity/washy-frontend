// Notification Types
export type NotificationType = 
  | 'order_status'
  | 'payment'
  | 'promotion'
  | 'system';

// Notification
export interface Notification {
  _id: string;
  recipient: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  data?: Record<string, unknown>;
  createdAt: string;
}

// Notification Filters
export interface NotificationFilters {
  page?: number;
  limit?: number;
  isRead?: boolean;
}

// Unread Count Response
export interface UnreadCountResponse {
  count: number;
}
