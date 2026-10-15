import type { ChapterId } from '@/src/data';

export type StepKind = 'chapter' | 'mini' | 'inter' | 'final';

export interface PathStep {
  key: string;
  kind: StepKind;
  chapters: ChapterId[];
  /** Note maximale (20 / 40 / 60 / 100) */
  max: number;
  /** Note minimale pour débloquer la suite */
  passMark: number;
  /** nombre de questions tirées par chapitre */
  perChapter: number;
  title: string;
  subtitle: string;
  emoji: string;
}

/** Seuils : 16/20 pour chaque chapitre (imposé). Les examens exigent 70 % (modifiable ici). */
export const EXAM_PASS_RATIO = 0.7;
export const CHAPTER_PASS_MARK = 16;

const chapter = (n: ChapterId): PathStep => ({
  key: `ch${n}`,
  kind: 'chapter',
  chapters: [n],
  max: 20,
  passMark: CHAPTER_PASS_MARK,
  perChapter: 20,
  title: `Chapitre ${n}`,
  subtitle: 'Cours + questionnaire de validation /20',
  emoji: '📖',
});

const mini = (idx: number, a: ChapterId, b: ChapterId): PathStep => ({
  key: `mini${idx}`,
  kind: 'mini',
  chapters: [a, b],
  max: 40,
  passMark: Math.ceil(40 * EXAM_PASS_RATIO),
  perChapter: 20,
  title: `Mini-examen ${idx}`,
  subtitle: `Chapitres ${a} et ${b} · noté sur 40`,
  emoji: '📝',
});

/**
 * Parcours complet (ordre de déblocage) :
 * 1, 2, Mini(1-2), 3, 4, Mini(3-4), 5, Examen intermédiaire (1-5), 6, Mini(5-6), 7, 8, Mini(7-8), 9, 10, Mini(9-10), Examen final.
 */
export const PATH: PathStep[] = [
  chapter(1),
  chapter(2),
  mini(1, 1, 2),
  chapter(3),
  chapter(4),
  mini(2, 3, 4),
  chapter(5),
  {
    key: 'inter',
    kind: 'inter',
    chapters: [1, 2, 3, 4, 5],
    max: 60,
    passMark: Math.ceil(60 * EXAM_PASS_RATIO),
    perChapter: 12,
    title: 'Examen intermédiaire',
    subtitle: 'Chapitres 1 à 5 · noté sur 60',
    emoji: '🎯',
  },
  chapter(6),
  mini(3, 5, 6),
  chapter(7),
  chapter(8),
  mini(4, 7, 8),
  chapter(9),
  chapter(10),
  mini(5, 9, 10),
  {
    key: 'final',
    kind: 'final',
    chapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    max: 100,
    passMark: Math.ceil(100 * EXAM_PASS_RATIO),
    perChapter: 10,
    title: 'Examen final',
    subtitle: 'Les 10 chapitres · noté sur 100',
    emoji: '🏆',
  },
];

export const STEP_BY_KEY: Record<string, PathStep> = Object.fromEntries(PATH.map((s) => [s.key, s]));

export function stepOfChapter(ch: number): PathStep | undefined {
  return STEP_BY_KEY[`ch${ch}`];
}
