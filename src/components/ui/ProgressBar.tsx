import React, { useEffect } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useTheme } from '@/src/theme/ThemeProvider';

interface Props {
  value: number; // 0..1
  color?: string;
  height?: number;
  style?: StyleProp<ViewStyle>;
  track?: string;
}

export function ProgressBar({ value, color, height = 10, style, track }: Props) {
  const { colors } = useTheme();
  const p = useSharedValue(0);
  const clamped = Math.max(0, Math.min(1, value));
  useEffect(() => {
    p.value = withTiming(clamped, { duration: 600, easing: Easing.out(Easing.cubic) });
  }, [clamped, p]);
  const anim = useAnimatedStyle(() => ({ width: `${p.value * 100}%` }));
  return (
    <View style={[{ height, borderRadius: height, backgroundColor: track ?? colors.surfaceAlt, overflow: 'hidden' }, style]}>
      <Animated.View style={[{ height, borderRadius: height, backgroundColor: color ?? colors.primary }, anim]} />
    </View>
  );
}
