import { apiClient } from '@/api/client';
import type { Notification, NotificationListFilters } from '@/contracts/notification';

export interface NotificationPage { items: Notification[]; page: number; limit: number; total: number; totalPages: number }

export function notificationQuery(filters: NotificationListFilters): string {
  const query = new URLSearchParams();
  if (filters.page) query.set('page', String(filters.page));
  if (filters.limit) query.set('limit', String(filters.limit));
  if (filters.unread !== undefined) query.set('unread', String(filters.unread));
  const value = query.toString();
  return value ? `?${value}` : '';
}

export const notificationService = {
  list: async (filters: NotificationListFilters = {}) => {
    const response = await apiClient.get<Notification[]>(`/users/notifications${notificationQuery(filters)}`);
    return { items: response.data, page: Number(response.meta?.page ?? 1), limit: Number(response.meta?.limit ?? 20), total: Number(response.meta?.total ?? response.data.length), totalPages: Number(response.meta?.totalPages ?? 1) } satisfies NotificationPage;
  },
  unreadCount: async () => (await apiClient.get<{ count: number }>('/users/notifications/unread-count')).data.count,
  markRead: async (id: string) => (await apiClient.patch<Notification, Record<string, never>>(`/users/notifications/${id}/read`, {})).data,
  markAllRead: async () => (await apiClient.patch<{ updated: number }, Record<string, never>>('/users/notifications/read-all', {})).data,
};
