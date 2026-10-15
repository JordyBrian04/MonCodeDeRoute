import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { CelebrationOverlay } from '@/src/components/feedback/CelebrationOverlay';
import { initNotifications, requestPermission, rescheduleAll } from '@/src/features/notifications/service';
import { useAppStore } from '@/src/store/useAppStore';
import { AppThemeProvider, useTheme } from '@/src/theme/ThemeProvider';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync().catch(() => {});

function useNotificationSync() {
  const hydrated = useAppStore((s) => s.hydrated);

  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    (async () => {
      await initNotifications();
      if (useAppStore.getState().settings.enabled) await requestPermission();
      if (!cancelled) await rescheduleAll();
    })();

    // replanifie (avec debounce) dès que quelque chose de pertinent change
    let timer: ReturnType<typeof setTimeout> | null = null;
    const unsub = useAppStore.subscribe((s, prev) => {
      if (
        s.steps !== prev.steps ||
        s.streak !== prev.streak ||
        s.settings !== prev.settings ||
        s.examDate !== prev.examDate ||
        s.daily !== prev.daily ||
        s.missed !== prev.missed ||
        s.streakProtection !== prev.streakProtection
      ) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          rescheduleAll();
        }, 1500);
      }
    });
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      unsub();
    };
  }, [hydrated]);
}

function Shell() {
  const { colors, isDark } = useTheme();
  const hydrated = useAppStore((s) => s.hydrated);
  const ensureExamDate = useAppStore((s) => s.ensureExamDate);

  useNotificationSync();

  useEffect(() => {
    if (hydrated) {
      ensureExamDate();
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [hydrated, ensureExamDate]);

  if (!hydrated) return null;

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: 'slide_from_right' }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="quiz" options={{ animation: 'fade_from_bottom', gestureEnabled: false }} />
        <Stack.Screen name="games/memory" options={{ animation: 'fade_from_bottom', gestureEnabled: false }} />
        <Stack.Screen name="games/speed" options={{ animation: 'fade_from_bottom', gestureEnabled: false }} />
        <Stack.Screen name="games/priorities" options={{ animation: 'fade_from_bottom', gestureEnabled: false }} />
        <Stack.Screen name="games/match" options={{ animation: 'fade_from_bottom', gestureEnabled: false }} />
        <Stack.Screen name="games/situations" options={{ animation: 'fade_from_bottom', gestureEnabled: false }} />
      </Stack>
      <CelebrationOverlay />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppThemeProvider>
          <Shell />
        </AppThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
