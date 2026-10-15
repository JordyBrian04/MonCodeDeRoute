import { SITUATIONS } from '@/src/data/situations';

export interface GameDef {
  id: 'memory' | 'speed' | 'priorities' | 'match' | 'situations';
  title: string;
  emoji: string;
  description: string;
  route: string;
  color: string;
  /** retourne un message de verrouillage, ou null si jouable */
  lock: (learned: number[]) => string | null;
}

const need = (learned: number[], ch: number, label: string) => (learned.includes(ch) ? null : `Lis le chapitre ${ch} (${label}) pour débloquer`);

export const GAMES: GameDef[] = [
  {
    id: 'speed',
    title: 'Quiz rapide',
    emoji: '⚡',
    description: '60 secondes, un maximum de bonnes réponses. Chaque erreur coûte du temps !',
    route: '/games/speed',
    color: '#F77F00',
    lock: (l) => (l.length ? null : 'Lis un premier chapitre pour débloquer'),
  },
  {
    id: 'memory',
    title: 'Memory des panneaux',
    emoji: '🧠',
    description: 'Retrouve les paires panneau ↔ signification. Peu de coups = plus de points.',
    route: '/games/memory',
    color: '#8E4FD6',
    lock: (l) => need(l, 2, 'Signalisation'),
  },
  {
    id: 'match',
    title: 'Associer panneau / sens',
    emoji: '🔗',
    description: 'Relie chaque panneau à sa signification, sans te tromper.',
    route: '/games/match',
    color: '#2478E0',
    lock: (l) => need(l, 2, 'Signalisation'),
  },
  {
    id: 'priorities',
    title: 'Jeu des priorités',
    emoji: '🚗',
    description: 'Vue de dessus : touche les voitures dans l’ordre de passage.',
    route: '/games/priorities',
    color: '#D6479A',
    lock: (l) => need(l, 6, 'Dégagements'),
  },
  {
    id: 'situations',
    title: 'Simulations de situations',
    emoji: '🎬',
    description: 'Une mise en situation, trois choix : que fais-tu au volant ?',
    route: '/games/situations',
    color: '#00A6B5',
    lock: (l) => (SITUATIONS.filter((s) => l.includes(s.chapter)).length >= 3 ? null : 'Lis plus de chapitres (2 à 4) pour débloquer'),
  },
];
