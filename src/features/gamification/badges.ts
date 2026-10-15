import type { StepsState } from '@/src/features/progress/selectors';
import type { StreakState } from '@/src/features/streak/streak';
import type { Attempt, GameStat } from '@/src/store/types';
import { PATH } from '@/src/features/progress/path';

export interface BadgeSnapshot {
  steps: StepsState;
  attempts: Attempt[];
  streak: StreakState;
  games: Record<string, GameStat>;
  dailyCompleted: number;
  lessonsRead: Record<number, boolean>;
  xp: number;
  themeStars: Record<string, number>;
}

export interface BadgeDef {
  id: string;
  emoji: string;
  title: string;
  description: string;
  check: (s: BadgeSnapshot) => boolean;
}

const passedChapters = (s: BadgeSnapshot) => PATH.filter((p) => p.kind === 'chapter' && s.steps[p.key]?.passed).length;
const passed = (s: BadgeSnapshot, key: string) => !!s.steps[key]?.passed;
const mocks = (s: BadgeSnapshot) => s.attempts.filter((a) => a.kind === 'mock');
const gamePlays = (s: BadgeSnapshot) => Object.values(s.games).reduce((n, g) => n + g.plays, 0);

export const BADGES: BadgeDef[] = [
  { id: 'first-lesson', emoji: '📖', title: 'Première leçon', description: 'Termine ta première leçon', check: (s) => Object.values(s.lessonsRead).some(Boolean) },
  { id: 'first-chapter', emoji: '🥉', title: 'Chapitre validé', description: 'Valide un premier chapitre (16/20)', check: (s) => passedChapters(s) >= 1 },
  { id: 'five-chapters', emoji: '🥈', title: 'À mi-parcours', description: 'Valide 5 chapitres', check: (s) => passedChapters(s) >= 5 },
  { id: 'all-chapters', emoji: '🥇', title: 'Cours terminé', description: 'Valide les 10 chapitres', check: (s) => passedChapters(s) >= 10 },
  { id: 'perfect', emoji: '💯', title: 'Sans faute', description: 'Obtiens un score parfait à un quiz', check: (s) => s.attempts.some((a) => a.max >= 10 && a.score === a.max) },
  { id: 'mini-exam', emoji: '📝', title: 'Mini-examinateur', description: 'Réussis un mini-examen', check: (s) => PATH.some((p) => p.kind === 'mini' && s.steps[p.key]?.passed) },
  { id: 'inter-exam', emoji: '🎯', title: 'Cap des 60', description: 'Réussis l’examen intermédiaire', check: (s) => passed(s, 'inter') },
  { id: 'final-exam', emoji: '🏆', title: 'Champion du Code', description: 'Réussis l’examen final', check: (s) => passed(s, 'final') },
  { id: 'mock-first', emoji: '⏱️', title: 'Premier examen blanc', description: 'Termine un examen blanc', check: (s) => mocks(s).length >= 1 },
  { id: 'mock-five', emoji: '🔁', title: 'Endurant', description: 'Termine 5 examens blancs', check: (s) => mocks(s).length >= 5 },
  { id: 'mock-90', emoji: '🚀', title: 'Prêt pour l’examen', description: 'Atteins 90 % à un examen blanc', check: (s) => mocks(s).some((a) => a.max >= 20 && a.score / a.max >= 0.9) },
  { id: 'streak-3', emoji: '🔥', title: '3 jours de suite', description: 'Série de 3 jours', check: (s) => s.streak.best >= 3 },
  { id: 'streak-7', emoji: '🔥', title: 'Semaine parfaite', description: 'Série de 7 jours', check: (s) => s.streak.best >= 7 },
  { id: 'streak-14', emoji: '🌋', title: 'Deux semaines !', description: 'Série de 14 jours', check: (s) => s.streak.best >= 14 },
  { id: 'daily-1', emoji: '📅', title: 'Défi relevé', description: 'Termine un défi du jour', check: (s) => s.dailyCompleted >= 1 },
  { id: 'daily-7', emoji: '🗓️', title: 'Habitué du défi', description: 'Termine 7 défis du jour', check: (s) => s.dailyCompleted >= 7 },
  { id: 'games-5', emoji: '🎮', title: 'Joueur', description: 'Joue à 5 jeux éducatifs', check: (s) => gamePlays(s) >= 5 },
  { id: 'theme-star', emoji: '⭐', title: 'Spécialiste', description: 'Obtiens 3 étoiles à un défi par thème', check: (s) => Object.values(s.themeStars).some((v) => v >= 3) },
  { id: 'xp-500', emoji: '💎', title: '500 XP', description: 'Cumule 500 points d’expérience', check: (s) => s.xp >= 500 },
];

export function badgeById(id: string): BadgeDef | undefined {
  return BADGES.find((b) => b.id === id);
}
