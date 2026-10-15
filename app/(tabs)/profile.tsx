import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { AnimatedIn } from '@/src/components/ui/AnimatedIn';
import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { PressableScale } from '@/src/components/ui/PressableScale';
import { ProgressBar } from '@/src/components/ui/ProgressBar';
import { Screen } from '@/src/components/ui/Screen';
import { CHAPTERS } from '@/src/data';
import { BADGES } from '@/src/features/gamification/badges';
import { TITLES, titleForXp } from '@/src/features/gamification/titles';
import { useAppStore } from '@/src/store/useAppStore';
import { chapterColors } from '@/src/theme/colors';
import { useTheme } from '@/src/theme/ThemeProvider';
import { radius, spacing } from '@/src/theme/tokens';

function Stat({ label, value, emoji }: { label: string; value: string; emoji: string }) {
  return (
    <Card style={{ flex: 1, alignItems: 'center', gap: 2, padding: spacing.md }}>
      <AppText style={{ fontSize: 22 }}>{emoji}</AppText>
      <AppText variant="h3">{value}</AppText>
      <AppText variant="caption" muted center>{label}</AppText>
    </Card>
  );
}

export default function ProfileScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const xp = useAppStore((s) => s.xp);
  const streak = useAppStore((s) => s.streak);
  const badges = useAppStore((s) => s.badges);
  const attempts = useAppStore((s) => s.attempts);
  const chapterStats = useAppStore((s) => s.chapterStats);
  const { current, next, progress } = titleForXp(xp);

  const answered = Object.values(chapterStats).reduce((n, c) => n + c.answered, 0);
  const correct = Object.values(chapterStats).reduce((n, c) => n + c.correct, 0);
  const pct = answered ? Math.round((correct / answered) * 100) : 0;
  const earned = BADGES.filter((b) => badges[b.id]);

  return (
    <Screen>
      <AnimatedIn index={0}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
          <AppText variant="h1">Profil</AppText>
          <PressableScale onPress={() => router.push('/settings')} accessibilityLabel="Réglages" style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="settings-outline" size={22} color={colors.text} />
          </PressableScale>
        </View>
        <Card style={{ alignItems: 'center', gap: spacing.sm }}>
          <AppText style={{ fontSize: 56 }}>{current.emoji}</AppText>
          <AppText variant="h2">{current.title}</AppText>
          <AppText muted>{xp} XP</AppText>
          <ProgressBar value={progress} color={colors.accent} style={{ alignSelf: 'stretch' }} />
          <AppText variant="caption" muted>{next ? `Prochain titre : ${next.emoji} ${next.title} à ${next.min} XP` : 'Titre maximal atteint 👑'}</AppText>
        </Card>
      </AnimatedIn>

      <AnimatedIn index={1} style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.md }}>
        <Stat emoji="🔥" label="Série record" value={`${streak.best} j`} />
        <Stat emoji="📝" label="Quiz terminés" value={String(attempts.length)} />
        <Stat emoji="🎯" label="Bonnes réponses" value={`${pct} %`} />
      </AnimatedIn>

      <AnimatedIn index={2} style={{ marginTop: spacing.xl }}>
        <AppText variant="h2" style={{ marginBottom: spacing.md }}>Maîtrise par chapitre</AppText>
        <Card style={{ gap: spacing.md }}>
          {CHAPTERS.map((c) => {
            const st = chapterStats[c.id];
            const p = st && st.answered ? st.correct / st.answered : 0;
            return (
              <View key={c.id} style={{ gap: 4 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <AppText variant="small" numberOfLines={1} style={{ flex: 1 }}>{c.emoji} {c.id}. {c.shortTitle}</AppText>
                  <AppText variant="small" muted>{st ? `${Math.round(p * 100)} % · ${st.answered} rép.` : '—'}</AppText>
                </View>
                <ProgressBar value={p} color={chapterColors[c.id - 1]} height={8} />
              </View>
            );
          })}
        </Card>
      </AnimatedIn>

      <AnimatedIn index={3} style={{ marginTop: spacing.xl }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: spacing.md }}>
          <AppText variant="h2">Badges</AppText>
          <AppText muted>{earned.length}/{BADGES.length}</AppText>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {BADGES.map((b) => {
            const on = !!badges[b.id];
            return (
              <View key={b.id} style={{ width: '31.5%', backgroundColor: on ? colors.surface : colors.surfaceAlt, borderRadius: radius.lg, borderWidth: 1, borderColor: on ? colors.gold : colors.border, padding: spacing.sm, alignItems: 'center', gap: 2, minHeight: 112, opacity: on ? 1 : 0.55 }}>
                <AppText style={{ fontSize: 30 }}>{on ? b.emoji : '🔒'}</AppText>
                <AppText variant="caption" center style={{ fontWeight: '800' }} numberOfLines={2}>{b.title}</AppText>
                <AppText variant="caption" muted center style={{ fontSize: 10 }} numberOfLines={3}>{b.description}</AppText>
              </View>
            );
          })}
        </View>
      </AnimatedIn>

      <AnimatedIn index={4} style={{ marginTop: spacing.xl }}>
        <AppText variant="h2" style={{ marginBottom: spacing.md }}>Titres</AppText>
        <Card style={{ gap: spacing.sm }}>
          {TITLES.map((t) => {
            const on = xp >= t.min;
            return (
              <View key={t.title} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, opacity: on ? 1 : 0.5 }}>
                <AppText style={{ fontSize: 24 }}>{on ? t.emoji : '🔒'}</AppText>
                <AppText style={{ flex: 1 }} variant={t.title === current.title ? 'bodyBold' : 'body'}>{t.title}</AppText>
                <AppText variant="caption" muted>{t.min} XP</AppText>
              </View>
            );
          })}
        </Card>
      </AnimatedIn>

      <AnimatedIn index={5} style={{ marginTop: spacing.xl }}>
        <PressableScale onPress={() => router.push('/history')}>
          <Card style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <AppText style={{ fontSize: 26 }}>📊</AppText>
            <AppText variant="bodyBold" style={{ flex: 1 }}>Historique & statistiques détaillées</AppText>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </Card>
        </PressableScale>
      </AnimatedIn>
    </Screen>
  );
}
