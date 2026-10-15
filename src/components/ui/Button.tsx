import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, StyleProp, View, ViewStyle } from 'react-native';

import { useTheme } from '@/src/theme/ThemeProvider';
import { font, radius, spacing } from '@/src/theme/tokens';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';

interface Props {
  title: string;
  onPress: () => void;
  variant?: Variant;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  small?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({ title, onPress, variant = 'primary', icon, disabled, loading, small, style }: Props) {
  const { colors } = useTheme();
  const map: Record<Variant, { bg: string; fg: string; border?: string }> = {
    primary: { bg: colors.primary, fg: colors.onPrimary },
    accent: { bg: colors.accent, fg: '#FFFFFF' },
    secondary: { bg: colors.primarySoft, fg: colors.primary },
    ghost: { bg: 'transparent', fg: colors.text, border: colors.border },
    danger: { bg: colors.dangerSoft, fg: colors.danger },
  };
  const v = map[variant];
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={[
        {
          backgroundColor: v.bg,
          borderRadius: radius.pill,
          paddingVertical: small ? 10 : 15,
          paddingHorizontal: small ? spacing.lg : spacing.xl,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: v.border ? 1.5 : 0,
          borderColor: v.border,
          opacity: disabled ? 0.45 : 1,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {loading ? <ActivityIndicator color={v.fg} /> : null}
        {icon && !loading ? <Ionicons name={icon} size={small ? 16 : 20} color={v.fg} /> : null}
        <AppText style={{ color: v.fg, fontSize: small ? font.size.sm : font.size.md, fontWeight: font.weight.bold }}>{title}</AppText>
      </View>
    </PressableScale>
  );
}
