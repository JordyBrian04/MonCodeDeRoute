import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';

import { useTheme } from '@/src/theme/ThemeProvider';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

interface Props {
  hour: number;
  minute: number;
  onChange: (hour: number, minute: number) => void;
  disabled?: boolean;
}

const STEP = 15;

export function TimeStepper({ hour, minute, onChange, disabled }: Props) {
  const { colors } = useTheme();
  const total = hour * 60 + minute;
  const move = (delta: number) => {
    const t = (total + delta + 1440) % 1440;
    onChange(Math.floor(t / 60), t % 60);
  };
  const btn = (icon: 'remove' | 'add', delta: number, label: string) => (
    <PressableScale
      disabled={disabled}
      onPress={() => move(delta)}
      accessibilityLabel={label}
      style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' }}
    >
      <Ionicons name={icon} size={18} color={colors.text} />
    </PressableScale>
  );
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, opacity: disabled ? 0.45 : 1 }}>
      {btn('remove', -STEP, 'Reculer l’heure')}
      <AppText variant="h3" style={{ minWidth: 70, textAlign: 'center' }}>
        {String(hour).padStart(2, '0')}:{String(minute).padStart(2, '0')}
      </AppText>
      {btn('add', STEP, 'Avancer l’heure')}
    </View>
  );
}
