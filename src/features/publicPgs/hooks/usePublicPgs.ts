import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { PublicPgListFilters } from '@/contracts/pg';
import { queryKeys } from '@/query/keys';
import { publicPgService } from '../api/publicPgService';
import type { PublicPgPage } from '../api/publicPgService';

export function getNextPublicPgPage(lastPage: PublicPgPage): number | undefined {
  return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined;
}

export function usePublicHome() {
  return useQuery({
    queryKey: queryKeys.publicPgs.home(),
    queryFn: () => publicPgService.home(),
  });
}

export function usePublicPgResults(keyword: string, filters: PublicPgListFilters) {
  const normalizedKeyword = keyword.trim();
  const criteria = { ...filters, page: undefined };
  const key = normalizedKeyword
    ? queryKeys.publicPgs.search({ keyword: normalizedKeyword, ...criteria })
    : queryKeys.publicPgs.list(criteria);

  return useInfiniteQuery({
    queryKey: key,
    initialPageParam: 1,
    queryFn: ({ pageParam }) => normalizedKeyword
      ? publicPgService.search({
          keyword: normalizedKeyword,
          page: pageParam,
          limit: filters.limit,
          city: filters.city,
          locality: filters.locality,
        })
      : publicPgService.list({ ...filters, page: pageParam }),
    getNextPageParam: getNextPublicPgPage,
  });
}

export function usePublicPgDetail(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.publicPgs.detail(id ?? ''),
    queryFn: () => publicPgService.detail(id!),
    enabled: Boolean(id),
  });
}
