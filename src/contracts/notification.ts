export const NOTIFICATION_TYPES = [
  'ENQUIRY_CREATED', 'ENQUIRY_UPDATED', 'VISIT_REQUESTED', 'VISIT_CONFIRMED',
  'VISIT_REJECTED', 'VISIT_RESCHEDULED', 'VISIT_CANCELLED',
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];
export type NotificationRelatedEntityType = 'ENQUIRY' | 'VISIT';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  relatedEntity: { type: NotificationRelatedEntityType; id: string } | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationListFilters { page?: number; limit?: number; unread?: boolean }
