import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { BADGES } from '@/src/features/gamification/badges';
import { titleForXp } from '@/src/features/gamification/titles';
import { STEP_BY_KEY } from '@/src/features/progress/path';
import type { StepResult, StepsState } from '@/src/features/progress/selectors';
import type { QuizAnswerRecord, QuizKind } from '@/src/features/quiz/engine';
import { advanceStreak, INITIAL_STREAK, StreakAdvance, StreakState } from '@/src/features/streak/streak';
import { addDays, toDateStr } from '@/src/utils/dates';
import { uid } from '@/src/utils/random';
import type {
  Attempt,
  CelebrationKind,
  ChapterStat,
  DailyState,
  GameStat,
  NotificationSettings,
  ThemeMode,
} from './types';

export const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: true,
  streak: { on: true, hour: 19, minute: 0 },
  challenge: { on: true, hour: 12, minute: 30 },
  encouragement: { on: true, hour: 8, minute: 0 },
  exams: true,
};

export interface SubmitInput {
  kind: QuizKind;
  ref: string;
  label: string;
  max: number;
  passMark?: number;
  gating: boolean;
  xpFactor: number;
  answers: QuizAnswerRecord[];
  durationSec: number;
}

export interface SubmitResult {
  attempt: Attempt;
  passed: boolean | null;
  firstPass: boolean;
  xpGained: number;
  newBadges: string[];
  streak: StreakAdvance;
  previousBest: number | null;
}

export interface ActivityResult {
  xpGained: number;
  newBadges: string[];
  streak: StreakAdvance;
}

interface AppState {
  hydrated: boolean;
  themeMode: ThemeMode;
  settings: NotificationSettings;
  streakProtection: boolean;
  /** date de l'examen officiel (YYYY-MM-DD) pour le compte à rebours */
  examDate: string | null;
  lessonsRead: Record<number, boolean>;
  steps: StepsState;
  attempts: Attempt[];
  chapterStats: Record<number, ChapterStat>;
  /** questions ratées : id → nombre d'erreurs */
  missed: Record<string, number>;
  xp: number;
  streak: StreakState;
  badges: Record<string, string>;
  daily: DailyState;
  dailyCompleted: number;
  themeStars: Record<string, number>;
  games: Record<string, GameStat>;
  celebrations: CelebrationKind[];

  setHydrated: () => void;
  setThemeMode: (m: ThemeMode) => void;
  updateSettings: (patch: Partial<NotificationSettings>) => void;
  setStreakProtection: (on: boolean) => void;
  setExamDate: (d: string | null) => void;
  ensureExamDate: () => void;
  markLessonRead: (chapter: number) => ActivityResult;
  submitQuiz: (input: SubmitInput) => SubmitResult;
  recordGame: (gameId: string, score: number, xp: number) => ActivityResult;
  dismissCelebration: () => void;
  resetProgress: () => void;
}

const initialProgress = {
  lessonsRead: {} as Record<number, boolean>,
  steps: {} as StepsState,
  attempts: [] as Attempt[],
  chapterStats: {} as Record<number, ChapterStat>,
  missed: {} as Record<string, number>,
  xp: 0,
  streak: INITIAL_STREAK,
  badges: {} as Record<string, string>,
  daily: { date: null, score: 0, max: 0 } as DailyState,
  dailyCompleted: 0,
  themeStars: {} as Record<string, number>,
  games: {} as Record<string, GameStat>,
  celebrations: [] as CelebrationKind[],
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => {
      /** Calcule les badges nouvellement débloqués sur la base de l'état fourni. */
      const evalBadges = (s: AppState): string[] =>
        BADGES.filter((b) => !s.badges[b.id] && b.check(s)).map((b) => b.id);

      const queueCelebrations = (extra: CelebrationKind[]) => {
        if (!extra.length) return;
        set((st) => ({ celebrations: [...st.celebrations, ...extra] }));
      };

      return {
        hydrated: false,
        themeMode: 'system',
        settings: DEFAULT_SETTINGS,
        streakProtection: true,
        examDate: null,
        ...initialProgress,

        setHydrated: () => set({ hydrated: true }),
        setThemeMode: (m) => set({ themeMode: m }),
        updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
        setStreakProtection: (on) => set({ streakProtection: on }),
        setExamDate: (d) => set({ examDate: d }),
        ensureExamDate: () => {
          if (!get().examDate) set({ examDate: addDays(toDateStr(), 14) });
        },

        markLessonRead: (chapter) => {
          const s = get();
          const adv = advanceStreak(s.streak, s.streakProtection);
          const firstTime = !s.lessonsRead[chapter];
          const xpGained = firstTime ? 10 : 0;
          const next: AppState = {
            ...s,
            lessonsRead: { ...s.lessonsRead, [chapter]: true },
            streak: adv.state,
            xp: s.xp + xpGained,
          };
          const newBadges = evalBadges(next);
          const stamp = new Date().toISOString();
          const badges = { ...s.badges };
          newBadges.forEach((id) => (badges[id] = stamp));
          set({ lessonsRead: next.lessonsRead, streak: adv.state, xp: next.xp, badges });
          const cel: CelebrationKind[] = [];
          if (adv.incremented) cel.push({ type: 'streak', value: adv.state.current, freezeUsed: adv.freezeUsed, freezeEarned: adv.freezeEarned, milestone: adv.milestone });
          if (newBadges.length) cel.push({ type: 'badge', ids: newBadges });
          queueCelebrations(cel);
          return { xpGained, newBadges, streak: adv };
        },

        submitQuiz: (input) => {
          const s = get();
          const today = toDateStr();
          const score = input.answers.filter((a) => a.correct).length;

          const perChapter: Record<number, { c: number; t: number }> = {};
          const chapterStats = { ...s.chapterStats };
          const missed = { ...s.missed };
          for (const a of input.answers) {
            const pc = (perChapter[a.chapter] ??= { c: 0, t: 0 });
            pc.t += 1;
            const cs = { ...(chapterStats[a.chapter] ?? { answered: 0, correct: 0 }) };
            cs.answered += 1;
            if (a.correct) {
              pc.c += 1;
              cs.correct += 1;
              if (missed[a.questionId]) delete missed[a.questionId];
            } else {
              missed[a.questionId] = (missed[a.questionId] ?? 0) + 1;
            }
            chapterStats[a.chapter] = cs;
          }

          const passed = input.passMark != null ? score >= input.passMark : null;

          const steps: StepsState = { ...s.steps };
          let firstPass = false;
          let previousBest: number | null = null;
          if (input.gating && STEP_BY_KEY[input.ref]) {
            const prev = steps[input.ref];
            previousBest = prev ? prev.best : null;
            const wasPassed = !!prev?.passed;
            const res: StepResult = {
              best: Math.max(prev?.best ?? 0, score),
              max: input.max,
              attempts: (prev?.attempts ?? 0) + 1,
              passed: wasPassed || passed === true,
              lastDate: today,
            };
            steps[input.ref] = res;
            firstPass = !wasPassed && res.passed;
          }

          const attempt: Attempt = {
            id: uid(),
            kind: input.kind,
            ref: input.ref,
            label: input.label,
            score,
            max: input.max,
            passed,
            date: new Date().toISOString(),
            durationSec: Math.round(input.durationSec),
            perChapter,
          };

          const adv = advanceStreak(s.streak, s.streakProtection, today);

          let xpGained = Math.round(score * 2 * input.xpFactor);
          if (firstPass) xpGained += 25;
          if (input.max >= 10 && score === input.max) xpGained += 10;

          let daily = s.daily;
          let dailyCompleted = s.dailyCompleted;
          if (input.kind === 'daily' && input.ref === today && s.daily.date !== today) {
            daily = { date: today, score, max: input.max };
            dailyCompleted += 1;
            xpGained += 15;
          }

          const themeStars = { ...s.themeStars };
          if (input.kind === 'theme' && input.max > 0) {
            const pct = score / input.max;
            const stars = pct >= 1 ? 3 : pct >= 0.8 ? 2 : pct >= 0.5 ? 1 : 0;
            themeStars[input.ref] = Math.max(themeStars[input.ref] ?? 0, stars);
          }

          const attempts = [attempt, ...s.attempts].slice(0, 300);
          const next: AppState = {
            ...s,
            steps,
            attempts,
            chapterStats,
            missed,
            xp: s.xp + xpGained,
            streak: adv.state,
            daily,
            dailyCompleted,
            themeStars,
          };
          const newBadges = evalBadges(next);
          const stamp = new Date().toISOString();
          const badges = { ...s.badges };
          newBadges.forEach((id) => (badges[id] = stamp));

          const before = titleForXp(s.xp).current.title;
          const after = titleForXp(next.xp).current.title;

          set({
            steps,
            attempts,
            chapterStats,
            missed,
            xp: next.xp,
            streak: adv.state,
            daily,
            dailyCompleted,
            themeStars,
            badges,
          });

          const cel: CelebrationKind[] = [];
          if (adv.incremented) cel.push({ type: 'streak', value: adv.state.current, freezeUsed: adv.freezeUsed, freezeEarned: adv.freezeEarned, milestone: adv.milestone });
          if (newBadges.length) cel.push({ type: 'badge', ids: newBadges });
          if (before !== after) cel.push({ type: 'level', title: after });
          queueCelebrations(cel);

          return { attempt, passed, firstPass, xpGained, newBadges, streak: adv, previousBest };
        },

        recordGame: (gameId, score, xp) => {
          const s = get();
          const adv = advanceStreak(s.streak, s.streakProtection);
          const prev = s.games[gameId] ?? { plays: 0, best: 0 };
          const games = {
            ...s.games,
            [gameId]: { plays: prev.plays + 1, best: Math.max(prev.best, score), lastDate: toDateStr() },
          };
          const next: AppState = { ...s, games, xp: s.xp + xp, streak: adv.state };
          const newBadges = evalBadges(next);
          const stamp = new Date().toISOString();
          const badges = { ...s.badges };
          newBadges.forEach((id) => (badges[id] = stamp));
          const before = titleForXp(s.xp).current.title;
          const after = titleForXp(next.xp).current.title;
          set({ games, xp: next.xp, streak: adv.state, badges });
          const cel: CelebrationKind[] = [];
          if (adv.incremented) cel.push({ type: 'streak', value: adv.state.current, freezeUsed: adv.freezeUsed, freezeEarned: adv.freezeEarned, milestone: adv.milestone });
          if (newBadges.length) cel.push({ type: 'badge', ids: newBadges });
          if (before !== after) cel.push({ type: 'level', title: after });
          queueCelebrations(cel);
          return { xpGained: xp, newBadges, streak: adv };
        },

        dismissCelebration: () => set((s) => ({ celebrations: s.celebrations.slice(1) })),

        resetProgress: () => set({ ...initialProgress, examDate: addDays(toDateStr(), 14) }),
      };
    },
    {
      name: 'moncodederoute-store-v1',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        themeMode: s.themeMode,
        settings: s.settings,
        streakProtection: s.streakProtection,
        examDate: s.examDate,
        lessonsRead: s.lessonsRead,
        steps: s.steps,
        attempts: s.attempts,
        chapterStats: s.chapterStats,
        missed: s.missed,
        xp: s.xp,
        streak: s.streak,
        badges: s.badges,
        daily: s.daily,
        dailyCompleted: s.dailyCompleted,
        themeStars: s.themeStars,
        games: s.games,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
