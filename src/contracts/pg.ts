export type PgCategory = 'Girls Only' | 'Boys Only' | 'Unisex / Co-living';

export interface PgLocation {
  address: string;
  city: string;
  locality: string;
  latitude: number | null;
  longitude: number | null;
}

export interface PublicPgPricing {
  monthlyRent: number | null;
  deposit: number;
  maintenanceCharge: number;
  foodCharge: number;
}

export interface PublicPgListItem {
  id: string;
  publicId: string;
  name: string;
  description: string;
  location: PgLocation;
  coverImage: string | null;
  gallerySummary: { count: number };
  pricing: PublicPgPricing;
  amenities: string[];
  roomSummary: { totalRooms: number; totalBeds: number; roomTypes: string[] };
  availabilitySummary: { availableBeds: number };
}

export interface PgRoom {
  id: string;
  publicId: string;
  roomNumber: string;
  roomType: string;
  building?: string;
  floor?: string;
  wing?: string;
  totalBeds: number;
  occupiedBeds?: number;
  monthlyRent: number;
  amenities?: string[];
}

export interface PgMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  isCover?: boolean;
  sortOrder?: number;
}

export interface PgAvailability {
  id: string;
  roomType: string;
  totalBeds: number;
  availableBeds: number;
  monthlyRent: number;
}

export interface PublicPgDetail {
  id: string;
  publicId: string;
  name: string;
  description: string;
  category: PgCategory;
  location: PgLocation;
  pricing: PublicPgPricing & {
    electricityDetails: Record<string, unknown> | null;
    otherCharges: Array<Record<string, unknown>>;
  };
  rooms: PgRoom[];
  media: PgMedia[];
  amenities: string[];
  availability: PgAvailability[];
  foodDetails: Record<string, unknown> | null;
  rules: string[];
  safetyFeatures: string[];
}

export interface PublicPgListFilters {
  page?: number;
  limit?: number;
  city?: string;
  locality?: string;
  minRent?: number;
  maxRent?: number;
  roomType?: string;
  amenities?: string[];
}

export interface PublicPgSearchFilters {
  keyword: string;
  page?: number;
  limit?: number;
  city?: string;
  locality?: string;
}

export interface PopularArea { city: string; locality: string; listingCount: number }
export interface PublicHome {
  featured: PublicPgListItem[];
  recentlyAdded: PublicPgListItem[];
  popularAreas: PopularArea[];
}

export interface SavedPg {
  savedAt: string;
  pg: PublicPgDetail;
}
