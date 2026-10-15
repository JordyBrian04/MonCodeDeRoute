import type { QuizKind } from '@/src/features/quiz/engine';

export type ThemeMode = 'system' | 'light' | 'dark';

export interface TimeSetting {
  on: boolean;
  hour: number;
  minute: number;
}

export interface NotificationSettings {
  /** interrupteur général */
  enabled: boolean;
  /** rappel quotidien pour maintenir la série */
  streak: TimeSetting;
  /** notification du défi du jour */
  challenge: TimeSetting;
  /** encouragements personnalisés selon la progression */
  encouragement: TimeSetting;
  /** rappels avant les examens (mini, intermédiaire, final) et compte à rebours de l'examen réel */
  exams: boolean;
}

export interface Attempt {
  id: string;
  kind: QuizKind;
  ref: string;
  label: string;
  score: number;
  max: number;
  passed: boolean | null;
  date: string; // ISO
  durationSec: number;
  perChapter: Record<number, { c: number; t: number }>;
}

export interface GameStat {
  plays: number;
  best: number;
  lastDate?: string;
}

export interface ChapterStat {
  answered: number;
  correct: number;
}

export interface DailyState {
  date: string | null;
  score: number;
  max: number;
}

export type CelebrationKind =
  | { type: 'streak'; value: number; freezeUsed?: boolean; freezeEarned?: boolean; milestone?: number | null }
  | { type: 'badge'; ids: string[] }
  | { type: 'chapter'; chapter: number }
  | { type: 'level'; title: string };
