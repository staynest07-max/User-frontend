export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  profilePhotoUrl: string | null;
  occupation: string | null;
}

export interface UpdateUserProfileInput {
  fullName?: string;
  email?: string | null;
  profilePhotoUrl?: string | null;
  occupation?: string | null;
}

export type AccommodationPreference = 'Girls Only' | 'Boys Only' | 'Unisex / Co-living';

export interface UserPreferences {
  preferredCity: string | null;
  preferredLocality: string | null;
  minimumBudget: number | null;
  maximumBudget: number | null;
  preferredRoomType: string | null;
  foodPreference: string | null;
  preferredAmenities: string[];
  accommodationPreference: AccommodationPreference | null;
  preferredMoveInDate: string | null;
}

export type UpdateUserPreferencesInput = Partial<UserPreferences>;
