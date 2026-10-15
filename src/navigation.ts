import type { useRouter } from 'expo-router';

import type { PathStep } from '@/src/features/progress/path';
import type { QuizKind } from '@/src/features/quiz/engine';

type Router = ReturnType<typeof useRouter>;

export function openQuiz(router: Router, kind: QuizKind, ref: string, extra: Record<string, string> = {}) {
  router.push({ pathname: '/quiz', params: { kind, ref, ...extra } });
}

/** Ouvre un palier du parcours : cours pour un chapitre, quiz pour un examen. */
export function openStep(router: Router, step: PathStep) {
  if (step.kind === 'chapter') router.push({ pathname: '/chapter/[id]', params: { id: String(step.chapters[0]) } });
  else openQuiz(router, step.kind, step.key);
}
