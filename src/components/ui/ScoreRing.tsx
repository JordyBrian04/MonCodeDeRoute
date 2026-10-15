import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { Easing, useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { useTheme } from '@/src/theme/ThemeProvider';
import { AppText } from './AppText';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  score: number;
  max: number;
  size?: number;
  color: string;
  label?: string;
}

export function ScoreRing({ score, max, size = 150, color, label }: Props) {
  const { colors } = useTheme();
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withTiming(max > 0 ? score / max : 0, { duration: 1100, easing: Easing.out(Easing.cubic) });
  }, [score, max, p]);
  const props = useAnimatedProps(() => ({ strokeDashoffset: c * (1 - p.value) }));
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.surfaceAlt} strokeWidth={stroke} fill="none" />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${c} ${c}`}
          animatedProps={props}
        />
      </Svg>
      <AppText style={{ fontSize: size * 0.27, fontWeight: '800' }}>{score}</AppText>
      <AppText variant="small" muted>{label ?? `sur ${max}`}</AppText>
    </View>
  );
}
