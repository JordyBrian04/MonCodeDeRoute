import type { Chapter, Question } from '../types';
import { qbuilder } from '../qb';
import { S } from '../signs';

export const chapter2: Chapter = {
  id: 2,
  title: 'La signalisation routière',
  shortTitle: 'Signalisation',
  emoji: '🚦',
  summary: '4 grands groupes : verticale, horizontale, lumineuse, gestuelle. Les 7 familles de panneaux et les règles de priorité.',
  pages: 'pages 6 à 11',
  sections: [
    {
      id: 'intro',
      title: 'Définition & 4 groupes',
      emoji: '🧭',
      blocks: [
        { type: 'p', text: 'La signalisation routière est l’ensemble des règles et éléments conçus pour la réglementation de la circulation routière.' },
        {
          type: 'list',
          title: 'Elle se divise en 4 grands groupes',
          items: ['La signalisation verticale (panneaux)', 'La signalisation horizontale (marquages au sol)', 'La signalisation lumineuse (feux)', 'La signalisation gestuelle (agents)'],
        },
        {
          type: 'key',
          text: 'Ordre de force : le signal d’un agent (gestuelle) « efface » les autres signalisations — il est prioritaire sur les 3 autres.',
        },
      ],
    },
    {
      id: 'verticale',
      title: 'Signalisation verticale : les 7 familles',
      emoji: '🪧',
      blocks: [
        {
          type: 'p',
          text: 'La signalisation verticale est l’ensemble des panneaux et balises implantés tout le long des routes et aux intersections, pour aider, informer ou avertir en temps opportun les usagers. Elle se divise en 7 parties selon les caractéristiques (formes, couleurs, symboles).',
        },
        {
          type: 'signs',
          title: '1 · Signaux de danger',
          items: [{ sign: S.danger, label: 'Triangle, sommet vers le haut, bordure rouge, fond blanc, symbole noir' }],
        },
        { type: 'p', text: 'Ils imposent une vigilance spéciale avec un ralentissement adapté à la nature du danger signalé par un symbole.' },
        {
          type: 'signs',
          title: '2 · Signaux de prescription absolue (forme ronde)',
          items: [
            { sign: S.interdiction, label: 'Interdiction : bordure rouge, fond blanc, symbole noir' },
            { sign: S.obligation, label: 'Obligation : fond bleu, symbole blanc' },
            { sign: S.stationnement, label: 'Stationnement : bordure rouge, fond bleu barré d’une barre oblique rouge' },
          ],
        },
        { type: 'p', text: 'NB : il existe aussi les panneaux de fin d’interdiction et d’obligation.' },
        {
          type: 'signs',
          title: '3 · Signaux de simples indications',
          items: [{ sign: S.indication, label: 'Forme carrée ou rectangulaire (fond bleu ou blanc ; symbole bleu ou blanc)' }],
        },
        {
          type: 'signs',
          title: '4 · Signaux temporaires',
          items: [{ sign: S.temporaire, label: 'Triangulaires : bordure rouge, fond jaune, symbole noir' }],
        },
        {
          type: 'signs',
          title: '5 · Signaux de directions (3 couleurs de fond)',
          items: [
            { sign: S.dirAutoroute, label: 'Bleu : autoroutes (A)' },
            { sign: S.dirNationale, label: 'Vert : routes nationales (N)' },
            { sign: S.dirAgglo, label: 'Blanc : en agglomération' },
          ],
        },
        { type: 'p', text: '6 · Les panneaux de passages à niveau : de forme variable, ils sont implantés aux intersections d’un chemin de fer et d’une route.' },
        { type: 'p', text: '7 · Les signaux d’intersections et de priorités : de formes variables, implantés aux intersections des routes. C’est d’eux que dépendent les principales règles de priorité de la circulation routière.' },
        {
          type: 'example',
          title: 'Astuce couleurs',
          text: 'Rouge = danger / interdit. Bleu = ordre à suivre ou information. Jaune = chantier, c’est temporaire. Pour les directions : Bleu = Autoroute, Vert = Nationale, Blanc = Ville.',
        },
      ],
    },
    {
      id: 'priorites',
      title: 'Les 3 règles de priorité',
      emoji: '⚖️',
      blocks: [
        { type: 'p', text: 'Il existe 3 principales règles de priorité.' },
        {
          type: 'signs',
          title: '1 · Priorité à droite',
          items: [{ sign: S.prioDroite, label: 'Panneau d’introduction : triangle avec une croix' }],
        },
        {
          type: 'p',
          text: 'Elle consiste à céder le passage à tous les usagers venant de ma droite à une intersection, si ceux-ci n’ont pas de véhicule à leur droite. Elle s’applique aussi à une intersection sans signalisation.',
        },
        {
          type: 'signs',
          title: '2 · Priorité de passage',
          items: [
            { sign: S.routePrioritaire, label: 'Route prioritaire' },
            { sign: S.prioPonctuelle, label: 'Priorité ponctuelle' },
          ],
        },
        { type: 'p', text: 'Elle consiste à passer à une intersection sans tenir compte des usagers de gauche et de droite.' },
        {
          type: 'signs',
          title: '3 · Règle de céder le passage (perte de priorité)',
          items: [
            { sign: S.stop, label: 'STOP' },
            { sign: S.cedez, label: 'Cédez le passage' },
          ],
        },
        { type: 'p', text: 'Elle consiste à laisser passer tous les usagers venant de gauche et de droite à une intersection.' },
        {
          type: 'signs',
          title: 'NB : la priorité à gauche',
          items: [{ sign: S.giratoire, label: 'Panneau du carrefour à sens giratoire' }],
        },
        { type: 'p', text: 'La priorité à gauche est secondaire : elle s’applique dans un carrefour à sens giratoire avec marquage au sol (ligne de céder le passage ou ligne stop).' },
        {
          type: 'example',
          title: 'Mise en situation',
          text: 'Tu arrives à une petite intersection de quartier sans aucun panneau : tu regardes à droite. Si quelqu’un arrive de ta droite, il passe avant toi. Si au contraire un STOP t’est imposé, tu t’arrêtes et tu laisses passer tout le monde, à gauche comme à droite.',
        },
      ],
    },
    {
      id: 'horizontale',
      title: 'Signalisation horizontale',
      emoji: '〰️',
      blocks: [
        { type: 'p', text: 'La signalisation horizontale est l’ensemble des marques et marquages peints sur la chaussée. On distingue :' },
        {
          type: 'list',
          title: 'Les lignes',
          items: [
            'Lignes continues',
            'Lignes discontinues',
            'Lignes mixtes',
            'Lignes de rive, de dissuasion, d’avertissement, de céder le passage, de stop, d’effet des feux, transversales…',
          ],
        },
        { type: 'p', text: 'Les flèches : directionnelles, bidirectionnelles et de rabattement.' },
        { type: 'p', text: 'Les bandes : passages cloutés et zébras.' },
        { type: 'warn', text: 'Franchir une ligne continue est un cas de retrait du permis (chapitre 1).' },
      ],
    },
    {
      id: 'lumineuse',
      title: 'Signalisation lumineuse',
      emoji: '🚥',
      blocks: [
        { type: 'p', text: 'Ce sont les feux lumineux conçus pour la réglementation de la circulation routière.' },
        {
          type: 'table',
          title: 'Les feux tricolores',
          rows: [
            ['🟢 Vert', 'Durée normale : 15 secondes. Indique le passage (priorité de passage).'],
            ['🟠 Orange / jaune', 'Durée normale : 3 à 5 secondes.'],
            ['🔴 Rouge', 'Durée normale : 20 secondes. Impose la règle de céder le passage (arrêt obligatoire).'],
          ],
        },
        {
          type: 'key',
          title: 'La flèche supplémentaire (ou de déboisement)',
          text: 'C’est une flèche jaune clignotante qui s’allume alors que le feu est rouge : elle m’autorise à aller dans la direction indiquée (à droite ou tout droit), à condition de faire la présélection de ma voie, de céder le passage aux piétons et aux véhicules venant de ma gauche.',
        },
        { type: 'p', text: 'Les feux tricolores en forme de flèche ont la même signification que les feux circulaires : je les respecte en fonction de la direction que je veux prendre. Lorsqu’une voie est affectée à deux directions et que les feux ne fonctionnent pas, on respecte les indications des panneaux.' },
        {
          type: 'list',
          title: '🔴 Les feux rouges clignotants se rencontrent…',
          items: ['À l’entrée de la caserne de sapeurs-pompiers', 'À l’entrée d’un pont mobile', 'À proximité des passages à niveau', 'À proximité des aérodromes', 'Au niveau des postes de péage ; appontement des bacs'],
        },
        {
          type: 'list',
          title: '🟡 Les feux jaunes clignotants se rencontrent…',
          items: ['Aux intersections de route', 'Aux endroits où l’on effectue des travaux temporaires', 'Au niveau des passages cloutés ou de piétons'],
        },
        { type: 'warn', text: 'À la vue d’un feu rouge clignotant, l’arrêt est absolu.' },
      ],
    },
    {
      id: 'gestuelle',
      title: 'Signalisation gestuelle',
      emoji: '👮',
      blocks: [
        { type: 'p', text: 'C’est l’ensemble des signes adressés aux usagers de la route par les agents de la force de l’ordre (OSER, Police, Gendarmerie).' },
        {
          type: 'list',
          title: 'Rôle de l’agent qui intervient dans la circulation',
          items: [
            'Garantir et assurer la sécurité routière',
            'Faciliter l’écoulement de la circulation',
            'Contrôler les pièces et vérifier l’état du conducteur et du véhicule',
            'Constater les infractions aux règles du code de la route',
            'Organiser le secours en cas d’accident',
          ],
        },
        { type: 'key', text: 'L’agent est prioritaire par rapport aux 3 autres signalisations : on dit qu’il « efface le signal ».' },
        {
          type: 'table',
          title: 'Positions de l’agent',
          rows: [
            ['Vue de face ou de dos', 'Arrêt obligatoire'],
            ['Vue de profil', 'Voie libre'],
            ['Bras levé', 'Attention à l’arrêt ou au départ'],
          ],
        },
        {
          type: 'example',
          title: 'Mise en situation',
          text: 'Le feu est vert mais un gendarme, face à toi, te fait signe : tu t’arrêtes. L’agent « efface » le feu. Quand il se tourne de profil, la voie est libre pour toi.',
        },
      ],
    },
  ],
};

const { q, tf } = qbuilder(2);

export const questions2: Question[] = [
  q('En combien de grands groupes se divise la signalisation routière ?', ['2', '3', '4', '7'], 2, 'Quatre : verticale, horizontale, lumineuse et gestuelle.'),
  q('La signalisation verticale est constituée…', ['Des feux tricolores', 'Des panneaux et balises', 'Des marquages au sol', 'Des gestes des agents'], 1, 'La signalisation verticale = panneaux et balises implantés le long des routes et aux intersections.'),
  q('La signalisation horizontale est l’ensemble…', ['Des panneaux', 'Des marques et marquages peints sur la chaussée', 'Des feux', 'Des agents'], 1, 'Marques et marquages peints sur la chaussée : lignes, flèches, bandes.'),
  q('En combien de parties se divise la signalisation verticale selon ses caractéristiques ?', ['4', '5', '6', '7'], 3, 'Elle se divise en 7 parties selon formes, couleurs et symboles.'),
  q('Quelles sont les caractéristiques d’un signal de danger ?', ['Rond, fond bleu, symbole blanc', 'Triangle, sommet en haut, bordure rouge, fond blanc, symbole noir', 'Carré, fond blanc', 'Triangle, fond jaune'], 1, 'Signal de danger : triangle sommet vers le haut, bordure rouge, fond blanc, symbole noir.', { sign: S.danger }),
  q('Un signal de danger impose…', ['L’arrêt immédiat', 'Une vigilance spéciale avec ralentissement adapté', 'L’accélération', 'De klaxonner seulement'], 1, 'Il impose une vigilance spéciale avec un ralentissement adapté à la nature du danger.'),
  q('Les signaux de prescription absolue sont de forme…', ['Triangulaire', 'Carrée', 'Ronde ou circulaire', 'Losange'], 2, 'Ils sont de forme ronde ou circulaire.'),
  q('Un panneau d’interdiction a…', ['Une bordure rouge, un fond blanc et un symbole noir', 'Un fond bleu et un symbole blanc', 'Un fond jaune', 'Un fond vert'], 0, 'Interdiction : bordure rouge, fond blanc, symbole noir.', { sign: S.interdiction }),
  q('Un panneau d’obligation a…', ['Un fond bleu et un symbole blanc', 'Une bordure rouge et un fond blanc', 'Un fond jaune', 'Un fond blanc, symbole noir'], 0, 'Obligation : fond bleu, symbole blanc.', { sign: S.obligation }),
  q('Quel panneau a une bordure rouge, un fond bleu et une barre oblique rouge ?', ['Obligation', 'Danger', 'Stationnement', 'Direction'], 2, 'C’est le panneau de stationnement.', { sign: S.stationnement }),
  q('Les signaux de simples indications sont de forme…', ['Triangulaire', 'Ronde', 'Carrée ou rectangulaire', 'Octogonale'], 2, 'Forme carrée ou rectangulaire, fond bleu ou blanc, symbole bleu ou blanc.', { sign: S.indication }),
  q('Un signal temporaire est un triangle…', ['Fond blanc, bordure rouge', 'Bordure rouge, fond jaune, symbole noir', 'Fond bleu', 'Fond vert'], 1, 'Signaux temporaires : triangulaires, bordure rouge, fond jaune, symbole noir.', { sign: S.temporaire }),
  q('Sur un panneau de direction, la couleur bleue est implantée sur…', ['Les routes nationales', 'Les autoroutes (A)', 'Les agglomérations', 'Les pistes'], 1, 'Bleu : autoroutes (A).', { sign: S.dirAutoroute }),
  q('Sur un panneau de direction, la couleur verte est implantée sur…', ['Les routes nationales (N)', 'Les autoroutes', 'Les agglomérations', 'Les voies ferrées'], 0, 'Vert : routes nationales (N).', { sign: S.dirNationale }),
  q('Sur un panneau de direction, la couleur blanche est implantée…', ['Sur les autoroutes', 'Sur les routes nationales', 'En agglomération', 'Sur les chemins de fer'], 2, 'Blanc : en agglomération.', { sign: S.dirAgglo }),
  q('Les panneaux de passage à niveau sont implantés…', ['À l’entrée de l’autoroute', 'Aux intersections d’un chemin de fer et d’une route', 'Dans les parkings', 'Aux ronds-points'], 1, 'Ils sont implantés aux intersections d’un chemin de fer et d’une route.'),
  q('Combien y a-t-il de principales règles de priorité ?', ['2', '3', '4', '5'], 1, 'Trois : priorité à droite, priorité de passage, règle de céder le passage.'),
  q('La priorité à droite consiste à…', ['Passer sans tenir compte des autres', 'Céder le passage aux usagers venant de ma droite', 'Céder le passage aux usagers venant de ma gauche', 'Toujours accélérer'], 1, 'Je cède le passage à tous les usagers venant de ma droite à une intersection (s’ils n’ont pas de véhicule à leur droite).'),
  q('Quel panneau introduit la priorité à droite ?', ['Un triangle avec une croix', 'Un octogone STOP', 'Un losange', 'Un triangle inversé'], 0, 'Le triangle avec une croix introduit la priorité à droite.', { sign: S.prioDroite }),
  tf('La priorité à droite s’applique aussi à une intersection sans signalisation.', true, 'Oui : à une intersection sans signalisation, c’est la priorité à droite qui s’applique.'),
  q('La priorité de passage consiste à…', ['Passer sans tenir compte des usagers de gauche et de droite', 'Céder à tous', 'S’arrêter obligatoirement', 'Reculer'], 0, 'Priorité de passage : passer à l’intersection sans tenir compte des usagers de gauche et de droite.'),
  q('Quel panneau introduit la règle de céder le passage (perte de priorité) ?', ['Le losange', 'Le STOP', 'Le triangle avec une croix', 'Le panneau bleu'], 1, 'STOP et « Cédez le passage » introduisent la perte de priorité.', { sign: S.stop }),
  q('Le panneau « Cédez le passage » a la forme…', ['D’un triangle pointe vers le bas', 'D’un cercle', 'D’un losange', 'D’un rectangle'], 0, 'Triangle pointe en bas, bordure rouge, fond blanc.', { sign: S.cedez }),
  q('Quelle règle de priorité est secondaire et s’applique au carrefour à sens giratoire avec marquage au sol ?', ['Priorité à droite', 'Priorité à gauche', 'Priorité de passage', 'Aucune'], 1, 'La priorité à gauche est secondaire : elle s’applique au carrefour à sens giratoire avec marquage au sol.', { sign: S.giratoire }),
  q('Quel est le rôle d’une route prioritaire (losange) ?', ['Donner la priorité de passage', 'Interdire le stationnement', 'Annoncer un danger', 'Annoncer un chantier'], 0, 'Le losange indique une route prioritaire : priorité de passage.', { sign: S.routePrioritaire }),
  q('Quelle est la durée normale du feu vert ?', ['5 secondes', '10 secondes', '15 secondes', '30 secondes'], 2, 'Feu vert : 15 secondes (durée normale).', { tags: ['chiffres'] }),
  q('Quelle est la durée normale du feu orange (jaune) ?', ['1 à 2 secondes', '3 à 5 secondes', '10 secondes', '20 secondes'], 1, 'Feu orange : 3 à 5 secondes.', { tags: ['chiffres'] }),
  q('Quelle est la durée normale du feu rouge ?', ['5 secondes', '10 secondes', '15 secondes', '20 secondes'], 3, 'Feu rouge : 20 secondes.', { tags: ['chiffres'] }),
  q('Le feu rouge impose…', ['La priorité de passage', 'La règle de céder le passage (arrêt obligatoire)', 'Le ralentissement', 'Le klaxon'], 1, 'Feu rouge : règle de céder le passage, arrêt obligatoire.'),
  q('Le feu vert indique…', ['L’arrêt', 'Le passage (priorité de passage)', 'Le danger', 'Le stationnement'], 1, 'Feu vert : le passage (priorité de passage).'),
  q('La flèche supplémentaire (ou de déboisement) est…', ['Une flèche verte fixe', 'Une flèche jaune clignotante allumée alors que le feu est rouge', 'Une flèche blanche', 'Un panneau bleu'], 1, 'C’est une flèche jaune clignotante qui s’allume alors que le feu est rouge.'),
  q('Avec la flèche de déboisement, on est autorisé à aller…', ['Uniquement à gauche', 'À droite ou tout droit', 'En demi-tour', 'En marche arrière'], 1, 'Elle autorise à aller dans la direction indiquée (à droite ou tout droit).'),
  q('Avec la flèche clignotante, on doit notamment…', ['Accélérer', 'Faire la présélection de sa voie et céder le passage aux piétons et aux véhicules venant de ma gauche', 'Klaxonner', 'S’arrêter 5 minutes'], 1, 'À condition de faire la présélection de sa voie, de céder aux piétons et aux véhicules venant de ma gauche.'),
  q('Un feu rouge clignotant se rencontre…', ['À l’entrée d’une caserne de sapeurs-pompiers', 'Devant une école uniquement', 'Sur toutes les routes', 'Dans les parkings'], 0, 'Feux rouges clignotants : caserne de pompiers, pont mobile, passages à niveau, aérodromes, postes de péage, appontement des bacs.'),
  q('Où rencontre-t-on des feux jaunes clignotants ?', ['Aux intersections de route, aux travaux temporaires, aux passages cloutés', 'Aux passages à niveau', 'Aux postes de péage', 'Aux aérodromes'], 0, 'Feux jaunes clignotants : intersections de route, travaux temporaires, passages cloutés ou de piétons.'),
  q('À la vue d’un feu rouge clignotant, l’arrêt est…', ['Facultatif', 'Absolu (nécessaire)', 'Interdit', 'Recommandé de jour seulement'], 1, 'À sa vue, l’arrêt est nécessaire, voire absolu.'),
  q('La signalisation gestuelle est assurée par…', ['Les panneaux', 'Les agents de la force de l’ordre', 'Les feux', 'Les marquages'], 1, 'Agents de la force de l’ordre : OSER, Police, Gendarmerie.'),
  q('Un agent qui règle la circulation est…', ['Prioritaire sur toutes les autres signalisations', 'Moins important que les feux', 'Moins important que les panneaux', 'Seulement un conseil'], 0, 'Il est prioritaire par rapport aux 3 autres signalisations : il efface le signal.'),
  q('Un agent vu de face ou de dos signifie…', ['Voie libre', 'Arrêt obligatoire', 'Accélérez', 'Demi-tour'], 1, 'Vue de face ou de dos : arrêt obligatoire.'),
  q('Un agent vu de profil signifie…', ['Voie libre', 'Arrêt obligatoire', 'Danger', 'Interdiction de passer'], 0, 'Vue de profil : voie libre.'),
  q('Un agent lève le bras : cela signifie…', ['Passez vite', 'Attention à l’arrêt ou au départ', 'Marche arrière', 'Stationnement'], 1, 'La levée de bras : attention à l’arrêt ou au départ.'),
  tf('Le feu est vert mais un agent vous fait face et vous fait signe : vous devez passer.', false, 'Faux : l’agent efface le signal. Vue de face, c’est l’arrêt obligatoire.'),
  q('Parmi ces rôles, lequel n’est PAS un rôle de l’agent de circulation ?', ['Constater les infractions', 'Organiser le secours en cas d’accident', 'Faciliter l’écoulement de la circulation', 'Réparer les véhicules'], 3, 'L’agent garantit la sécurité, facilite la circulation, contrôle, constate les infractions et organise les secours — il ne répare pas les véhicules.'),
];
