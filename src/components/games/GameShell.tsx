import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedIn } from '@/src/components/ui/AnimatedIn';
import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { PressableScale } from '@/src/components/ui/PressableScale';
import { Confetti } from '@/src/components/feedback/Confetti';
import { useTheme } from '@/src/theme/ThemeProvider';
import { spacing } from '@/src/theme/tokens';

interface ShellProps {
  title: string;
  right?: React.ReactNode;
  /** demande confirmation avant de quitter (partie en cours) */
  confirmQuit?: boolean;
  children: React.ReactNode;
}

export function GameShell({ title, right, confirmQuit = true, children }: ShellProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const quit = () => {
    const leave = () => (router.canGoBack() ? router.back() : router.replace('/'));
    if (!confirmQuit) return leave();
    Alert.alert('Quitter la partie ?', 'Ta partie en cours sera perdue.', [
      { text: 'Continuer', style: 'cancel' },
      { text: 'Quitter', style: 'destructive', onPress: leave },
    ]);
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.sm, flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <PressableScale onPress={quit} accessibilityLabel="Quitter" style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="close" size={22} color={colors.text} />
        </PressableScale>
        <AppText variant="h3" style={{ flex: 1 }} numberOfLines={1}>{title}</AppText>
        {right}
      </View>
      <View style={{ flex: 1 }}>{children}</View>
    </SafeAreaView>
  );
}

interface OverProps {
  emoji: string;
  title: string;
  lines: string[];
  xp: number;
  best?: boolean;
  celebrate?: boolean;
  onReplay: () => void;
}

export function GameOver({ emoji, title, lines, xp, best, celebrate = true, onReplay }: OverProps) {
  const router = useRouter();
  return (
    <View style={{ flex: 1, padding: spacing.lg, justifyContent: 'center', gap: spacing.lg }}>
      <AnimatedIn>
        <Card style={{ alignItems: 'center', gap: spacing.md }}>
          <AppText style={{ fontSize: 64 }}>{emoji}</AppText>
          <AppText variant="h1" center>{title}</AppText>
          {lines.map((l) => (
            <AppText key={l} muted center>{l}</AppText>
          ))}
          <AppText variant="h3" color="#F77F00">+{xp} XP</AppText>
          {best ? <AppText variant="bodyBold" color="#F2B600">⭐ Nouveau record !</AppText> : null}
        </Card>
      </AnimatedIn>
      <AnimatedIn index={1} style={{ gap: spacing.sm }}>
        <Button title="Rejouer" icon="refresh" onPress={onReplay} />
        <Button title="Retour aux jeux" variant="ghost" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} />
      </AnimatedIn>
      {celebrate ? <Confetti count={40} /> : null}
    </View>
  );
}
