import { describe, expect, it } from 'vitest';
import { toPropertyCardModel } from './publicPg';

describe('toPropertyCardModel', () => {
  it('maps only fields supplied by the public backend DTO', () => {
    const result = toPropertyCardModel({
      id: 'id', publicId: 'PG-1', name: 'Lakeview', description: 'Home',
      location: { address: 'Road', city: 'Hyderabad', locality: 'Madhapur', latitude: null, longitude: null },
      coverImage: null, gallerySummary: { count: 0 },
      pricing: { monthlyRent: 12000, deposit: 10000, maintenanceCharge: 0, foodCharge: 0 },
      amenities: ['WiFi'], roomSummary: { totalRooms: 1, totalBeds: 2, roomTypes: ['2 Sharing'] },
      availabilitySummary: { availableBeds: 1 },
    });
    expect(result).toEqual({
      id: 'id', name: 'Lakeview', area: 'Madhapur', city: 'Hyderabad', coverImage: null,
      startingRent: 12000, amenities: ['WiFi'], roomTypeLabels: ['2 Sharing'], availableBeds: 1,
    });
    expect(result).not.toHaveProperty('rating');
    expect(result).not.toHaveProperty('merchantId');
  });
});
