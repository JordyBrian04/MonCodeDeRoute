import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { GameOver, GameShell } from '@/src/components/games/GameShell';
import { Intersection } from '@/src/components/games/Intersection';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { ProgressBar } from '@/src/components/ui/ProgressBar';
import type { CarColor, PriorityScene } from '@/src/data';
import { PRIORITY_SCENES } from '@/src/data/priorityScenes';
import { useAppStore } from '@/src/store/useAppStore';
import { useTheme } from '@/src/theme/ThemeProvider';
import { spacing } from '@/src/theme/tokens';
import { haptic } from '@/src/utils/haptics';
import { sample } from '@/src/utils/random';

const SCENES_PER_GAME = 6;

export default function PrioritiesGame() {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const recordGame = useAppStore((s) => s.recordGame);
  const size = Math.min(width - spacing.lg * 2, 380);

  const [scenes, setScenes] = useState<PriorityScene[]>(() => sample(PRIORITY_SCENES, SCENES_PER_GAME));
  const [si, setSi] = useState(0);
  const [group, setGroup] = useState(0);
  const [ranks, setRanks] = useState<Partial<Record<CarColor, number>>>({});
  const [sceneMistakes, setSceneMistakes] = useState(0);
  const [perfect, setPerfect] = useState(0);
  const [errorCar, setErrorCar] = useState<{ color: CarColor; n: number } | null>(null);
  const [solved, setSolved] = useState(false);
  const [over, setOver] = useState<{ xp: number; record: boolean } | null>(null);
  const errN = useRef(0);

  const scene = scenes[si];

  useEffect(() => {
    setRanks({});
    setGroup(0);
    setSceneMistakes(0);
    setSolved(false);
    setErrorCar(null);
  }, [si, scenes]);

  const reset = () => {
    setScenes(sample(PRIORITY_SCENES, SCENES_PER_GAME));
    setSi(0);
    setPerfect(0);
    setOver(null);
  };

  const pressCar = (color: CarColor) => {
    if (solved) return;
    const expected = scene.order[group];
    if (!expected.includes(color)) {
      haptic.error();
      errN.current += 1;
      setErrorCar({ color, n: errN.current });
      setSceneMistakes((m) => m + 1);
      return;
    }
    haptic.tap();
    const rank = Object.keys(ranks).length + 1;
    const nr = { ...ranks, [color]: rank };
    setRanks(nr);
    const groupDone = expected.every((c) => nr[c] != null);
    if (groupDone) {
      if (group === scene.order.length - 1) {
        haptic.success();
        setSolved(true);
      } else {
        setGroup(group + 1);
      }
    }
  };

  const next = () => {
    const wasPerfect = sceneMistakes === 0;
    const np = perfect + (wasPerfect ? 1 : 0);
    if (si < scenes.length - 1) {
      setPerfect(np);
      setSi(si + 1);
    } else {
      const xp = np * 6 + 8;
      const prev = useAppStore.getState().games.priorities?.best ?? 0;
      recordGame('priorities', np, xp);
      setPerfect(np);
      setOver({ xp, record: np > prev });
    }
  };

  if (over) {
    return (
      <GameShell title="Jeu des priorités" confirmQuit={false}>
        <GameOver emoji={perfect >= 5 ? '🏆' : '🚗'} title={`${perfect}/${scenes.length} sans faute`} lines={['Priorité à droite, STOP, cédez-le-passage, route prioritaire…']} xp={over.xp} best={over.record} celebrate={perfect >= 4} onReplay={reset} />
      </GameShell>
    );
  }

  const remaining = scene.order.slice(group).flat().filter((c) => ranks[c] == null).length;

  return (
    <GameShell title="Jeu des priorités" right={<AppText variant="bodyBold" color={colors.primary}>{si + 1}/{scenes.length}</AppText>}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.md, alignItems: 'center' }} showsVerticalScrollIndicator={false}>
        <View style={{ alignSelf: 'stretch', gap: 6 }}>
          <ProgressBar value={si / scenes.length} height={8} />
          <AppText variant="h3">{scene.title}</AppText>
          <AppText variant="small" muted>
            {solved ? 'Bien joué !' : 'Touche les voitures dans l’ordre où elles passent. Celles qui peuvent passer en même temps se touchent dans n’importe quel ordre.'}
          </AppText>
        </View>
        <Intersection scene={scene} size={size} ranks={ranks} errorCar={errorCar} onPressCar={pressCar} disabled={solved} />
        {!solved ? (
          <View style={{ alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'space-between' }}>
            <AppText variant="small" muted>Reste {remaining} voiture{remaining > 1 ? 's' : ''}</AppText>
            <AppText variant="small" color={sceneMistakes ? colors.danger : colors.textMuted}>Erreurs : {sceneMistakes}</AppText>
          </View>
        ) : (
          <Animated.View entering={FadeInDown.duration(300)} style={{ alignSelf: 'stretch', gap: spacing.md }}>
            <Card tint={sceneMistakes === 0 ? colors.successSoft : colors.warningSoft} elevated={false} style={{ gap: 4 }}>
              <AppText variant="bodyBold">{sceneMistakes === 0 ? '✔ Sans faute !' : `Terminé avec ${sceneMistakes} erreur${sceneMistakes > 1 ? 's' : ''}`}</AppText>
              <AppText variant="small" style={{ fontWeight: '700' }}>📘 {scene.rule}</AppText>
              <AppText variant="small">{scene.explanation}</AppText>
            </Card>
            <Button title={si < scenes.length - 1 ? 'Scène suivante' : 'Voir le résultat'} icon="arrow-forward" onPress={next} />
          </Animated.View>
        )}
      </ScrollView>
    </GameShell>
  );
}
