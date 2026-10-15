import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, View } from 'react-native';

import { AnimatedIn } from '@/src/components/ui/AnimatedIn';
import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { PressableScale } from '@/src/components/ui/PressableScale';
import { Screen } from '@/src/components/ui/Screen';
import { GAMES } from '@/src/features/games/games';
import { learnedChapters } from '@/src/features/quiz/context';
import { isThemeAvailable, THEMES } from '@/src/features/quiz/engine';
import { openQuiz } from '@/src/navigation';
import { useAppStore } from '@/src/store/useAppStore';
import { useTheme } from '@/src/theme/ThemeProvider';
import { radius, spacing } from '@/src/theme/tokens';
import { haptic } from '@/src/utils/haptics';

export default function GamesScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const steps = useAppStore((s) => s.steps);
  const lessonsRead = useAppStore((s) => s.lessonsRead);
  const games = useAppStore((s) => s.games);
  const themeStars = useAppStore((s) => s.themeStars);
  const learned = learnedChapters({ steps, lessonsRead });

  return (
    <Screen>
      <AnimatedIn index={0}>
        <AppText variant="h1">Jeux & défis</AppText>
        <AppText muted style={{ marginBottom: spacing.lg }}>Apprends en t’amusant. Les jeux se débloquent au fil des chapitres lus.</AppText>
      </AnimatedIn>

      {GAMES.map((g, i) => {
        const lock = g.lock(learned);
        const stat = games[g.id];
        return (
          <AnimatedIn key={g.id} index={i + 1} style={{ marginBottom: spacing.md }}>
            <PressableScale
              hapticOnPress={!lock}
              onPress={() => {
                if (lock) {
                  haptic.warning();
                  Alert.alert('Jeu verrouillé 🔒', lock);
                  return;
                }
                router.push(g.route as never);
              }}
            >
              <Card style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, opacity: lock ? 0.6 : 1 }}>
                <View style={{ width: 56, height: 56, borderRadius: radius.md, backgroundColor: g.color + '26', alignItems: 'center', justifyContent: 'center' }}>
                  <AppText style={{ fontSize: 30 }}>{lock ? '🔒' : g.emoji}</AppText>
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <AppText variant="h3">{g.title}</AppText>
                  <AppText variant="small" muted>{lock ?? g.description}</AppText>
                  {stat ? <AppText variant="caption" color={g.color} style={{ fontWeight: '800' }}>Record : {stat.best} · {stat.plays} partie{stat.plays > 1 ? 's' : ''}</AppText> : null}
                </View>
                <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
              </Card>
            </PressableScale>
          </AnimatedIn>
        );
      })}

      <AnimatedIn index={7} style={{ marginTop: spacing.lg }}>
        <AppText variant="h2">Défis par thème</AppText>
        <AppText muted style={{ marginBottom: spacing.md }}>10 questions ciblées. Vise les 3 étoiles ⭐⭐⭐ (100 %).</AppText>
      </AnimatedIn>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
        {THEMES.map((t, i) => {
          const ok = isThemeAvailable(t, learned);
          const stars = themeStars[t.key] ?? 0;
          return (
            <AnimatedIn key={t.key} index={i + 8} style={{ width: '47.5%' }}>
              <PressableScale
                hapticOnPress={ok}
                onPress={() => {
                  if (!ok) {
                    haptic.warning();
                    Alert.alert('Défi verrouillé 🔒', 'Lis les chapitres concernés pour débloquer ce thème.');
                    return;
                  }
                  openQuiz(router, 'theme', t.key);
                }}
              >
                <Card style={{ gap: 4, alignItems: 'flex-start', opacity: ok ? 1 : 0.55, minHeight: 130 }}>
                  <AppText style={{ fontSize: 28 }}>{ok ? t.emoji : '🔒'}</AppText>
                  <AppText variant="bodyBold" numberOfLines={2}>{t.title}</AppText>
                  <AppText variant="caption" muted numberOfLines={2}>{t.description}</AppText>
                  <AppText style={{ fontSize: 14 }}>{[0, 1, 2].map((n) => (n < stars ? '⭐' : '☆')).join(' ')}</AppText>
                </Card>
              </PressableScale>
            </AnimatedIn>
          );
        })}
      </View>
    </Screen>
  );
}
