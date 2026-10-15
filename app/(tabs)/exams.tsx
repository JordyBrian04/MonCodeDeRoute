import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, View } from 'react-native';

import { AnimatedIn } from '@/src/components/ui/AnimatedIn';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { MiniBars } from '@/src/components/ui/MiniBars';
import { OptionPills } from '@/src/components/ui/OptionPills';
import { PressableScale } from '@/src/components/ui/PressableScale';
import { Screen } from '@/src/components/ui/Screen';
import { questionsOf } from '@/src/data';
import { PATH } from '@/src/features/progress/path';
import { isMockUnlocked, isStepPassed, isStepUnlocked, MOCK_MIN_CHAPTERS, validatedChapters } from '@/src/features/progress/selectors';
import { openQuiz, openStep } from '@/src/navigation';
import { useAppStore } from '@/src/store/useAppStore';
import { useTheme } from '@/src/theme/ThemeProvider';
import { spacing } from '@/src/theme/tokens';
import { haptic } from '@/src/utils/haptics';

const COUNTS = [10, 20, 40, 60, 100];
const MINUTES = [0, 10, 20, 30, 45, 60]; // 0 = auto

export default function ExamsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const steps = useAppStore((s) => s.steps);
  const attempts = useAppStore((s) => s.attempts);
  const mockOpen = isMockUnlocked(steps);
  const validated = validatedChapters(steps);
  const poolSize = useMemo(() => validated.reduce((n, c) => n + questionsOf(c).length, 0), [validated]);
  const countOptions = COUNTS.filter((c) => c <= poolSize);
  const [count, setCount] = useState(20);
  const [minutes, setMinutes] = useState(0);
  const effCount = countOptions.includes(count) ? count : countOptions[countOptions.length - 1] ?? 10;
  const autoMin = Math.max(5, Math.round((effCount * 45) / 60));

  const mocks = attempts.filter((a) => a.kind === 'mock');
  const evolution = mocks.slice(0, 8).reverse().map((a) => (a.score / a.max) * 100);
  const bestMock = mocks.length ? Math.max(...mocks.map((a) => (a.score / a.max) * 100)) : null;

  const exams = PATH.filter((p) => p.kind !== 'chapter');

  return (
    <Screen>
      <AnimatedIn index={0}>
        <AppText variant="h1">Examens</AppText>
        <AppText muted style={{ marginBottom: spacing.lg }}>Conditions réelles : pas de correction pendant l’épreuve, détail à la fin.</AppText>
      </AnimatedIn>

      <AnimatedIn index={1}>
        <Card style={{ gap: spacing.md, borderColor: colors.primary, borderWidth: 2 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <AppText style={{ fontSize: 28 }}>⏱️</AppText>
            <View style={{ flex: 1 }}>
              <AppText variant="h3">Examen blanc</AppText>
              <AppText variant="small" muted>Questions tirées de tes chapitres validés ({poolSize} disponibles)</AppText>
            </View>
          </View>
          {mockOpen ? (
            <>
              <View style={{ gap: 6 }}>
                <AppText variant="bodyBold">Nombre de questions</AppText>
                <OptionPills options={countOptions.map((c) => ({ value: c, label: String(c) }))} value={effCount} onChange={setCount} />
              </View>
              <View style={{ gap: 6 }}>
                <AppText variant="bodyBold">Chronomètre</AppText>
                <OptionPills options={MINUTES.map((m) => ({ value: m, label: m === 0 ? `Auto (${autoMin} min)` : `${m} min` }))} value={minutes} onChange={setMinutes} />
              </View>
              <Button
                title="Lancer l’examen blanc"
                icon="play"
                onPress={() => openQuiz(router, 'mock', 'mock', { count: String(effCount), minutes: String(minutes === 0 ? autoMin : minutes) })}
              />
            </>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="lock-closed" size={18} color={colors.textMuted} />
              <AppText variant="small" muted style={{ flex: 1 }}>
                Valide {MOCK_MIN_CHAPTERS} chapitres pour débloquer l’examen blanc ({validated.length}/{MOCK_MIN_CHAPTERS}).
              </AppText>
            </View>
          )}
          {mocks.length > 0 ? (
            <View style={{ gap: 6 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <AppText variant="bodyBold">Évolution de tes scores</AppText>
                <AppText variant="caption" muted>Meilleur : {Math.round(bestMock ?? 0)} %</AppText>
              </View>
              <MiniBars values={evolution} />
              <PressableScale onPress={() => router.push('/history')}>
                <AppText variant="small" color={colors.primary} style={{ fontWeight: '700' }}>Voir tout l’historique →</AppText>
              </PressableScale>
            </View>
          ) : null}
        </Card>
      </AnimatedIn>

      <AnimatedIn index={2} style={{ marginTop: spacing.xl }}>
        <AppText variant="h2" style={{ marginBottom: spacing.md }}>Examens du parcours</AppText>
      </AnimatedIn>
      {exams.map((e, i) => {
        const unlocked = isStepUnlocked(steps, e.key);
        const passed = isStepPassed(steps, e.key);
        const res = steps[e.key];
        return (
          <AnimatedIn key={e.key} index={i + 3} style={{ marginBottom: spacing.md }}>
            <PressableScale
              hapticOnPress={unlocked}
              onPress={() => {
                if (!unlocked) {
                  haptic.warning();
                  Alert.alert('Examen verrouillé 🔒', 'Valide les étapes précédentes du parcours pour le débloquer.');
                  return;
                }
                openStep(router, e);
              }}
            >
              <Card style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, opacity: unlocked ? 1 : 0.6 }}>
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: passed ? colors.successSoft : colors.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
                  <AppText style={{ fontSize: 24 }}>{passed ? '✅' : unlocked ? e.emoji : '🔒'}</AppText>
                </View>
                <View style={{ flex: 1 }}>
                  <AppText variant="bodyBold">{e.title}</AppText>
                  <AppText variant="small" muted>{e.subtitle}</AppText>
                  {res ? <AppText variant="caption" muted>Meilleur : {res.best}/{res.max} · {res.attempts} essai{res.attempts > 1 ? 's' : ''}</AppText> : <AppText variant="caption" muted>Minimum requis : {e.passMark}/{e.max}</AppText>}
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
              </Card>
            </PressableScale>
          </AnimatedIn>
        );
      })}
    </Screen>
  );
}
