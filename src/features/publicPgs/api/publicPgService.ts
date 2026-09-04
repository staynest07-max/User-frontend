import { apiClient } from '@/api/client';
import type { ApiMeta } from '@/api/types';
import type {
  PublicHome,
  PublicPgDetail,
  PublicPgListFilters,
  PublicPgListItem,
  PublicPgSearchFilters,
} from '@/contracts/pg';

export interface PublicPgPage {
  items: PublicPgListItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

function addValue(params: URLSearchParams, key: string, value: string | number | undefined): void {
  if (value !== undefined && value !== '') params.set(key, String(value));
}

export function publicPgListQuery(filters: PublicPgListFilters): string {
  const params = new URLSearchParams();
  addValue(params, 'page', filters.page);
  addValue(params, 'limit', filters.limit);
  addValue(params, 'city', filters.city?.trim());
  addValue(params, 'locality', filters.locality?.trim());
  addValue(params, 'minRent', filters.minRent);
  addValue(params, 'maxRent', filters.maxRent);
  addValue(params, 'roomType', filters.roomType?.trim());
  if (filters.amenities?.length) params.set('amenities', filters.amenities.join(','));
  const query = params.toString();
  return query ? `/public/pgs?${query}` : '/public/pgs';
}

export function publicPgSearchQuery(filters: PublicPgSearchFilters): string {
  const params = new URLSearchParams();
  addValue(params, 'keyword', filters.keyword.trim());
  addValue(params, 'page', filters.page);
  addValue(params, 'limit', filters.limit);
  addValue(params, 'city', filters.city?.trim());
  addValue(params, 'locality', filters.locality?.trim());
  return `/public/pgs/search?${params.toString()}`;
}

function pageFrom(items: PublicPgListItem[], meta?: ApiMeta): PublicPgPage {
  return {
    items,
    page: meta?.page ?? 1,
    limit: meta?.limit ?? items.length,
    total: meta?.total ?? items.length,
    totalPages: meta?.totalPages ?? 1,
  };
}

export const publicPgService = {
  async home(): Promise<PublicHome> {
    return (await apiClient.get<PublicHome>('/public/home', { authenticated: false })).data;
  },

  async list(filters: PublicPgListFilters = {}): Promise<PublicPgPage> {
    const response = await apiClient.get<PublicPgListItem[]>(publicPgListQuery(filters), { authenticated: false });
    return pageFrom(response.data, response.meta);
  },

  async search(filters: PublicPgSearchFilters): Promise<PublicPgPage> {
    const response = await apiClient.get<PublicPgListItem[]>(publicPgSearchQuery(filters), { authenticated: false });
    return pageFrom(response.data, response.meta);
  },

  async detail(id: string): Promise<PublicPgDetail> {
    return (await apiClient.get<PublicPgDetail>(`/public/pgs/${encodeURIComponent(id)}`, {
      authenticated: false,
    })).data;
  },
};
