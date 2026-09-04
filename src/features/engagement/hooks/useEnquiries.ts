import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateEnquiryInput } from '@/contracts/enquiry';
import { queryKeys } from '@/query/keys';
import { enquiryService } from '../api/enquiryService';

export const useEnquiries = () => useQuery({ queryKey: queryKeys.enquiries.all, queryFn: enquiryService.list });
export const useEnquiry = (id?: string) => useQuery({ queryKey: queryKeys.enquiries.detail(id ?? ''), queryFn: () => enquiryService.detail(id!), enabled: Boolean(id) });
export function useCreateEnquiry() { const client = useQueryClient(); return useMutation({ mutationFn: (input: CreateEnquiryInput) => enquiryService.create(input), onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.enquiries.all }) }); }
