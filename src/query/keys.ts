export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    me: () => ['auth', 'me'] as const,
  },
  publicPgs: {
    all: ['public-pgs'] as const,
    home: () => ['public-pgs', 'home'] as const,
    list: (filters: object) => ['public-pgs', 'list', filters] as const,
    search: (filters: object) => ['public-pgs', 'search', filters] as const,
    detail: (id: string) => ['public-pgs', 'detail', id] as const,
  },
  user: {
    all: ['user'] as const,
    profile: () => ['user', 'profile'] as const,
  },
  preferences: { all: ['preferences'] as const },
  savedPgs: { all: ['saved-pgs'] as const },
  enquiries: {
    all: ['enquiries'] as const,
    detail: (id: string) => ['enquiries', 'detail', id] as const,
  },
  visits: {
    all: ['visits'] as const,
    detail: (id: string) => ['visits', 'detail', id] as const,
  },
  notifications: {
    all: ['notifications'] as const,
    list: (filters: object) => ['notifications', 'list', filters] as const,
    detail: (id: string) => ['notifications', 'detail', id] as const,
    unreadCount: () => ['notifications', 'unread-count'] as const,
  },
} as const;
