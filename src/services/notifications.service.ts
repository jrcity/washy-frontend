import { api } from '@/lib/axios';
import type { 
  ApiResponse, 
  Notification, 
  NotificationFilters, 
  UnreadCountResponse,
  Pagination
} from '@/types';

interface NotificationsResponse {
  notifications: Notification[];
  pagination: Pagination;
}

/**
 * Get user notifications
 */
export const getNotifications = async (filters?: NotificationFilters): Promise<ApiResponse<NotificationsResponse>> => {
  const response = await api.get<ApiResponse<NotificationsResponse>>('/notifications', { params: filters });
  return response.data;
};

/**
 * Get unread notification count
 */
export const getUnreadCount = async (): Promise<ApiResponse<UnreadCountResponse>> => {
  const response = await api.get<ApiResponse<UnreadCountResponse>>('/notifications/unread-count');
  return response.data;
};

/**
 * Mark notification as read
 */
export const markAsRead = async (id: string): Promise<ApiResponse<Notification>> => {
  const response = await api.patch<ApiResponse<Notification>>(`/notifications/${id}/read`);
  return response.data;
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (): Promise<ApiResponse<void>> => {
  const response = await api.patch<ApiResponse<void>>('/notifications/read-all');
  return response.data;
};
