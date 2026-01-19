export type NotificationType = 'order_status' | 'payment' | 'promotion' | 'system';

export interface Notification {
  _id: string;
  recipient: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}

export interface UnreadCountResponse {
  count: number;
}

export interface NotificationFilters {
  isRead?: boolean;
  type?: NotificationType;
}
