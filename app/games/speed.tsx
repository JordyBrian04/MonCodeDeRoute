import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import { QuizOption, OptionState } from '@/src/components/feedback/QuizOption';
import { GameOver, GameShell } from '@/src/components/games/GameShell';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { ProgressBar } from '@/src/components/ui/ProgressBar';
import { SignShape } from '@/src/components/signs/SignShape';
import { ALL_QUESTIONS } from '@/src/data';
import { learnedChapters } from '@/src/features/quiz/context';
import { RuntimeQuestion, toRuntime } from '@/src/features/quiz/engine';
import { useAppStore } from '@/src/store/useAppStore';
import { useTheme } from '@/src/theme/ThemeProvider';
import { spacing } from '@/src/theme/tokens';
import { haptic } from '@/src/utils/haptics';
import { shuffle } from '@/src/utils/random';

const DURATION = 60;
const PENALTY = 5;
const LETTERS = ['A', 'B', 'C', 'D', 'E'];

export default function SpeedGame() {
  const { colors } = useTheme();
  const recordGame = useAppStore((s) => s.recordGame);
  const best = useAppStore((s) => s.games.speed?.best ?? 0);
  const steps = useAppStore((s) => s.steps);
  const lessonsRead = useAppStore((s) => s.lessonsRead);

  const [phase, setPhase] = useState<'ready' | 'play' | 'over'>('ready');
  const [queue, setQueue] = useState<RuntimeQuestion[]>([]);
  const [qi, setQi] = useState(0);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [left, setLeft] = useState(DURATION);
  const [outcome, setOutcome] = useState<{ xp: number; record: boolean } | null>(null);

  const endAt = useRef(0);
  const scoreRef = useRef(0);
  const locked = useRef(false);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const penaltyX = useSharedValue(0);
  const penaltyStyle = useAnimatedStyle(() => ({ opacity: penaltyX.value, transform: [{ translateY: -10 * (1 - penaltyX.value) }] }));

  const pool = useMemo(() => {
    const learned = learnedChapters({ steps, lessonsRead });
    return ALL_QUESTIONS.filter((q) => learned.includes(q.chapter));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearTimers = () => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
  };
  useEffect(() => clearTimers, []);

  const makeQueue = useCallback(() => shuffle(pool).map((q) => toRuntime(q)), [pool]);

  const start = () => {
    clearTimers();
    setQueue(makeQueue());
    setQi(0);
    setScore(0);
    scoreRef.current = 0;
    setWrong(0);
    setCombo(0);
    setBestCombo(0);
    setPicked(null);
    locked.current = false;
    setLeft(DURATION);
    endAt.current = Date.now() + DURATION * 1000;
    setOutcome(null);
    setPhase('play');
  };

  const finish = useCallback(() => {
    clearTimers();
    const s = scoreRef.current;
    const xp = Math.min(60, s * 3);
    const prev = useAppStore.getState().games.speed?.best ?? 0;
    recordGame('speed', s, xp);
    setOutcome({ xp, record: s > prev && s > 0 });
    setPhase('over');
  }, [recordGame]);

  useEffect(() => {
    if (phase !== 'play') return;
    const id = setInterval(() => {
      const l = Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000));
      setLeft(l);
      if (l <= 0) {
        clearInterval(id);
        finish();
      }
    }, 200);
    return () => clearInterval(id);
  }, [phase, finish]);

  const answer = (i: number) => {
    if (locked.current || phase !== 'play') return;
    const q = queue[qi % queue.length];
    locked.current = true;
    setPicked(i);
    const ok = i === q.answer;
    if (ok) {
      haptic.success();
      scoreRef.current += 1;
      setScore(scoreRef.current);
      setCombo((c) => {
        const n = c + 1;
        setBestCombo((b) => Math.max(b, n));
        return n;
      });
    } else {
      haptic.error();
      setWrong((w) => w + 1);
      setCombo(0);
      endAt.current -= PENALTY * 1000;
      penaltyX.value = withSequence(withTiming(1, { duration: 150 }), withTiming(0, { duration: 700 }));
    }
    timeouts.current.push(
      setTimeout(() => {
        setPicked(null);
        setQi((n) => n + 1);
        locked.current = false;
      }, ok ? 450 : 1100),
    );
  };

  const stateOf = (q: RuntimeQuestion, i: number): OptionState => {
    if (picked == null) return 'idle';
    if (i === q.answer) return picked === i ? 'correct' : 'missed';
    if (i === picked) return 'wrong';
    return 'dim';
  };

  if (pool.length === 0) {
    return (
      <GameShell title="Quiz rapide" confirmQuit={false}>
        <View style={{ flex: 1, justifyContent: 'center', padding: spacing.xl }}>
          <AppText center muted>Lis un chapitre d’abord pour débloquer ce jeu.</AppText>
        </View>
      </GameShell>
    );
  }

  if (phase === 'ready') {
    return (
      <GameShell title="Quiz rapide" confirmQuit={false}>
        <View style={{ flex: 1, padding: spacing.lg, justifyContent: 'center', gap: spacing.lg }}>
          <Card style={{ alignItems: 'center', gap: spacing.md }}>
            <AppText style={{ fontSize: 60 }}>⚡</AppText>
            <AppText variant="h1" center>{DURATION} secondes !</AppText>
            <AppText muted center>Réponds à un maximum de questions de tes chapitres lus. Une erreur te coûte {PENALTY} secondes. Enchaîne les bonnes réponses pour un combo.</AppText>
            {best > 0 ? <AppText variant="bodyBold" color={colors.accent}>Record : {best}</AppText> : null}
          </Card>
          <Button title="Démarrer" icon="flash" onPress={start} />
        </View>
      </GameShell>
    );
  }

  if (phase === 'over') {
    return (
      <GameShell title="Quiz rapide" confirmQuit={false}>
        <GameOver
          emoji={score >= 15 ? '🚀' : score >= 8 ? '⚡' : '💪'}
          title={`${score} bonne${score > 1 ? 's' : ''} réponse${score > 1 ? 's' : ''}`}
          lines={[`Erreurs : ${wrong}`, `Meilleur combo : ${bestCombo}`]}
          xp={outcome?.xp ?? 0}
          best={outcome?.record}
          celebrate={score >= 8}
          onReplay={start}
        />
      </GameShell>
    );
  }

  const q = queue[qi % queue.length];
  return (
    <GameShell
      title="Quiz rapide"
      right={
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <AppText variant="bodyBold" color={colors.success}>✅ {score}</AppText>
          <AppText variant="h3" color={left <= 10 ? colors.danger : colors.text}>{left}s</AppText>
        </View>
      }
    >
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.sm }}>
        <ProgressBar value={left / DURATION} color={left <= 10 ? colors.danger : colors.accent} height={8} />
        <View style={{ height: 22, alignItems: 'center', justifyContent: 'center' }}>
          {combo >= 2 ? <AppText variant="small" color={colors.accent} style={{ fontWeight: '800' }}>🔥 Combo x{combo}</AppText> : null}
          <Animated.View style={[{ position: 'absolute', right: 0 }, penaltyStyle]}>
            <AppText variant="small" color={colors.danger} style={{ fontWeight: '800' }}>−{PENALTY}s</AppText>
          </Animated.View>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }} showsVerticalScrollIndicator={false}>
        <Card style={{ gap: spacing.sm }}>
          {q.sign ? <View style={{ alignItems: 'center' }}><SignShape spec={q.sign} size={80} /></View> : null}
          <AppText variant="h3">{q.text}</AppText>
        </Card>
        {q.options.map((o, i) => (
          <QuizOption key={`${q.id}-${qi}-${i}`} letter={LETTERS[i] ?? String(i + 1)} text={o} state={stateOf(q, i)} disabled={picked != null} onPress={() => answer(i)} />
        ))}
        {picked != null && picked !== q.answer ? (
          <Card tint={colors.dangerSoft} elevated={false}>
            <AppText variant="small">💡 {q.explanation}</AppText>
          </Card>
        ) : null}
      </ScrollView>
    </GameShell>
  );
}
