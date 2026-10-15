/**
 * Design system — palette claire / sombre.
 * Couleurs inspirées du drapeau ivoirien (orange, blanc, vert) + états sémantiques.
 */
export interface Palette {
  bg: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  primary: string;
  primaryDark: string;
  primarySoft: string;
  onPrimary: string;
  accent: string;
  accentSoft: string;
  success: string;
  successSoft: string;
  danger: string;
  dangerSoft: string;
  warning: string;
  warningSoft: string;
  info: string;
  infoSoft: string;
  flame: string;
  gold: string;
  overlay: string;
  tabBar: string;
  shadow: string;
  gradientA: string;
  gradientB: string;
}

export const lightPalette: Palette = {
  bg: '#F6F8F5',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF3EC',
  border: '#DCE5DA',
  text: '#14221A',
  textMuted: '#5B6B60',
  primary: '#0A8F5B',
  primaryDark: '#06683F',
  primarySoft: '#DDF3E8',
  onPrimary: '#FFFFFF',
  accent: '#F77F00',
  accentSoft: '#FFEBD3',
  success: '#12A150',
  successSoft: '#D9F4E3',
  danger: '#E03A3A',
  dangerSoft: '#FDE1E1',
  warning: '#E5A000',
  warningSoft: '#FFF2CC',
  info: '#2478E0',
  infoSoft: '#DEEBFD',
  flame: '#FF6A13',
  gold: '#F2B600',
  overlay: 'rgba(10, 20, 14, 0.55)',
  tabBar: '#FFFFFF',
  shadow: '#0B2016',
  gradientA: '#0A8F5B',
  gradientB: '#16B877',
};

export const darkPalette: Palette = {
  bg: '#0C1410',
  surface: '#15211B',
  surfaceAlt: '#1D2B24',
  border: '#2A3B32',
  text: '#EAF3EE',
  textMuted: '#9DB2A5',
  primary: '#2BCB86',
  primaryDark: '#1AA36A',
  primarySoft: '#173A2A',
  onPrimary: '#06150E',
  accent: '#FF9A2E',
  accentSoft: '#3A2813',
  success: '#34D07A',
  successSoft: '#143823',
  danger: '#FF6B6B',
  dangerSoft: '#3D1B1B',
  warning: '#FFC53D',
  warningSoft: '#3B3013',
  info: '#6CA8FF',
  infoSoft: '#16294A',
  flame: '#FF8A3D',
  gold: '#FFD23F',
  overlay: 'rgba(0, 0, 0, 0.65)',
  tabBar: '#101B15',
  shadow: '#000000',
  gradientA: '#0E6B47',
  gradientB: '#1AA36A',
};

/** Couleurs par chapitre (identité visuelle de chaque module). */
export const chapterColors: string[] = [
  '#0A8F5B', // 1 permis
  '#E03A3A', // 2 signalisation
  '#2478E0', // 3 route & autoroute
  '#F77F00', // 4 arrêt/stationnement/dépassement
  '#8E4FD6', // 5 règles de circulation
  '#00A6B5', // 6 dégagements
  '#D6479A', // 7 giratoire
  '#5C6B7A', // 8 véhicule
  '#C9A100', // 9 conduite
  '#2E9E3F', // 10 chaîne cinématique
];
