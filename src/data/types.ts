export type ChapterId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type SignShapeKind = 'triangle' | 'triangleDown' | 'circle' | 'square' | 'rect' | 'octagon' | 'diamond';
export type SignGlyph = 'cross' | 'arrowUp' | 'arrowRight' | 'exclam' | 'roundabout' | 'priority' | 'none';

/** Description vectorielle d'un panneau (dessiné avec react-native-svg). */
export interface SignSpec {
  shape: SignShapeKind;
  /** couleur de la bordure (anneau extérieur) */
  border: string;
  /** couleur du fond intérieur */
  fill: string;
  glyph?: SignGlyph;
  glyphColor?: string;
  text?: string;
  textColor?: string;
  /** barre oblique rouge (ex: stationnement interdit) */
  slash?: boolean;
  outline?: string;
}

export interface Question {
  id: string;
  chapter: ChapterId;
  text: string;
  options: string[];
  /** index de la bonne réponse dans `options` (avant mélange) */
  answer: number;
  explanation: string;
  tags?: string[];
  sign?: SignSpec;
}

export type Block =
  | { type: 'p'; text: string }
  | { type: 'list'; title?: string; items: string[]; ordered?: boolean }
  | { type: 'key'; title?: string; text: string }
  | { type: 'warn'; text: string }
  | { type: 'mnemo'; code: string; title: string; items: { letter: string; text: string }[] }
  | { type: 'example'; title: string; text: string }
  | { type: 'table'; title?: string; rows: [string, string][] }
  | { type: 'signs'; title?: string; items: { sign: SignSpec; label: string }[] };

export interface LessonSection {
  id: string;
  title: string;
  emoji: string;
  blocks: Block[];
}

export interface Chapter {
  id: ChapterId;
  title: string;
  shortTitle: string;
  emoji: string;
  summary: string;
  /** pages du cours papier couvertes */
  pages: string;
  sections: LessonSection[];
}

export interface SignDef {
  id: string;
  name: string;
  meaning: string;
  spec: SignSpec;
  category: string;
}

export interface Situation {
  id: string;
  chapter: ChapterId;
  title: string;
  emoji: string;
  story: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export type CarColor = 'rouge' | 'bleue' | 'verte' | 'jaune';
export type Arm = 'bas' | 'gauche' | 'haut' | 'droite';
export type ArmSign = 'none' | 'cedez' | 'stop' | 'prioritaire' | 'ponctuelle' | 'droite';

export interface PriorityScene {
  id: string;
  title: string;
  rule: string;
  cars: { color: CarColor; arm: Arm }[];
  signs: Partial<Record<Arm, ArmSign>>;
  /** ordre de passage : groupes successifs (les voitures d'un même groupe peuvent passer ensemble) */
  order: CarColor[][];
  explanation: string;
}
