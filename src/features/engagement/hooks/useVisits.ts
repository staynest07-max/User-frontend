import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateVisitInput } from '@/contracts/visit';
import { queryKeys } from '@/query/keys';
import { visitService } from '../api/visitService';

export const useVisits = () => useQuery({ queryKey: queryKeys.visits.all, queryFn: visitService.list });
export const useVisit = (id?: string) => useQuery({ queryKey: queryKeys.visits.detail(id ?? ''), queryFn: () => visitService.detail(id!), enabled: Boolean(id) });
export function useCreateVisit() { const client = useQueryClient(); return useMutation({ mutationFn: (input: CreateVisitInput) => visitService.create(input), onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.visits.all }) }); }
export function useCancelVisit() { const client = useQueryClient(); return useMutation({ mutationFn: visitService.cancel, onSuccess: (visit) => { client.setQueryData(queryKeys.visits.detail(visit.id), visit); void client.invalidateQueries({ queryKey: queryKeys.visits.all }); } }); }
