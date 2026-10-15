import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, View } from 'react-native';

import { AnimatedIn } from '@/src/components/ui/AnimatedIn';
import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { PressableScale } from '@/src/components/ui/PressableScale';
import { ProgressBar } from '@/src/components/ui/ProgressBar';
import { Screen } from '@/src/components/ui/Screen';
import { getChapter } from '@/src/data';
import { PATH } from '@/src/features/progress/path';
import { isStepPassed, isStepUnlocked, nextStep, overallProgress, passedCount } from '@/src/features/progress/selectors';
import { openQuiz, openStep } from '@/src/navigation';
import { useAppStore } from '@/src/store/useAppStore';
import { chapterColors } from '@/src/theme/colors';
import { useTheme } from '@/src/theme/ThemeProvider';
import { spacing } from '@/src/theme/tokens';
import { haptic } from '@/src/utils/haptics';

export default function LearnScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const steps = useAppStore((s) => s.steps);
  const next = nextStep(steps);

  return (
    <Screen>
      <AnimatedIn index={0}>
        <AppText variant="h1">Parcours</AppText>
        <AppText muted style={{ marginBottom: spacing.md }}>
          10 chapitres, des examens intermédiaires et l’examen final. Il faut 16/20 à chaque chapitre pour débloquer la suite.
        </AppText>
        <Card style={{ gap: 8, marginBottom: spacing.lg }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <AppText variant="bodyBold">Progression globale</AppText>
            <AppText variant="bodyBold" color={colors.primary}>{passedCount(steps)}/{PATH.length}</AppText>
          </View>
          <ProgressBar value={overallProgress(steps)} />
        </Card>
      </AnimatedIn>

      {PATH.map((step, i) => {
        const passed = isStepPassed(steps, step.key);
        const unlocked = isStepUnlocked(steps, step.key);
        const isNext = next?.key === step.key;
        const res = steps[step.key];
        const isChapter = step.kind === 'chapter';
        const ch = isChapter ? getChapter(step.chapters[0]) : undefined;
        const color = isChapter ? chapterColors[step.chapters[0] - 1] : step.kind === 'final' ? colors.gold : colors.accent;
        const title = ch ? `${ch.title}` : step.title;
        const sub = ch ? `${ch.pages} · ${step.subtitle}` : step.subtitle;
        const last = i === PATH.length - 1;

        return (
          <AnimatedIn key={step.key} index={i + 1}>
            <View style={{ flexDirection: 'row', gap: spacing.md }}>
              {/* rail de progression */}
              <View style={{ alignItems: 'center', width: 44 }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: passed ? colors.success : unlocked ? color : colors.surfaceAlt,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: isNext ? 3 : 0,
                    borderColor: colors.accent,
                  }}
                >
                  {passed ? <Ionicons name="checkmark" size={24} color="#FFFFFF" /> : unlocked ? <AppText style={{ fontSize: 20 }}>{step.emoji}</AppText> : <Ionicons name="lock-closed" size={18} color={colors.textMuted} />}
                </View>
                {!last ? <View style={{ flex: 1, width: 3, minHeight: 20, backgroundColor: passed ? colors.success : colors.border, marginVertical: 2 }} /> : null}
              </View>

              <View style={{ flex: 1, paddingBottom: spacing.md }}>
                <PressableScale
                  onPress={() => {
                    if (!unlocked) {
                      haptic.warning();
                      Alert.alert('Étape verrouillée 🔒', 'Valide d’abord l’étape précédente pour débloquer celle-ci.');
                      return;
                    }
                    openStep(router, step);
                  }}
                  hapticOnPress={unlocked}
                >
                  <Card style={{ borderColor: isNext ? colors.accent : colors.border, borderWidth: isNext ? 2 : 1, opacity: unlocked ? 1 : 0.65, gap: 4 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <AppText variant="bodyBold" style={{ flex: 1 }} numberOfLines={2}>{title}</AppText>
                      {res ? (
                        <AppText variant="caption" color={passed ? colors.success : colors.danger} style={{ fontWeight: '800' }}>
                          {res.best}/{res.max}
                        </AppText>
                      ) : null}
                    </View>
                    <AppText variant="small" muted>{sub}</AppText>
                    {res ? <AppText variant="caption" muted>{res.attempts} tentative{res.attempts > 1 ? 's' : ''}{passed ? ' · validé ✅' : ` · minimum ${step.passMark}/${step.max}`}</AppText> : null}
                    {isChapter && passed ? (
                      <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                        <PressableScale onPress={() => openQuiz(router, 'review', String(step.chapters[0]))}>
                          <View style={{ backgroundColor: colors.primarySoft, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 }}>
                            <AppText variant="caption" color={colors.primary} style={{ fontWeight: '800' }}>🔁 Révision libre</AppText>
                          </View>
                        </PressableScale>
                      </View>
                    ) : null}
                  </Card>
                </PressableScale>
              </View>
            </View>
          </AnimatedIn>
        );
      })}
    </Screen>
  );
}
