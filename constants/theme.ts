export const COLORS = {
  primary: '#0875bb',
  primaryDark: '#065a8c',
  primaryLight: '#e3f1fb',
  accent: '#0875bb',
  accentLight: '#F7F9FC',
  warning: '#f59e0b',
  danger: '#ef4444',
  dangerLight: '#fee2e2',
  success: '#22c55e',
  bg: '#F7F9FC',
  card: '#ffffff',
  cardBorder: '#e3f1fb',
  text: '#0a2233',
  textSecondary: '#0875bb',
  textMuted: '#6c7a89',
  textLight: '#d1d5db',
  border: '#e3f1fb',
  borderLight: '#F7F9FC',
  gradPrimary: ['#0875bb', '#065a8c'] as [string, string],
  gradAccent:  ['#0875bb', '#43a6dd'] as [string, string],
  gradHero:    ['#0875bb', '#F7F9FC'] as [string, string],
};

export const RADIUS = { sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, full: 999 };

export const SHADOW = {
  sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  md: { shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.09, shadowRadius: 10, elevation: 4 },
  lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.13, shadowRadius: 18, elevation: 8 },
};
