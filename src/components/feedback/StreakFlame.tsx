import React, { useEffect } from 'react';
import { Text } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

interface Props {
  size?: number;
  active?: boolean;
}

/** Flamme qui « respire » : plus vive si la série est active aujourd'hui. */
export function StreakFlame({ size = 28, active = true }: Props) {
  const s = useSharedValue(1);
  useEffect(() => {
    if (active) {
      s.value = withRepeat(withSequence(withTiming(1.12, { duration: 700, easing: Easing.inOut(Easing.quad) }), withTiming(0.96, { duration: 700, easing: Easing.inOut(Easing.quad) })), -1, true);
    } else {
      s.value = 1;
    }
  }, [active, s]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return (
    <Animated.View style={style}>
      <Text style={{ fontSize: size, opacity: active ? 1 : 0.45 }}>🔥</Text>
    </Animated.View>
  );
}
