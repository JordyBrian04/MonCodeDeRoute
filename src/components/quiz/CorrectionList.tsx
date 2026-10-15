import React, { useState } from 'react';
import { View } from 'react-native';

import { SignShape } from '@/src/components/signs/SignShape';
import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { OptionPills } from '@/src/components/ui/OptionPills';
import type { RuntimeQuestion } from '@/src/features/quiz/engine';
import { useTheme } from '@/src/theme/ThemeProvider';
import { spacing } from '@/src/theme/tokens';

interface Props {
  questions: RuntimeQuestion[];
  chosen: (number | null)[];
}

/** Correction détaillée : réponse donnée, bonne réponse, explication. */
export function CorrectionList({ questions, chosen }: Props) {
  const { colors } = useTheme();
  const wrongCount = questions.filter((q, i) => chosen[i] !== q.answer).length;
  const [mode, setMode] = useState<'wrong' | 'all'>(wrongCount > 0 ? 'wrong' : 'all');

  return (
    <View style={{ gap: spacing.md }}>
      <OptionPills<'wrong' | 'all'>
        value={mode}
        onChange={setMode}
        options={[
          { value: 'wrong', label: `Erreurs (${wrongCount})` },
          { value: 'all', label: `Tout (${questions.length})` },
        ]}
      />
      {questions.map((q, i) => {
        const ok = chosen[i] === q.answer;
        if (mode === 'wrong' && ok) return null;
        return (
          <Card key={q.id + i} style={{ gap: spacing.sm, borderColor: ok ? colors.success : colors.danger, borderWidth: 1.5 }}>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <AppText variant="caption" muted>#{i + 1} · Chapitre {q.chapter}</AppText>
              <AppText variant="caption" color={ok ? colors.success : colors.danger} style={{ fontWeight: '800' }}>{ok ? '✔ Correct' : chosen[i] == null ? '✘ Sans réponse' : '✘ Faux'}</AppText>
            </View>
            {q.sign ? <View style={{ alignItems: 'center' }}><SignShape spec={q.sign} size={64} /></View> : null}
            <AppText variant="bodyBold">{q.text}</AppText>
            {!ok && chosen[i] != null ? (
              <View style={{ backgroundColor: colors.dangerSoft, borderRadius: 10, padding: spacing.sm }}>
                <AppText variant="small">Ta réponse : {q.options[chosen[i] as number]}</AppText>
              </View>
            ) : null}
            <View style={{ backgroundColor: colors.successSoft, borderRadius: 10, padding: spacing.sm }}>
              <AppText variant="small">Bonne réponse : {q.options[q.answer]}</AppText>
            </View>
            <AppText variant="small" muted>💡 {q.explanation}</AppText>
          </Card>
        );
      })}
    </View>
  );
}
