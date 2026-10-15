import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Modal, Text, View } from 'react-native';
import Animated, { Easing, FadeIn, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withSpring, withTiming } from 'react-native-reanimated';

import { Button } from '@/src/components/ui/Button';
import { AppText } from '@/src/components/ui/AppText';
import { badgeById } from '@/src/features/gamification/badges';
import { streakMessage } from '@/src/features/streak/streak';
import { useAppStore } from '@/src/store/useAppStore';
import type { CelebrationKind } from '@/src/store/types';
import { useTheme } from '@/src/theme/ThemeProvider';
import { radius, spacing } from '@/src/theme/tokens';
import { haptic } from '@/src/utils/haptics';
import { Confetti } from './Confetti';

function BigEmoji({ emoji, size = 96 }: { emoji: string; size?: number }) {
  const scale = useSharedValue(0);
  const rot = useSharedValue(0);
  useEffect(() => {
    scale.value = withSequence(withSpring(1.35, { damping: 6, stiffness: 160 }), withSpring(1, { damping: 8 }));
    rot.value = withDelay(500, withRepeat(withSequence(withTiming(-8, { duration: 220 }), withTiming(8, { duration: 220 })), 4, true));
  }, [scale, rot]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }, { rotate: `${rot.value}deg` }] }));
  return (
    <Animated.View style={style}>
      <Text style={{ fontSize: size }}>{emoji}</Text>
    </Animated.View>
  );
}

function Counter({ value }: { value: number }) {
  const y = useSharedValue(40);
  const o = useSharedValue(0);
  useEffect(() => {
    y.value = withDelay(250, withSpring(0, { damping: 10 }));
    o.value = withDelay(250, withTiming(1, { duration: 300, easing: Easing.out(Easing.quad) }));
  }, [y, o]);
  const style = useAnimatedStyle(() => ({ opacity: o.value, transform: [{ translateY: y.value }] }));
  return (
    <Animated.View style={style}>
      <AppText style={{ color: '#FFFFFF', fontSize: 72, fontWeight: '800', lineHeight: 80 }}>{value}</AppText>
    </Animated.View>
  );
}

function content(c: CelebrationKind): { emoji: string; title: string; body: string; extra?: string; colors: [string, string]; confetti: boolean; counter?: number } {
  switch (c.type) {
    case 'streak': {
      const m = streakMessage(c.value);
      const extras: string[] = [];
      if (c.freezeUsed) extras.push('🧊 Une protection a sauvé ta série hier !');
      if (c.freezeEarned) extras.push('🧊 Protection de série gagnée !');
      return {
        emoji: '🔥',
        title: m.title,
        body: c.milestone ? `Palier de ${c.milestone} jours atteint ! ${m.body}` : m.body,
        extra: extras.join('\n') || undefined,
        colors: ['#FF8A00', '#F2542D'],
        confetti: !!c.milestone || c.value >= 7,
        counter: c.value,
      };
    }
    case 'badge': {
      const defs = c.ids.map((id) => badgeById(id)).filter(Boolean);
      return {
        emoji: defs[0]?.emoji ?? '🏅',
        title: defs.length > 1 ? `${defs.length} badges débloqués !` : `Badge : ${defs[0]?.title ?? ''}`,
        body: defs.map((d) => `${d!.emoji} ${d!.title} — ${d!.description}`).join('\n'),
        colors: ['#8E4FD6', '#4F6BED'],
        confetti: true,
      };
    }
    case 'level':
      return { emoji: '👑', title: 'Nouveau titre !', body: `Tu es maintenant « ${c.title} ».`, colors: ['#0A8F5B', '#16B877'], confetti: true };
    case 'chapter':
      return { emoji: '🎉', title: `Chapitre ${c.chapter} validé !`, body: 'Le suivant est débloqué.', colors: ['#0A8F5B', '#16B877'], confetti: true };
  }
}

/** File d'attente globale de célébrations (série, badges, titre) : une carte plein écran à la fois. */
export function CelebrationOverlay() {
  const { colors } = useTheme();
  const current = useAppStore((s) => s.celebrations[0]);
  const dismiss = useAppStore((s) => s.dismissCelebration);
  const count = useAppStore((s) => s.celebrations.length);

  useEffect(() => {
    if (current) haptic.success();
  }, [current]);

  if (!current) return null;
  const c = content(current);
  // la clé change à chaque célébration pour rejouer les animations
  const key = `${current.type}-${count}-${current.type === 'streak' ? current.value : ''}`;

  return (
    <Modal transparent animationType="fade" visible onRequestClose={dismiss} statusBarTranslucent>
      <View style={{ flex: 1, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center', padding: spacing.xl }}>
        <Animated.View key={key} entering={FadeIn.duration(250)} style={{ width: '100%', maxWidth: 380 }}>
          <LinearGradient colors={c.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: radius.xl, padding: spacing.xl, alignItems: 'center', gap: spacing.md }}>
            <BigEmoji emoji={c.emoji} />
            {c.counter != null ? <Counter value={c.counter} /> : null}
            <AppText variant="h2" center style={{ color: '#FFFFFF' }}>{c.title}</AppText>
            <AppText center style={{ color: '#FFFFFFEE' }}>{c.body}</AppText>
            {c.extra ? <AppText center style={{ color: '#FFFFFF', fontWeight: '700' }}>{c.extra}</AppText> : null}
            <Button title={count > 1 ? 'Suivant' : 'Super !'} variant="secondary" onPress={dismiss} style={{ marginTop: spacing.sm, alignSelf: 'stretch', backgroundColor: '#FFFFFF' }} />
          </LinearGradient>
        </Animated.View>
        {c.confetti ? <Confetti burstKey={key} /> : null}
      </View>
    </Modal>
  );
}
