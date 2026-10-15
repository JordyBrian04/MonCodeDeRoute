import type { Chapter, ChapterId, Question } from './types';
import { chapter1, questions1 } from './chapters/ch01';
import { chapter2, questions2 } from './chapters/ch02';
import { chapter3, questions3 } from './chapters/ch03';
import { chapter4, questions4 } from './chapters/ch04';
import { chapter5, questions5 } from './chapters/ch05';
import { chapter6, questions6 } from './chapters/ch06';
import { chapter7, questions7 } from './chapters/ch07';
import { chapter8, questions8 } from './chapters/ch08';
import { chapter9, questions9 } from './chapters/ch09';
import { chapter10, questions10 } from './chapters/ch10';

export * from './types';

export const CHAPTERS: Chapter[] = [
  chapter1,
  chapter2,
  chapter3,
  chapter4,
  chapter5,
  chapter6,
  chapter7,
  chapter8,
  chapter9,
  chapter10,
];

export const ALL_QUESTIONS: Question[] = [
  ...questions1,
  ...questions2,
  ...questions3,
  ...questions4,
  ...questions5,
  ...questions6,
  ...questions7,
  ...questions8,
  ...questions9,
  ...questions10,
];

const byChapter = new Map<ChapterId, Question[]>();
const byId = new Map<string, Question>();
for (const q of ALL_QUESTIONS) {
  const list = byChapter.get(q.chapter) ?? [];
  list.push(q);
  byChapter.set(q.chapter, list);
  byId.set(q.id, q);
}

export function getChapter(id: number): Chapter | undefined {
  return CHAPTERS.find((c) => c.id === id);
}

export function questionsOf(chapter: number): Question[] {
  return byChapter.get(chapter as ChapterId) ?? [];
}

export function getQuestion(id: string): Question | undefined {
  return byId.get(id);
}
