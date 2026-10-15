import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';

import { useTheme } from '@/src/theme/ThemeProvider';
import { typography } from '@/src/theme/tokens';

type Variant = keyof typeof typography;

interface Props extends TextProps {
  variant?: Variant;
  color?: string;
  muted?: boolean;
  center?: boolean;
}

export function AppText({ variant = 'body', color, muted, center, style, ...rest }: Props) {
  const { colors } = useTheme();
  const s: TextStyle = {
    ...typography[variant],
    color: color ?? (muted ? colors.textMuted : colors.text),
    textAlign: center ? 'center' : undefined,
  };
  return <Text {...rest} style={[s, style]} />;
}
