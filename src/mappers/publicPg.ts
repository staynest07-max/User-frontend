import type { PublicPgListItem } from '@/contracts/pg';
import type { PropertyCardModel } from '@/design-system/components/PropertyCard';

export function toPropertyCardModel(pg: PublicPgListItem): PropertyCardModel {
  return {
    id: pg.id,
    name: pg.name,
    area: pg.location.locality,
    city: pg.location.city,
    coverImage: pg.coverImage,
    startingRent: pg.pricing.monthlyRent,
    amenities: pg.amenities,
    roomTypeLabels: pg.roomSummary.roomTypes,
    availableBeds: pg.availabilitySummary.availableBeds,
  };
}
