/**
 * StayNest Typography — Sora (headings), Inter (body), Manrope (numbers)
 */

export const fontFamilies = {
  heading: 'Sora_600SemiBold',
  headingBold: 'Sora_700Bold',
  headingMedium: 'Sora_500Medium',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
  numbers: 'Manrope_600SemiBold',
  numbersBold: 'Manrope_700Bold',
  numbersRegular: 'Manrope_400Regular',
} as const;

export const fontSizes = {
  display: 40,
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  body: 16,
  bodyLarge: 18,
  caption: 14,
  small: 12,
  tiny: 10,
} as const;

export const lineHeights = {
  display: 48,
  h1: 40,
  h2: 36,
  h3: 32,
  h4: 28,
  body: 24,
  bodyLarge: 28,
  caption: 20,
  small: 16,
  tiny: 14,
} as const;

export const letterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.3,
  wider: 0.6,
} as const;

export const typography = {
  display: {
    fontFamily: fontFamilies.headingBold,
    fontSize: fontSizes.display,
    lineHeight: lineHeights.display,
    letterSpacing: letterSpacing.tight,
  },
  h1: {
    fontFamily: fontFamilies.headingBold,
    fontSize: fontSizes.h1,
    lineHeight: lineHeights.h1,
    letterSpacing: letterSpacing.tight,
  },
  h2: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes.h2,
    lineHeight: lineHeights.h2,
    letterSpacing: letterSpacing.tight,
  },
  h3: {
    fontFamily: fontFamilies.heading,
    fontSize: fontSizes.h3,
    lineHeight: lineHeights.h3,
  },
  h4: {
    fontFamily: fontFamilies.headingMedium,
    fontSize: fontSizes.h4,
    lineHeight: lineHeights.h4,
  },
  body: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
  },
  bodyMedium: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
  },
  bodySemiBold: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
  },
  bodyLarge: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.bodyLarge,
    lineHeight: lineHeights.bodyLarge,
  },
  caption: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.caption,
    lineHeight: lineHeights.caption,
  },
  captionMedium: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.caption,
    lineHeight: lineHeights.caption,
  },
  small: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.small,
    lineHeight: lineHeights.small,
  },
  smallMedium: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.small,
    lineHeight: lineHeights.small,
  },
  number: {
    fontFamily: fontFamilies.numbers,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
  },
  numberLarge: {
    fontFamily: fontFamilies.numbersBold,
    fontSize: fontSizes.h3,
    lineHeight: lineHeights.h3,
  },
  numberPrice: {
    fontFamily: fontFamilies.numbersBold,
    fontSize: fontSizes.h4,
    lineHeight: lineHeights.h4,
  },
  button: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
    letterSpacing: letterSpacing.wide,
  },
  buttonSmall: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: fontSizes.caption,
    lineHeight: lineHeights.caption,
    letterSpacing: letterSpacing.wide,
  },
  label: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.caption,
    lineHeight: lineHeights.caption,
    letterSpacing: letterSpacing.wider,
  },
} as const;
