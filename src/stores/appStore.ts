import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserPreferences } from '../types';
import { properties as allProperties } from '../data/mock';

interface AppState {
  hydrated: boolean;
  setHydrated: (v: boolean) => void;

  onboardingComplete: boolean;
  completeOnboarding: () => void;

  preferences: UserPreferences;
  setPreferences: (p: Partial<UserPreferences>) => void;

  locationGranted: boolean;
  setLocationGranted: (v: boolean) => void;

  savedIds: string[];
  toggleSave: (id: string) => void;

  recentlyViewed: string[];
  addRecentlyViewed: (id: string) => void;

  searchQuery: string;
  setSearchQuery: (q: string) => void;

  filters: {
    city: string;
    locality: string;
    roomType: string;
    rentMin: number;
    rentMax: number;
    pgType: string[];
    sharing: string[];
    amenities: string[];
    foodIncluded: boolean;
    verifiedOnly: boolean;
    sortBy: 'relevance' | 'rent' | 'distance' | 'rating' | 'newest';
  };
  setFilters: (f: Partial<AppState['filters']>) => void;
  resetFilters: () => void;

  getFilteredProperties: () => typeof allProperties;
}

const defaultPreferences: UserPreferences = {
  city: 'Pune',
  budgetMin: 5000,
  budgetMax: 20000,
  pgType: 'any',
  sharing: 'any',
};

const defaultFilters: AppState['filters'] = {
  city: '',
  locality: '',
  roomType: '',
  rentMin: 0,
  rentMax: 0,
  pgType: [],
  sharing: [],
  amenities: [],
  foodIncluded: false,
  verifiedOnly: false,
  sortBy: 'relevance',
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),

      onboardingComplete: false,
      completeOnboarding: () => set({ onboardingComplete: true }),

      preferences: defaultPreferences,
      setPreferences: (p) => set({ preferences: { ...get().preferences, ...p } }),

      locationGranted: false,
      setLocationGranted: (v) => set({ locationGranted: v }),

      savedIds: [],
      toggleSave: (id) => {
        const { savedIds } = get();
        set({
          savedIds: savedIds.includes(id)
            ? savedIds.filter((x) => x !== id)
            : [...savedIds, id],
        });
      },

      recentlyViewed: [],
      addRecentlyViewed: (id) => {
        const next = [id, ...get().recentlyViewed.filter((x) => x !== id)].slice(0, 10);
        set({ recentlyViewed: next });
      },

      searchQuery: '',
      setSearchQuery: (q) => set({ searchQuery: q }),

      filters: defaultFilters,
      setFilters: (f) => set({ filters: { ...get().filters, ...f } }),
      resetFilters: () => set({ filters: defaultFilters }),

      getFilteredProperties: () => {
        const { filters, searchQuery, preferences } = get();
        let list = [...allProperties];

        const q = searchQuery.trim().toLowerCase();
        if (q) {
          list = list.filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              p.area.toLowerCase().includes(q) ||
              p.city.toLowerCase().includes(q) ||
              p.landmark.toLowerCase().includes(q)
          );
        }

        if (preferences.city) {
          list = list.filter((p) => p.city === preferences.city || !preferences.city);
        }

        list = list.filter((p) =>
          p.startingRent >= filters.rentMin && (!filters.rentMax || p.startingRent <= filters.rentMax)
        );

        if (filters.pgType.length) {
          list = list.filter((p) => filters.pgType.includes(p.pgType));
        }
        if (filters.sharing.length) {
          list = list.filter((p) => p.sharingTypes.some((s) => filters.sharing.includes(s)));
        }
        if (filters.amenities.length) {
          list = list.filter((p) =>
            filters.amenities.every((a) => p.amenities.includes(a))
          );
        }
        if (filters.foodIncluded) {
          list = list.filter((p) => p.food.included);
        }
        if (filters.verifiedOnly) {
          list = list.filter((p) => p.verified);
        }

        switch (filters.sortBy) {
          case 'rent':
            list.sort((a, b) => a.startingRent - b.startingRent);
            break;
          case 'distance':
            list.sort((a, b) => (a.distanceKm ?? 99) - (b.distanceKm ?? 99));
            break;
          case 'rating':
            list.sort((a, b) => b.rating - a.rating);
            break;
          case 'newest':
            break;
          default:
            list.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
        }

        return list;
      },
    }),
    {
      name: 'staynest-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        onboardingComplete: s.onboardingComplete,
        preferences: s.preferences,
        savedIds: s.savedIds,
        recentlyViewed: s.recentlyViewed,
        locationGranted: s.locationGranted,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
