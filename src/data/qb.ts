import type { ChapterId, Question, SignSpec } from './types';

type Extra = { tags?: string[]; sign?: SignSpec };

/**
 * Fabrique de questions pour un chapitre : génère des identifiants stables `cX-NN`.
 * ⚠️ Ne changez pas l'ordre des questions existantes (la progression sauvegarde les identifiants).
 */
export function qbuilder(chapter: ChapterId) {
  let n = 0;
  const nextId = () => `c${chapter}-${String(++n).padStart(2, '0')}`;

  /** Question à choix multiples. `answer` = index de la bonne réponse. */
  const q = (text: string, options: string[], answer: number, explanation: string, extra: Extra = {}): Question => ({
    id: nextId(),
    chapter,
    text,
    options,
    answer,
    explanation,
    ...extra,
  });

  /** Question Vrai / Faux. */
  const tf = (text: string, truth: boolean, explanation: string, extra: Extra = {}): Question => ({
    id: nextId(),
    chapter,
    text,
    options: ['Vrai', 'Faux'],
    answer: truth ? 0 : 1,
    explanation,
    ...extra,
  });

  return { q, tf };
}
