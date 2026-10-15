import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, BackHandler, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Confetti } from '@/src/components/feedback/Confetti';
import { QuestionView } from '@/src/components/quiz/QuestionView';
import { ResultView } from '@/src/components/quiz/ResultView';
import { AnimatedIn } from '@/src/components/ui/AnimatedIn';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { PressableScale } from '@/src/components/ui/PressableScale';
import { ProgressBar } from '@/src/components/ui/ProgressBar';
import { STEP_BY_KEY } from '@/src/features/progress/path';
import { isStepUnlocked } from '@/src/features/progress/selectors';
import { buildContext } from '@/src/features/quiz/context';
import { buildQuiz, QuizAnswerRecord, QuizConfig, QuizKind } from '@/src/features/quiz/engine';
import { useCountdown, useStopwatch } from '@/src/hooks/useCountdown';
import { SubmitResult, useAppStore } from '@/src/store/useAppStore';
import { useTheme } from '@/src/theme/ThemeProvider';
import { radius, spacing } from '@/src/theme/tokens';
import { formatDuration } from '@/src/utils/dates';
import { haptic } from '@/src/utils/haptics';

type Params = { kind?: string; ref?: string; count?: string; minutes?: string };

function makeConfig(p: Params): QuizConfig {
  const kind = (p.kind ?? 'review') as QuizKind;
  const ctx = buildContext(useAppStore.getState(), {
    mockCount: p.count ? Number(p.count) : undefined,
    mockMinutes: p.minutes ? Number(p.minutes) : undefined,
  });
  return buildQuiz(kind, p.ref ?? '1', ctx);
}

export default function QuizScreen() {
  const params = useLocalSearchParams<Params>();
  const router = useRouter();
  const { colors } = useTheme();
  const steps = useAppStore((s) => s.steps);
  const [run, setRun] = useState(0);
  const [config, setConfig] = useState<QuizConfig | null>(null);

  // construit la config une seule fois (et à chaque « rejouer »)
  useEffect(() => {
    setConfig(makeConfig(params));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);

  const stepKey = params.ref && STEP_BY_KEY[params.ref] && ['chapter', 'mini', 'inter', 'final'].includes(params.kind ?? '') ? params.ref : null;
  const locked = stepKey ? !isStepUnlocked(steps, stepKey) : false;

  if (locked) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.md }}>
        <AppText style={{ fontSize: 60 }}>🔒</AppText>
        <AppText variant="h2" center>Étape verrouillée</AppText>
        <AppText muted center>Valide d’abord les étapes précédentes du parcours.</AppText>
        <Button title="Retour" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }
  if (!config) return <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} />;

  if (config.questions.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.md }}>
        <AppText style={{ fontSize: 60 }}>🎉</AppText>
        <AppText variant="h2" center>Rien à travailler ici</AppText>
        <AppText muted center>Aucune question disponible pour ce quiz pour l’instant.</AppText>
        <Button title="Retour" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  return <QuizRun key={run} config={config} onRetry={() => { setConfig(null); setRun((r) => r + 1); }} />;
}

function QuizRun({ config, onRetry }: { config: QuizConfig; onRetry: () => void }) {
  const { colors } = useTheme();
  const router = useRouter();
  const submitQuiz = useAppStore((s) => s.submitQuiz);
  const questions = config.questions;
  const total = questions.length;
  const instant = config.feedback === 'instant';

  const [phase, setPhase] = useState<'intro' | 'playing' | 'result'>('intro');
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<(number | null)[]>(() => Array(total).fill(null));
  const [revealed, setRevealed] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [finalDuration, setFinalDuration] = useState(0);

  const submitted = useRef(false);
  const chosenRef = useRef(chosen);
  chosenRef.current = chosen;
  const scrollRef = useRef<ScrollView>(null);
  const elapsed = useStopwatch(phase === 'playing');
  const elapsedRef = useRef(0);
  elapsedRef.current = elapsed;

  const finish = useCallback(() => {
    if (submitted.current) return;
    submitted.current = true;
    const ch = chosenRef.current;
    const answers: QuizAnswerRecord[] = questions.map((q, i) => ({ questionId: q.id, chapter: q.chapter, chosen: ch[i], correct: ch[i] === q.answer }));
    const res = submitQuiz({
      kind: config.kind,
      ref: config.ref,
      label: config.title,
      max: config.max,
      passMark: config.passMark,
      gating: config.gating,
      xpFactor: config.xpFactor,
      answers,
      durationSec: elapsedRef.current,
    });
    setFinalDuration(elapsedRef.current);
    setResult(res);
    setPhase('result');
    if (res.passed === false) haptic.warning();
  }, [config, questions, submitQuiz]);

  const timeLeft = useCountdown(config.timeLimitSec, phase === 'playing', finish);

  const confirmQuit = useCallback(() => {
    Alert.alert('Quitter le quiz ?', 'Ta progression dans ce quiz sera perdue.', [
      { text: 'Continuer', style: 'cancel' },
      { text: 'Quitter', style: 'destructive', onPress: () => router.back() },
    ]);
  }, [router]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (phase === 'playing') {
        confirmQuit();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [phase, confirmQuit]);

  const choose = (i: number) => {
    if (instant && revealed) return;
    const next = chosen.slice();
    next[index] = i;
    setChosen(next);
    chosenRef.current = next;
    if (instant) {
      setRevealed(true);
      if (i === questions[index].answer) haptic.success();
      else haptic.error();
    } else {
      haptic.tap();
    }
  };

  const goNext = () => {
    if (index < total - 1) {
      setIndex(index + 1);
      setRevealed(false);
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    } else {
      finish();
    }
  };

  const goPrev = () => {
    if (index > 0) {
      setIndex(index - 1);
      setRevealed(false);
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }
  };

  const confirmFinishEarly = () => {
    const unanswered = chosen.filter((c) => c == null).length;
    if (unanswered === 0) return finish();
    Alert.alert('Terminer maintenant ?', `${unanswered} question${unanswered > 1 ? 's' : ''} sans réponse seront comptées fausses.`, [
      { text: 'Continuer', style: 'cancel' },
      { text: 'Terminer', style: 'destructive', onPress: finish },
    ]);
  };

  /* ───────────── INTRO ───────────── */
  if (phase === 'intro') {
    const rules: string[] = [
      `${total} questions`,
      instant ? 'Correction immédiate après chaque réponse' : 'Pas de correction pendant le test : détail complet à la fin',
      config.timeLimitSec ? `Temps limité : ${Math.round(config.timeLimitSec / 60)} min` : 'Pas de limite de temps',
      config.passMark != null ? `Note minimale : ${config.passMark}/${config.max}${config.gating ? ' pour débloquer la suite' : ''}` : 'Sans note éliminatoire',
    ];
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
        <View style={{ flex: 1, padding: spacing.lg, justifyContent: 'center', gap: spacing.lg }}>
          <AnimatedIn>
            <Card style={{ gap: spacing.md, alignItems: 'center' }}>
              <AppText style={{ fontSize: 56 }}>{config.kind === 'mock' ? '⏱️' : config.kind === 'final' ? '🏆' : config.kind === 'daily' ? '📅' : config.kind === 'errors' ? '🎯' : '📝'}</AppText>
              <AppText variant="h1" center>{config.title}</AppText>
              <AppText muted center>{config.subtitle}</AppText>
              <View style={{ alignSelf: 'stretch', gap: 8, marginTop: spacing.sm }}>
                {rules.map((r) => (
                  <View key={r} style={{ flexDirection: 'row', gap: 8 }}>
                    <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                    <AppText variant="small" style={{ flex: 1 }}>{r}</AppText>
                  </View>
                ))}
              </View>
            </Card>
          </AnimatedIn>
          <AnimatedIn index={1} style={{ gap: spacing.sm }}>
            <Button title="C’est parti !" icon="play" onPress={() => setPhase('playing')} />
            <Button title="Retour" variant="ghost" onPress={() => router.back()} />
          </AnimatedIn>
        </View>
      </SafeAreaView>
    );
  }

  /* ───────────── RÉSULTAT ───────────── */
  if (phase === 'result' && result) {
    const pct = result.attempt.score / result.attempt.max;
    const good = result.passed === true || (result.passed === null && pct >= 0.7);
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
        <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl * 2 }} showsVerticalScrollIndicator={false}>
          <ResultView config={config} questions={questions} chosen={chosen} result={result} durationSec={finalDuration} onRetry={onRetry} />
        </ScrollView>
        {good ? <Confetti burstKey={result.attempt.id} count={pct === 1 ? 70 : 44} /> : null}
      </SafeAreaView>
    );
  }

  /* ───────────── EN COURS ───────────── */
  const q = questions[index];
  const answered = chosen[index] != null;
  const correctSoFar = chosen.reduce<number>((n, c, i) => (c != null && c === questions[i].answer ? n + 1 : n), 0);
  const lowTime = timeLeft != null && timeLeft <= 60;
  const isLast = index === total - 1;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.sm, gap: spacing.sm }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <PressableScale onPress={confirmQuit} accessibilityLabel="Quitter" style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="close" size={22} color={colors.text} />
          </PressableScale>
          <View style={{ flex: 1 }}>
            <AppText variant="bodyBold">Question {index + 1}/{total}</AppText>
            <AppText variant="caption" muted numberOfLines={1}>{config.title}</AppText>
          </View>
          {instant ? <AppText variant="bodyBold" color={colors.success}>✅ {correctSoFar}</AppText> : null}
          {timeLeft != null ? (
            <View style={{ backgroundColor: lowTime ? colors.dangerSoft : colors.surfaceAlt, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6, flexDirection: 'row', gap: 4, alignItems: 'center' }}>
              <Ionicons name="time-outline" size={16} color={lowTime ? colors.danger : colors.text} />
              <AppText variant="bodyBold" color={lowTime ? colors.danger : colors.text}>{formatDuration(timeLeft)}</AppText>
            </View>
          ) : (
            <AppText variant="small" muted>{formatDuration(elapsed)}</AppText>
          )}
        </View>
        <ProgressBar value={(index + (instant ? (revealed ? 1 : 0) : answered ? 1 : 0)) / total} height={8} />
      </View>

      <ScrollView ref={scrollRef} style={{ flex: 1 }} contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xl }} showsVerticalScrollIndicator={false}>
        <QuestionView question={q} index={index} chosen={chosen[index]} revealed={instant && revealed} onChoose={choose} />
      </ScrollView>

      <View style={{ padding: spacing.lg, gap: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface }}>
        {instant ? (
          revealed ? (
            <Button title={isLast ? 'Voir le résultat' : 'Question suivante'} icon={isLast ? 'flag' : 'arrow-forward'} onPress={goNext} />
          ) : (
            <AppText variant="small" muted center>Choisis une réponse</AppText>
          )
        ) : (
          <>
            <Button title={isLast ? 'Terminer l’examen' : 'Suivant'} icon={isLast ? 'flag' : 'arrow-forward'} disabled={!answered} onPress={isLast ? confirmFinishEarly : goNext} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button title="Précédent" variant="ghost" small disabled={index === 0} onPress={goPrev} />
              {!isLast ? <Button title="Terminer maintenant" variant="ghost" small onPress={confirmFinishEarly} /> : null}
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
