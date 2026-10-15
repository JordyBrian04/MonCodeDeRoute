import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { AnimatedIn } from '@/src/components/ui/AnimatedIn';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { ProgressBar } from '@/src/components/ui/ProgressBar';
import { ScoreRing } from '@/src/components/ui/ScoreRing';
import { getChapter } from '@/src/data';
import { STEP_BY_KEY } from '@/src/features/progress/path';
import { nextStep } from '@/src/features/progress/selectors';
import type { QuizConfig } from '@/src/features/quiz/engine';
import { openStep } from '@/src/navigation';
import { SubmitResult, useAppStore } from '@/src/store/useAppStore';
import { chapterColors } from '@/src/theme/colors';
import { useTheme } from '@/src/theme/ThemeProvider';
import { spacing } from '@/src/theme/tokens';
import { formatDuration } from '@/src/utils/dates';
import { CorrectionList } from './CorrectionList';
import type { RuntimeQuestion } from '@/src/features/quiz/engine';

interface Props {
  config: QuizConfig;
  questions: RuntimeQuestion[];
  chosen: (number | null)[];
  result: SubmitResult;
  durationSec: number;
  onRetry: () => void;
}

function verdict(config: QuizConfig, pct: number, passed: boolean | null): { emoji: string; title: string; body: string } {
  if (passed === true) {
    if (pct === 100) return { emoji: '🏆', title: 'Score parfait !', body: 'Aucune erreur. Tu maîtrises ce sujet.' };
    return { emoji: '🎉', title: 'Bravo, validé !', body: config.gating ? 'Tu peux passer à l’étape suivante.' : 'Excellent résultat.' };
  }
  if (passed === false) {
    return {
      emoji: '💪',
      title: 'Pas encore…',
      body: config.gating ? `Il faut ${config.passMark}/${config.max} pour avancer. Relis la correction, puis réessaie : les questions sont mélangées.` : 'Regarde la correction et retente.',
    };
  }
  if (pct >= 80) return { emoji: '🌟', title: 'Très bien !', body: 'Continue comme ça.' };
  if (pct >= 50) return { emoji: '👍', title: 'Pas mal !', body: 'Encore un peu de pratique et ce sera parfait.' };
  return { emoji: '📚', title: 'À retravailler', body: 'Relis les chapitres concernés puis refais un essai.' };
}

export function ResultView({ config, questions, chosen, result, durationSec, onRetry }: Props) {
  const { colors } = useTheme();
  const router = useRouter();
  const steps = useAppStore((s) => s.steps);
  const { attempt, passed, firstPass, xpGained, previousBest } = result;
  const pct = Math.round((attempt.score / attempt.max) * 100);
  const good = passed === true || (passed === null && pct >= 70);
  const v = verdict(config, pct, passed);
  const color = good ? colors.success : pct >= 50 ? colors.warning : colors.danger;
  const chapters = Object.entries(attempt.perChapter)
    .map(([c, r]) => ({ chapter: Number(c), pct: r.t ? r.c / r.t : 0, ...r }))
    .sort((a, b) => a.pct - b.pct);
  const weak = chapters.filter((c) => c.pct < 0.7);
  const next = nextStep(steps);
  const step = STEP_BY_KEY[config.ref];
  const showNext = config.gating && passed === true && next;
  const canRetryGate = config.gating && passed === false;
  const newBest = previousBest != null && attempt.score > previousBest;

  return (
    <View style={{ gap: spacing.lg }}>
      <AnimatedIn index={0}>
        <Card style={{ alignItems: 'center', gap: spacing.md }}>
          <AppText style={{ fontSize: 54 }}>{v.emoji}</AppText>
          <ScoreRing score={attempt.score} max={attempt.max} color={color} />
          <AppText variant="h2" center>{v.title}</AppText>
          <AppText muted center>{v.body}</AppText>
          <View style={{ flexDirection: 'row', gap: spacing.lg, flexWrap: 'wrap', justifyContent: 'center' }}>
            <AppText variant="small" muted>⏱ {formatDuration(durationSec)}</AppText>
            <AppText variant="small" muted>🎯 {pct} %</AppText>
            <AppText variant="small" color={colors.accent} style={{ fontWeight: '800' }}>+{xpGained} XP</AppText>
          </View>
          {newBest ? <AppText variant="bodyBold" color={colors.gold}>⭐ Nouveau record personnel !</AppText> : null}
          {firstPass && step ? (
            <View style={{ backgroundColor: colors.successSoft, borderRadius: 12, padding: spacing.md }}>
              <AppText variant="small" center color={colors.success} style={{ fontWeight: '700' }}>
                {step.kind === 'chapter' ? `Chapitre ${step.chapters[0]} validé ! ` : `${step.title} réussi ! `}
                {next ? `Prochaine étape débloquée : ${next.title}.` : 'Tu as terminé tout le parcours 🏁'}
              </AppText>
            </View>
          ) : null}
        </Card>
      </AnimatedIn>

      {chapters.length > 0 && (config.kind !== 'chapter' && config.kind !== 'review') ? (
        <AnimatedIn index={1}>
          <Card style={{ gap: spacing.md }}>
            <AppText variant="h3">Analyse par chapitre</AppText>
            {chapters.map((c) => {
              const ch = getChapter(c.chapter);
              return (
                <View key={c.chapter} style={{ gap: 4 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <AppText variant="small" numberOfLines={1} style={{ flex: 1 }}>{ch?.emoji} {c.chapter}. {ch?.shortTitle}</AppText>
                    <AppText variant="small" color={c.pct >= 0.7 ? colors.success : colors.danger} style={{ fontWeight: '800' }}>{c.c}/{c.t}</AppText>
                  </View>
                  <ProgressBar value={c.pct} color={c.pct >= 0.7 ? chapterColors[c.chapter - 1] : colors.danger} height={8} />
                </View>
              );
            })}
            {weak.length > 0 ? (
              <View style={{ backgroundColor: colors.warningSoft, borderRadius: 12, padding: spacing.md, gap: 6 }}>
                <AppText variant="bodyBold">🎯 Points faibles à revoir</AppText>
                {weak.map((c) => (
                  <AppText key={c.chapter} variant="small">• Chapitre {c.chapter} — {getChapter(c.chapter)?.shortTitle} ({Math.round(c.pct * 100)} %)</AppText>
                ))}
              </View>
            ) : (
              <AppText variant="small" color={colors.success} style={{ fontWeight: '700' }}>Aucun point faible détecté sur ce test 👏</AppText>
            )}
          </Card>
        </AnimatedIn>
      ) : null}

      <AnimatedIn index={2} style={{ gap: spacing.sm }}>
        {showNext ? <Button title={`Continuer : ${next.title}`} icon="arrow-forward" onPress={() => openStep(router, next)} /> : null}
        {canRetryGate ? <Button title="Réessayer (questions mélangées)" icon="refresh" onPress={onRetry} /> : null}
        {!canRetryGate && !showNext ? <Button title="Rejouer" icon="refresh" variant="secondary" onPress={onRetry} /> : null}
        {weak.length > 0 && weak[0] ? (
          <Button title={`Revoir le chapitre ${weak[0].chapter}`} icon="book-outline" variant="secondary" onPress={() => router.push({ pathname: '/chapter/[id]', params: { id: String(weak[0].chapter) } })} />
        ) : null}
        <Button title="Retour" variant="ghost" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} />
      </AnimatedIn>

      <AnimatedIn index={3}>
        <AppText variant="h2" style={{ marginBottom: spacing.md }}>Correction détaillée</AppText>
        <CorrectionList questions={questions} chosen={chosen} />
      </AnimatedIn>

    </View>
  );
}
