import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';

import { SignShape } from '@/src/components/signs/SignShape';
import { AppText } from '@/src/components/ui/AppText';
import { PressableScale } from '@/src/components/ui/PressableScale';
import type { Arm, ArmSign, CarColor, PriorityScene } from '@/src/data';
import { S } from '@/src/data/signs';
import { useTheme } from '@/src/theme/ThemeProvider';

const CAR_COLORS: Record<CarColor, string> = {
  rouge: '#E03A3A',
  bleue: '#2478E0',
  verte: '#12A150',
  jaune: '#F2B600',
};

const SIGN_SPEC: Record<Exclude<ArmSign, 'none'>, (typeof S)[string]> = {
  cedez: S.cedez,
  stop: S.stop,
  prioritaire: S.routePrioritaire,
  ponctuelle: S.prioPonctuelle,
  droite: S.prioDroite,
};

interface Props {
  scene: PriorityScene;
  size: number;
  /** ordre de passage déjà validé : couleur → rang */
  ranks: Partial<Record<CarColor, number>>;
  /** couleur qui vient de provoquer une erreur */
  errorCar?: { color: CarColor; n: number } | null;
  onPressCar: (c: CarColor) => void;
  disabled?: boolean;
}

/** Carrefour vu de dessus. Les voitures sont placées sur leur voie de droite. */
export function Intersection({ scene, size, ranks, errorCar, onPressCar, disabled }: Props) {
  const { colors, isDark } = useTheme();
  const c = size / 2;
  const half = size * 0.17;
  const lane = half / 2;
  const sign = size * 0.17;
  const carL = size * 0.13;
  const carW = size * 0.085;
  const road = isDark ? '#3A4A42' : '#5B6B66';

  // positions du centre de chaque voiture (voie de droite)
  const pos: Record<Arm, { x: number; y: number; w: number; h: number }> = {
    bas: { x: c + lane - carW / 2, y: size * 0.74 - carL / 2, w: carW, h: carL },
    haut: { x: c - lane - carW / 2, y: size * 0.26 - carL / 2, w: carW, h: carL },
    gauche: { x: size * 0.26 - carL / 2, y: c + lane - carW / 2, w: carL, h: carW },
    droite: { x: size * 0.74 - carL / 2, y: c - lane - carW / 2, w: carL, h: carW },
  };
  const signPos: Record<Arm, { x: number; y: number }> = {
    bas: { x: c + half + 4, y: size * 0.66 },
    haut: { x: c - half - 4 - sign, y: size * 0.18 },
    gauche: { x: size * 0.16, y: c + half + 4 },
    droite: { x: size * 0.72, y: c - half - 4 - sign },
  };

  return (
    <View style={{ width: size, height: size, borderRadius: 24, overflow: 'hidden', backgroundColor: isDark ? '#1B3324' : '#CDE8C9' }}>
      {/* routes */}
      <View style={{ position: 'absolute', left: c - half, top: 0, width: half * 2, height: size, backgroundColor: road }} />
      <View style={{ position: 'absolute', top: c - half, left: 0, height: half * 2, width: size, backgroundColor: road }} />
      {/* marquages */}
      <View style={{ position: 'absolute', left: c - 1, top: 0, width: 2, height: c - half, backgroundColor: '#FFFFFF88' }} />
      <View style={{ position: 'absolute', left: c - 1, top: c + half, width: 2, height: c - half, backgroundColor: '#FFFFFF88' }} />
      <View style={{ position: 'absolute', top: c - 1, left: 0, height: 2, width: c - half, backgroundColor: '#FFFFFF88' }} />
      <View style={{ position: 'absolute', top: c - 1, left: c + half, height: 2, width: c - half, backgroundColor: '#FFFFFF88' }} />
      <View style={{ position: 'absolute', left: c - half, top: c - half, width: half * 2, height: half * 2, backgroundColor: road }} />

      {/* panneaux */}
      {(Object.keys(scene.signs) as Arm[]).map((arm) => {
        const s = scene.signs[arm];
        if (!s || s === 'none') return null;
        const p = signPos[arm];
        return (
          <View key={arm} style={{ position: 'absolute', left: p.x, top: p.y }}>
            <SignShape spec={SIGN_SPEC[s]} size={sign} />
          </View>
        );
      })}

      {/* voitures */}
      {scene.cars.map((car) => {
        const p = pos[car.arm];
        const vertical = car.arm === 'bas' || car.arm === 'haut';
        return (
          <View key={car.color} style={{ position: 'absolute', left: p.x, top: p.y, width: p.w, height: p.h, alignItems: 'center', justifyContent: 'center' }}>
            <CarSprite
              color={car.color}
              arm={car.arm}
              vertical={vertical}
              w={carW}
              h={carL}
              rank={ranks[car.color]}
              error={errorCar?.color === car.color ? errorCar.n : 0}
              onPress={() => onPressCar(car.color)}
              disabled={disabled}
            />
          </View>
        );
      })}
      <View pointerEvents="none" style={{ position: 'absolute', right: 8, top: 8, backgroundColor: colors.surface + 'CC', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 }}>
        <AppText variant="caption" muted>↑ vue de dessus</AppText>
      </View>
    </View>
  );
}

function CarSprite({ color, arm, vertical, w, h, rank, error, onPress, disabled }: { color: CarColor; arm: Arm; vertical: boolean; w: number; h: number; rank?: number; error: number; onPress: () => void; disabled?: boolean }) {
  const scale = useSharedValue(1);
  const x = useSharedValue(0);
  React.useEffect(() => {
    if (rank != null) scale.value = withSequence(withSpring(1.25, { damping: 6 }), withSpring(1));
  }, [rank, scale]);
  React.useEffect(() => {
    if (error > 0) x.value = withSequence(withTiming(-6, { duration: 50 }), withTiming(6, { duration: 80 }), withTiming(-4, { duration: 60 }), withTiming(0, { duration: 50 }));
  }, [error, x]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }, { translateX: x.value }] }));
  // fenêtre côté avant : haut pour « bas » (monte), bas pour « haut » (descend), droite pour « gauche », gauche pour « droite »
  const front: Record<Arm, object> = {
    bas: { top: 4, left: '15%', width: '70%', height: '22%' },
    haut: { bottom: 4, left: '15%', width: '70%', height: '22%' },
    gauche: { right: 4, top: '15%', height: '70%', width: '22%' },
    droite: { left: 4, top: '15%', height: '70%', width: '22%' },
  };
  const bw = vertical ? w : h;
  const bh = vertical ? h : w;
  return (
    <PressableScale onPress={onPress} disabled={disabled || rank != null} hapticOnPress={false} accessibilityLabel={`Voiture ${color}`} scaleTo={0.9}>
      <Animated.View style={[{ width: bw, height: bh, alignItems: 'center', justifyContent: 'center' }, style]}>
        <View style={{ width: bw, height: bh, borderRadius: 9, backgroundColor: CAR_COLORS[color], borderWidth: 2, borderColor: '#00000033' }}>
          <View style={[{ position: 'absolute', borderRadius: 3, backgroundColor: '#FFFFFFB0' }, front[arm]]} />
        </View>
        {rank != null ? (
          <View style={{ position: 'absolute', width: 22, height: 22, borderRadius: 11, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: CAR_COLORS[color] }}>
            <AppText variant="caption" style={{ fontWeight: '800', color: '#111' }}>{rank}</AppText>
          </View>
        ) : null}
      </Animated.View>
    </PressableScale>
  );
}

export { CAR_COLORS };
