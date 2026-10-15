import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { useTheme } from '@/src/theme/ThemeProvider';
import { radius, shadow, spacing } from '@/src/theme/tokens';

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  tint?: string;
  padded?: boolean;
  elevated?: boolean;
}

export function Card({ children, style, tint, padded = true, elevated = true }: Props) {
  const { colors, isDark } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: tint ?? colors.surface,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.border,
          padding: padded ? spacing.lg : 0,
        },
        elevated && !isDark ? shadow(colors.shadow, 1) : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}
