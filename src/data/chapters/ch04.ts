import type { Chapter, Question } from '../types';
import { qbuilder } from '../qb';

export const chapter4: Chapter = {
  id: 4,
  title: 'Arrêt, stationnement, croisement et dépassement',
  shortTitle: 'Arrêt & dépassement',
  emoji: '🅿️',
  summary: 'Différences arrêt / stationnement, façons de se garer, dépassement (la manœuvre la plus meurtrière) et croisement.',
  pages: 'pages 16 à 18',
  sections: [
    {
      id: 'arret',
      title: 'L’arrêt',
      emoji: '🛑',
      blocks: [
        {
          type: 'p',
          text: 'L’arrêt est l’immobilisation momentanée d’un véhicule, en présence ou en absence du conducteur, le moteur étant en marche, pour décharger ou charger un bagage ou prendre ou descendre un passager. Exemple : bus, taxi.',
        },
        { type: 'list', title: '3 types d’arrêt', items: ['Arrêt en douceur', 'Arrêt de précision', 'Arrêt brusque'] },
        { type: 'key', text: 'La durée maximum d’un arrêt est de 45 minutes.' },
      ],
    },
    {
      id: 'stationnement',
      title: 'Le stationnement',
      emoji: '🅿️',
      blocks: [
        { type: 'p', text: 'C’est l’immobilisation prolongée d’un véhicule dans un endroit approprié, le moteur étant éteint. Exemple : dans un parking.' },
        { type: 'key', text: 'La durée maximale d’un stationnement est de 7 jours.' },
        {
          type: 'table',
          title: 'Les 3 façons de stationner',
          rows: [
            ['En épi', 'En biais par rapport au trottoir'],
            ['En bataille', 'Perpendiculairement au trottoir'],
            ['En parallèle ou en créneau', 'Entre 2 véhicules ou parallèlement au trottoir'],
          ],
        },
        { type: 'list', title: 'Les modes de stationnement', items: ['Stationnement unilatéral', 'Stationnement bilatéral', 'Stationnement réglementé'] },
        {
          type: 'mnemo',
          code: 'Bon arrêt',
          title: 'Précautions pour bien s’arrêter / stationner (dans l’ordre)',
          items: [
            { letter: '1', text: 'S’assurer que l’on n’est pas dans une zone interdite' },
            { letter: '2', text: 'Ralentir' },
            { letter: '3', text: 'Mettre le clignotant' },
            { letter: '4', text: 'Vérifier dans le rétroviseur (extérieur droit) que l’on ne gêne aucun usager' },
            { letter: '5', text: 'Serrer le plus possible à droite tout en restant sur la chaussée' },
            { letter: '6', text: 'S’immobiliser' },
          ],
        },
        { type: 'list', title: 'Stationnement interdit : 3 cas', items: ['Le stationnement gênant', 'Le stationnement dangereux', 'Le stationnement abusif'] },
        { type: 'warn', text: 'Un mauvais stationnement peut s’avérer très dangereux pour les autres usagers.' },
        {
          type: 'example',
          title: 'Arrêt ou stationnement ?',
          text: 'Un taxi qui dépose un client moteur allumé : c’est un arrêt (momentané, moteur en marche). Une voiture garée toute la journée devant ton bureau, moteur éteint : c’est un stationnement.',
        },
      ],
    },
    {
      id: 'depassement',
      title: 'Le dépassement',
      emoji: '🏁',
      blocks: [
        { type: 'p', text: 'C’est le passage de 2 véhicules, l’un devant l’autre, allant dans le même sens. C’est la manœuvre la plus meurtrière en cas d’accident.' },
        {
          type: 'table',
          title: 'Les types de dépassement',
          rows: [
            ['Proprement dit', 'Il se fait du côté gauche'],
            ['Toléré', 'Il se fait dans un cadre d’interdiction, sans danger'],
            ['Exceptionnel', 'Il se fait du côté droit'],
          ],
        },
        {
          type: 'list',
          title: 'Ne pas être…',
          items: ['Dans un cas d’interdiction', 'Sur le point d’être dépassé', 'En gênant la circulation venant en sens inverse'],
        },
        {
          type: 'list',
          title: 'Il faut…',
          items: [
            'Avoir une réserve d’accélération suffisante',
            'Regarder dans les rétroviseurs',
            'Actionner son clignotant',
            'Se déporter à gauche en laissant la distance latérale de dépassement : 1 mètre pour les cyclistes, les piétons ou les véhicules à traction animale, et 0,5 mètre pour les automobilistes',
            'Après avoir dépassé : avertir avec son clignotant droit et se rabattre progressivement',
          ],
        },
        { type: 'warn', text: 'Accélérer pour ne pas se laisser dépasser, dépasser dans un virage ou en sens inverse : cas de retrait du permis.' },
      ],
    },
    {
      id: 'croisement',
      title: 'Le croisement',
      emoji: '↔️',
      blocks: [
        { type: 'p', text: 'C’est le passage de deux véhicules, l’un à côté de l’autre, allant dans des sens contraires. Le croisement se fait à droite.' },
        {
          type: 'list',
          title: 'Pour croiser',
          ordered: true,
          items: ['Serrer à droite pour laisser le plus d’espace possible entre les véhicules', 'Ralentir', 'S’arrêter s’il y a un obstacle', 'S’il fait nuit, passer des feux de route aux feux de croisement'],
        },
        {
          type: 'key',
          title: 'Dépassement ≠ croisement',
          text: 'Dépassement : même sens (normalement par la gauche). Croisement : sens contraires, à droite.',
        },
      ],
    },
  ],
};

const { q, tf } = qbuilder(4);

export const questions4: Question[] = [
  q('L’arrêt est…', ['Une immobilisation momentanée, moteur en marche', 'Une immobilisation prolongée, moteur éteint', 'Un dépassement', 'Un croisement'], 0, 'Arrêt = immobilisation momentanée, moteur en marche, en présence ou en absence du conducteur.'),
  q('Lequel de ces exemples correspond à un arrêt ?', ['Un taxi qui dépose un client moteur en marche', 'Une voiture garée dans un parking toute la nuit', 'Un camion garé 5 jours', 'Une moto en panne depuis une semaine'], 0, 'Bus, taxi : arrêt pour prendre ou descendre un passager.'),
  q('Combien de types d’arrêt le cours distingue-t-il ?', ['2', '3', '4', '5'], 1, 'Trois : arrêt en douceur, arrêt de précision, arrêt brusque.'),
  q('Quelle est la durée maximum d’un arrêt ?', ['15 minutes', '30 minutes', '45 minutes', '60 minutes'], 2, 'La durée maximum d’un arrêt est de 45 minutes.', { tags: ['chiffres'] }),
  q('Le stationnement est…', ['Une immobilisation prolongée, moteur éteint', 'Une immobilisation momentanée, moteur en marche', 'Un type de dépassement', 'Un feu'], 0, 'Stationnement = immobilisation prolongée dans un endroit approprié, moteur éteint.'),
  q('Quelle est la durée maximale d’un stationnement ?', ['24 heures', '3 jours', '7 jours', '30 jours'], 2, 'Sept (07) jours.', { tags: ['chiffres'] }),
  q('Le stationnement en épi consiste à stationner…', ['Perpendiculairement au trottoir', 'En biais par rapport au trottoir', 'Parallèlement au trottoir', 'Sur la chaussée'], 1, 'En épi = en biais par rapport au trottoir.'),
  q('Le stationnement en bataille consiste à stationner…', ['Perpendiculairement au trottoir', 'En biais', 'Entre deux véhicules', 'Sur l’autoroute'], 0, 'En bataille = perpendiculairement au trottoir.'),
  q('Le stationnement en créneau (ou en parallèle) consiste à stationner…', ['En biais', 'Perpendiculairement', 'Entre 2 véhicules ou parallèlement au trottoir', 'Au milieu de la route'], 2, 'En parallèle ou en créneau : entre 2 véhicules ou parallèlement au trottoir.'),
  q('Parmi ces modes, lequel est un mode de stationnement du cours ?', ['Unilatéral', 'Triangulaire', 'Circulaire', 'Diagonal'], 0, 'Modes : unilatéral, bilatéral, réglementé.'),
  q('Quelle est la première précaution pour bien s’arrêter ou stationner ?', ['Mettre le clignotant', 'S’assurer que l’on n’est pas dans une zone interdite', 'Serrer à droite', 'S’immobiliser'], 1, 'Étape 1 : s’assurer que l’on n’est pas dans une zone interdite.'),
  q('Dans quel rétroviseur vérifie-t-on que l’on ne gêne aucun usager avant de s’arrêter ?', ['Le rétroviseur intérieur seulement', 'Le rétroviseur extérieur droit', 'Le rétroviseur extérieur gauche', 'Aucun'], 1, 'On vérifie dans le rétroviseur extérieur droit.'),
  q('Quel est l’ordre correct de ces précautions ?', ['Ralentir – clignotant – vérifier – serrer à droite – s’immobiliser', 'Serrer à droite – ralentir – clignotant', 'S’immobiliser – ralentir – vérifier', 'Clignotant – s’immobiliser – ralentir'], 0, 'Zone interdite ? → Ralentir → Clignotant → Vérifier rétroviseur → Serrer à droite → S’immobiliser.'),
  q('Où doit-on se placer pour s’arrêter ?', ['Le plus possible à droite en restant sur la chaussée', 'Au milieu de la route', 'À gauche', 'Sur la bande centrale'], 0, 'Serrer le plus possible à droite tout en restant sur la chaussée.'),
  q('Combien de cas de stationnement interdit le cours cite-t-il ?', ['2', '3', '4', '5'], 1, 'Trois : gênant, dangereux, abusif.'),
  q('Lequel de ces stationnements est interdit ?', ['Le stationnement dangereux', 'Le stationnement en créneau régulier', 'Le stationnement en parking', 'Le stationnement bilatéral autorisé'], 0, 'Interdits : stationnement gênant, dangereux, abusif.'),
  q('Le dépassement est…', ['Le passage de 2 véhicules l’un devant l’autre allant dans le même sens', 'Le passage de 2 véhicules en sens contraires', 'Un arrêt', 'Un virage'], 0, 'Dépassement : 2 véhicules, l’un devant l’autre, même sens.'),
  q('Le dépassement est…', ['La manœuvre la plus meurtrière en cas d’accident', 'La manœuvre la plus lente', 'Une manœuvre sans risque', 'Une manœuvre réservée aux motos'], 0, 'C’est la manœuvre la plus meurtrière en cas d’accident.'),
  q('Le dépassement proprement dit se fait…', ['Du côté gauche', 'Du côté droit', 'Par l’accotement', 'Des deux côtés'], 0, 'Dépassement proprement dit : côté gauche.'),
  q('Le dépassement exceptionnel se fait…', ['Du côté gauche', 'Du côté droit', 'En marche arrière', 'Sur l’autoroute'], 1, 'Dépassement exceptionnel : côté droit.'),
  q('Le dépassement toléré se fait…', ['Dans un cadre d’interdiction, sans danger', 'À toute vitesse', 'Dans un virage', 'Sans clignotant'], 0, 'Dépassement toléré : dans un cadre d’interdiction mais sans danger.'),
  q('Avant de dépasser, il ne faut pas être…', ['Sur le point d’être dépassé', 'Sur la voie de droite', 'Au volant d’une voiture', 'Prudent'], 0, 'Ne pas être sur le point d’être dépassé, ni dans un cas d’interdiction, ni gêner la circulation venant en sens inverse.'),
  q('Pour dépasser, il faut avoir…', ['Une réserve d’accélération suffisante', 'Un klaxon puissant', 'Un chargement léger', 'Des feux de route'], 0, 'Réserve d’accélération suffisante, rétroviseurs, clignotant.'),
  q('Quelle distance latérale laisser en dépassant un cycliste ?', ['0,5 mètre', '1 mètre', '2 mètres', '5 mètres'], 1, '1 mètre pour les cyclistes, les piétons ou les véhicules à traction animale.', { tags: ['chiffres'] }),
  q('Quelle distance latérale laisser en dépassant un automobiliste ?', ['0,5 mètre', '1 mètre', '2 mètres', '3 mètres'], 0, '0,5 mètre pour les automobilistes.', { tags: ['chiffres'] }),
  q('Après avoir dépassé, on doit…', ['Avertir avec son clignotant droit et se rabattre progressivement', 'Se rabattre brusquement', 'Freiner', 'Klaxonner'], 0, 'Clignotant droit, puis rabattement progressif.'),
  tf('Se rabattre prématurément à droite après un dépassement est un cas de retrait du permis.', true, 'Retour à droite prématuré après un dépassement : cas de retrait.'),
  q('Le croisement est…', ['Le passage de deux véhicules l’un à côté de l’autre allant dans des sens contraires', 'Le passage de 2 véhicules dans le même sens', 'Un type de stationnement', 'Un arrêt brusque'], 0, 'Croisement : 2 véhicules côte à côte, sens contraires.'),
  q('Le croisement se fait…', ['À gauche', 'À droite', 'Au milieu', 'Par l’accotement'], 1, 'Le croisement se fait à droite (croiser à gauche est un cas de retrait).'),
  q('De nuit, pour croiser un usager venant en sens inverse, il faut…', ['Passer des feux de route aux feux de croisement', 'Éteindre les feux', 'Mettre les feux de détresse', 'Passer aux feux de route'], 0, 'S’il fait nuit, on passe des feux de route aux feux de croisement.'),
  q('Pour croiser, il faut d’abord…', ['Serrer à droite pour laisser le plus d’espace possible', 'Accélérer', 'Se déporter à gauche', 'Klaxonner'], 0, 'Serrer à droite, ensuite ralentir, s’arrêter s’il y a un obstacle.'),
  q('Un taxi stationné 2 h devant un domicile, moteur éteint, c’est…', ['Un arrêt', 'Un stationnement', 'Un dépassement', 'Un croisement'], 1, 'Moteur éteint + immobilisation prolongée = stationnement.'),
];
