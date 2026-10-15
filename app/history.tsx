import React, { useState } from 'react';
import { View } from 'react-native';

import { AnimatedIn } from '@/src/components/ui/AnimatedIn';
import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { Header } from '@/src/components/ui/Header';
import { MiniBars } from '@/src/components/ui/MiniBars';
import { OptionPills } from '@/src/components/ui/OptionPills';
import { Screen } from '@/src/components/ui/Screen';
import { CHAPTERS } from '@/src/data';
import { useAppStore } from '@/src/store/useAppStore';
import { useTheme } from '@/src/theme/ThemeProvider';
import { spacing } from '@/src/theme/tokens';
import { formatDuration, formatIsoFr } from '@/src/utils/dates';

type Filter = 'all' | 'mock' | 'exams' | 'chapter';

const KIND_LABEL: Record<string, string> = {
  chapter: 'Chapitre',
  mini: 'Mini-examen',
  inter: 'Intermédiaire',
  final: 'Final',
  mock: 'Examen blanc',
  daily: 'Défi du jour',
  theme: 'Défi thème',
  review: 'Révision',
  errors: 'Mes erreurs',
};

export default function HistoryScreen() {
  const { colors } = useTheme();
  const attempts = useAppStore((s) => s.attempts);
  const chapterStats = useAppStore((s) => s.chapterStats);
  const [filter, setFilter] = useState<Filter>('all');

  const list = attempts.filter((a) => {
    if (filter === 'mock') return a.kind === 'mock';
    if (filter === 'exams') return a.kind === 'mini' || a.kind === 'inter' || a.kind === 'final';
    if (filter === 'chapter') return a.kind === 'chapter';
    return true;
  });
  const mocks = attempts.filter((a) => a.kind === 'mock');
  const evo = mocks.slice(0, 10).reverse().map((a) => (a.score / a.max) * 100);

  const weak = CHAPTERS.map((c) => {
    const st = chapterStats[c.id];
    return { c, pct: st && st.answered >= 5 ? st.correct / st.answered : null, n: st?.answered ?? 0 };
  })
    .filter((x) => x.pct != null)
    .sort((a, b) => (a.pct as number) - (b.pct as number))
    .slice(0, 3);

  return (
    <Screen>
      <Header title="Historique" subtitle={`${attempts.length} quiz terminés`} />

      {mocks.length > 0 ? (
        <AnimatedIn index={0}>
          <Card style={{ gap: spacing.sm, marginBottom: spacing.lg }}>
            <AppText variant="h3">Examens blancs : évolution (%)</AppText>
            <MiniBars values={evo} />
            <AppText variant="caption" muted>Vert : 70 % ou plus · Orange : à améliorer</AppText>
          </Card>
        </AnimatedIn>
      ) : null}

      {weak.length > 0 ? (
        <AnimatedIn index={1}>
          <Card style={{ gap: spacing.sm, marginBottom: spacing.lg }} tint={colors.warningSoft}>
            <AppText variant="h3">Points faibles</AppText>
            {weak.map(({ c, pct }) => (
              <AppText key={c.id} variant="small">{c.emoji} Ch. {c.id} · {c.shortTitle} — {Math.round((pct as number) * 100)} % de réussite</AppText>
            ))}
          </Card>
        </AnimatedIn>
      ) : null}

      <OptionPills
        value={filter}
        onChange={setFilter}
        options={[
          { value: 'all', label: 'Tout' },
          { value: 'chapter', label: 'Chapitres' },
          { value: 'exams', label: 'Examens' },
          { value: 'mock', label: 'Blancs' },
        ]}
      />

      <View style={{ marginTop: spacing.md, gap: spacing.sm }}>
        {list.length === 0 ? <AppText muted center style={{ marginTop: spacing.xl }}>Rien ici pour l’instant. Lance un quiz !</AppText> : null}
        {list.map((a, i) => {
          const pct = Math.round((a.score / a.max) * 100);
          const ok = a.passed == null ? pct >= 70 : a.passed;
          return (
            <AnimatedIn key={a.id} index={Math.min(i, 8)}>
              <Card style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md }}>
                <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: ok ? colors.successSoft : colors.dangerSoft, alignItems: 'center', justifyContent: 'center' }}>
                  <AppText variant="bodyBold" color={ok ? colors.success : colors.danger}>{pct}%</AppText>
                </View>
                <View style={{ flex: 1 }}>
                  <AppText variant="bodyBold" numberOfLines={1}>{a.label}</AppText>
                  <AppText variant="caption" muted>{KIND_LABEL[a.kind] ?? a.kind} · {formatIsoFr(a.date)} · {formatDuration(a.durationSec)}</AppText>
                </View>
                <AppText variant="bodyBold">{a.score}/{a.max}</AppText>
              </Card>
            </AnimatedIn>
          );
        })}
      </View>
    </Screen>
  );
}
