import { validatedChapters } from '@/src/features/progress/selectors';
import { useAppStore } from '@/src/store/useAppStore';
import type { QuizContext } from './engine';

type S = ReturnType<typeof useAppStore.getState>;

/** Chapitres « appris » = validés ou dont la leçon a été lue. */
export function learnedChapters(s: Pick<S, 'steps' | 'lessonsRead'>): number[] {
  const set = new Set<number>(validatedChapters(s.steps));
  for (const [k, v] of Object.entries(s.lessonsRead)) if (v) set.add(Number(k));
  return [...set].sort((a, b) => a - b);
}

export function buildContext(s: S, extra: Partial<QuizContext> = {}): QuizContext {
  return {
    validated: validatedChapters(s.steps),
    unlocked: learnedChapters(s),
    missedIds: Object.keys(s.missed),
    ...extra,
  };
}
