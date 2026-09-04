import { apiClient } from '@/api/client';
import type { SavedPg } from '@/contracts/pg';

export const savedPgService = {
  list: async () => (await apiClient.get<SavedPg[]>('/users/saved-pgs')).data,
  save: async (pgId: string) => (await apiClient.post<{ saved: true }>(`/users/saved-pgs/${pgId}`, {})).data,
  remove: async (pgId: string) => (await apiClient.delete<{ removed: boolean }>(`/users/saved-pgs/${pgId}`)).data,
};
