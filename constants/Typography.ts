
export const Fonts = {
  display: 'DMSans-SemiBold',

  heading: 'DMSans-SemiBold',

  body: 'Inter-Regular',
  bodyMedium: 'Inter-Medium',
  bodySemiBold: 'Inter-SemiBold',
  bodyBold: 'Inter-Bold',

  data: 'JetBrainsMono-Medium',
  dataBold: 'JetBrainsMono-Bold',
} as const;

export const Typography = {
  h1: {
    fontFamily: Fonts.heading,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
  },

  h2: {
    fontFamily: Fonts.heading,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
  },

  h3: {
    fontFamily: Fonts.heading,
    fontSize: 16.5,
    lineHeight: 22,
    fontWeight: '600' as const,
    letterSpacing: 0,
  },

  body: {
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  bodyLarge: {
    fontFamily: Fonts.body,
    fontSize: 15.5,
    lineHeight: 22,
    fontWeight: '400' as const,
  },
  bodyMedium: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const,
  },
  bodySmall: {
    fontFamily: Fonts.body,
    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: '400' as const,
  },

  caption: {
    fontFamily: Fonts.body,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
  },
  captionMedium: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
  },

  eyebrow: {
    fontFamily: Fonts.heading,
    fontSize: 10.5,
    lineHeight: 15,
    fontWeight: '600' as const,
    letterSpacing: 1.3,
    textTransform: 'uppercase' as const,
  },

  button: {
    fontFamily: Fonts.heading,
    fontSize: 13.5,
    lineHeight: 18,
    fontWeight: '600' as const,
    letterSpacing: 0.3,
  },
  buttonSmall: {
    fontFamily: Fonts.heading,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600' as const,
    letterSpacing: 0.2,
  },

  heroTitle: {
    fontFamily: Fonts.heading,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '600' as const,
    letterSpacing: -0.4,
  },
  displayLarge: {
    fontFamily: Fonts.heading,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
  },
  displayMedium: {
    fontFamily: Fonts.heading,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
  },
  cardTitle: {
    fontFamily: Fonts.heading,
    fontSize: 16.5,
    lineHeight: 22,
    fontWeight: '600' as const,
    letterSpacing: 0,
  },
  sectionEyebrow: {
    fontFamily: Fonts.heading,
    fontSize: 10.5,
    lineHeight: 15,
    fontWeight: '600' as const,
    letterSpacing: 1.3,
    textTransform: 'uppercase' as const,
  },
  navLabel: {
    fontFamily: Fonts.heading,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600' as const,
    letterSpacing: 0.3,
  },
  formLabel: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
    letterSpacing: 0.4,
  },

  dataMetricHero: {
    fontFamily: Fonts.dataBold,
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  dataMetricLarge: {
    fontFamily: Fonts.dataBold,
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  dataMetricValue: {
    fontFamily: Fonts.dataBold,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700' as const,
  },
  dataStat: {
    fontFamily: Fonts.data,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500' as const,
  },
  dataSmall: {
    fontFamily: Fonts.data,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '500' as const,
  },
} as const;

export const typography = Typography;

export default Typography;
