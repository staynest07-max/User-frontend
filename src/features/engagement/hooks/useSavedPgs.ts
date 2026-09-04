import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PublicPgDetail, SavedPg } from '@/contracts/pg';
import { queryKeys } from '@/query/keys';
import { savedPgService } from '../api/savedPgService';

export const useSavedPgs = () => useQuery({ queryKey: queryKeys.savedPgs.all, queryFn: savedPgService.list });

export function useSavedPgToggle(pgId: string) {
  const client = useQueryClient();
  const records = client.getQueryData<SavedPg[]>(queryKeys.savedPgs.all);
  const saved = records?.some((item) => item.pg.id === pgId) ?? false;
  const mutation = useMutation<unknown, Error, boolean, { previous?: SavedPg[] }>({
    mutationFn: async (wasSaved) => wasSaved ? savedPgService.remove(pgId) : savedPgService.save(pgId),
    onMutate: async (wasSaved) => {
      await client.cancelQueries({ queryKey: queryKeys.savedPgs.all });
      const previous = client.getQueryData<SavedPg[]>(queryKeys.savedPgs.all);
      if (wasSaved) client.setQueryData<SavedPg[]>(queryKeys.savedPgs.all, (old = []) => old.filter((x) => x.pg.id !== pgId));
      else {
        const pg = client.getQueryData<PublicPgDetail>(queryKeys.publicPgs.detail(pgId));
        if (pg) client.setQueryData<SavedPg[]>(queryKeys.savedPgs.all, (old = []) => [{ pg, savedAt: new Date().toISOString() }, ...old]);
      }
      return { previous };
    },
    onError: (_error, _saved, context) => client.setQueryData(queryKeys.savedPgs.all, context?.previous),
    onSettled: () => client.invalidateQueries({ queryKey: queryKeys.savedPgs.all }),
  });
  return { saved, toggle: () => mutation.mutate(saved), ...mutation };
}
