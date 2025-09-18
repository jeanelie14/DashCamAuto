export const typography = {
  // Font families
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
    light: 'System',
  },

  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },

  // Font weights
  fontWeight: {
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
    extraBold: '800' as const,
  },

  // Letter spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
    widest: 2,
  },
} as const;

export const textStyles = {
  // Display styles
  displayLarge: {
    fontSize: typography.fontSize['6xl'],
    lineHeight: typography.lineHeight.tight,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.tight,
  },

  displayMedium: {
    fontSize: typography.fontSize['5xl'],
    lineHeight: typography.lineHeight.tight,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.tight,
  },

  displaySmall: {
    fontSize: typography.fontSize['4xl'],
    lineHeight: typography.lineHeight.tight,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: typography.letterSpacing.tight,
  },

  // Headline styles
  headlineLarge: {
    fontSize: typography.fontSize['3xl'],
    lineHeight: typography.lineHeight.tight,
    fontWeight: typography.fontWeight.semiBold,
    letterSpacing: typography.letterSpacing.normal,
  },

  headlineMedium: {
    fontSize: typography.fontSize['2xl'],
    lineHeight: typography.lineHeight.normal,
    fontWeight: typography.fontWeight.semiBold,
    letterSpacing: typography.letterSpacing.normal,
  },

  headlineSmall: {
    fontSize: typography.fontSize.xl,
    lineHeight: typography.lineHeight.normal,
    fontWeight: typography.fontWeight.semiBold,
    letterSpacing: typography.letterSpacing.normal,
  },

  // Title styles
  titleLarge: {
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.normal,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: typography.letterSpacing.normal,
  },

  titleMedium: {
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.normal,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: typography.letterSpacing.normal,
  },

  titleSmall: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.normal,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: typography.letterSpacing.wide,
  },

  // Body styles
  bodyLarge: {
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.relaxed,
    fontWeight: typography.fontWeight.normal,
    letterSpacing: typography.letterSpacing.normal,
  },

  bodyMedium: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.relaxed,
    fontWeight: typography.fontWeight.normal,
    letterSpacing: typography.letterSpacing.normal,
  },

  bodySmall: {
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.relaxed,
    fontWeight: typography.fontWeight.normal,
    letterSpacing: typography.letterSpacing.normal,
  },

  // Label styles
  labelLarge: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.normal,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: typography.letterSpacing.wide,
  },

  labelMedium: {
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.normal,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: typography.letterSpacing.wide,
  },

  labelSmall: {
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.normal,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: typography.letterSpacing.wider,
  },
} as const;

export type TextStyle = keyof typeof textStyles;
