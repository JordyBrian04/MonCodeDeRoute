import type { PriorityScene } from './types';

/**
 * Scènes du « jeu des priorités » (vue de dessus). Toutes les voitures vont tout droit.
 * Chaque voiture arrive par un bras du carrefour : bas (monte), gauche (va vers la droite),
 * haut (descend), droite (va vers la gauche).
 * « À droite de » : bas→droite, gauche→bas, haut→gauche, droite→haut.
 * `order` = groupes successifs ; les voitures d'un même groupe peuvent passer ensemble.
 */
export const PRIORITY_SCENES: PriorityScene[] = [
  {
    id: 'p1',
    title: 'Intersection sans signalisation',
    rule: 'Priorité à droite : je cède à l’usager venant de ma droite.',
    cars: [
      { color: 'rouge', arm: 'droite' },
      { color: 'bleue', arm: 'gauche' },
      { color: 'verte', arm: 'bas' },
    ],
    signs: {},
    order: [['rouge'], ['verte'], ['bleue']],
    explanation:
      'La rouge n’a personne à sa droite : elle passe. La verte avait la rouge à sa droite, elle passe ensuite. La bleue avait la verte à sa droite : elle passe en dernier.',
  },
  {
    id: 'p2',
    title: 'Deux véhicules, aucun panneau',
    rule: 'Priorité à droite : je cède à l’usager venant de ma droite.',
    cars: [
      { color: 'rouge', arm: 'bas' },
      { color: 'jaune', arm: 'droite' },
    ],
    signs: {},
    order: [['jaune'], ['rouge']],
    explanation: 'La jaune arrive de la droite de la rouge : elle passe d’abord, la rouge cède.',
  },
  {
    id: 'p3',
    title: 'Triangle « priorité à droite »',
    rule: 'Avec ce panneau, je cède au véhicule débouchant des routes situées à ma droite.',
    cars: [
      { color: 'jaune', arm: 'haut' },
      { color: 'bleue', arm: 'droite' },
      { color: 'verte', arm: 'bas' },
    ],
    signs: { bas: 'droite', haut: 'droite', gauche: 'droite', droite: 'droite' },
    order: [['jaune'], ['bleue'], ['verte']],
    explanation:
      'La jaune n’a personne à sa droite (la voie de gauche est vide) : elle passe. La bleue avait la jaune à sa droite : elle passe ensuite. La verte avait la bleue à sa droite : elle passe en dernier.',
  },
  {
    id: 'p4',
    title: 'Route prioritaire (losange)',
    rule: 'Sur une route prioritaire, j’ai la priorité de passage ; l’autre route doit céder.',
    cars: [
      { color: 'bleue', arm: 'gauche' },
      { color: 'rouge', arm: 'droite' },
      { color: 'verte', arm: 'bas' },
      { color: 'jaune', arm: 'haut' },
    ],
    signs: { gauche: 'prioritaire', droite: 'prioritaire', bas: 'cedez', haut: 'cedez' },
    order: [['bleue', 'rouge'], ['verte', 'jaune']],
    explanation:
      'La bleue et la rouge circulent sur la route prioritaire : elles passent d’abord (ensemble, elles ne se gênent pas). La verte et la jaune doivent céder le passage, puis passent.',
  },
  {
    id: 'p5',
    title: 'Le STOP',
    rule: 'STOP = perte de priorité : je m’arrête et je cède à gauche et à droite.',
    cars: [
      { color: 'jaune', arm: 'bas' },
      { color: 'rouge', arm: 'gauche' },
      { color: 'bleue', arm: 'droite' },
    ],
    signs: { bas: 'stop', gauche: 'prioritaire', droite: 'prioritaire' },
    order: [['rouge', 'bleue'], ['jaune']],
    explanation: 'La jaune est au STOP : elle s’arrête, laisse passer la rouge et la bleue (route prioritaire), puis repart quand la route est libre.',
  },
  {
    id: 'p6',
    title: 'Priorité ponctuelle',
    rule: 'La priorité ponctuelle est valable seulement à l’intersection annoncée.',
    cars: [
      { color: 'verte', arm: 'bas' },
      { color: 'jaune', arm: 'haut' },
      { color: 'rouge', arm: 'gauche' },
    ],
    signs: { bas: 'ponctuelle', haut: 'ponctuelle', gauche: 'cedez', droite: 'cedez' },
    order: [['verte', 'jaune'], ['rouge']],
    explanation: 'La verte et la jaune bénéficient de la priorité ponctuelle et passent. La rouge doit céder le passage : elle passe quand la route abordée est libre.',
  },
  {
    id: 'p7',
    title: 'Deux voitures sans panneau',
    rule: 'Priorité à droite : je cède à l’usager venant de ma droite.',
    cars: [
      { color: 'bleue', arm: 'haut' },
      { color: 'verte', arm: 'gauche' },
    ],
    signs: {},
    order: [['verte'], ['bleue']],
    explanation: 'Pour la bleue (qui descend), la droite est le côté gauche de l’écran : la verte arrive de sa droite, elle passe d’abord.',
  },
  {
    id: 'p8',
    title: 'STOP sur une petite route',
    rule: 'STOP = je cède à gauche et à droite.',
    cars: [
      { color: 'rouge', arm: 'droite' },
      { color: 'verte', arm: 'bas' },
      { color: 'bleue', arm: 'haut' },
    ],
    signs: { droite: 'stop', bas: 'prioritaire', haut: 'prioritaire' },
    order: [['verte', 'bleue'], ['rouge']],
    explanation: 'La rouge est au STOP : elle cède aux deux véhicules de la route prioritaire, puis passe en dernier.',
  },
  {
    id: 'p9',
    title: 'Trois voitures sans panneau',
    rule: 'Priorité à droite : je cède à l’usager venant de ma droite.',
    cars: [
      { color: 'jaune', arm: 'bas' },
      { color: 'rouge', arm: 'gauche' },
      { color: 'bleue', arm: 'haut' },
    ],
    signs: {},
    order: [['jaune'], ['rouge'], ['bleue']],
    explanation:
      'La jaune (en bas) n’a personne à sa droite : elle passe. La rouge (à gauche) avait la jaune à sa droite : elle passe ensuite. La bleue (en haut) avait la rouge à sa droite : elle passe en dernier.',
  },
  {
    id: 'p10',
    title: 'Cédez le passage',
    rule: 'Cédez le passage = je laisse passer les usagers de gauche et de droite.',
    cars: [
      { color: 'verte', arm: 'bas' },
      { color: 'rouge', arm: 'gauche' },
    ],
    signs: { bas: 'cedez', gauche: 'ponctuelle', droite: 'ponctuelle' },
    order: [['rouge'], ['verte']],
    explanation: 'La rouge bénéficie d’une priorité ponctuelle. La verte doit céder le passage, puis passe.',
  },
];
