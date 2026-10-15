import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View } from 'react-native';

import { AppText } from '@/src/components/ui/AppText';
import { activeToday, effectiveStreak, FREEZE_EVERY, streakMessage } from '@/src/features/streak/streak';
import { useAppStore } from '@/src/store/useAppStore';
import { useTheme } from '@/src/theme/ThemeProvider';
import { radius, spacing } from '@/src/theme/tokens';
import { addDays, dayLabelShort, toDateStr } from '@/src/utils/dates';
import { StreakFlame } from './StreakFlame';

/** Carte série (streak) bien visible : valeur, message d'encouragement, 7 derniers jours, protections. */
export function StreakCard() {
  const { colors } = useTheme();
  const streak = useAppStore((s) => s.streak);
  const protection = useAppStore((s) => s.streakProtection);
  const today = toDateStr();
  const value = effectiveStreak(streak, protection, today);
  const doneToday = activeToday(streak, today);
  const msg = streakMessage(value);
  const week = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
  const nextFreezeIn = FREEZE_EVERY - (value % FREEZE_EVERY);

  return (
    <LinearGradient
      colors={doneToday ? ['#FF8A00', '#F2542D'] : [colors.gradientA, colors.gradientB]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ borderRadius: radius.xl, padding: spacing.lg }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <StreakFlame size={46} active={doneToday} />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
            <AppText style={{ color: '#FFFFFF', fontSize: 40, fontWeight: '800', lineHeight: 46 }}>{value}</AppText>
            <AppText style={{ color: '#FFFFFFDD', fontWeight: '700' }}>jour{value > 1 ? 's' : ''} d’affilée</AppText>
          </View>
          <AppText variant="small" style={{ color: '#FFFFFFEE' }} numberOfLines={2}>{msg.body}</AppText>
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md }}>
        {week.map((d) => {
          const on = streak.days.includes(d);
          const frozen = streak.frozenDays.includes(d);
          const isToday = d === today;
          return (
            <View key={d} style={{ alignItems: 'center', gap: 4 }}>
              <AppText variant="caption" style={{ color: '#FFFFFFCC' }}>{dayLabelShort(d)}</AppText>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: on ? '#FFFFFF' : frozen ? '#BFE6FF' : '#FFFFFF33',
                  borderWidth: isToday ? 2 : 0,
                  borderColor: '#FFFFFF',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AppText style={{ fontSize: 15 }}>{on ? '🔥' : frozen ? '🧊' : ''}</AppText>
              </View>
            </View>
          );
        })}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md }}>
        <AppText variant="caption" style={{ color: '#FFFFFFDD' }}>🧊 Protections : {streak.freezes}/2</AppText>
        <AppText variant="caption" style={{ color: '#FFFFFFDD' }}>
          {streak.best > 0 ? `Record : ${streak.best} j · ` : ''}prochaine protection dans {nextFreezeIn} j
        </AppText>
      </View>
    </LinearGradient>
  );
}
