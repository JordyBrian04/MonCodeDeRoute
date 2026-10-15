import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { PressableScale } from '@/src/components/ui/PressableScale';
import { useAppStore } from '@/src/store/useAppStore';
import { useTheme } from '@/src/theme/ThemeProvider';
import { dayDiff, formatDateFr, toDateStr } from '@/src/utils/dates';

export function ExamCountdown() {
  const { colors } = useTheme();
  const router = useRouter();
  const examDate = useAppStore((s) => s.examDate);
  if (!examDate) return null;
  const left = dayDiff(toDateStr(), examDate);
  const label = left > 1 ? `J-${left}` : left === 1 ? 'Demain' : left === 0 ? 'Aujourd’hui' : 'Passé';
  const tint = left <= 3 ? colors.dangerSoft : left <= 7 ? colors.warningSoft : colors.infoSoft;
  const fg = left <= 3 ? colors.danger : left <= 7 ? colors.warning : colors.info;
  return (
    <PressableScale onPress={() => router.push('/settings')} hapticOnPress={false}>
      <Card tint={tint} elevated={false} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, borderColor: 'transparent' }}>
        <AppText style={{ fontSize: 30 }}>⏳</AppText>
        <View style={{ flex: 1 }}>
          <AppText variant="bodyBold">Examen officiel : {formatDateFr(examDate)}</AppText>
          <AppText variant="small" muted>Touche pour changer la date</AppText>
        </View>
        <AppText style={{ color: fg, fontSize: 24, fontWeight: '800' }}>{label}</AppText>
      </Card>
    </PressableScale>
  );
}
