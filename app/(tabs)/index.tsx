import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { StreakCard } from '@/src/components/feedback/StreakCard';
import { ExamCountdown } from '@/src/components/home/ExamCountdown';
import { AnimatedIn } from '@/src/components/ui/AnimatedIn';
import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { Chip } from '@/src/components/ui/Chip';
import { PressableScale } from '@/src/components/ui/PressableScale';
import { ProgressBar } from '@/src/components/ui/ProgressBar';
import { Screen } from '@/src/components/ui/Screen';
import { titleForXp } from '@/src/features/gamification/titles';
import { nextStep, overallProgress, passedCount } from '@/src/features/progress/selectors';
import { PATH } from '@/src/features/progress/path';
import { learnedChapters } from '@/src/features/quiz/context';
import { openQuiz, openStep } from '@/src/navigation';
import { useAppStore } from '@/src/store/useAppStore';
import { useTheme } from '@/src/theme/ThemeProvider';
import { radius, spacing } from '@/src/theme/tokens';
import { toDateStr } from '@/src/utils/dates';

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const steps = useAppStore((s) => s.steps);
  const xp = useAppStore((s) => s.xp);
  const daily = useAppStore((s) => s.daily);
  const missed = useAppStore((s) => s.missed);
  const lessonsRead = useAppStore((s) => s.lessonsRead);

  const today = toDateStr();
  const next = nextStep(steps);
  const progress = overallProgress(steps);
  const { current, next: nextTitle, progress: titleProgress } = titleForXp(xp);
  const learned = learnedChapters({ steps, lessonsRead });
  const dailyDone = daily.date === today;
  const missedCount = Object.keys(missed).length;

  return (
    <Screen>
      <AnimatedIn index={0}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg }}>
          <View style={{ flex: 1 }}>
            <AppText variant="small" muted>Bonjour 👋</AppText>
            <AppText variant="h1">Code de la Route CI</AppText>
          </View>
          <PressableScale onPress={() => router.push('/settings')} accessibilityLabel="Réglages" style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="settings-outline" size={22} color={colors.text} />
          </PressableScale>
        </View>
      </AnimatedIn>

      <AnimatedIn index={1}>
        <StreakCard />
      </AnimatedIn>

      <AnimatedIn index={2} style={{ marginTop: spacing.lg }}>
        <ExamCountdown />
      </AnimatedIn>

      {next ? (
        <AnimatedIn index={3} style={{ marginTop: spacing.lg }}>
          <PressableScale onPress={() => openStep(router, next)}>
            <LinearGradient colors={[colors.gradientA, colors.gradientB]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: radius.xl, padding: spacing.lg, gap: spacing.sm }}>
              <AppText variant="caption" style={{ color: '#FFFFFFCC' }}>CONTINUER LE PARCOURS</AppText>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                <AppText style={{ fontSize: 38 }}>{next.emoji}</AppText>
                <View style={{ flex: 1 }}>
                  <AppText variant="h2" style={{ color: '#FFFFFF' }}>{next.title}</AppText>
                  <AppText variant="small" style={{ color: '#FFFFFFDD' }}>{next.subtitle}</AppText>
                </View>
                <Ionicons name="arrow-forward-circle" size={36} color="#FFFFFF" />
              </View>
              <ProgressBar value={progress} color="#FFFFFF" track="#FFFFFF44" height={8} />
              <AppText variant="caption" style={{ color: '#FFFFFFDD' }}>{passedCount(steps)}/{PATH.length} étapes validées</AppText>
            </LinearGradient>
          </PressableScale>
        </AnimatedIn>
      ) : (
        <AnimatedIn index={3} style={{ marginTop: spacing.lg }}>
          <Card tint={colors.successSoft}>
            <AppText variant="h3">🏆 Parcours terminé !</AppText>
            <AppText muted>Tu as validé toutes les étapes. Enchaîne les examens blancs pour rester au top.</AppText>
          </Card>
        </AnimatedIn>
      )}

      <AnimatedIn index={4} style={{ marginTop: spacing.lg }}>
        <PressableScale disabled={learned.length === 0} onPress={() => openQuiz(router, 'daily', today)}>
          <Card style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, opacity: learned.length === 0 ? 0.6 : 1 }}>
            <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
              <AppText style={{ fontSize: 28 }}>📅</AppText>
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <AppText variant="h3">Défi du jour</AppText>
              <AppText variant="small" muted>
                {learned.length === 0 ? 'Lis le chapitre 1 pour le débloquer' : dailyDone ? `Relevé ! ${daily.score}/${daily.max} · +XP bonus gagné` : '10 questions · XP bonus'}
              </AppText>
            </View>
            {dailyDone ? <Chip label="Fait" emoji="✅" color={colors.success} bg={colors.successSoft} /> : <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />}
          </Card>
        </PressableScale>
      </AnimatedIn>

      {missedCount > 0 ? (
        <AnimatedIn index={5} style={{ marginTop: spacing.md }}>
          <PressableScale onPress={() => openQuiz(router, 'errors', 'errors')}>
            <Card style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: colors.dangerSoft, alignItems: 'center', justifyContent: 'center' }}>
                <AppText style={{ fontSize: 28 }}>🎯</AppText>
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <AppText variant="h3">Mes erreurs</AppText>
                <AppText variant="small" muted>{missedCount} question{missedCount > 1 ? 's' : ''} à retravailler</AppText>
              </View>
              <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
            </Card>
          </PressableScale>
        </AnimatedIn>
      ) : null}

      <AnimatedIn index={6} style={{ marginTop: spacing.md }}>
        <Card style={{ gap: spacing.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
              <AppText style={{ fontSize: 26 }}>{current.emoji}</AppText>
              <View>
                <AppText variant="bodyBold">{current.title}</AppText>
                <AppText variant="caption" muted>{xp} XP</AppText>
              </View>
            </View>
            {nextTitle ? <AppText variant="caption" muted>Prochain : {nextTitle.emoji} {nextTitle.title} ({nextTitle.min} XP)</AppText> : <AppText variant="caption" muted>Titre max !</AppText>}
          </View>
          <ProgressBar value={titleProgress} color={colors.accent} />
        </Card>
      </AnimatedIn>
    </Screen>
  );
}
