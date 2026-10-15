import React from 'react';
import { View } from 'react-native';

import { useTheme } from '@/src/theme/ThemeProvider';
import { AppText } from './AppText';

interface Props {
  /** pourcentages 0..100, du plus ancien au plus récent */
  values: number[];
  passAt?: number;
  height?: number;
}

/** Petit histogramme d'évolution des scores. */
export function MiniBars({ values, passAt = 70, height = 90 }: Props) {
  const { colors } = useTheme();
  if (!values.length) return null;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: height + 20 }}>
      {values.map((v, i) => (
        <View key={i} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 3 }}>
          <AppText variant="caption" muted style={{ fontSize: 10 }}>{Math.round(v)}</AppText>
          <View style={{ width: '100%', maxWidth: 28, height: Math.max(4, (v / 100) * height), borderRadius: 6, backgroundColor: v >= passAt ? colors.success : colors.warning }} />
        </View>
      ))}
    </View>
  );
}
