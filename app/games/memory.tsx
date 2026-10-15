import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

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

const PAIRS = 6;

interface CardData {
  uid: string;
  pairId: string;
  type: 'sign' | 'name';
  def: SignDef;
}

function buildDeck(): CardData[] {
  const defs = sample(SIGN_DEFS, PAIRS);
  const cards: CardData[] = [];
  defs.forEach((d) => {
    cards.push({ uid: `${d.id}-s`, pairId: d.id, type: 'sign', def: d });
    cards.push({ uid: `${d.id}-n`, pairId: d.id, type: 'name', def: d });
  });
  return shuffle(cards);
}

function FlipCard({ card, faceUp, matched, size, onPress }: { card: CardData; faceUp: boolean; matched: boolean; size: { w: number; h: number }; onPress: () => void }) {
  const { colors } = useTheme();
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withTiming(faceUp || matched ? 1 : 0, { duration: 320, easing: Easing.out(Easing.cubic) });
  }, [faceUp, matched, t]);
  const front = useAnimatedStyle(() => ({ transform: [{ perspective: 800 }, { rotateY: `${interpolate(t.value, [0, 1], [180, 360])}deg` }], opacity: t.value > 0.5 ? 1 : 0 }));
  const back = useAnimatedStyle(() => ({ transform: [{ perspective: 800 }, { rotateY: `${interpolate(t.value, [0, 1], [0, 180])}deg` }], opacity: t.value > 0.5 ? 0 : 1 }));
  const base = { position: 'absolute' as const, width: size.w, height: size.h, borderRadius: radius.md, alignItems: 'center' as const, justifyContent: 'center' as const, backfaceVisibility: 'hidden' as const };
  return (
    <PressableScale onPress={onPress} disabled={faceUp || matched} hapticOnPress={false} style={{ width: size.w, height: size.h }} accessibilityLabel={faceUp || matched ? card.def.name : 'Carte cachée'}>
      <Animated.View style={[base, { backgroundColor: colors.primary }, back]}>
        <AppText style={{ fontSize: 30, color: colors.onPrimary }}>🚦</AppText>
      </Animated.View>
      <Animated.View style={[base, { backgroundColor: matched ? colors.successSoft : colors.surface, borderWidth: 2, borderColor: matched ? colors.success : colors.border, padding: 4 }, front]}>
        {card.type === 'sign' ? <SignShape spec={card.def.spec} size={Math.min(size.w, size.h) - 18} /> : <AppText variant="small" center style={{ fontWeight: '700' }} numberOfLines={4} adjustsFontSizeToFit>{card.def.name}</AppText>}
      </Animated.View>
    </PressableScale>
  );
}

export default function MemoryGame() {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const recordGame = useAppStore((s) => s.recordGame);

  const [deck, setDeck] = useState<CardData[]>(buildDeck);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [info, setInfo] = useState<SignDef | null>(null);
  const [over, setOver] = useState<{ score: number; xp: number; record: boolean } | null>(null);
  const busy = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const cols = 3;
  const gap = spacing.md;
  const cw = Math.floor((width - spacing.lg * 2 - gap * (cols - 1)) / cols);
  const size = useMemo(() => ({ w: cw, h: Math.round(cw * 1.1) }), [cw]);

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    busy.current = false;
    setDeck(buildDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setInfo(null);
    setOver(null);
  };

  const press = (i: number) => {
    if (busy.current || flipped.includes(i) || matched.includes(deck[i].pairId)) return;
    haptic.tap();
    const next = [...flipped, i];
    setFlipped(next);
    if (next.length < 2) return;
    setMoves((m) => m + 1);
    busy.current = true;
    const [a, b] = next.map((k) => deck[k]);
    if (a.pairId === b.pairId) {
      timers.current.push(
        setTimeout(() => {
          haptic.success();
          const m = [...matched, a.pairId];
          setMatched(m);
          setFlipped([]);
          setInfo(a.def);
          busy.current = false;
          if (m.length === PAIRS) {
            const mv = moves + 1;
            const score = Math.max(10, 100 - (mv - PAIRS) * 6);
            const xp = Math.round(score / 4) + 5;
            const prev = useAppStore.getState().games.memory?.best ?? 0;
            recordGame('memory', score, xp);
            timers.current.push(setTimeout(() => setOver({ score, xp, record: score > prev }), 700));
          }
        }, 350),
      );
    } else {
      timers.current.push(
        setTimeout(() => {
          haptic.warning();
          setFlipped([]);
          busy.current = false;
        }, 900),
      );
    }
  };

  if (over) {
    const stars = moves <= 9 ? 3 : moves <= 13 ? 2 : 1;
    return (
      <GameShell title="Memory des panneaux" confirmQuit={false}>
        <GameOver emoji="🧠" title={`${'⭐'.repeat(stars)}`} lines={[`Terminé en ${moves} coups`, `Score : ${over.score}/100`]} xp={over.xp} best={over.record} onReplay={reset} />
      </GameShell>
    );
  }

  return (
    <GameShell title="Memory des panneaux" right={<AppText variant="bodyBold" color={colors.primary}>{moves} coups</AppText>}>
      <View style={{ padding: spacing.lg, gap: spacing.lg }}>
        <AppText variant="small" muted center>Associe chaque panneau à son nom ({matched.length}/{PAIRS} paires)</AppText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap }}>
          {deck.map((c, i) => (
            <FlipCard key={c.uid} card={c} faceUp={flipped.includes(i)} matched={matched.includes(c.pairId)} size={size} onPress={() => press(i)} />
          ))}
        </View>
        <View style={{ minHeight: 84 }}>
          {info ? (
            <Card tint={colors.successSoft} elevated={false} style={{ gap: 2 }}>
              <AppText variant="bodyBold" color={colors.success}>✔ {info.name}</AppText>
              <AppText variant="small">{info.meaning}</AppText>
            </Card>
          ) : null}
        </View>
      </View>
    </GameShell>
  );
}
