import React from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

import { QuizOption, OptionState } from '@/src/components/feedback/QuizOption';
import { SignShape } from '@/src/components/signs/SignShape';
import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { Chip } from '@/src/components/ui/Chip';
import type { RuntimeQuestion } from '@/src/features/quiz/engine';
import { chapterColors } from '@/src/theme/colors';
import { useTheme } from '@/src/theme/ThemeProvider';
import { spacing } from '@/src/theme/tokens';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

interface Props {
  question: RuntimeQuestion;
  index: number;
  chosen: number | null;
  /** retour immédiat : révèle bonne/mauvaise réponse + explication */
  revealed: boolean;
  onChoose: (i: number) => void;
}

export function QuestionView({ question, index, chosen, revealed, onChoose }: Props) {
  const { colors } = useTheme();
  const correct = chosen === question.answer;

  const stateOf = (i: number): OptionState => {
    if (revealed) {
      if (i === question.answer) return chosen === i ? 'correct' : 'missed';
      if (i === chosen) return 'wrong';
      return 'dim';
    }
    return chosen === i ? 'selected' : 'idle';
  };

  return (
    <Animated.View key={`${question.id}-${index}`} entering={FadeInRight.duration(260)} style={{ gap: spacing.md }}>
      <Card style={{ gap: spacing.md }}>
        <Chip label={`Chapitre ${question.chapter}`} color={chapterColors[question.chapter - 1]} bg={chapterColors[question.chapter - 1] + '22'} />
        {question.sign ? (
          <View style={{ alignItems: 'center', paddingVertical: spacing.sm }}>
            <SignShape spec={question.sign} size={104} />
          </View>
        ) : null}
        <AppText variant="h3" style={{ lineHeight: 26 }}>{question.text}</AppText>
      </Card>

      <View style={{ gap: spacing.sm }}>
        {question.options.map((o, i) => (
          <QuizOption key={i} letter={LETTERS[i] ?? String(i + 1)} text={o} state={stateOf(i)} disabled={revealed} onPress={() => onChoose(i)} />
        ))}
      </View>

      {revealed ? (
        <Animated.View entering={FadeInDown.duration(300)}>
          <View style={{ backgroundColor: correct ? colors.successSoft : colors.dangerSoft, borderRadius: 16, padding: spacing.md, gap: 4, borderWidth: 1, borderColor: correct ? colors.success : colors.danger }}>
            <AppText variant="bodyBold" color={correct ? colors.success : colors.danger}>{correct ? '✔ Bonne réponse !' : '✘ Pas tout à fait'}</AppText>
            {!correct ? <AppText variant="small">Bonne réponse : {question.options[question.answer]}</AppText> : null}
            <AppText variant="small">💡 {question.explanation}</AppText>
          </View>
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}
