import React from 'react';
import { View } from 'react-native';

import { useTheme } from '@/src/theme/ThemeProvider';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

interface Props<T extends string | number> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}

export function OptionPills<T extends string | number>({ options, value, onChange }: Props<T>) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <PressableScale key={String(o.value)} onPress={() => onChange(o.value)} accessibilityRole="button" accessibilityState={{ selected: on }}>
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 9,
                borderRadius: 999,
                backgroundColor: on ? colors.primary : colors.surfaceAlt,
                borderWidth: 1,
                borderColor: on ? colors.primary : colors.border,
              }}
            >
              <AppText variant="small" color={on ? colors.onPrimary : colors.text} style={{ fontWeight: '700' }}>{o.label}</AppText>
            </View>
          </PressableScale>
        );
      })}
    </View>
  );
}
