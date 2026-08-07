/** StayNest Spacing — 8pt grid */

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
  '7xl': 80,
  '8xl': 96,
} as const;

export const radius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
  /** Property cards */
  card: 24,
  /** Buttons & inputs */
  control: 14,
  /** Bottom sheets */
  sheet: 28,
  /** Pills / chips */
  chip: 100,
} as const;

export const elevation = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  soft: {
    shadowColor: '#2F3A35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  card: {
    shadowColor: '#2F3A35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  raised: {
    shadowColor: '#2F3A35',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },
  float: {
    shadowColor: '#2F3A35',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 10,
  },
  nav: {
    shadowColor: '#2F3A35',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

export const touchTarget = {
  min: 48,
  icon: 44,
  fab: 56,
} as const;

export const layout = {
  screenPadding: spacing['2xl'],
  sectionGap: spacing['3xl'],
  cardGap: spacing.lg,
  maxContentWidth: 480,
} as const;

export const motion = {
  duration: {
    instant: 100,
    fast: 200,
    normal: 320,
    slow: 480,
    slower: 640,
  },
  spring: {
    gentle: { damping: 20, stiffness: 180, mass: 1 },
    soft: { damping: 24, stiffness: 140, mass: 1 },
    snappy: { damping: 22, stiffness: 260, mass: 0.9 },
  },
} as const;
