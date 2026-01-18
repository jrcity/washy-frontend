import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';
import * as notificationsService from '@/services/notifications.service';
import type { NotificationFilters } from '@/types';

import { getToken } from '@/lib/storage';

/**
 * Hook for fetching notifications
 */
export const useNotifications = (filters?: NotificationFilters) => {
  return useQuery({
    queryKey: queryKeys.notifications.list(filters),
    queryFn: async () => {
      const response = await notificationsService.getNotifications(filters);
      return response.data;
    },
    enabled: !!getToken(),
  });
};

/**
 * Hook for fetching unread count with polling
 */
export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey: queryKeys.notifications.unreadCount(),
    queryFn: async () => {
      const response = await notificationsService.getUnreadCount();
      return response.data?.count ?? 0;
    },
    refetchInterval: 30000, // Poll every 30 seconds
    enabled: !!getToken(),
    retry: false,
  });
};

/**
 * Hook for marking notification as read
 */
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
};

/**
 * Hook for marking all notifications as read
 */
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
};
