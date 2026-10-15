import { pick } from '@/src/utils/random';

export interface MsgContext {
  streak: number;
  /** jours restants avant l'examen réel (null si pas de date) */
  daysLeft: number | null;
  validated: number;
  nextLabel: string | null;
  activeToday: boolean;
  missedCount: number;
}

export interface Msg {
  title: string;
  body: string;
}

export function streakReminder(c: MsgContext, seed: number): Msg {
  if (c.streak >= 3) {
    return {
      title: `🔥 ${c.streak} jours d’affilée !`,
      body: pick([
        'Ne casse pas ta série : une petite session suffit.',
        'Ta flamme t’attend. 5 minutes et c’est validé !',
        'Encore un jour et ta série grandit. Tu y vas ?',
      ], rng(seed)),
    };
  }
  return {
    title: '🔥 Ta série t’attend',
    body: pick([
      'Fais une petite activité aujourd’hui pour lancer ta série.',
      'Un quiz de 5 minutes et tu gardes le rythme.',
      'Le Code, c’est de la régularité. Prêt(e) ?',
    ], rng(seed)),
  };
}

export function challengeReminder(seed: number): Msg {
  return {
    title: '📅 Défi du jour disponible',
    body: pick([
      '10 questions, les mêmes pour tout le monde aujourd’hui. Tu relèves ?',
      'Ton défi quotidien est prêt : gagne de l’XP bonus !',
      'Petit défi, grosse progression. C’est parti ?',
    ], rng(seed)),
  };
}

export function encouragement(c: MsgContext, seed: number): Msg {
  const r = rng(seed);
  if (c.daysLeft != null && c.daysLeft <= 3 && c.daysLeft >= 0) {
    return {
      title: `⏳ Plus que ${c.daysLeft} jour${c.daysLeft > 1 ? 's' : ''} !`,
      body: pick(['Révise tes erreurs et fais un examen blanc.', 'Dernière ligne droite : un examen blanc aujourd’hui ?'], r),
    };
  }
  if (c.missedCount >= 5) {
    return {
      title: '🎯 Transforme tes erreurs en points',
      body: `Tu as ${c.missedCount} questions à retravailler. Le mode « Mes erreurs » t’attend.`,
    };
  }
  if (c.nextLabel) {
    return {
      title: '💪 Continue sur ta lancée',
      body: `${c.validated} chapitre${c.validated > 1 ? 's' : ''} validé${c.validated > 1 ? 's' : ''}. Prochaine étape : ${c.nextLabel}.`,
    };
  }
  return {
    title: '🏁 Presque au bout !',
    body: pick(['Refais un examen blanc pour rester affûté(e).', 'Révise les chiffres clés avant le grand jour.'], r),
  };
}

export function examReminder(label: string, kind: 'mini' | 'inter' | 'final'): Msg {
  if (kind === 'final') return { title: '🏆 L’examen final approche', body: `${label} : révise bien tes 10 chapitres avant de te lancer.` };
  if (kind === 'inter') return { title: '🎯 Examen intermédiaire', body: `${label} t’attend : relis les chapitres 1 à 5 avant de commencer.` };
  return { title: '📝 Mini-examen en vue', body: `${label} : un petit tour de révision et tu es prêt(e) !` };
}

export function countdownReminder(daysLeft: number): Msg {
  if (daysLeft <= 0) return { title: '🚦 C’est le grand jour !', body: 'Respire, concentre-toi, tu as bien préparé ton Code. Bonne chance !' };
  if (daysLeft === 1) return { title: '🌙 Examen demain', body: 'Relis les chiffres clés, dors bien : demain tu assures.' };
  return { title: `⏳ J-${daysLeft} avant l’examen`, body: 'Un examen blanc aujourd’hui ? Chaque point compte.' };
}

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
