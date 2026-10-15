import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';

import { AppText } from '@/src/components/ui/AppText';
import { PressableScale } from '@/src/components/ui/PressableScale';
import { useTheme } from '@/src/theme/ThemeProvider';
import { radius, spacing } from '@/src/theme/tokens';

export type OptionState = 'idle' | 'selected' | 'correct' | 'wrong' | 'missed' | 'dim';

interface Props {
  letter: string;
  text: string;
  state: OptionState;
  disabled?: boolean;
  onPress: () => void;
}

export function QuizOption({ letter, text, state, disabled, onPress }: Props) {
  const { colors } = useTheme();
  const x = useSharedValue(0);
  const pop = useSharedValue(1);

  useEffect(() => {
    if (state === 'wrong') {
      x.value = withSequence(withTiming(-9, { duration: 55 }), withTiming(9, { duration: 90 }), withTiming(-6, { duration: 80 }), withTiming(6, { duration: 80 }), withTiming(0, { duration: 55 }));
    } else if (state === 'correct') {
      pop.value = withSequence(withSpring(1.04, { damping: 5, stiffness: 300 }), withSpring(1, { damping: 8 }));
    }
  }, [state, x, pop]);

  const anim = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }, { scale: pop.value }] }));

  const palette = {
    idle: { bg: colors.surface, border: colors.border, fg: colors.text, badge: colors.surfaceAlt, badgeFg: colors.textMuted },
    selected: { bg: colors.primarySoft, border: colors.primary, fg: colors.text, badge: colors.primary, badgeFg: colors.onPrimary },
    correct: { bg: colors.successSoft, border: colors.success, fg: colors.text, badge: colors.success, badgeFg: '#FFFFFF' },
    wrong: { bg: colors.dangerSoft, border: colors.danger, fg: colors.text, badge: colors.danger, badgeFg: '#FFFFFF' },
    missed: { bg: colors.successSoft, border: colors.success, fg: colors.text, badge: colors.success, badgeFg: '#FFFFFF' },
    dim: { bg: colors.surface, border: colors.border, fg: colors.textMuted, badge: colors.surfaceAlt, badgeFg: colors.textMuted },
  }[state];

  return (
    <Animated.View style={anim}>
      <PressableScale
        onPress={onPress}
        disabled={disabled}
        scaleTo={0.98}
        accessibilityRole="button"
        accessibilityLabel={`Réponse ${letter} : ${text}`}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.md,
          backgroundColor: palette.bg,
          borderColor: palette.border,
          borderWidth: 2,
          borderRadius: radius.lg,
          padding: spacing.md,
          opacity: state === 'dim' ? 0.6 : 1,
        }}
      >
        <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: palette.badge, alignItems: 'center', justifyContent: 'center' }}>
          {state === 'correct' || state === 'missed' ? (
            <Ionicons name="checkmark" size={18} color={palette.badgeFg} />
          ) : state === 'wrong' ? (
            <Ionicons name="close" size={18} color={palette.badgeFg} />
          ) : (
            <AppText variant="caption" color={palette.badgeFg} style={{ fontWeight: '800' }}>{letter}</AppText>
          )}
        </View>
        <AppText style={{ flex: 1, color: palette.fg }}>{text}</AppText>
      </PressableScale>
    </Animated.View>
  );
}
