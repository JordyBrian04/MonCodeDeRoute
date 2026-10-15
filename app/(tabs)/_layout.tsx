import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/src/theme/ThemeProvider';
import { haptic } from '@/src/utils/haptics';

type IconName = keyof typeof Ionicons.glyphMap;

const TABS: { name: string; title: string; icon: IconName; iconOn: IconName }[] = [
  { name: 'index', title: 'Accueil', icon: 'home-outline', iconOn: 'home' },
  { name: 'learn', title: 'Parcours', icon: 'map-outline', iconOn: 'map' },
  { name: 'games', title: 'Jeux', icon: 'game-controller-outline', iconOn: 'game-controller' },
  { name: 'exams', title: 'Examens', icon: 'ribbon-outline', iconOn: 'ribbon' },
  { name: 'profile', title: 'Profil', icon: 'person-outline', iconOn: 'person' },
];

export default function TabsLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenListeners={{ tabPress: () => haptic.tap() }}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
          height: 58 + (Platform.OS === 'ios' ? insets.bottom : Math.max(insets.bottom, 6)),
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : Math.max(insets.bottom, 6),
          paddingTop: 6,
        },
      }}
    >
      {TABS.map((t) => (
        <Tabs.Screen
          key={t.name}
          name={t.name}
          options={{
            title: t.title,
            tabBarIcon: ({ color, focused, size }) => <Ionicons name={focused ? t.iconOn : t.icon} size={size} color={color} />,
          }}
        />
      ))}
    </Tabs>
  );
}
