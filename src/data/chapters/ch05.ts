import type { Chapter, Question } from '../types';
import { qbuilder } from '../qb';

export const chapter5: Chapter = {
  id: 5,
  title: 'Les règles de la circulation',
  shortTitle: 'Règles de circulation',
  emoji: '⚡',
  summary: 'Côté de circulation, vitesses maximales, temps de réaction, distance d’arrêt, force centrifuge, dérapage.',
  pages: 'pages 19 et 20',
  sections: [
    {
      id: 'vitesse',
      title: 'La vitesse',
      emoji: '🏎️',
      blocks: [
        { type: 'key', text: 'En marche normale, la circulation s’effectue sur le côté droit de la chaussée.' },
        {
          type: 'table',
          title: 'Vitesses maximales autorisées',
          rows: [
            ['Agglomération', '60 km/h'],
            ['Rase campagne', '110 km/h'],
            ['Autoroute', '120 km/h'],
          ],
        },
        { type: 'p', text: 'Par temps de brouillard, si la vitesse est réduite à 30 km/h, il ne faut pas dépasser 50 km/h.' },
        {
          type: 'example',
          title: 'Mise en situation',
          text: 'À Abidjan, dans le quartier, tu restes à 60 km/h maximum. Sur la route entre deux villes (rase campagne) la limite monte à 110 km/h et sur l’autoroute à 120 km/h. Excès de vitesse = cas de retrait du permis.',
        },
      ],
    },
    {
      id: 'distances',
      title: 'Temps de réaction & distance d’arrêt',
      emoji: '⏱️',
      blocks: [
        {
          type: 'table',
          rows: [
            ['Temps de réaction', 'Temps qui s’écoule entre la perception d’un signal ou d’un évènement et l’action qui y répond. L’opération dure environ 1 seconde.'],
            ['Distance de freinage ou d’arrêt', 'Distance parcourue pendant la réaction du conducteur jusqu’à l’arrêt complet du véhicule.'],
          ],
        },
        {
          type: 'list',
          title: 'Le temps de réaction s’allonge si le conducteur est…',
          items: ['Sous l’emprise de l’alcool', 'Sous l’effet de certains médicaments', 'Fatigué ou malade', 'Distrait ou soucieux'],
        },
        {
          type: 'list',
          title: 'La distance d’arrêt dépend…',
          items: [
            'Du dispositif de freinage (réglage, état des plaquettes et des disques)',
            'De l’adhérence (revêtement du sol, état et pression des pneus)',
            'De la pente de la chaussée',
            'De l’état de l’amortissement',
            'De la technique du conducteur',
          ],
        },
        {
          type: 'example',
          title: 'Mise en situation',
          text: 'Tu as veillé tard et tu es fatigué : ton temps de réaction augmente. Un enfant traverse : il te faut plus de temps pour freiner, donc plus de distance pour t’arrêter. Moralité : ne conduis pas fatigué ni après avoir bu.',
        },
      ],
    },
    {
      id: 'centrifuge',
      title: 'La force centrifuge',
      emoji: '🌀',
      blocks: [
        {
          type: 'p',
          text: 'C’est la force qui porte le véhicule hors de la courbe du virage. Elle est composée du poids, de la vitesse du véhicule et du rayon de courbure (ou galbe).',
        },
        {
          type: 'p',
          text: 'Dans un virage à droite, elle fait pencher la voiture vers la gauche (c’est la roue avant extérieure au virage qui supporte le maximum de la charge). En insistant trop, des véhicules se retrouvent sur le toit. La force centrifuge est la plus grande si la vitesse est élevée.',
        },
        { type: 'key', text: 'Il y a dérapage quand la force centrifuge est supérieure à l’adhérence : les roues n’arrivent plus à s’accrocher et se mettent à glisser latéralement. Formule du cours : FC = 4 × V (V = vitesse du véhicule).' },
        {
          type: 'p',
          text: 'Pour retenir la formule : plus la vitesse augmente, plus la force qui te pousse hors du virage augmente (FC = 4 × V).',
        },
      ],
    },
    {
      id: 'derapage',
      title: 'Que faire en cas de dérapage ou d’éclatement ?',
      emoji: '🛞',
      blocks: [
        {
          type: 'table',
          rows: [
            ['Dérapage après un coup de frein qui bloque les roues', 'Relâcher aussitôt la pédale de frein pour permettre aux roues de tourner et retrouver le contrôle de la direction. Freiner à nouveau si nécessaire, en relâchant pour ne pas bloquer les roues.'],
            ['Dérapage sans virage', 'Corriger par un mouvement de volant rapide mais mesuré, en évitant de freiner. Si le véhicule est à propulsion, relâcher complètement l’accélérateur.'],
            ['Éclatement d’un pneu', 'Ne pas freiner, maintenir fermement le volant et corriger la déviation de la trajectoire, réduire la vitesse progressivement.'],
          ],
        },
        { type: 'warn', text: 'Éclatement de pneu : surtout pas de coup de frein brusque !' },
      ],
    },
  ],
};

const { q, tf } = qbuilder(5);

export const questions5: Question[] = [
  q('En marche normale, la circulation s’effectue…', ['Sur le côté gauche', 'Sur le côté droit de la chaussée', 'Au milieu', 'Sur l’accotement'], 1, 'En marche normale : côté droit de la chaussée (circuler à gauche est un cas de retrait).'),
  q('Vitesse maximale autorisée en agglomération :', ['40 km/h', '50 km/h', '60 km/h', '90 km/h'], 2, 'Agglomération : 60 km/h.', { tags: ['chiffres'] }),
  q('Vitesse maximale autorisée en rase campagne :', ['90 km/h', '100 km/h', '110 km/h', '120 km/h'], 2, 'Rase campagne : 110 km/h.', { tags: ['chiffres'] }),
  q('Vitesse maximale autorisée sur autoroute :', ['90 km/h', '110 km/h', '120 km/h', '130 km/h'], 2, 'Autoroute : 120 km/h.', { tags: ['chiffres'] }),
  q('Par temps de brouillard, quelle vitesse ne faut-il pas dépasser (selon le cours) ?', ['30 km/h', '50 km/h', '60 km/h', '90 km/h'], 1, 'Selon le cours : si la vitesse est réduite à 30 km/h, il ne faut pas dépasser 50 km/h.', { tags: ['chiffres'] }),
  q('Le temps de réaction est…', ['Le temps entre la perception d’un signal et l’action qui y répond', 'La distance de freinage', 'La durée du feu rouge', 'La vitesse maximale'], 0, 'C’est le temps qui s’écoule entre la perception d’un signal ou évènement et l’action qui y répond.'),
  q('Le temps de réaction dure environ…', ['1 seconde', '5 secondes', '10 secondes', '1 minute'], 0, 'L’opération dure environ 1 seconde.', { tags: ['chiffres'] }),
  q('La distance de freinage ou d’arrêt est…', ['La distance parcourue pendant la réaction du conducteur jusqu’à l’arrêt complet', 'La distance entre deux villes', 'La longueur du véhicule', 'La largeur de la route'], 0, 'C’est la distance parcourue pendant la réaction du conducteur jusqu’à l’arrêt complet du véhicule.'),
  q('Lequel de ces facteurs allonge le temps de réaction ?', ['La fatigue', 'Un véhicule propre', 'Une route large', 'Un klaxon'], 0, 'Alcool, médicaments, fatigue, maladie, distraction ou soucis allongent le temps de réaction.'),
  q('L’alcool a pour effet…', ['De raccourcir le temps de réaction', 'D’allonger le temps de réaction', 'De ne rien changer', 'D’améliorer la vision'], 1, 'Sous l’emprise de l’alcool, le temps de réaction s’allonge.'),
  q('Lequel de ces éléments influence la distance d’arrêt ?', ['L’état des plaquettes et des disques de frein', 'La couleur de la voiture', 'Le nombre de portes', 'La marque de la radio'], 0, 'Elle dépend du dispositif de freinage (réglage, plaquettes, disques), de l’adhérence, de la pente, de l’amortissement, de la technique du conducteur.'),
  q('L’adhérence dépend notamment…', ['Du revêtement du sol et de l’état/pression des pneus', 'De la couleur des feux', 'Du poids du klaxon', 'Du nombre de passagers uniquement'], 0, 'Adhérence : revêtement du sol, état et pression des pneus.'),
  q('La force centrifuge est la force qui…', ['Porte le véhicule hors de la courbe du virage', 'Ralentit le véhicule', 'Fait avancer le véhicule', 'Éclaire la route'], 0, 'Elle porte le véhicule hors de la courbe du virage.'),
  q('La force centrifuge est composée…', ['Du poids, de la vitesse et du rayon de courbure (galbe)', 'De la couleur et du poids', 'Du carburant seulement', 'De la pression des pneus seulement'], 0, 'Poids, vitesse du véhicule et rayon de courbure ou galbe.'),
  q('Dans un virage à droite, la force centrifuge fait pencher la voiture vers…', ['La droite', 'La gauche', 'L’avant', 'L’arrière'], 1, 'Dans un virage à droite, elle fait pencher la voiture vers la gauche.'),
  q('Quelle roue supporte le maximum de la charge dans un virage ?', ['La roue arrière intérieure', 'La roue avant extérieure au virage', 'La roue avant intérieure', 'Toutes également'], 1, 'C’est la roue avant extérieure au virage.'),
  q('La force centrifuge est la plus grande quand…', ['La vitesse est élevée', 'La vitesse est faible', 'Le véhicule est à l’arrêt', 'Il pleut seulement'], 0, 'Elle est la plus grande si la vitesse est élevée.'),
  q('Il y a dérapage quand…', ['La force centrifuge est supérieure à l’adhérence', 'La force centrifuge est nulle', 'L’adhérence est supérieure', 'On roule à 20 km/h'], 0, 'Dérapage = force centrifuge supérieure à l’adhérence.'),
  q('Quelle formule le cours donne-t-il pour la force centrifuge ?', ['FC = 4 × V', 'FC = V + 4', 'FC = V ÷ 4', 'FC = 2 × V'], 0, 'Le cours donne FC = 4 × V (V = vitesse du véhicule).'),
  q('Dérapage causé par un coup de frein qui bloque les roues : que faire ?', ['Relâcher aussitôt la pédale de frein', 'Freiner encore plus fort', 'Accélérer', 'Lâcher le volant'], 0, 'Relâcher aussitôt la pédale pour que les roues tournent et retrouver le contrôle de la direction.'),
  q('En cas de dérapage sans virage, on doit…', ['Corriger par un mouvement de volant rapide mais mesuré, en évitant de freiner', 'Freiner à fond', 'Lâcher le volant', 'Accélérer fort'], 0, 'Corriger par un mouvement de volant rapide mais mesuré, sans freiner.'),
  q('Si le véhicule est à propulsion et dérape, on doit…', ['Relâcher complètement l’accélérateur', 'Appuyer à fond sur l’accélérateur', 'Mettre le frein à main', 'Éteindre les phares'], 0, 'Pour un véhicule à propulsion : relâcher complètement l’accélérateur.'),
  q('En cas d’éclatement d’un pneu, il faut…', ['Ne pas freiner, tenir fermement le volant et réduire progressivement la vitesse', 'Freiner brusquement', 'Lâcher le volant', 'Accélérer'], 0, 'Ne pas freiner, maintenir fermement le volant, corriger la trajectoire, réduire progressivement la vitesse.'),
  tf('En cas d’éclatement d’un pneu, il faut freiner brusquement.', false, 'Faux : il ne faut pas freiner, mais maintenir le volant et réduire la vitesse progressivement.'),
  tf('Un conducteur fatigué a un temps de réaction plus court.', false, 'Faux : la fatigue allonge le temps de réaction.'),
  tf('Plus la vitesse augmente, plus la force centrifuge augmente.', true, 'Vrai : la force centrifuge est la plus grande si la vitesse est élevée.'),
  q('Que se passe-t-il quand on insiste trop sur la vitesse dans un virage ?', ['Les véhicules peuvent se retrouver sur le toit', 'Rien', 'La route s’élargit', 'Le temps de réaction diminue'], 0, 'En insistant trop, des véhicules se trouvent sur le toit.'),
  q('Un conducteur sous l’effet de certains médicaments a…', ['Un temps de réaction allongé', 'Un temps de réaction raccourci', 'Une meilleure adhérence', 'Une vision améliorée'], 0, 'Certains médicaments allongent le temps de réaction.'),
];
