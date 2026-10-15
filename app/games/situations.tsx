import React, { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { OptionState, QuizOption } from '@/src/components/feedback/QuizOption';
import { GameOver, GameShell } from '@/src/components/games/GameShell';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { ProgressBar } from '@/src/components/ui/ProgressBar';
import type { Situation } from '@/src/data';
import { SITUATIONS } from '@/src/data/situations';
import { learnedChapters } from '@/src/features/quiz/context';
import { useAppStore } from '@/src/store/useAppStore';
import { useTheme } from '@/src/theme/ThemeProvider';
import { spacing } from '@/src/theme/tokens';
import { haptic } from '@/src/utils/haptics';
import { sample, shuffle } from '@/src/utils/random';

const PER_GAME = 8;
const LETTERS = ['A', 'B', 'C', 'D'];

interface Item {
  s: Situation;
  options: string[];
  answer: number;
}

function build(learned: number[]): Item[] {
  const pool = SITUATIONS.filter((s) => learned.includes(s.chapter));
  return sample(pool, PER_GAME).map((s) => {
    const order = shuffle(s.options.map((_, i) => i));
    return { s, options: order.map((i) => s.options[i]), answer: order.indexOf(s.answer) };
  });
}

export default function SituationsGame() {
  const { colors } = useTheme();
  const recordGame = useAppStore((s) => s.recordGame);
  const steps = useAppStore((s) => s.steps);
  const lessonsRead = useAppStore((s) => s.lessonsRead);
  const learned = useMemo(() => learnedChapters({ steps, lessonsRead }), []); // eslint-disable-line react-hooks/exhaustive-deps

  const [items, setItems] = useState<Item[]>(() => build(learned));
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState<{ xp: number; record: boolean } | null>(null);

  const reset = () => {
    setItems(build(learned));
    setI(0);
    setPicked(null);
    setScore(0);
    setOver(null);
  };

  if (items.length === 0) {
    return (
      <GameShell title="Simulations" confirmQuit={false}>
        <View style={{ flex: 1, justifyContent: 'center', padding: spacing.xl }}>
          <AppText center muted>Lis plus de chapitres pour débloquer des mises en situation.</AppText>
        </View>
      </GameShell>
    );
  }

  if (over) {
    return (
      <GameShell title="Simulations" confirmQuit={false}>
        <GameOver emoji={score === items.length ? '🏆' : '🎬'} title={`${score}/${items.length}`} lines={['Bons réflexes au volant !']} xp={over.xp} best={over.record} celebrate={score >= items.length - 1} onReplay={reset} />
      </GameShell>
    );
  }

  const it = items[i];
  const revealed = picked != null;
  const stateOf = (k: number): OptionState => {
    if (!revealed) return 'idle';
    if (k === it.answer) return picked === k ? 'correct' : 'missed';
    if (k === picked) return 'wrong';
    return 'dim';
  };

  const choose = (k: number) => {
    if (revealed) return;
    setPicked(k);
    if (k === it.answer) {
      setScore((s) => s + 1);
      haptic.success();
    } else haptic.error();
  };

  const next = () => {
    if (i < items.length - 1) {
      setI(i + 1);
      setPicked(null);
    } else {
      const xp = score * 4 + 6;
      const prev = useAppStore.getState().games.situations?.best ?? 0;
      recordGame('situations', score, xp);
      setOver({ xp, record: score > prev });
    }
  };

  return (
    <GameShell title="Simulations" right={<AppText variant="bodyBold" color={colors.primary}>{i + 1}/{items.length}</AppText>}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }} showsVerticalScrollIndicator={false}>
        <ProgressBar value={i / items.length} height={8} />
        <Animated.View key={it.s.id} entering={FadeInDown.duration(300)} style={{ gap: spacing.md }}>
          <Card style={{ gap: spacing.sm }}>
            <AppText style={{ fontSize: 40 }}>{it.s.emoji}</AppText>
            <AppText variant="h3">{it.s.title}</AppText>
            <AppText>{it.s.story}</AppText>
            <AppText variant="bodyBold" color={colors.primary}>{it.s.question}</AppText>
          </Card>
          {it.options.map((o, k) => (
            <QuizOption key={k} letter={LETTERS[k] ?? String(k + 1)} text={o} state={stateOf(k)} disabled={revealed} onPress={() => choose(k)} />
          ))}
          {revealed ? (
            <Animated.View entering={FadeInDown.duration(300)} style={{ gap: spacing.md }}>
              <Card tint={picked === it.answer ? colors.successSoft : colors.dangerSoft} elevated={false}>
                <AppText variant="bodyBold">{picked === it.answer ? '✔ Bon réflexe !' : '✘ Attention'}</AppText>
                <AppText variant="small">💡 {it.s.explanation}</AppText>
              </Card>
              <Button title={i < items.length - 1 ? 'Situation suivante' : 'Voir le résultat'} icon="arrow-forward" onPress={next} />
            </Animated.View>
          ) : null}
        </Animated.View>
      </ScrollView>
    </GameShell>
  );
}
