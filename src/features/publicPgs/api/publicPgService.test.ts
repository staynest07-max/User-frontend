import { beforeEach, describe, expect, it, vi } from 'vitest';

const get = vi.hoisted(() => vi.fn());
vi.mock('@/api/client', () => ({ apiClient: { get } }));

import {
  publicPgListQuery,
  publicPgSearchQuery,
  publicPgService,
} from './publicPgService';

const pg = {
  id: 'pg-id', publicId: 'PG-1', name: 'Lakeview', description: 'A home',
  location: { address: 'Road', city: 'Hyderabad', locality: 'Madhapur', latitude: null, longitude: null },
  coverImage: null, gallerySummary: { count: 0 },
  pricing: { monthlyRent: 12000, deposit: 10000, maintenanceCharge: 0, foodCharge: 0 },
  amenities: ['WiFi'], roomSummary: { totalRooms: 1, totalBeds: 2, roomTypes: ['2 Sharing'] },
  availabilitySummary: { availableBeds: 1 },
};

describe('publicPgService', () => {
  beforeEach(() => vi.clearAllMocks());

  it('serializes listing filters using the backend contract', () => {
    expect(publicPgListQuery({
      page: 2, limit: 10, city: 'Hyderabad', locality: 'Madhapur', minRent: 8000,
      maxRent: 15000, roomType: '2 Sharing', amenities: ['WiFi', 'CCTV'],
    })).toBe('/public/pgs?page=2&limit=10&city=Hyderabad&locality=Madhapur&minRent=8000&maxRent=15000&roomType=2+Sharing&amenities=WiFi%2CCCTV');
  });

  it('serializes search without unsupported listing filters', () => {
    expect(publicPgSearchQuery({ keyword: 'lake view', city: 'Hyderabad', locality: 'Madhapur', page: 1 }))
      .toBe('/public/pgs/search?keyword=lake+view&page=1&city=Hyderabad&locality=Madhapur');
  });

  it('maps the backend pagination envelope', async () => {
    get.mockResolvedValue({
      success: true, data: [pg], meta: { page: 2, limit: 1, total: 3, totalPages: 3 },
    });
    await expect(publicPgService.list({ page: 2, limit: 1 })).resolves.toEqual({
      items: [pg], page: 2, limit: 1, total: 3, totalPages: 3,
    });
    expect(get).toHaveBeenCalledWith('/public/pgs?page=2&limit=1', { authenticated: false });
  });

  it('loads home and detail from public endpoints', async () => {
    const home = { featured: [pg], recentlyAdded: [], popularAreas: [] };
    get.mockResolvedValueOnce({ success: true, data: home });
    await expect(publicPgService.home()).resolves.toBe(home);
    expect(get).toHaveBeenNthCalledWith(1, '/public/home', { authenticated: false });

    const detail = { ...pg, category: 'Unisex / Co-living', rooms: [], media: [], availability: [] };
    get.mockResolvedValueOnce({ success: true, data: detail });
    await expect(publicPgService.detail('68f7cc2b-a92e-4c9c-874a-aee447f4ec19')).resolves.toBe(detail);
    expect(get).toHaveBeenNthCalledWith(
      2, '/public/pgs/68f7cc2b-a92e-4c9c-874a-aee447f4ec19', { authenticated: false }
    );
  });
});
