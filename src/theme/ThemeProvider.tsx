import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';

import { useAppStore } from '@/src/store/useAppStore';
import { darkPalette, lightPalette, Palette } from './colors';

interface ThemeContextValue {
  colors: Palette;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({ colors: lightPalette, isDark: false });

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const mode = useAppStore((s) => s.themeMode);
  const isDark = mode === 'system' ? system === 'dark' : mode === 'dark';
  const value = useMemo<ThemeContextValue>(() => ({ colors: isDark ? darkPalette : lightPalette, isDark }), [isDark]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
