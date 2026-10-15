import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import { GameOver, GameShell } from '@/src/components/games/GameShell';
import { SignShape } from '@/src/components/signs/SignShape';
import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { PressableScale } from '@/src/components/ui/PressableScale';
import { SIGN_DEFS } from '@/src/data/signs';
import type { SignDef } from '@/src/data';
import { useAppStore } from '@/src/store/useAppStore';
import { useTheme } from '@/src/theme/ThemeProvider';
import { radius, spacing } from '@/src/theme/tokens';
import { haptic } from '@/src/utils/haptics';
import { sample, shuffle } from '@/src/utils/random';

const ROUNDS = 3;
const PER_ROUND = 5;

function Shaker({ trigger, children }: { trigger: number; children: React.ReactNode }) {
  const x = useSharedValue(0);
  useEffect(() => {
    if (trigger > 0) x.value = withSequence(withTiming(-8, { duration: 50 }), withTiming(8, { duration: 80 }), withTiming(-5, { duration: 70 }), withTiming(0, { duration: 50 }));
  }, [trigger, x]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  return <Animated.View style={style}>{children}</Animated.View>;
}

export default function MatchGame() {
  const { colors } = useTheme();
  const recordGame = useAppStore((s) => s.recordGame);

  const makeRounds = () => {
    const picked = sample(SIGN_DEFS, ROUNDS * PER_ROUND);
    return Array.from({ length: ROUNDS }, (_, r) => picked.slice(r * PER_ROUND, (r + 1) * PER_ROUND));
  };

  const [rounds, setRounds] = useState<SignDef[][]>(makeRounds);
  const [round, setRound] = useState(0);
  const [selSign, setSelSign] = useState<string | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [shake, setShake] = useState<{ id: string; n: number }>({ id: '', n: 0 });
  const [over, setOver] = useState<{ score: number; xp: number; record: boolean } | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const defs = rounds[round];
  const meanings = useMemo(() => shuffle(defs), [defs]);

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setRounds(makeRounds());
    setRound(0);
    setSelSign(null);
    setDone([]);
    setMistakes(0);
    setOver(null);
  };

  const pickMeaning = (id: string) => {
    if (!selSign || done.includes(id)) return;
    if (selSign === id) {
      haptic.success();
      const nd = [...done, id];
      setDone(nd);
      setSelSign(null);
      if (nd.length === defs.length) {
        timers.current.push(
          setTimeout(() => {
            if (round < ROUNDS - 1) {
              setRound(round + 1);
              setDone([]);
            } else {
              const score = Math.max(0, ROUNDS * PER_ROUND - mistakes);
              const xp = score + 5;
              const prev = useAppStore.getState().games.match?.best ?? 0;
              recordGame('match', score, xp);
              setOver({ score, xp, record: score > prev });
            }
          }, 600),
        );
      }
    } else {
      haptic.error();
      setMistakes((m) => m + 1);
      setShake((s) => ({ id, n: s.n + 1 }));
      setSelSign(null);
    }
  };

  if (over) {
    return (
      <GameShell title="Associer panneau / sens" confirmQuit={false}>
        <GameOver emoji={over.score >= 13 ? '🏆' : '🔗'} title={`${over.score}/${ROUNDS * PER_ROUND}`} lines={[`${mistakes} erreur${mistakes > 1 ? 's' : ''}`]} xp={over.xp} best={over.record} onReplay={reset} />
      </GameShell>
    );
  }

  return (
    <GameShell title="Associer panneau / sens" right={<AppText variant="bodyBold" color={colors.danger}>✘ {mistakes}</AppText>}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }} showsVerticalScrollIndicator={false}>
        <AppText variant="small" muted center>Manche {round + 1}/{ROUNDS} · touche un panneau, puis sa signification</AppText>
        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <View style={{ width: 84, gap: spacing.sm }}>
            {defs.map((d) => {
              const ok = done.includes(d.id);
              const sel = selSign === d.id;
              return (
                <PressableScale key={d.id} disabled={ok} onPress={() => setSelSign(d.id)} accessibilityLabel={`Panneau ${d.name}`}>
                  <View style={{ height: 92, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md, borderWidth: 2, borderColor: ok ? colors.success : sel ? colors.primary : colors.border, backgroundColor: ok ? colors.successSoft : sel ? colors.primarySoft : colors.surface, opacity: ok ? 0.65 : 1 }}>
                    <SignShape spec={d.spec} size={68} />
                  </View>
                </PressableScale>
              );
            })}
          </View>
          <View style={{ flex: 1, gap: spacing.sm }}>
            {meanings.map((d) => {
              const ok = done.includes(d.id);
              return (
                <Shaker key={d.id} trigger={shake.id === d.id ? shake.n : 0}>
                  <PressableScale disabled={ok || !selSign} onPress={() => pickMeaning(d.id)} accessibilityLabel={d.meaning}>
                    <View style={{ minHeight: 92, justifyContent: 'center', padding: spacing.sm, borderRadius: radius.md, borderWidth: 2, borderColor: ok ? colors.success : colors.border, backgroundColor: ok ? colors.successSoft : colors.surface, opacity: !selSign && !ok ? 0.85 : 1 }}>
                      <AppText variant="small" style={{ fontSize: 13, lineHeight: 17 }}>{d.meaning}</AppText>
                    </View>
                  </PressableScale>
                </Shaker>
              );
            })}
          </View>
        </View>
        {done.length > 0 ? (
          <Card tint={colors.successSoft} elevated={false}>
            <AppText variant="small" color={colors.success} style={{ fontWeight: '700' }}>✔ {done.length}/{defs.length} associés</AppText>
          </Card>
        ) : null}
      </ScrollView>
    </GameShell>
  );
}
