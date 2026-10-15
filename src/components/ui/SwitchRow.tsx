import React from 'react';
import { Switch, View } from 'react-native';

import { useTheme } from '@/src/theme/ThemeProvider';
import { AppText } from './AppText';

interface Props {
  title: string;
  subtitle?: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}

export function SwitchRow({ title, subtitle, value, onChange, disabled }: Props) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, opacity: disabled ? 0.5 : 1 }}>
      <View style={{ flex: 1 }}>
        <AppText variant="bodyBold">{title}</AppText>
        {subtitle ? <AppText variant="small" muted>{subtitle}</AppText> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        trackColor={{ true: colors.primary, false: colors.border }}
        thumbColor="#FFFFFF"
        accessibilityLabel={title}
      />
    </View>
  );
}
