import type { Chapter, Question } from '../types';
import { qbuilder } from '../qb';

export const chapter10: Chapter = {
  id: 10,
  title: 'La chaîne cinématique',
  shortTitle: 'Chaîne cinématique',
  emoji: '⛓️',
  summary: 'Moteur, embrayage, boîte de vitesse, roues : les 3 étapes (embrayer, débrayer, patinage) et les 11 gestes du départ.',
  pages: 'pages 34 et 35',
  sections: [
    {
      id: 'definition',
      title: 'Définition',
      emoji: '📘',
      blocks: [
        {
          type: 'p',
          text: 'La chaîne cinématique est l’ensemble des organes du véhicule qui lui permet d’être en mouvement. Elle est constituée du moteur, de l’embrayage, de la boîte de vitesse et des roues (la chaîne cinématique, c’est la transmission du mouvement vers les roues).',
        },
        {
          type: 'key',
          title: 'À retenir',
          text: 'Moteur → embrayage → boîte de vitesse → roues. Le mouvement du moteur est transmis jusqu’aux roues.',
        },
        {
          type: 'example',
          title: 'Image mentale',
          text: 'Pense à un vélo : le pédalage (moteur) passe par la chaîne (transmission) jusqu’à la roue. L’embrayage est comme un « interrupteur » entre le moteur et le reste.',
        },
      ],
    },
    {
      id: 'etapes',
      title: 'Les 3 étapes',
      emoji: '🔩',
      blocks: [
        { type: 'p', text: 'Elle se déroule en trois (3) étapes. Le schéma du cours montre le moteur (M), le plateau moteur (P1), le plateau vitesse (P2), la boîte de vitesse et les roues.' },
        {
          type: 'table',
          rows: [
            ['Étape I', 'Position « embrayer » (V = 0 km/h)'],
            ['Étape II', 'Position « débrayer » (V = 1 km/h)'],
            ['Étape III', 'Position de patinage : position embrayée avec vitesse enclenchée (V = 1 km/h). C’est le « point de patinage ».'],
          ],
        },
        {
          type: 'key',
          text: 'Le point de patinage est le moment où les deux plateaux (P1 plateau moteur et P2 plateau vitesse) frottent l’un contre l’autre, ce qui permet de démarrer en douceur.',
        },
      ],
    },
    {
      id: 'depart',
      title: 'Les 11 gestes du départ',
      emoji: '🚦',
      blocks: [
        {
          type: 'list',
          title: 'Départ du véhicule (dans l’ordre)',
          ordered: true,
          items: [
            'Départ du véhicule',
            'Mettre le levier de vitesse en première vitesse',
            'Signaler son départ en clignotant',
            'Accélérer nécessairement',
            'Embrayer jusqu’à faire patiner',
            'Baisser le frein à main',
            'Vérifier si la voie est libre à l’avant, à l’arrière, à gauche ou à droite',
            'Finir d’embrayer lentement',
            'Desserrer complètement le frein à main',
            'Accélérer progressivement pour bien lancer le véhicule, afin de pouvoir passer la deuxième vitesse rapidement',
            'Éteindre le clignotant',
          ],
        },
        {
          type: 'example',
          title: 'Mise en situation',
          text: 'Tu es garé le long du trottoir. Première enclenchée, clignotant, tu appuies sur l’accélérateur, tu lèves doucement l’embrayage jusqu’au patinage, tu baisses le frein à main, tu vérifies autour de toi… puis tu finis d’embrayer lentement et tu accélères progressivement. Dès que tu es lancé, tu éteins le clignotant.',
        },
        { type: 'warn', text: 'Le cours demande de vérifier que la voie est libre (avant, arrière, gauche, droite) avant de finir d’embrayer.' },
      ],
    },
  ],
};

const { q, tf } = qbuilder(10);

export const questions10: Question[] = [
  q('La chaîne cinématique est…', ['L’ensemble des organes qui permet au véhicule d’être en mouvement', 'Un type de route', 'Un système de feux', 'Une chaîne de montage'], 0, 'Ensemble des organes du véhicule qui lui permet d’être en mouvement.'),
  q('La chaîne cinématique est constituée…', ['Du moteur, de l’embrayage, de la boîte de vitesse et des roues', 'Du volant et des pédales', 'Des feux et des rétroviseurs', 'Du réservoir et de la batterie'], 0, 'Moteur, embrayage, boîte de vitesse et roues.'),
  q('La chaîne cinématique, c’est la transmission du mouvement vers…', ['Les roues', 'Les feux', 'Le volant', 'Le réservoir'], 0, 'C’est la transmission du mouvement vers les roues.'),
  q('Combien d’étapes comporte la chaîne cinématique dans le cours ?', ['2', '3', '4', '5'], 1, 'Trois étapes : embrayer, débrayer, patinage.', { tags: ['chiffres'] }),
  q('L’étape I est la position…', ['Embrayer (V = 0 km/h)', 'Débrayer (V = 1 km/h)', 'Patinage', 'Freinage'], 0, 'Étape I : position embrayer (V = 0 km/h).'),
  q('L’étape II est la position…', ['Embrayer', 'Débrayer (V = 1 km/h)', 'Patinage', 'Stationnement'], 1, 'Étape II : position débrayer (V = 1 km/h).'),
  q('L’étape III est la position…', ['De patinage (embrayée avec vitesse enclenchée)', 'De freinage', 'D’arrêt', 'De marche arrière'], 0, 'Étape III : position de patinage (embrayée avec vitesse enclenchée).'),
  q('Dans le schéma du cours, que représente P1 ?', ['Le plateau moteur', 'Le plateau vitesse', 'Le pneu', 'Le pédalier'], 0, 'P1 = plateau moteur.'),
  q('Dans le schéma du cours, que représente P2 ?', ['Le plateau vitesse', 'Le plateau moteur', 'La pédale', 'Le pneu'], 0, 'P2 = plateau vitesse.'),
  q('Le « point de patinage » correspond à…', ['Le frottement des plateaux lors du démarrage', 'L’arrêt complet', 'La marche arrière', 'Le freinage d’urgence'], 0, 'C’est la position de patinage, où le véhicule démarre progressivement.'),
  q('Quel est le premier geste après « départ du véhicule » ?', ['Mettre le levier de vitesse en première vitesse', 'Signaler son départ', 'Baisser le frein à main', 'Éteindre le clignotant'], 0, 'Geste 2 : mettre le levier de vitesse en première.'),
  q('Quel geste suit « mettre le levier en première » ?', ['Signaler son départ en clignotant', 'Embrayer jusqu’au patinage', 'Accélérer', 'Éteindre le clignotant'], 0, 'Geste 3 : signaler son départ en clignotant.'),
  q('Quand baisse-t-on le frein à main ?', ['Après avoir embrayé jusqu’à faire patiner', 'Avant de mettre la première', 'À la fin du trajet', 'Jamais'], 0, 'Geste 6 : baisser le frein à main après avoir embrayé jusqu’à faire patiner.'),
  q('Avant de finir d’embrayer, on doit…', ['Vérifier si la voie est libre à l’avant, à l’arrière, à gauche ou à droite', 'Klaxonner', 'Couper le moteur', 'Éteindre les phares'], 0, 'Geste 7 : vérifier si la voie est libre.'),
  q('Comment finit-on d’embrayer ?', ['Lentement', 'Brusquement', 'En lâchant la pédale', 'En freinant'], 0, 'Geste 8 : finir d’embrayer lentement.'),
  q('Quand desserre-t-on complètement le frein à main ?', ['Après avoir fini d’embrayer lentement', 'Avant tout', 'Après avoir éteint le clignotant', 'Jamais'], 0, 'Geste 9 : desserrer complètement le frein à main.'),
  q('Après le départ, l’accélération doit être…', ['Progressive pour bien lancer le véhicule et pouvoir passer la 2ᵉ vitesse rapidement', 'Brutale', 'Nulle', 'Maximale'], 0, 'Geste 10 : accélérer progressivement.'),
  q('Quel est le dernier geste du départ ?', ['Éteindre le clignotant', 'Mettre la première', 'Serrer le frein à main', 'Klaxonner'], 0, 'Geste 11 : éteindre le clignotant.'),
  q('Combien de gestes comporte la séquence de départ dans le cours (en comptant « départ du véhicule ») ?', ['7', '9', '11', '13'], 2, 'Onze gestes, de « départ du véhicule » à « éteindre le clignotant ».', { tags: ['chiffres'] }),
  q('Avant d’accélérer pour démarrer, on doit signaler…', ['Son départ en clignotant', 'Son arrêt', 'Sa vitesse', 'Son carburant'], 0, 'On signale son départ en clignotant avant d’accélérer.'),
  tf('On éteint le clignotant tout au début du départ, avant même de mettre la première vitesse.', false, 'Faux : on le met avant de partir et on l’éteint à la fin, une fois lancé.'),
  q('Quel organe fait partie de la chaîne cinématique ?', ['L’embrayage', 'Le lave-glace', 'Les rétroviseurs', 'Les feux stop'], 0, 'Embrayage, moteur, boîte de vitesse, roues.'),
  q('Lequel de ces éléments ne fait PAS partie de la chaîne cinématique ?', ['La boîte de vitesse', 'Le moteur', 'Les roues', 'Le lave-glace'], 3, 'La chaîne cinématique : moteur, embrayage, boîte de vitesse, roues.'),
  q('Dans l’étape I, la vitesse du véhicule est…', ['0 km/h', '1 km/h', '30 km/h', '60 km/h'], 0, 'Étape I : V = 0 km/h.', { tags: ['chiffres'] }),
  q('Dans l’étape III (patinage), la vitesse indiquée est…', ['0 km/h', '1 km/h', '10 km/h', '30 km/h'], 1, 'Étape III : V = 1 km/h.', { tags: ['chiffres'] }),
  q('Pour passer la 2ᵉ vitesse rapidement, il faut…', ['Bien lancer le véhicule en accélérant progressivement', 'Freiner', 'S’arrêter', 'Éteindre le moteur'], 0, 'On accélère progressivement pour bien lancer le véhicule.'),
];
