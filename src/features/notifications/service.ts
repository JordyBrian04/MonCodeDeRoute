import Constants, { ExecutionEnvironment } from 'expo-constants';
import type * as NotificationsType from 'expo-notifications';
import { Platform } from 'react-native';

import { PATH } from '@/src/features/progress/path';
import { nextStep, validatedChapters } from '@/src/features/progress/selectors';
import { effectiveStreak } from '@/src/features/streak/streak';
import { useAppStore } from '@/src/store/useAppStore';
import { addDays, dayDiff, parseDateStr, toDateStr } from '@/src/utils/dates';
import { hashString } from '@/src/utils/random';
import { challengeReminder, countdownReminder, encouragement, examReminder, MsgContext, streakReminder } from './messages';


type NotificationsModule = typeof NotificationsType;
let cached: NotificationsModule | null | undefined;

/**
 * Chargement paresseux et sécurisé de expo-notifications.
 * Dans Expo Go (ou si le module natif manque), l'import lève une erreur : on la capture
 * pour que l'app continue de fonctionner sans notifications.
 */
function getNotifications(): NotificationsModule | null {
  if (Platform.OS === 'web') return null;
  if (cached !== undefined) return cached;
  // Expo Go n'embarque pas le module natif : on évite même de l'importer (pas d'erreur dans la console).
  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
    cached = null;
    return cached;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    cached = require('expo-notifications') as NotificationsModule;
  } catch {
    cached = null;
  }
  return cached;
}

export function notificationsAvailable(): boolean {
  return getNotifications() != null;
}

const CHANNEL_ID = 'rappels';
const HORIZON_DAYS = 7;

let handlerSet = false;

/** À appeler une fois au démarrage : affichage des notifications quand l'app est ouverte + canal Android. */
export async function initNotifications(): Promise<void> {
  const Notifications = getNotifications();
  if (!Notifications) return;
  try {
    if (!handlerSet) {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowBanner: true,
          shouldShowList: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });
      handlerSet = true;
    }
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: 'Rappels et défis',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 200, 100, 200],
        lightColor: '#0A8F5B',
      });
    }
  } catch {
    // les notifications ne doivent jamais faire planter l'app
  }
}

export async function hasPermission(): Promise<boolean> {
  const Notifications = getNotifications();
  if (!Notifications) return false;
  try {
    const p = await Notifications.getPermissionsAsync();
    return p.granted || p.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
  } catch {
    return false;
  }
}

export async function requestPermission(): Promise<boolean> {
  const Notifications = getNotifications();
  if (!Notifications) return false;
  try {
    if (await hasPermission()) return true;
    const p = await Notifications.requestPermissionsAsync();
    return p.granted;
  } catch {
    return false;
  }
}

function at(day: string, hour: number, minute: number): Date {
  const d = parseDateStr(day);
  d.setHours(hour, minute, 0, 0);
  return d;
}

async function schedule(title: string, body: string, date: Date): Promise<void> {
  const Notifications = getNotifications();
  if (!Notifications) return;
  if (date.getTime() <= Date.now() + 5000) return;
  await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: false },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date, channelId: CHANNEL_ID },
  });
}

/**
 * Replanifie toutes les notifications locales à partir de l'état courant.
 * On planifie les 7 prochains jours en notifications ponctuelles pour pouvoir personnaliser
 * chaque message ; l'app les recalcule à chaque ouverture et après chaque activité.
 */
export async function rescheduleAll(): Promise<void> {
  const Notifications = getNotifications();
  if (!Notifications) return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    const s = useAppStore.getState();
    if (!s.hydrated || !s.settings.enabled) return;
    if (!(await hasPermission())) return;

    const today = toDateStr();
    const next = nextStep(s.steps);
    const streak = effectiveStreak(s.streak, s.streakProtection, today);
    const daysLeft = s.examDate ? dayDiff(today, s.examDate) : null;
    const ctx: MsgContext = {
      streak,
      daysLeft,
      validated: validatedChapters(s.steps).length,
      nextLabel: next ? next.title : null,
      activeToday: s.streak.lastActive === today,
      missedCount: Object.keys(s.missed).length,
    };

    for (let i = 0; i < HORIZON_DAYS; i++) {
      const day = addDays(today, i);
      const seed = hashString(`${day}-notif`);
      const dayCtx: MsgContext = { ...ctx, streak: i === 0 ? streak : Math.max(0, streak), daysLeft: s.examDate ? dayDiff(day, s.examDate) : null };

      if (s.settings.streak.on && !(i === 0 && ctx.activeToday)) {
        const m = streakReminder(dayCtx, seed);
        await schedule(m.title, m.body, at(day, s.settings.streak.hour, s.settings.streak.minute));
      }
      if (s.settings.challenge.on && !(i === 0 && s.daily.date === today)) {
        const m = challengeReminder(seed);
        await schedule(m.title, m.body, at(day, s.settings.challenge.hour, s.settings.challenge.minute));
      }
      if (s.settings.encouragement.on) {
        const m = encouragement(dayCtx, seed);
        await schedule(m.title, m.body, at(day, s.settings.encouragement.hour, s.settings.encouragement.minute));
      }
    }

    if (s.settings.exams) {
      // rappel avant le prochain examen du parcours (veille à 18h, ou le jour même s'il est déjà proche)
      const upcoming = nextExamStep(s.steps);
      if (upcoming) {
        const m = examReminder(upcoming.title, upcoming.kind as 'mini' | 'inter' | 'final');
        await schedule(m.title, m.body, at(addDays(today, 1), 18, 0));
      }
      if (s.examDate && daysLeft != null) {
        for (const d of [7, 3, 1, 0]) {
          if (daysLeft >= d) {
            const m = countdownReminder(d);
            await schedule(m.title, m.body, at(addDays(s.examDate, -d), 9, 0));
          }
        }
      }
    }
  } catch {
    // silencieux : la planification est un bonus
  }
}

function nextExamStep(steps: ReturnType<typeof useAppStore.getState>['steps']) {
  // premier palier de type examen pas encore réussi
  return PATH.find((p) => p.kind !== 'chapter' && !steps[p.key]?.passed) ?? null;
}

/** Notification de test (5 s). Retourne false si indisponible. */
export async function sendTestNotification(): Promise<boolean> {
  const Notifications = getNotifications();
  if (!Notifications) return false;
  try {
    await Notifications.scheduleNotificationAsync({
      content: { title: '🚦 Test réussi !', body: 'Les rappels de Mon Code de la Route fonctionnent.' },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 5, channelId: CHANNEL_ID },
    });
    return true;
  } catch {
    return false;
  }
}
