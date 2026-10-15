import { Platform, TextStyle, ViewStyle } from 'react-native';

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

export const radius = { sm: 8, md: 14, lg: 20, xl: 28, pill: 999 } as const;

export const font = {
  family: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }) as string,
  size: { xs: 12, sm: 14, md: 16, lg: 18, xl: 22, xxl: 28, hero: 36 },
  weight: {
    regular: '400' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    semibold: '600' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
    heavy: '800' as TextStyle['fontWeight'],
  },
} as const;

export const typography = {
  hero: { fontSize: font.size.hero, fontWeight: font.weight.heavy, letterSpacing: -0.5 } as TextStyle,
  h1: { fontSize: font.size.xxl, fontWeight: font.weight.heavy, letterSpacing: -0.3 } as TextStyle,
  h2: { fontSize: font.size.xl, fontWeight: font.weight.bold } as TextStyle,
  h3: { fontSize: font.size.lg, fontWeight: font.weight.bold } as TextStyle,
  body: { fontSize: font.size.md, fontWeight: font.weight.regular, lineHeight: 23 } as TextStyle,
  bodyBold: { fontSize: font.size.md, fontWeight: font.weight.semibold, lineHeight: 23 } as TextStyle,
  small: { fontSize: font.size.sm, fontWeight: font.weight.regular, lineHeight: 19 } as TextStyle,
  caption: { fontSize: font.size.xs, fontWeight: font.weight.medium, letterSpacing: 0.3 } as TextStyle,
} as const;

export function shadow(color: string, level: 1 | 2 | 3 = 1): ViewStyle {
  const o = level === 1 ? 0.08 : level === 2 ? 0.14 : 0.22;
  const r = level === 1 ? 6 : level === 2 ? 12 : 20;
  return Platform.select<ViewStyle>({
    ios: { shadowColor: color, shadowOpacity: o, shadowRadius: r, shadowOffset: { width: 0, height: level * 2 } },
    android: { elevation: level * 2 },
    default: { shadowColor: color, shadowOpacity: o, shadowRadius: r, shadowOffset: { width: 0, height: level * 2 } },
  }) as ViewStyle;
}
