/**
 * StayNest Design System — Color Tokens
 * Warm Scandinavian hospitality palette. Sage is the only primary accent.
 * Ratio: 70% Warm Cream · 20% White · 8% Sage · 2% Warm Sand
 */

export const colors = {
  primary: '#7B9D8A',
  primaryDark: '#6D8F7D',
  primaryLight: '#DDE9E0',
  primaryMuted: '#E8F0EA',

  background: '#FAF8F4',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceMuted: '#F5F2EC',

  accent: '#D8C29B',
  accentLight: '#F0E8D8',
  accentDark: '#C4A97A',

  border: '#EAE8E4',
  borderStrong: '#DDD9D2',
  divider: '#F0EDE7',

  textPrimary: '#2F3A35',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',
  textOnPrimary: '#FFFFFF',

  disabled: '#B3B7B4',
  disabledBg: '#F0F0EE',

  success: '#5DA271',
  successLight: '#E8F5EC',
  warning: '#F2B94B',
  warningLight: '#FFF8E8',
  error: '#E56363',
  errorLight: '#FDECEC',
  info: '#6F9BD1',
  infoLight: '#EAF2FA',

  overlay: 'rgba(47, 58, 53, 0.45)',
  overlayLight: 'rgba(47, 58, 53, 0.08)',
  glass: 'rgba(255, 255, 255, 0.72)',
  glassBorder: 'rgba(255, 255, 255, 0.4)',

  favorite: '#E56363',
  verified: '#5DA271',
  rating: '#F2B94B',
  mapPin: '#7B9D8A',
} as const;

export type ColorToken = keyof typeof colors;

/** Dark-mode-ready architecture — light is production; dark tokens reserved */
export const darkColors = {
  ...colors,
  background: '#1A1F1C',
  surface: '#242B27',
  surfaceMuted: '#2C342F',
  textPrimary: '#F5F2EC',
  textSecondary: '#A8B0AB',
  border: '#3A423D',
  divider: '#2C342F',
} as const;
