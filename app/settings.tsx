import React, { useState } from 'react';
import { Alert, Linking, Platform, View } from 'react-native';

import { AppText } from '@/src/components/ui/AppText';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Header } from '@/src/components/ui/Header';
import { OptionPills } from '@/src/components/ui/OptionPills';
import { Screen } from '@/src/components/ui/Screen';
import { SwitchRow } from '@/src/components/ui/SwitchRow';
import { TimeStepper } from '@/src/components/ui/TimeStepper';
import { hasPermission, notificationsAvailable, requestPermission, rescheduleAll, sendTestNotification } from '@/src/features/notifications/service';
import type { NotificationSettings, ThemeMode, TimeSetting } from '@/src/store/types';
import { useAppStore } from '@/src/store/useAppStore';
import { useTheme } from '@/src/theme/ThemeProvider';
import { spacing } from '@/src/theme/tokens';
import { addDays, dayDiff, formatDateFr, toDateStr } from '@/src/utils/dates';

type TimedKey = 'streak' | 'challenge' | 'encouragement';

const TIMED: { key: TimedKey; title: string; subtitle: string }[] = [
  { key: 'streak', title: 'Rappel de série 🔥', subtitle: 'Chaque jour, pour ne pas perdre ta série' },
  { key: 'challenge', title: 'Défi du jour 📅', subtitle: 'Quand le défi quotidien est prêt' },
  { key: 'encouragement', title: 'Encouragements 💪', subtitle: 'Messages personnalisés selon ta progression' },
];

export default function SettingsScreen() {
  const { colors } = useTheme();
  const themeMode = useAppStore((s) => s.themeMode);
  const setThemeMode = useAppStore((s) => s.setThemeMode);
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const protection = useAppStore((s) => s.streakProtection);
  const setProtection = useAppStore((s) => s.setStreakProtection);
  const examDate = useAppStore((s) => s.examDate);
  const setExamDate = useAppStore((s) => s.setExamDate);
  const resetProgress = useAppStore((s) => s.resetProgress);
  const [busy, setBusy] = useState(false);

  const setTimed = (key: TimedKey, patch: Partial<TimeSetting>) => {
    const next: NotificationSettings = { ...settings, [key]: { ...settings[key], ...patch } };
    updateSettings({ [key]: next[key] });
  };

  const toggleGlobal = async (on: boolean) => {
    if (on) {
      const ok = await requestPermission();
      if (!ok && Platform.OS !== 'web') {
        Alert.alert('Notifications bloquées', 'Autorise les notifications dans les réglages du téléphone pour recevoir les rappels.', [
          { text: 'Plus tard', style: 'cancel' },
          { text: 'Ouvrir les réglages', onPress: () => Linking.openSettings().catch(() => {}) },
        ]);
      }
    }
    updateSettings({ enabled: on });
  };

  const sendTest = async () => {
    setBusy(true);
    try {
      if (!notificationsAvailable()) {
        Alert.alert('Indisponible dans Expo Go', 'Les notifications nécessitent un build de développement (npx expo run:android ou run:ios). Le reste de l’app fonctionne normalement.');
        return;
      }
      if (!(await hasPermission()) && !(await requestPermission())) {
        Alert.alert('Permission refusée', 'Active les notifications dans les réglages du téléphone.');
        return;
      }
      if (await sendTestNotification()) {
        Alert.alert('Test programmé', 'Une notification arrive dans 5 secondes. Quitte l’app pour la voir en bannière.');
      } else {
        Alert.alert('Impossible', 'Les notifications locales ne sont pas disponibles ici.');
      }
    } catch {
      Alert.alert('Impossible', 'Les notifications locales ne sont pas disponibles ici.');
    } finally {
      setBusy(false);
    }
  };

  const shiftExam = (n: number) => {
    const base = examDate ?? toDateStr();
    const next = addDays(base, n);
    if (dayDiff(toDateStr(), next) < 0) return;
    setExamDate(next);
  };

  const confirmReset = () => {
    Alert.alert('Tout réinitialiser ?', 'Chapitres, scores, badges et série seront effacés. Cette action est définitive.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Réinitialiser', style: 'destructive', onPress: () => { resetProgress(); rescheduleAll(); } },
    ]);
  };

  const left = examDate ? dayDiff(toDateStr(), examDate) : null;

  return (
    <Screen>
      <Header title="Réglages" />

      <Card style={{ gap: spacing.md }}>
        <AppText variant="h3">Apparence</AppText>
        <OptionPills<ThemeMode>
          value={themeMode}
          onChange={setThemeMode}
          options={[
            { value: 'system', label: '📱 Système' },
            { value: 'light', label: '☀️ Clair' },
            { value: 'dark', label: '🌙 Sombre' },
          ]}
        />
      </Card>

      <Card style={{ gap: spacing.lg, marginTop: spacing.lg }}>
        <AppText variant="h3">Notifications</AppText>
        {!notificationsAvailable() ? (
          <AppText variant="small" color={colors.warning}>
            ⚠️ Indisponibles dans Expo Go : utilise un build de développement pour les recevoir.
          </AppText>
        ) : null}
        <SwitchRow title="Activer les notifications" subtitle="Rappels locaux, sans connexion internet" value={settings.enabled} onChange={toggleGlobal} />
        {TIMED.map((t) => (
          <View key={t.key} style={{ gap: spacing.sm }}>
            <SwitchRow title={t.title} subtitle={t.subtitle} value={settings[t.key].on} disabled={!settings.enabled} onChange={(on) => setTimed(t.key, { on })} />
            {settings[t.key].on && settings.enabled ? (
              <TimeStepper hour={settings[t.key].hour} minute={settings[t.key].minute} onChange={(hour, minute) => setTimed(t.key, { hour, minute })} />
            ) : null}
          </View>
        ))}
        <SwitchRow title="Rappels d’examens 📝" subtitle="Avant les mini, intermédiaire, final + compte à rebours de l’examen officiel" value={settings.exams} disabled={!settings.enabled} onChange={(exams) => updateSettings({ exams })} />
        <Button title="Envoyer une notification test" variant="secondary" icon="notifications-outline" onPress={sendTest} loading={busy} small />
      </Card>

      <Card style={{ gap: spacing.md, marginTop: spacing.lg }}>
        <AppText variant="h3">Série</AppText>
        <SwitchRow title="Protection de série 🧊" subtitle="Une protection (gagnée tous les 7 jours, max 2) sauve ta série si tu rates un seul jour" value={protection} onChange={setProtection} />
      </Card>

      <Card style={{ gap: spacing.md, marginTop: spacing.lg }}>
        <AppText variant="h3">Date de l’examen officiel</AppText>
        <AppText muted>{examDate ? `${formatDateFr(examDate)}${left != null ? ` · ${left >= 0 ? `dans ${left} jour${left > 1 ? 's' : ''}` : 'passé'}` : ''}` : 'Non définie'}</AppText>
        <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
          <Button title="−1 jour" variant="ghost" small onPress={() => shiftExam(-1)} />
          <Button title="+1 jour" variant="ghost" small onPress={() => shiftExam(1)} />
          <Button title="+7 jours" variant="ghost" small onPress={() => shiftExam(7)} />
        </View>
      </Card>

      <Card style={{ gap: spacing.md, marginTop: spacing.lg, borderColor: colors.danger }}>
        <AppText variant="h3" color={colors.danger}>Zone sensible</AppText>
        <Button title="Réinitialiser ma progression" variant="danger" icon="trash-outline" onPress={confirmReset} />
      </Card>
    </Screen>
  );
}
