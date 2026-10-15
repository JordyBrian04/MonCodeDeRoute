export interface TitleDef {
  min: number;
  title: string;
  emoji: string;
}

/** Titres selon l'expérience (XP). */
export const TITLES: TitleDef[] = [
  { min: 0, title: 'Piéton curieux', emoji: '🚶' },
  { min: 80, title: 'Élève conducteur', emoji: '🧑‍🎓' },
  { min: 250, title: 'Conducteur prudent', emoji: '🚗' },
  { min: 550, title: 'Pilote averti', emoji: '🏁' },
  { min: 1000, title: 'As du Code', emoji: '⭐' },
  { min: 1600, title: 'Maître du Code', emoji: '👑' },
];

export function titleForXp(xp: number): { current: TitleDef; next: TitleDef | null; progress: number } {
  let idx = 0;
  for (let i = 0; i < TITLES.length; i++) if (xp >= TITLES[i].min) idx = i;
  const current = TITLES[idx];
  const next = TITLES[idx + 1] ?? null;
  const progress = next ? (xp - current.min) / (next.min - current.min) : 1;
  return { current, next, progress };
}
