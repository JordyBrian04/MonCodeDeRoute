import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { useTheme } from '@/src/theme/ThemeProvider';
import { spacing } from '@/src/theme/tokens';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

interface Props {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onBack?: () => void;
  noBack?: boolean;
}

export function Header({ title, subtitle, right, onBack, noBack }: Props) {
  const router = useRouter();
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg }}>
      {noBack ? null : (
        <PressableScale
          onPress={() => (onBack ? onBack() : router.canGoBack() ? router.back() : router.replace('/'))}
          accessibilityLabel="Retour"
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </PressableScale>
      )}
      <View style={{ flex: 1 }}>
        <AppText variant="h2" numberOfLines={1}>{title}</AppText>
        {subtitle ? <AppText variant="small" muted numberOfLines={1}>{subtitle}</AppText> : null}
      </View>
      {right}
    </View>
  );
}
