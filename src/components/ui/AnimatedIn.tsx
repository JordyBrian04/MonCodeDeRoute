import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Props {
  children: React.ReactNode;
  index?: number;
  style?: StyleProp<ViewStyle>;
}

/** Animation d'entrée en cascade (fade + slide). */
export function AnimatedIn({ children, index = 0, style }: Props) {
  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index, 10) * 60).duration(380).springify().damping(16)} style={style}>
      {children}
    </Animated.View>
  );
}
