import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/query/keys';
import { notificationService, type NotificationPage } from '../api/notificationService';

export const nextNotificationPage = (last: NotificationPage) => last.page < last.totalPages ? last.page + 1 : undefined;
export function useNotifications() { return useInfiniteQuery({ queryKey: queryKeys.notifications.list({}), initialPageParam: 1, queryFn: ({ pageParam }) => notificationService.list({ page: pageParam, limit: 20 }), getNextPageParam: nextNotificationPage }); }
export const useUnreadCount = () => useQuery({ queryKey: queryKeys.notifications.unreadCount(), queryFn: notificationService.unreadCount, refetchInterval: 60_000 });
export function useMarkNotificationRead() { const client = useQueryClient(); return useMutation({ mutationFn: notificationService.markRead, onMutate: (id) => { client.setQueryData<number>(queryKeys.notifications.unreadCount(), (count = 0) => Math.max(0, count - 1)); client.setQueriesData<{ pages: NotificationPage[] }>({ queryKey: ['notifications', 'list'] }, (old) => old ? { ...old, pages: old.pages.map((page) => ({ ...page, items: page.items.map((item) => item.id === id ? { ...item, isRead: true, readAt: new Date().toISOString() } : item) })) } : old); }, onSettled: () => client.invalidateQueries({ queryKey: queryKeys.notifications.all }) }); }
export function useMarkAllNotificationsRead() { const client = useQueryClient(); return useMutation({ mutationFn: notificationService.markAllRead, onMutate: () => client.setQueryData(queryKeys.notifications.unreadCount(), 0), onSettled: () => client.invalidateQueries({ queryKey: queryKeys.notifications.all }) }); }
