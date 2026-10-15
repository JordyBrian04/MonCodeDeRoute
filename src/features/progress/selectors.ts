import { PATH, PathStep, STEP_BY_KEY } from './path';

export interface StepResult {
  best: number;
  max: number;
  attempts: number;
  passed: boolean;
  lastDate: string;
}

export type StepsState = Record<string, StepResult | undefined>;

export function isStepPassed(steps: StepsState, key: string): boolean {
  return !!steps[key]?.passed;
}

export function stepIndex(key: string): number {
  return PATH.findIndex((s) => s.key === key);
}

/** Un palier est débloqué quand le précédent est réussi (le premier l'est toujours). */
export function isStepUnlocked(steps: StepsState, key: string): boolean {
  const i = stepIndex(key);
  if (i <= 0) return i === 0;
  return isStepPassed(steps, PATH[i - 1].key);
}

export function isChapterUnlocked(steps: StepsState, chapter: number): boolean {
  return isStepUnlocked(steps, `ch${chapter}`);
}

export function isChapterValidated(steps: StepsState, chapter: number): boolean {
  return isStepPassed(steps, `ch${chapter}`);
}

export function validatedChapters(steps: StepsState): number[] {
  return PATH.filter((s) => s.kind === 'chapter' && isStepPassed(steps, s.key)).map((s) => s.chapters[0]);
}

export function unlockedChapters(steps: StepsState): number[] {
  return PATH.filter((s) => s.kind === 'chapter' && isStepUnlocked(steps, s.key)).map((s) => s.chapters[0]);
}

/** Premier palier non réussi (le prochain à faire). */
export function nextStep(steps: StepsState): PathStep | null {
  return PATH.find((s) => !isStepPassed(steps, s.key)) ?? null;
}

export function passedCount(steps: StepsState): number {
  return PATH.filter((s) => isStepPassed(steps, s.key)).length;
}

export function overallProgress(steps: StepsState): number {
  return passedCount(steps) / PATH.length;
}

export function stepProgressLabel(key: string, steps: StepsState): string {
  const r = steps[key];
  const s = STEP_BY_KEY[key];
  if (!r) return `— / ${s.max}`;
  return `${r.best} / ${r.max}`;
}

/** Le mode Examen Blanc se débloque dès 2 chapitres validés. */
export const MOCK_MIN_CHAPTERS = 2;
export function isMockUnlocked(steps: StepsState): boolean {
  return validatedChapters(steps).length >= MOCK_MIN_CHAPTERS;
}
