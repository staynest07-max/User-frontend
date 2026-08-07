# StayNest Design System

Enterprise-ready tokens and patterns for the StayNest mobile product.

## Brand

**StayNest** — find your next home. Calm, safe, premium hospitality — not a property classifieds feed.

Emotional goals: safe · comfortable · calm · organized · welcome · premium · trustworthy.

## Color

Ratio: **70% cream · 20% white · 8% sage · 2% sand**

| Token | Hex | Use |
|-------|-----|-----|
| primary | `#7B9D8A` | CTAs, selected, brand accent |
| primaryDark | `#6D8F7D` | Pressed / emphasis text |
| primaryLight | `#DDE9E0` | Soft fills |
| background | `#FAF8F4` | App canvas |
| surface | `#FFFFFF` | Cards, sheets |
| accent | `#D8C29B` | Warm sand highlight |
| border | `#EAE8E4` | Hairlines |
| textPrimary | `#2F3A35` | Body / titles |
| textSecondary | `#6B7280` | Supporting |
| success / warning / error / info | see `tokens/colors.ts` | Status only |

Dark mode: `darkColors` mirrors structure for future theme switching.

## Typography

| Role | Family |
|------|--------|
| Headings | Sora |
| Body | Inter |
| Numbers / prices | Manrope |

Scale: Display 40 · H1 32 · H2 28 · H3 24 · H4 20 · Body 16 · Caption 14 · Small 12

## Spacing & layout

8pt grid: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64…

- Screen padding: 24
- Card radius: 24
- Control radius: 14
- Sheet radius: 28
- Min touch target: 48

## Elevation

Soft shadows only (`soft`, `card`, `raised`, `float`, `nav`). No harsh Material elevation.

## Motion

Natural · slow · elegant. Spring damping ~20–24. Fade, slide, scale, card lift. **No bounce.**

Durations: instant 100 · fast 200 · normal 320 · slow 480.

## Components

`Text` · `Button` (primary/secondary/soft/outline/ghost/danger) · `Input` · `SearchBar` · `PropertyCard` · `Chip` · `Badge` · `BottomSheet` · `Skeleton` · `EmptyState` · `ErrorState` · `SectionHeader`

### Property card anatomy

Large photo · verified badge · favorite · rating · price · location · amenity chips · Details + Book Visit · radius 24 · premium spacing.

## Iconography

Lucide outline, 2px stroke, rounded.

## Photography

Natural daylight · wood · plants · white walls · cream bedding · large windows. No HDR, no dark artificial light.

## Accessibility

WCAG AA contrast targets · 48px touch · text labels with color · VoiceOver labels on icon buttons.

## Figma variable mapping

Mirror these JS tokens as Figma variables:

`color/primary` · `color/background` · `color/surface` · `color/accent` · `color/text/primary` · `space/*` · `radius/*` · `type/*`
