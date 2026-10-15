import type { Chapter, Question } from '../types';
import { qbuilder } from '../qb';
import { S } from '../signs';

export const chapter7: Chapter = {
  id: 7,
  title: 'Le carrefour à sens giratoire',
  shortTitle: 'Giratoire',
  emoji: '🔄',
  summary: 'Rond-point : clignotants, qui cède le passage, quelle voie choisir, et l’exception sans signalisation.',
  pages: 'page 24 (+ rappels pages 8 et 14)',
  sections: [
    {
      id: 'principe',
      title: 'Le principe du rond-point',
      emoji: '⭕',
      blocks: [
        { type: 'key', text: 'Un carrefour à sens giratoire est une intersection à multiples branches.' },
        {
          type: 'signs',
          title: 'Panneau d’annonce',
          items: [{ sign: S.giratoire, label: 'Carrefour à sens giratoire (rond-point)' }],
        },
        {
          type: 'p',
          text: 'Des panneaux et des lignes « Cédez le passage » sont placés au débouché de chaque route qui arrive sur le rond-point.',
        },
        {
          type: 'p',
          text: 'Les 3 voies de l’anneau sont simplement des routes à sens unique… qui tournent ! Circuler sur un rond-point n’est pas fondamentalement différent de circuler en ligne droite, sauf que les manœuvres sont courtes.',
        },
        {
          type: 'p',
          text: 'Rappel du chapitre 2 : la priorité à gauche est secondaire ; elle s’applique dans un carrefour à sens giratoire avec marquage au sol (ligne de céder le passage ou ligne stop).',
        },
      ],
    },
    {
      id: 'sortir',
      title: 'Sortir du rond-point',
      emoji: '↗️',
      blocks: [
        {
          type: 'key',
          title: 'Règle',
          text: 'D’une manière générale, pour sortir du rond-point, il faut utiliser les clignotants au niveau de la route précédant la sortie, pour permettre aux autres de s’insérer plus facilement et de mieux comprendre nos intentions.',
        },
        {
          type: 'example',
          title: 'Mise en situation',
          text: 'Tu veux prendre la 3ᵉ sortie : tu mets ton clignotant droit quand tu passes devant la sortie précédente (la 2ᵉ). Ainsi, la voiture qui attend pour entrer comprend que tu quittes l’anneau et peut s’insérer.',
        },
      ],
    },
    {
      id: 'voies',
      title: 'Plusieurs voies : qui cède ?',
      emoji: '🛣️',
      blocks: [
        {
          type: 'key',
          title: 'Règle',
          text: 'Quand l’anneau comporte plusieurs voies, c’est forcément celui qui change de voie qui doit céder le passage.',
        },
        {
          type: 'table',
          title: 'Quelle voie choisir ?',
          rows: [
            ['Aller à droite ou en face', 'Je reste à droite (voie A)'],
            ['Aller à gauche ou faire demi-tour', 'Je peux me rapprocher du centre du rond-point (voies B et C)'],
            ['Je ne connais pas la sortie', 'Je reste à droite'],
          ],
        },
      ],
    },
    {
      id: 'exception',
      title: 'L’exception à connaître',
      emoji: '⚠️',
      blocks: [
        {
          type: 'warn',
          text: 'EXCEPTION — Attention : en l’absence de signalisation, les usagers circulant sur l’anneau doivent céder le passage à ceux qui entrent. Donc : priorité à droite.',
        },
        {
          type: 'p',
          text: 'Tout dépend donc de la signalisation : avec marquage « cédez le passage » à l’entrée, ceux qui entrent cèdent aux véhicules de l’anneau ; sans signalisation, c’est la priorité à droite qui s’applique (annotation manuscrite du cours).',
        },
      ],
    },
  ],
};

const { q, tf } = qbuilder(7);

export const questions7: Question[] = [
  q('Un carrefour à sens giratoire est…', ['Une intersection à multiples branches', 'Une intersection en T', 'Un parking', 'Une autoroute'], 0, 'C’est une intersection à multiples branches.'),
  q('À l’entrée d’un rond-point avec marquage au sol, la règle de priorité secondaire est…', ['La priorité à droite', 'La priorité à gauche', 'La priorité ponctuelle', 'Aucune règle'], 1, 'La priorité à gauche s’applique dans un carrefour à sens giratoire avec marquage au sol (ligne de céder le passage ou ligne stop).', { sign: S.giratoire }),
  q('Que trouve-t-on au débouché de chaque route sur un giratoire ?', ['Des panneaux et des lignes « Cédez le passage »', 'Des feux tricolores', 'Des passages à niveau', 'Des péages'], 0, 'Des panneaux et des lignes « Cédez le passage » sont placés au débouché de chaque route.'),
  q('Quand utiliser le clignotant pour sortir d’un rond-point ?', ['Au niveau de la route précédant la sortie', 'À l’entrée seulement', 'Une fois sorti', 'Jamais'], 0, 'Il faut utiliser les clignotants au niveau de la route précédant la sortie.'),
  q('Pourquoi met-on le clignotant avant la sortie ?', ['Pour permettre aux autres de s’insérer plus facilement et de comprendre nos intentions', 'Pour faire joli', 'Pour accélérer', 'Pour se garer'], 0, 'Cela permet aux autres de s’insérer plus facilement et de mieux comprendre nos intentions.'),
  q('Selon le cours, les voies d’un rond-point sont…', ['Des routes à sens unique qui tournent', 'Des routes à double sens', 'Des autoroutes', 'Des pistes'], 0, 'Les voies sont simplement des routes à sens unique… qui tournent.'),
  q('Circuler sur un rond-point est, selon le cours…', ['Fondamentalement différent de rouler en ligne droite', 'Pas fondamentalement différent de circuler en ligne droite, sauf que les manœuvres sont courtes', 'Interdit aux débutants', 'Réservé aux motos'], 1, 'Pas fondamentalement différent de circuler en ligne droite, sauf que les manœuvres sont courtes.'),
  q('Quand l’anneau comporte plusieurs voies, qui doit céder le passage ?', ['Celui qui change de voie', 'Celui qui reste sur sa voie', 'Le plus rapide', 'Le plus lent'], 0, 'C’est forcément celui qui change de voie qui doit céder le passage.'),
  q('Pour aller à droite ou en face, je…', ['Reste à droite', 'Me rapproche du centre', 'M’arrête', 'Fais demi-tour'], 0, 'Pour aller à droite ou en face, je reste à droite (voie A).'),
  q('Pour aller à gauche ou faire demi-tour, je…', ['Peux me rapprocher du centre du rond-point', 'Reste sur la voie de droite', 'M’arrête', 'Accélère'], 0, 'Pour aller à gauche ou faire demi-tour, on peut se rapprocher du centre (B et C).'),
  q('Si je ne connais pas la sortie, je…', ['Reste à droite', 'Vais au centre', 'M’arrête', 'Klaxonne'], 0, 'Si l’on ne connaît pas la sortie, l’on reste à droite.'),
  q('En l’absence de signalisation à un rond-point, quelle règle s’applique ?', ['Priorité à droite', 'Priorité de passage', 'Priorité ponctuelle', 'Aucune'], 0, 'Exception : en l’absence de signalisation, ceux de l’anneau cèdent à ceux qui entrent : priorité à droite.'),
  tf('En l’absence de signalisation, ceux qui sont dans l’anneau doivent céder le passage à ceux qui entrent.', true, 'C’est l’exception du cours : donc priorité à droite.'),
  q('Un rond-point est compté parmi les types d’intersections comme une…', ['Intersection à branches multiples', 'Intersection en T', 'Intersection en Y', 'Intersection en X'], 0, 'Le type « branches multiples » correspond au carrefour à sens giratoire.'),
  q('Quel panneau annonce un carrefour à sens giratoire ?', ['Triangle avec trois flèches en cercle', 'Octogone rouge', 'Losange jaune', 'Rond bleu barré'], 0, 'Le panneau triangulaire avec trois flèches en cercle introduit le giratoire.', { sign: S.giratoire }),
  q('Le panneau du giratoire introduit…', ['La priorité à gauche', 'La priorité à droite', 'Le STOP', 'La route prioritaire'], 0, 'Il introduit la priorité à gauche (secondaire) avec marquage au sol.', { sign: S.giratoire }),
  q('Vous voulez prendre la troisième sortie. Où mettez-vous votre clignotant ?', ['Au niveau de la sortie précédente', 'Après la troisième sortie', 'Avant d’entrer dans le rond-point', 'Jamais'], 0, 'On signale au niveau de la route précédant la sortie.'),
  q('Vous entrez dans un rond-point qui comporte un marquage « cédez le passage » à l’entrée. Vous…', ['Cédez le passage aux véhicules déjà dans l’anneau', 'Passez en premier', 'Vous arrêtez au centre', 'Klaxonnez'], 0, 'Avec marquage au sol, la priorité à gauche s’applique : les véhicules de l’anneau sont prioritaires.'),
  q('Vous êtes sur la voie de droite de l’anneau et un véhicule veut se rabattre sur votre voie en changeant de voie. Qui cède ?', ['Celui qui change de voie', 'Vous', 'Le plus gros', 'Personne'], 0, 'Celui qui change de voie doit céder le passage.'),
  q('Dans le schéma du cours, la lettre A correspond à…', ['La voie de droite (aller à droite ou en face)', 'La voie du centre', 'La sortie', 'Un panneau'], 0, 'A : voie de droite (aller à droite ou en face).'),
  q('Dans le schéma du cours, B et C correspondent à…', ['Les voies plus proches du centre (aller à gauche ou demi-tour)', 'Des sorties', 'Des parkings', 'Des feux'], 0, 'B et C : voies plus proches du centre pour aller à gauche ou faire demi-tour.'),
  tf('Un rond-point comporte des feux rouges clignotants à chaque entrée.', false, 'Faux : ce sont des panneaux et lignes « Cédez le passage » qui sont placés au débouché de chaque route.'),
  q('Quelle règle donne la priorité aux véhicules circulant sur l’anneau quand il y a des panneaux/lignes « Cédez le passage » ?', ['La règle de céder le passage (aux entrées)', 'La règle de priorité à droite', 'La règle du stationnement', 'La règle RAS'], 0, 'Les véhicules qui entrent cèdent le passage à ceux de l’anneau grâce aux panneaux et lignes « cédez le passage ».'),
  q('Pour comprendre vos intentions, les autres usagers doivent…', ['Voir votre clignotant avant la sortie', 'Entendre votre klaxon', 'Voir vos feux de détresse', 'Voir vos phares éteints'], 0, 'Le clignotant avant la sortie permet de mieux comprendre vos intentions.'),
  q('À l’approche d’un rond-point, avec la méthode RASVO, que signifie le « O » ?', ['Observer le régime de priorité', 'Obéir', 'Ouvrir', 'Optimiser'], 0, 'O = observer le régime de priorité (priorité à droite, de passage, règle de céder le passage).'),
];
