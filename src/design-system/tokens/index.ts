import { colors, darkColors } from './colors';
import { typography, fontFamilies, fontSizes } from './typography';
import { spacing, radius, elevation, touchTarget, layout, motion } from './spacing';

export const theme = {
  colors,
  typography,
  fontFamilies,
  fontSizes,
  spacing,
  radius,
  elevation,
  touchTarget,
  layout,
  motion,
  mode: 'light' as const,
} as const;

export const darkTheme = {
  ...theme,
  colors: darkColors,
  mode: 'dark' as const,
} as const;

export type Theme = typeof theme;

export * from './colors';
export * from './typography';
export * from './spacing';
