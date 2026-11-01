
export const BrandPalette = {
  navy: '#0D2B45',
  obsidian: '#0D0D0D',
  copper: '#B5651D',
  gold: '#C9943A',
  victoryGreen: '#1A7A4A',
  ivory: '#F7F3EE',
} as const;

export interface ThemeColors {
  navy: string;
  obsidian: string;
  copper: string;
  gold: string;
  victoryGreen: string;
  ivory: string;
  primary: string;
  primaryDark: string;
  secondary: string;
  background: string;
  surface: string;
  surfaceCard: string;
  surfaceCardHover: string;
  cardBorder: string;
  appBar: string;
  navBar: string;
  inputBackground: string;
  inputBorder: string;
  overlay: string;
  divider: string;
  googleButton: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  placeholder: string;
  accentNavy: string;
  accentObsidian: string;
  accentCopper: string;
  accentGold: string;
  accentGreen: string;
  accentIvory: string;
  accentDanger: string;
  accentSurface: string;
  accentBlue: string;
  accentPurple: string;
  accentPink: string;
}

export const DarkThemeColors: ThemeColors = {
  navy: BrandPalette.navy,
  obsidian: BrandPalette.obsidian,
  copper: BrandPalette.copper,
  gold: BrandPalette.gold,
  victoryGreen: BrandPalette.victoryGreen,
  ivory: BrandPalette.ivory,

  primary: BrandPalette.gold, // #C9943A (Primary CTA buttons, active states, progress rings)
  primaryDark: '#A77928',
  secondary: BrandPalette.copper, // #B5651D (Secondary accent, badges, tier borders)
  background: BrandPalette.obsidian, // #0D0D0D (Root dark surface)
  surface: '#111822', // Deep Navy-Obsidian luxury dark surface
  surfaceCard: '#131F2E', // Navy-tinted card surface
  surfaceCardHover: '#18273A',
  cardBorder: 'rgba(181, 101, 29, 0.22)', // Copper subtle border accent
  appBar: BrandPalette.navy, // #0D2B45
  navBar: BrandPalette.navy, // #0D2B45

  inputBackground: 'rgba(13, 43, 69, 0.40)', // Navy-tinted input
  inputBorder: 'rgba(181, 101, 29, 0.35)', // Copper-tinted input border
  overlay: 'rgba(13, 13, 13, 0.85)', // Obsidian overlay
  divider: 'rgba(247, 243, 238, 0.12)', // Ivory subtle divider
  googleButton: '#111822',

  text: BrandPalette.ivory, // #F7F3EE
  textSecondary: 'rgba(247, 243, 238, 0.72)',
  textMuted: 'rgba(247, 243, 238, 0.48)',
  placeholder: 'rgba(247, 243, 238, 0.35)',

  accentNavy: BrandPalette.navy,
  accentObsidian: BrandPalette.obsidian,
  accentCopper: BrandPalette.copper,
  accentGold: BrandPalette.gold,
  accentGreen: BrandPalette.victoryGreen,
  accentIvory: BrandPalette.ivory,
  accentDanger: '#EF4444',
  accentSurface: '#14202E',

  accentBlue: BrandPalette.navy,
  accentPurple: BrandPalette.copper,
  accentPink: BrandPalette.gold,
};

export const LightThemeColors: ThemeColors = {
  navy: BrandPalette.navy,
  obsidian: BrandPalette.obsidian,
  copper: BrandPalette.copper,
  gold: BrandPalette.gold,
  victoryGreen: BrandPalette.victoryGreen,
  ivory: BrandPalette.ivory,

  primary: BrandPalette.gold, // #C9943A (Primary CTA buttons, active states, progress rings)
  primaryDark: '#A77928',
  secondary: BrandPalette.copper, // #B5651D (Secondary accent, badges, tier borders)
  background: BrandPalette.ivory, // #F7F3EE (Root light surface)
  surface: '#FFFFFF', // Pure White luxury surface
  surfaceCard: '#FFFFFF', // Pure White card surface
  surfaceCardHover: '#F4EFEA',
  cardBorder: 'rgba(13, 43, 69, 0.08)', // Subtle Navy border accent
  appBar: '#FFFFFF',
  navBar: '#FFFFFF',

  inputBackground: '#FFFFFF',
  inputBorder: 'rgba(13, 43, 69, 0.18)',
  overlay: 'rgba(13, 43, 69, 0.60)',
  divider: 'rgba(13, 43, 69, 0.08)',
  googleButton: '#FFFFFF',

  text: BrandPalette.navy, // #0D2B45
  textSecondary: 'rgba(13, 43, 69, 0.72)',
  textMuted: 'rgba(13, 43, 69, 0.48)',
  placeholder: 'rgba(13, 43, 69, 0.35)',

  accentNavy: BrandPalette.navy,
  accentObsidian: BrandPalette.obsidian,
  accentCopper: BrandPalette.copper,
  accentGold: BrandPalette.gold,
  accentGreen: BrandPalette.victoryGreen,
  accentIvory: BrandPalette.ivory,
  accentDanger: '#EF4444',
  accentSurface: '#F5F1EA',

  accentBlue: BrandPalette.navy,
  accentPurple: BrandPalette.copper,
  accentPink: BrandPalette.gold,
};

export function getThemeColors(mode: 'dark' | 'light'): ThemeColors {
  return mode === 'light' ? LightThemeColors : DarkThemeColors;
}

export const Colors = DarkThemeColors;
