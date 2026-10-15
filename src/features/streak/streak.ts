import { addDays, dayDiff, toDateStr } from '@/src/utils/dates';

export interface StreakState {
  current: number;
  best: number;
  /** dernier jour d'activité (YYYY-MM-DD) */
  lastActive: string | null;
  /** jours de protection disponibles (1 gagné tous les 7 jours de série, max 2) */
  freezes: number;
  /** jours actifs récents (60 derniers) */
  days: string[];
  /** jours sauvés par une protection */
  frozenDays: string[];
}

export const INITIAL_STREAK: StreakState = {
  current: 0,
  best: 0,
  lastActive: null,
  freezes: 0,
  days: [],
  frozenDays: [],
};

export const MAX_FREEZES = 2;
export const FREEZE_EVERY = 7;

export interface StreakAdvance {
  state: StreakState;
  /** la série vient d'augmenter aujourd'hui (déclenche l'animation spéciale) */
  incremented: boolean;
  /** une protection a sauvé la série */
  freezeUsed: boolean;
  /** la série a été remise à 1 */
  broken: boolean;
  /** protection gagnée à ce passage */
  freezeEarned: boolean;
  /** palier atteint (3, 7, 14, 21, 30…) */
  milestone: number | null;
}

export const MILESTONES = [3, 7, 14, 21, 30, 50, 100];

/** Fait avancer la série quand l'utilisateur accomplit une activité aujourd'hui. */
export function advanceStreak(prev: StreakState, protectionEnabled: boolean, today: string = toDateStr()): StreakAdvance {
  const base: StreakAdvance = { state: prev, incremented: false, freezeUsed: false, broken: false, freezeEarned: false, milestone: null };

  if (prev.lastActive === today) return base;

  let current = prev.current;
  let freezes = prev.freezes;
  const frozenDays = prev.frozenDays.slice();
  let freezeUsed = false;
  let broken = false;

  if (!prev.lastActive) {
    current = 1;
  } else {
    const gap = dayDiff(prev.lastActive, today);
    if (gap === 1) {
      current += 1;
    } else if (gap === 2 && protectionEnabled && freezes > 0) {
      freezes -= 1;
      freezeUsed = true;
      frozenDays.push(addDays(prev.lastActive, 1));
      current += 1;
    } else {
      current = 1;
      broken = prev.current > 1;
    }
  }

  let freezeEarned = false;
  if (current > 0 && current % FREEZE_EVERY === 0 && freezes < MAX_FREEZES) {
    freezes += 1;
    freezeEarned = true;
  }

  const days = [...prev.days, today].slice(-60);
  const state: StreakState = {
    current,
    best: Math.max(prev.best, current),
    lastActive: today,
    freezes,
    days,
    frozenDays: frozenDays.slice(-30),
  };
  const incremented = current > prev.current || (prev.current === 0 && current === 1);
  const milestone = incremented && MILESTONES.includes(current) ? current : null;
  return { state, incremented, freezeUsed, broken, freezeEarned, milestone };
}

/** Valeur à afficher : la série n'est « vivante » que si l'on est actif aujourd'hui ou hier (ou protégé). */
export function effectiveStreak(s: StreakState, protectionEnabled: boolean, today: string = toDateStr()): number {
  if (!s.lastActive) return 0;
  const gap = dayDiff(s.lastActive, today);
  if (gap <= 1) return s.current;
  if (gap === 2 && protectionEnabled && s.freezes > 0) return s.current;
  return 0;
}

export function activeToday(s: StreakState, today: string = toDateStr()): boolean {
  return s.lastActive === today;
}

export function streakMessage(n: number): { title: string; body: string } {
  if (n <= 0) return { title: 'Lance ta série !', body: 'Fais une activité aujourd’hui pour démarrer ta série de jours consécutifs.' };
  if (n === 1) return { title: 'Série lancée 🔥', body: 'Premier jour validé. Reviens demain pour continuer !' };
  if (n < 3) return { title: `${n} jours d’affilée`, body: 'Bon début ! Encore un jour pour décrocher le palier des 3 jours.' };
  if (n < 7) return { title: `${n} jours, ça chauffe !`, body: 'Tu prends le rythme. Vise les 7 jours : une protection de série t’attend.' };
  if (n < 14) return { title: `${n} jours : tu es régulier !`, body: 'La régularité, c’est la clé pour réussir ton code. Continue !' };
  if (n < 21) return { title: `${n} jours : impressionnant !`, body: 'Tu as déjà fait plus que la plupart des candidats. Ne lâche rien.' };
  if (n < 30) return { title: `${n} jours : machine de guerre`, body: 'Le Code n’a plus de secrets pour toi… presque.' };
  return { title: `${n} jours : légende du Code`, body: 'Une série incroyable. Tu es prêt(e) pour l’examen !' };
}
