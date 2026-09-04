import { apiClient } from '@/api/client';
import type { CreateVisitInput, Visit } from '@/contracts/visit';

export const visitService = {
  list: async () => (await apiClient.get<Visit[]>('/users/visits')).data,
  detail: async (id: string) => (await apiClient.get<Visit>(`/users/visits/${id}`)).data,
  create: async (input: CreateVisitInput) => (await apiClient.post<Visit, CreateVisitInput>('/users/visits', input)).data,
  cancel: async (id: string) => (await apiClient.patch<Visit, Record<string, never>>(`/users/visits/${id}/cancel`, {})).data,
};
