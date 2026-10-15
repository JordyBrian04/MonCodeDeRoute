import type { Chapter, Question } from '../types';
import { qbuilder } from '../qb';

export const chapter3: Chapter = {
  id: 3,
  title: 'La route et l’autoroute',
  shortTitle: 'Route & autoroute',
  emoji: '🛣️',
  summary: 'Parties, types et catégories de routes, virages (RAS), intersections (RASVO), autoroute et manœuvres interdites.',
  pages: 'pages 11 à 15',
  sections: [
    {
      id: 'route',
      title: 'La route, ses parties, ses types',
      emoji: '🛤️',
      blocks: [
        { type: 'p', text: 'La route est un passage aménagé et ouvert à la circulation publique. En ville, elle prend le nom de rue, avenue ou boulevard.' },
        {
          type: 'p',
          text: 'L’aménagement ne consiste pas seulement à la construction de la route, mais aussi et surtout à la mise en place de la signalisation. Une piste, par contre, est une route sommairement aménagée sur laquelle la circulation peut être interrompue à certaines périodes de l’année ou soumise à des règles spéciales.',
        },
        {
          type: 'list',
          title: 'Les 6 parties de la route (schéma du cours)',
          ordered: true,
          items: ['Le trottoir ou l’accotement', 'La voie (3,5 m)', 'Le sens de la circulation', 'L’axe central', 'La chaussée', 'La route'],
        },
        {
          type: 'table',
          title: 'Types de route',
          rows: [
            ['Route classée', 'Appelée « route à grande circulation » à cause de son trafic important. Elle est prioritaire, reconnue par les panneaux placés aux intersections qui la jalonnent.'],
            ['Route non classée', 'Ou route secondaire : trafic moins important.'],
          ],
        },
      ],
    },
    {
      id: 'categories',
      title: 'Les catégories de routes',
      emoji: '🗺️',
      blocks: [
        {
          type: 'table',
          rows: [
            ['Nationales', 'Desservent plusieurs régions'],
            ['Départementales', 'Desservent les villes et villages d’un département'],
            ['Communales', 'Desservent les quartiers d’une commune'],
            ['Rurales', 'Relient les chefs-lieux des villages'],
            ['Forestières', 'Desservent un domaine classé, à l’intérieur de ce domaine'],
            ['Catégorie A', 'Relient les préfectures entre elles et assurent la liaison inter-états'],
            ['Catégorie B', 'Relient les sous-préfectures'],
            ['Catégorie C', 'Desservent les villages à partir des catégories A et B'],
            ['Catégorie D', 'Pistes reliant des villages aux campements ou entre eux'],
          ],
        },
        {
          type: 'example',
          title: 'Astuce',
          text: 'A → on part des Autorités (préfectures). B → Bourgs (sous-préfectures). C → Campagne (villages). D → Détours (pistes jusqu’aux campements).',
        },
      ],
    },
    {
      id: 'virages',
      title: 'Les virages : système RAS',
      emoji: '↪️',
      blocks: [
        { type: 'p', text: 'Le virage est une courbe plus ou moins accentuée de la route : à ce niveau il faut limiter la vitesse. Il existe deux sortes de virages : virage dangereux à droite et virage dangereux à gauche.' },
        {
          type: 'mnemo',
          code: 'RAS',
          title: 'Pour aborder un virage',
          items: [
            { letter: 'R', text: 'Ralentir' },
            { letter: 'A', text: 'Avertir en klaxonnant le jour et la nuit par des avertissements lumineux' },
            { letter: 'S', text: 'Serrer à droite' },
          ],
        },
        {
          type: 'list',
          title: 'Dans un virage, il ne faut pas…',
          items: ['Stationner', 'Effectuer un dépassement', 'S’arrêter', 'Faire demi-tour à vive allure'],
        },
        { type: 'key', text: 'NB : à un virage dangereux, ralentir jusqu’à 40 km/h.' },
        {
          type: 'example',
          title: 'Mise en situation',
          text: 'Sur la route de Bassam, tu vois le panneau « virage dangereux à gauche ». Tu lèves le pied, tu klaxonnes, tu serres à droite : RAS. Surtout, tu ne dépasses pas le camion devant toi dans ce virage.',
        },
      ],
    },
    {
      id: 'intersections',
      title: 'Les intersections : système RASVO',
      emoji: '✖️',
      blocks: [
        { type: 'p', text: 'Une intersection est le lieu de jonction ou de croisement de deux ou plusieurs chaussées, quels que soient les angles des axes de ces chaussées.' },
        {
          type: 'list',
          title: 'Les 4 types d’intersections',
          items: ['Intersection en croix ou en X', 'Intersection en T', 'Intersection en Y', 'Intersection à branches multiples (carrefour à sens giratoire)'],
        },
        { type: 'p', text: 'Il existe deux sortes d’intersections : sans signalisation et avec signalisation.' },
        {
          type: 'mnemo',
          code: 'R.A.S.V.O',
          title: 'Précautions pour aborder une intersection',
          items: [
            { letter: 'R', text: 'Ralentir' },
            { letter: 'A', text: 'Avertir en klaxonnant le jour et la nuit par des avertissements lumineux' },
            { letter: 'S', text: 'Serrer à droite' },
            { letter: 'V', text: 'Vérifier si la chaussée abordée est libre' },
            { letter: 'O', text: 'Observer le régime de priorité (priorité à droite, priorité de passage, règle de céder le passage)' },
          ],
        },
      ],
    },
    {
      id: 'autoroute',
      title: 'L’autoroute',
      emoji: '🏎️',
      blocks: [
        {
          type: 'p',
          text: 'C’est une route spécialement conçue et construite pour la circulation rapide des automobilistes. Elle ne dessert pas les propriétés riveraines, comporte deux chaussées distinctement séparées l’une de l’autre par un terre-plein central, ne croise ni routes, ni voie ferrée, ni passage pour piétons, et est spécialement signalée comme étant une autoroute.',
        },
        {
          type: 'list',
          title: 'Les parties de l’autoroute',
          items: ['Deux chaussées distinctement séparées', 'Le terre-plein central', 'Les voies', 'Les bretelles de sortie et d’accès', 'La bande d’arrêt d’urgence', 'L’accotement'],
        },
        {
          type: 'list',
          title: '⛔ Manœuvres interdites sur l’autoroute',
          items: [
            'L’arrêt et le stationnement',
            'La circulation sur les surfaces hachurées',
            'La circulation sur la bande d’arrêt d’urgence',
            'La marche arrière',
            'Pénétrer ou séjourner sur la bande centrale',
            'L’essai de véhicules',
            'Les compétitions sportives',
            'Les leçons de conduite',
          ],
        },
        {
          type: 'table',
          title: 'Sortie, croisement, bifurcation',
          rows: [
            ['Sortie', 'Division de l’autoroute en deux branches : l’une est le prolongement de l’autoroute, l’autre le raccordement aux réseaux routiers. Elle est annoncée par 3 panneaux successifs dont la signalisation est à fond bleu.'],
            ['Croisement d’autoroute', 'Rencontre de deux autoroutes allant dans des directions différentes ; on passe de l’une à l’autre par des jonctions, bifurcations ou bretelles de raccordement constituant un échangeur.'],
            ['Bifurcation', 'Séparation d’une route en deux branches constituant chacune une autoroute.'],
          ],
        },
        { type: 'warn', text: 'Stationner sur l’autoroute est aussi un cas de retrait du permis (chapitre 1).' },
      ],
    },
  ],
};

const { q, tf } = qbuilder(3);

export const questions3: Question[] = [
  q('Une route est…', ['Un passage aménagé et ouvert à la circulation publique', 'Un chemin privé', 'Un parking', 'Une voie ferrée'], 0, 'La route est un passage aménagé et ouvert à la circulation publique.'),
  q('En ville, la route prend le nom de…', ['Piste, sentier ou chemin', 'Rue, avenue ou boulevard', 'Autoroute ou bretelle', 'Accotement'], 1, 'En ville : rue, avenue ou boulevard.'),
  q('Une piste est…', ['Une autoroute', 'Une route sommairement aménagée où la circulation peut être interrompue à certaines périodes', 'Un trottoir', 'Une bretelle'], 1, 'Une piste est une route sommairement aménagée, circulation parfois interrompue ou soumise à des règles spéciales.'),
  q('Quelle est la largeur d’une voie dans le schéma du cours ?', ['2 m', '3,5 m', '5 m', '7 m'], 1, 'La voie fait 3,5 m.', { tags: ['chiffres'] }),
  q('Combien de parties de la route le cours distingue-t-il ?', ['4', '5', '6', '8'], 2, 'Six : trottoir/accotement, voie, sens de circulation, axe central, chaussée, route.'),
  q('La route classée est aussi appelée…', ['Route secondaire', 'Route à grande circulation', 'Piste', 'Route rurale'], 1, 'Route classée = route à grande circulation, à cause de son trafic important.'),
  q('Une route classée bénéficie…', ['D’un caractère prioritaire', 'D’une limitation à 20 km/h', 'D’aucune priorité', 'D’un péage'], 0, 'Elle bénéficie d’un caractère prioritaire et se reconnaît par les panneaux aux intersections.'),
  q('Une route non classée est aussi appelée…', ['Route à grande circulation', 'Route secondaire', 'Autoroute', 'Route nationale'], 1, 'Route non classée = route secondaire (trafic moins important).'),
  q('Les routes nationales desservent…', ['Un quartier', 'Plusieurs régions', 'Un domaine forestier', 'Des campements'], 1, 'Les routes nationales desservent plusieurs régions.'),
  q('Les routes communales desservent…', ['Les quartiers d’une commune', 'Les préfectures', 'Les campements', 'Plusieurs pays'], 0, 'Les routes communales desservent les quartiers d’une commune.'),
  q('Les routes rurales…', ['Relient les chefs-lieux des villages', 'Relient les préfectures', 'Desservent un domaine classé', 'Sont des autoroutes'], 0, 'Les routes rurales relient les chefs-lieux des villages.'),
  q('Les routes forestières desservent…', ['Un domaine classé, à l’intérieur de ce domaine', 'Les grandes villes', 'Les aéroports', 'Les quartiers'], 0, 'Les routes forestières desservent un domaine classé situé à l’intérieur de ce domaine.'),
  q('Les routes de catégorie A…', ['Relient les préfectures entre elles et assurent la liaison inter-états', 'Relient les sous-préfectures', 'Desservent les villages', 'Sont des pistes'], 0, 'Catégorie A : préfectures entre elles + liaison inter-états.'),
  q('Les routes de catégorie B…', ['Relient les sous-préfectures', 'Relient les préfectures', 'Sont des pistes', 'Desservent les quartiers'], 0, 'Catégorie B : elles relient les sous-préfectures.'),
  q('Les routes de catégorie C…', ['Desservent les villages à partir des catégories A et B', 'Relient les préfectures', 'Sont des autoroutes', 'Relient des pays'], 0, 'Catégorie C : desserte des villages à partir des catégories A et B.'),
  q('Les routes de catégorie D sont…', ['Des pistes reliant des villages aux campements ou entre eux', 'Des autoroutes', 'Des routes nationales', 'Des rues de ville'], 0, 'Catégorie D : pistes reliant des villages aux campements ou entre eux.'),
  q('Que signifie le système RAS dans un virage ?', ['Ralentir – Avertir – Serrer à droite', 'Regarder – Accélérer – Stopper', 'Ralentir – Accélérer – Sortir', 'Rouler – Avertir – Signaler'], 0, 'RAS = Ralentir, Avertir en klaxonnant, Serrer à droite.'),
  q('Dans un virage dangereux, il faut ralentir jusqu’à…', ['20 km/h', '40 km/h', '60 km/h', '80 km/h'], 1, 'Dans un virage dangereux, ralentir jusqu’à 40 km/h.', { tags: ['chiffres'] }),
  q('Que doit-on faire pour avertir dans un virage ?', ['Klaxonner et faire des avertissements lumineux (jour et nuit)', 'Éteindre les feux', 'Freiner brusquement', 'S’arrêter'], 0, 'On avertit en klaxonnant le jour et la nuit par des avertissements lumineux.'),
  q('Lequel de ces comportements est interdit dans un virage ?', ['Ralentir', 'Effectuer un dépassement', 'Serrer à droite', 'Klaxonner'], 1, 'Dans un virage : on ne doit pas stationner, dépasser, s’arrêter ni faire demi-tour à vive allure.'),
  tf('Il est permis de stationner dans un virage si l’on met ses feux de détresse.', false, 'Faux : stationner dans un virage est interdit.'),
  q('Une intersection est…', ['Le lieu de jonction ou de croisement de deux ou plusieurs chaussées', 'Un type de route', 'Un parking', 'Un panneau'], 0, 'C’est la jonction ou le croisement de 2 chaussées ou plus, quels que soient les angles.'),
  q('Combien de types d’intersections le cours distingue-t-il ?', ['2', '3', '4', '6'], 2, 'Quatre : en croix (X), en T, en Y, à branches multiples.'),
  q('Parmi ces types, lequel n’est PAS une forme d’intersection du cours ?', ['En X', 'En T', 'En Y', 'En Z'], 3, 'Les formes sont : en croix ou X, en T, en Y, à branches multiples.'),
  q('Quel système applique-t-on pour aborder une intersection ?', ['RAS', 'RASVO', 'VIF', 'ABS'], 1, 'R.A.S.V.O : Ralentir, Avertir, Serrer à droite, Vérifier, Observer le régime de priorité.'),
  q('Dans RASVO, la lettre V signifie…', ['Vitesse', 'Vérifier si la chaussée abordée est libre', 'Virer', 'Voie'], 1, 'V = Vérifier si la chaussée abordée est libre.'),
  q('Dans RASVO, la lettre O signifie…', ['Observer le régime de priorité', 'Obéir au klaxon', 'Ouvrir la vitre', 'Opter pour la gauche'], 0, 'O = Observer le régime de priorité (à droite, de passage, céder le passage).'),
  q('Combien de sortes d’intersections existe-t-il ?', ['Une', 'Deux (avec ou sans signalisation)', 'Trois', 'Quatre'], 1, 'Deux : sans signalisation et avec signalisation.'),
  q('Une autoroute comporte…', ['Deux chaussées séparées par un terre-plein central', 'Une seule chaussée', 'Des passages à niveau', 'Des passages piétons'], 0, 'Deux chaussées distinctement séparées par un terre-plein central.'),
  q('Une autoroute croise-t-elle des routes, des voies ferrées ou des passages pour piétons ?', ['Oui, souvent', 'Non, jamais', 'Oui, seulement les voies ferrées', 'Oui, les piétons'], 1, 'Elle ne croise ni routes, ni voie ferrée, ni passage pour piéton.'),
  q('Lequel de ces éléments fait partie de l’autoroute ?', ['La bande d’arrêt d’urgence', 'Le passage à niveau', 'Le trottoir de ville', 'Le carrefour à feux'], 0, 'Parties : 2 chaussées, terre-plein central, voies, bretelles de sortie et d’accès, bande d’arrêt d’urgence, accotement.'),
  q('Laquelle de ces manœuvres est interdite sur l’autoroute ?', ['Rouler sur la voie de droite', 'La marche arrière', 'Mettre son clignotant', 'Rouler à 100 km/h'], 1, 'Marche arrière, arrêt et stationnement, bande d’arrêt d’urgence… sont interdits.'),
  tf('Les leçons de conduite sont autorisées sur l’autoroute.', false, 'Faux : les leçons de conduite, essais de véhicules et compétitions sportives sont interdits.'),
  tf('On peut s’arrêter et stationner sur l’autoroute.', false, 'Faux : l’arrêt et le stationnement sont interdits (et le stationnement sur l’autoroute est un cas de retrait).'),
  q('La sortie d’autoroute est annoncée par…', ['Un panneau rouge', '3 panneaux successifs à fond bleu', '1 panneau jaune', 'Un feu clignotant'], 1, 'Elle est annoncée par 3 panneaux successifs dont la signalisation est à fond bleu.'),
  q('Qu’est-ce qu’un échangeur ?', ['Un parking', 'L’ensemble des jonctions, bifurcations ou bretelles reliant deux autoroutes', 'Un péage', 'Une borne'], 1, 'Dans le croisement d’autoroutes, on passe de l’une à l’autre par jonctions, bifurcations ou bretelles : un échangeur.'),
  q('La bifurcation d’autoroute est…', ['La séparation d’une route en deux branches constituant chacune une autoroute', 'Un rond-point', 'Un péage', 'Un parking'], 0, 'Séparation d’une route en 2 branches qui sont chacune une autoroute.'),
];
