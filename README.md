# StayNest

Premium PG (Paying Guest) discovery platform for seekers, owners, and platform ops.

Built with **Expo + React Native + TypeScript**, designed as a lifestyle hospitality product — warm Scandinavian / Japandi aesthetics, not a generic real-estate marketplace.

## Run

```bash
# Node 20+ recommended
nvm use 20
npm install --legacy-peer-deps
npm start
```

Then press `i` for iOS simulator, `a` for Android, or scan the QR with Expo Go.

## Roles

| Role | Entry |
|------|--------|
| **Seeker** | Onboarding → Home tabs |
| **Guest** | Browse without login; OTP required for enquire / visit |
| **Merchant** | Welcome → “I’m a PG owner” → OTP → Owner dashboard |
| **Admin** | Profile → “Switch to admin” |

Demo OTP: any 4 digits.

## What’s included

### Design system (`src/design-system`)
- Color, typography, spacing (8pt), radius, elevation, motion tokens
- Dark-mode-ready color architecture
- Components: Text, Button, Input, SearchBar, PropertyCard, Chip, Badge, BottomSheet, Skeleton, Empty/Error states

### Seeker screens
Onboarding, auth, location permission, home, search, results, map, filters, property details, gallery, amenities, rooms, reviews, enquire, book visit, success, saved, bookings, notifications, messages, profile, settings, help, preferences

### Merchant screens
Dashboard, listings, add PG wizard, vacancy update, enquiry inbox, visit management, profile

### Admin screens
Platform dashboard, listing approval queue, reports / trust & safety, users & merchants, operations

### Feature coverage (from Basera Phase 1)
Mobile OTP, guest browse, preferences, home feed, search, filters, sort, property cards/details, gallery, rooms, pricing & move-in total, amenities, rules, safety, save, enquire, call/WhatsApp, book visit, notifications, support tickets, merchant listing CRUD flow, vacancy updates, enquiry/visit ops, admin approve/reject/report queue

## Stack

- Expo Router (file-based navigation)
- Zustand + AsyncStorage
- Lucide icons
- Sora / Inter / Manrope fonts
- Reanimated + Haptics for calm motion

## Project structure

```
app/                  # Expo Router screens
src/design-system/    # Tokens + UI kit
src/data/mock.ts      # Demo properties & flows
src/stores/           # App state
src/types/            # Domain types
```

## Design tokens (quick)

| Token | Value |
|-------|-------|
| Primary | `#7B9D8A` |
| Background | `#FAF8F4` |
| Surface | `#FFFFFF` |
| Accent | `#D8C29B` |
| Text | `#2F3A35` |

See `src/design-system/DESIGN_SYSTEM.md` for the full system.
