import { ALL_QUESTIONS, ChapterId, Question, SignSpec, questionsOf, getQuestion } from '@/src/data';
import { PATH, STEP_BY_KEY, CHAPTER_PASS_MARK, EXAM_PASS_RATIO } from '@/src/features/progress/path';
import { hashString, mulberry32, Rng, sample, shuffle } from '@/src/utils/random';
import { toDateStr } from '@/src/utils/dates';

export type QuizKind = 'chapter' | 'mini' | 'inter' | 'final' | 'mock' | 'daily' | 'theme' | 'review' | 'errors';

export interface RuntimeQuestion {
  id: string;
  chapter: ChapterId;
  text: string;
  options: string[];
  /** index de la bonne réponse après mélange */
  answer: number;
  explanation: string;
  sign?: SignSpec;
}

export interface QuizConfig {
  kind: QuizKind;
  /** clé de palier ('ch3', 'mini2'…), thème, ou chapitre pour la révision */
  ref: string;
  title: string;
  subtitle: string;
  questions: RuntimeQuestion[];
  /** retour immédiat (bon/mauvais + explication) ou correction à la fin (conditions d'examen) */
  feedback: 'instant' | 'end';
  /** compte à rebours en secondes (examen blanc) */
  timeLimitSec?: number;
  /** note minimale pour réussir (palier validant), sinon undefined */
  passMark?: number;
  max: number;
  /** ce quiz compte pour la progression (valide un palier) */
  gating: boolean;
  /** ce quiz rapporte de l'XP */
  xpFactor: number;
}

export interface QuizContext {
  validated: number[];
  unlocked: number[];
  missedIds: string[];
  mockCount?: number;
  mockMinutes?: number;
}

export interface ThemeDef {
  key: string;
  title: string;
  emoji: string;
  chapters: number[];
  tag?: string;
  description: string;
}

export const THEMES: ThemeDef[] = [
  { key: 'permis', title: 'Permis & retraits', emoji: '🪪', chapters: [1], description: 'Catégories, âges, périodicité, retraits' },
  { key: 'signaux', title: 'Panneaux & feux', emoji: '🚦', chapters: [2], description: 'Formes, couleurs, feux, agents' },
  { key: 'routes', title: 'Routes & autoroutes', emoji: '🛣️', chapters: [3], description: 'Catégories, virages RAS, RASVO' },
  { key: 'manoeuvres', title: 'Arrêt, dépassement…', emoji: '🅿️', chapters: [4], description: 'Arrêt, stationnement, croisement' },
  { key: 'vitesse', title: 'Vitesse & sécurité', emoji: '⚡', chapters: [5], description: 'Vitesses, freinage, dérapage' },
  { key: 'priorites', title: 'Priorités & ronds-points', emoji: '🔀', chapters: [6, 7], description: 'Qui passe en premier ?' },
  { key: 'voyants', title: 'Voyants & mécanique', emoji: '🚗', chapters: [8, 10], description: 'Tableau de bord, moteur, chaîne cinématique' },
  { key: 'conduite', title: 'Conduite & démarrage', emoji: '🔑', chapters: [9], description: 'VIF, champ visuel, mise en marche' },
  { key: 'chiffres', title: 'Chiffres clés', emoji: '🔢', chapters: [], tag: 'chiffres', description: 'Toutes les valeurs à connaître par cœur' },
];

export function themeByKey(key: string): ThemeDef | undefined {
  return THEMES.find((t) => t.key === key);
}

export function themePool(theme: ThemeDef, unlocked: number[]): Question[] {
  if (theme.tag) {
    return ALL_QUESTIONS.filter((q) => q.tags?.includes(theme.tag!) && unlocked.includes(q.chapter));
  }
  return ALL_QUESTIONS.filter((q) => theme.chapters.includes(q.chapter) && unlocked.includes(q.chapter));
}

export function isThemeAvailable(theme: ThemeDef, unlocked: number[]): boolean {
  return themePool(theme, unlocked).length >= 8;
}

/** Mélange les options (sauf Vrai/Faux) et recalcule l'index de la bonne réponse. */
export function toRuntime(q: Question, rng: Rng = Math.random): RuntimeQuestion {
  const isTF = q.options.length === 2 && q.options[0] === 'Vrai' && q.options[1] === 'Faux';
  if (isTF) {
    return { id: q.id, chapter: q.chapter, text: q.text, options: q.options.slice(), answer: q.answer, explanation: q.explanation, sign: q.sign };
  }
  const order = shuffle(q.options.map((_, i) => i), rng);
  return {
    id: q.id,
    chapter: q.chapter,
    text: q.text,
    options: order.map((i) => q.options[i]),
    answer: order.indexOf(q.answer),
    explanation: q.explanation,
    sign: q.sign,
  };
}

function build(qs: Question[], rng: Rng = Math.random): RuntimeQuestion[] {
  return shuffle(qs, rng).map((q) => toRuntime(q, rng));
}

function pickPerChapter(chapters: number[], perChapter: number, rng: Rng = Math.random): Question[] {
  const out: Question[] = [];
  for (const ch of chapters) {
    out.push(...sample(questionsOf(ch), perChapter, rng));
  }
  return out;
}

export function buildQuiz(kind: QuizKind, ref: string, ctx: QuizContext): QuizConfig {
  switch (kind) {
    case 'chapter':
    case 'mini':
    case 'inter':
    case 'final': {
      const step = STEP_BY_KEY[ref] ?? PATH[0];
      const questions = build(pickPerChapter(step.chapters, step.perChapter));
      const max = questions.length;
      const passMark = step.kind === 'chapter' ? Math.min(CHAPTER_PASS_MARK, max) : Math.ceil(max * EXAM_PASS_RATIO);
      return {
        kind: step.kind,
        ref: step.key,
        title: step.kind === 'chapter' ? `Validation · Chapitre ${step.chapters[0]}` : step.title,
        subtitle: `Note minimale : ${passMark}/${max}`,
        questions,
        feedback: step.kind === 'chapter' ? 'instant' : 'end',
        passMark,
        max,
        gating: true,
        xpFactor: step.kind === 'chapter' ? 1 : 1.5,
      };
    }
    case 'mock': {
      const pool = ctx.validated.length ? ctx.validated : [1];
      const count = ctx.mockCount ?? 40;
      const all = pool.flatMap((c) => questionsOf(c));
      const questions = build(sample(all, count));
      const minutes = ctx.mockMinutes ?? Math.max(5, Math.round((questions.length * 45) / 60));
      return {
        kind: 'mock',
        ref: 'mock',
        title: 'Examen blanc',
        subtitle: `${questions.length} questions · ${minutes} min · correction à la fin`,
        questions,
        feedback: 'end',
        timeLimitSec: minutes * 60,
        max: questions.length,
        passMark: Math.ceil(questions.length * EXAM_PASS_RATIO),
        gating: false,
        xpFactor: 1.2,
      };
    }
    case 'daily': {
      const today = toDateStr();
      const rng = mulberry32(hashString(`daily-${today}`));
      const pool = ALL_QUESTIONS.filter((q) => ctx.unlocked.includes(q.chapter));
      const picks = sample(pool.length ? pool : questionsOf(1), 10, rng);
      return {
        kind: 'daily',
        ref: today,
        title: 'Défi du jour',
        subtitle: '10 questions · les mêmes toute la journée',
        questions: picks.map((q) => toRuntime(q, rng)),
        feedback: 'instant',
        max: picks.length,
        gating: false,
        xpFactor: 1.5,
      };
    }
    case 'theme': {
      const theme = themeByKey(ref) ?? THEMES[0];
      const pool = themePool(theme, ctx.unlocked);
      const questions = build(sample(pool, 10));
      return {
        kind: 'theme',
        ref: theme.key,
        title: `Défi · ${theme.title}`,
        subtitle: theme.description,
        questions,
        feedback: 'instant',
        max: questions.length,
        gating: false,
        xpFactor: 1,
      };
    }
    case 'review': {
      const ch = Number(ref) || 1;
      const questions = build(sample(questionsOf(ch), 15));
      return {
        kind: 'review',
        ref,
        title: `Révision · Chapitre ${ch}`,
        subtitle: 'Révision libre, sans pression',
        questions,
        feedback: 'instant',
        max: questions.length,
        gating: false,
        xpFactor: 0.5,
      };
    }
    case 'errors': {
      const qs = ctx.missedIds.map((id) => getQuestion(id)).filter((q): q is Question => !!q);
      const questions = build(sample(qs, 15));
      return {
        kind: 'errors',
        ref: 'errors',
        title: 'Mes erreurs',
        subtitle: 'Les questions que tu as ratées',
        questions,
        feedback: 'instant',
        max: questions.length,
        gating: false,
        xpFactor: 0.8,
      };
    }
  }
}

export interface QuizAnswerRecord {
  questionId: string;
  chapter: number;
  chosen: number | null;
  correct: boolean;
}

export function xpFor(config: QuizConfig, score: number): number {
  return Math.round(score * 2 * config.xpFactor);
}
