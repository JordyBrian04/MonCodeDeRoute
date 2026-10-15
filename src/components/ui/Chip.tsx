import React from 'react';
import { View } from 'react-native';

import { useTheme } from '@/src/theme/ThemeProvider';
import { radius } from '@/src/theme/tokens';
import { AppText } from './AppText';

interface Props {
  label: string;
  color?: string;
  bg?: string;
  emoji?: string;
}

export function Chip({ label, color, bg, emoji }: Props) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: bg ?? colors.primarySoft, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' }}>
      {emoji ? <AppText variant="caption">{emoji}</AppText> : null}
      <AppText variant="caption" color={color ?? colors.primary} style={{ fontWeight: '700' }}>{label}</AppText>
    </View>
  );
}
