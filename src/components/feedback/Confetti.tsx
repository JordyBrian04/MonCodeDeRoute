import React, { useEffect, useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

const COLORS = ['#F77F00', '#0A8F5B', '#F2B600', '#E03A3A', '#2478E0', '#8E4FD6', '#00A6B5'];

interface PieceProps {
  x: number;
  delay: number;
  size: number;
  color: string;
  drift: number;
  rot: number;
  height: number;
  duration: number;
}

function Piece({ x, delay, size, color, drift, rot, height, duration }: PieceProps) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(delay, withTiming(1, { duration, easing: Easing.in(Easing.quad) }));
  }, [t, delay, duration]);
  const style = useAnimatedStyle(() => ({
    opacity: t.value < 0.85 ? 1 : 1 - (t.value - 0.85) / 0.15,
    transform: [
      { translateX: drift * t.value },
      { translateY: -40 + (height + 80) * t.value },
      { rotate: `${rot * t.value}deg` },
    ],
  }));
  return <Animated.View style={[{ position: 'absolute', left: x, top: 0, width: size, height: size * 0.5, backgroundColor: color, borderRadius: 2 }, style]} />;
}

interface Props {
  count?: number;
  /** change la clé pour relancer */
  burstKey?: number | string;
}

/** Pluie de confettis (Reanimated, sans dépendance externe). */
export function Confetti({ count = 46, burstKey = 0 }: Props) {
  const { width, height } = useWindowDimensions();
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: `${burstKey}-${i}`,
        x: Math.random() * width,
        delay: Math.random() * 500,
        size: 8 + Math.random() * 8,
        color: COLORS[i % COLORS.length],
        drift: (Math.random() - 0.5) * 140,
        rot: (Math.random() - 0.5) * 900,
        duration: 1800 + Math.random() * 1400,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [count, burstKey, width],
  );
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map((p) => (
        <Piece key={p.id} {...p} height={height} />
      ))}
    </View>
  );
}
