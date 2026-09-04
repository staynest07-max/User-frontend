import { apiClient } from '@/api/client';
import type { CreateEnquiryInput, Enquiry } from '@/contracts/enquiry';

export const enquiryService = {
  list: async () => (await apiClient.get<Enquiry[]>('/users/enquiries')).data,
  detail: async (id: string) => (await apiClient.get<Enquiry>(`/users/enquiries/${id}`)).data,
  create: async (input: CreateEnquiryInput) => (await apiClient.post<Enquiry, CreateEnquiryInput>('/users/enquiries', input)).data,
};
