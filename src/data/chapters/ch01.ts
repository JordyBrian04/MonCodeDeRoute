import type { Chapter, Question } from '../types';
import { qbuilder } from '../qb';

export const chapter1: Chapter = {
  id: 1,
  title: 'Le permis de conduire',
  shortTitle: 'Permis',
  emoji: '🪪',
  summary: '6 catégories de permis, âges minimum, permis permanents et périodiques, cas de retrait.',
  pages: 'pages 2 à 5',
  sections: [
    {
      id: 'definition',
      title: 'Définition & les 6 catégories',
      emoji: '📘',
      blocks: [
        {
          type: 'p',
          text: 'Le permis de conduire est une attestation délivrée par les autorités administratives à un individu pour conduire un véhicule selon sa catégorie.',
        },
        {
          type: 'key',
          title: 'À retenir',
          text: 'Il existe 6 catégories de permis de conduire : A – B – C – D – E – F.',
        },
        {
          type: 'table',
          title: 'Vue d’ensemble',
          rows: [
            ['A', 'Motos (cyclomoteurs) · 18 ans · permanent'],
            ['B', 'Tourisme / affaires, PTAC ≤ 3,5 t, 9 sièges max · 18 ans · permanent'],
            ['C', 'PTAC > 3,5 t, marchandises · 21 ans · périodique'],
            ['D', 'PTAC > 3,5 t, transport en commun (≥ 8 sièges) · 21 ans · périodique'],
            ['E', 'Complémentaire : remorques / semi-remorques · 21 ans · périodique'],
            ['F', 'Personnes infirmes, véhicule aménagé · 18 ans · permanent'],
          ],
        },
        {
          type: 'example',
          title: 'Mise en situation',
          text: 'Koffi veut devenir chauffeur de taxi-brousse (transport de personnes) : il vise le permis D. Awa veut juste conduire sa petite voiture personnelle : le permis B suffit. Et son frère Yao, qui rêve de conduire un camion avec remorque, aura besoin du C puis du E.',
        },
      ],
    },
    {
      id: 'ab',
      title: 'Permis A et B (permanents)',
      emoji: '🏍️',
      blocks: [
        { type: 'p', text: 'Permis A : il permet de conduire les motos (les cyclomoteurs). Âge du conducteur : 18 ans. Il a un caractère permanent.' },
        {
          type: 'p',
          text: 'Permis B : il permet de conduire les véhicules automobiles d’affaires ou de tourisme dont le PTAC ne dépasse pas 3,5 tonnes, comportant au plus 9 sièges avec celui du conducteur. Âge minimal : 18 ans. Il a un caractère permanent.',
        },
        {
          type: 'key',
          title: 'Le PTAC',
          text: 'PTAC = Poids Total Autorisé en Charge.  P.T.A.C = PV + CU  (poids à vide + charge utile)  → pour le permis B : inférieur à 3,5 tonnes.',
        },
        { type: 'warn', text: 'Permanent = tu ne le renouvelles pas. Piège classique : ne confonds pas avec « périodique » (renouvelable).' },
      ],
    },
    {
      id: 'cde',
      title: 'Permis C, D, E (périodiques)',
      emoji: '🚚',
      blocks: [
        {
          type: 'p',
          text: 'Permis C : véhicules automobiles dont le PTAC dépasse 3,5 tonnes, affectés au transport de marchandises ou de matériels. Âge minimal : 21 ans. Caractère périodique, c’est-à-dire renouvelable.',
        },
        {
          type: 'p',
          text: 'Permis D : véhicules dont le PTAC dépasse 3,5 tonnes, affectés au transport en commun de personnes comportant au moins 8 sièges, y compris celui du conducteur. Âge minimum : 21 ans. Périodique.',
        },
        {
          type: 'p',
          text: 'Permis E : c’est un permis complémentaire destiné aux attelages remorques ou semi-remorques. Périodique ; âge du conducteur : 21 ans.',
        },
        {
          type: 'p',
          text: 'Permis F : il permet à un infirme de conduire un véhicule automobile d’une des catégories A, B ou AB, spécialement aménagé pour tenir compte de son infirmité. Permanent ; âge : 18 ans.',
        },
        {
          type: 'example',
          title: 'Astuce mémoire',
          text: 'C = Cargaison (marchandises). D = Déplacement de voyageurs (transport en commun). E = Extension (remorque en plus). F = Facilité pour les personnes infirmes.',
        },
      ],
    },
    {
      id: 'renouvellement',
      title: 'Renouveler les permis C, D, E',
      emoji: '📅',
      blocks: [
        { type: 'p', text: 'Les permis C, D et E sont renouvelables. Plus le conducteur vieillit, plus la visite revient souvent :' },
        {
          type: 'table',
          title: 'Périodicité',
          rows: [
            ['De 21 à 45 ans', 'Tous les 5 ans'],
            ['De 45 à 55 ans', 'Tous les 3 ans'],
            ['De 55 à 60 ans', 'Tous les 2 ans'],
            ['À partir de 60 ans', 'Tous les ans'],
          ],
        },
        {
          type: 'key',
          text: 'NB du cours : la conduite automobile est un art parvenu à un esprit de sécurité qui nécessite une vigilance. Cette vigilance est constituée d’observation, d’analyse, de prévention et d’anticipation.',
        },
      ],
    },
    {
      id: 'retrait',
      title: 'Les cas de retrait du permis',
      emoji: '🚫',
      blocks: [
        { type: 'p', text: 'Il existe 37 cas de retrait de permis en Côte d’Ivoire et 21 cas au plan international. Voici ceux détaillés dans ton cours, regroupés pour mieux les mémoriser :' },
        {
          type: 'list',
          title: 'Sens de circulation & lignes',
          items: [
            'Circulation sur la partie gauche de la chaussée en marche normale',
            'Franchissement d’une ligne continue',
            'Croisement à gauche',
            'Refus de serrer à droite pour se laisser dépasser',
          ],
        },
        {
          type: 'list',
          title: 'Vitesse & dépassement',
          items: [
            'Vitesse excessive dans le cas où elle doit être réduite',
            'Dépassement des vitesses réglementées ou excès de vitesse',
            'Dépassement en sens inverse',
            'Dépassement dans un virage',
            'Dépassement à gauche lorsqu’il est interdit',
            'Retour à droite prématuré après un dépassement',
            'Accélération pour ne pas se laisser dépasser',
          ],
        },
        {
          type: 'list',
          title: 'Priorités, arrêts & stationnement',
          items: [
            'Traverser sans arrêt à l’entrée d’un passage à niveau',
            'Non-respect des règles de priorité',
            'Stationnement volontaire sur la chaussée',
            'Stationnement involontaire sans les mesures de pré-signalisation',
            'Véhicule en stationnement non signalé dans une zone dépourvue d’éclairage public',
            'Arrêt ou stationnement dangereux',
            'Stationnement sur l’autoroute',
            'Obstruction volontaire de la voie publique',
          ],
        },
        {
          type: 'list',
          title: 'Éclairage & signalisation du véhicule',
          items: [
            'Défauts d’éclairage et de signalisation à l’avant et à l’arrière d’un véhicule',
            'Usage de feux de route à l’endroit des usagers venant en sens inverse',
            'Chargement long non signalé',
            'Changement de direction non signalé',
            'Défaut d’autorisation de transport hors gabarit',
            'Non-utilisation des ceintures de sécurité',
          ],
        },
        {
          type: 'list',
          title: 'Comportement grave & documents',
          items: [
            'État d’ivresse',
            'Délit de fuite',
            'Homicide ou blessure par imprudence',
            'Organisation de course automobile sans autorisation administrative',
            'Prêt de véhicule à autrui sans permis',
            'Dégradation des chaussées, ponts et ouvrages d’art',
            'Mise en circulation d’un véhicule sans autorisation administrative',
            'Utilisation volontaire de pièces périmées',
            'Utilisation de pièces administratives falsifiées',
            'Usage volontaire de fausse inscription',
            'Véhicule en circulation sans numéros prescrits par les règlements',
          ],
        },
        { type: 'warn', text: 'Le cours annonce 37 cas ; la liste fournie en détaille 36. Retiens surtout les grandes familles ci-dessus.' },
      ],
    },
  ],
};

const { q, tf } = qbuilder(1);

export const questions1: Question[] = [
  tf('Le permis de conduire est une attestation délivrée par les autorités administratives.', true, 'C’est la définition du cours : une attestation délivrée à un individu pour conduire un véhicule selon sa catégorie.'),
  q('Combien de catégories de permis de conduire existe-t-il ?', ['4', '5', '6', '8'], 2, 'Il y a 6 catégories : A, B, C, D, E et F.'),
  q('Le permis A permet de conduire…', ['Les motos (cyclomoteurs)', 'Les camions', 'Les autocars', 'Les remorques'], 0, 'Le permis A est celui des motos (cyclomoteurs).'),
  q('Quel est l’âge minimal pour le permis A ?', ['16 ans', '18 ans', '21 ans', '25 ans'], 1, 'Pour le permis A, l’âge du conducteur est de 18 ans.'),
  q('Le permis B concerne les véhicules dont le PTAC…', ['Dépasse 3,5 tonnes', 'Ne dépasse pas 3,5 tonnes', 'Dépasse 7 tonnes', 'Est illimité'], 1, 'Permis B : véhicules d’affaires ou de tourisme dont le PTAC ne dépasse pas 3,5 tonnes.'),
  q('Combien de sièges au maximum (conducteur compris) pour un véhicule du permis B ?', ['5', '7', '9', '12'], 2, 'Le permis B autorise au plus 9 sièges avec celui du conducteur.'),
  q('PTAC signifie :', ['Poids Total Autorisé en Charge', 'Poids Technique Admis en Circulation', 'Pression Totale Admise en Charge', 'Poids Théorique Autorisé Constant'], 0, 'P.T.A.C = Poids Total Autorisé en Charge.'),
  q('Quelle formule correspond au PTAC ?', ['PV + CU', 'PV − CU', 'CU × PV', 'PV ÷ CU'], 0, 'P.T.A.C = PV + CU (poids à vide + charge utile).'),
  q('Quel permis faut-il pour un camion de marchandises dont le PTAC dépasse 3,5 t ?', ['A', 'B', 'C', 'F'], 2, 'Le permis C concerne les véhicules de plus de 3,5 t affectés au transport de marchandises ou de matériels.'),
  q('Quel âge minimum pour le permis C ?', ['18 ans', '19 ans', '21 ans', '23 ans'], 2, 'Âge minimal du conducteur pour le permis C : 21 ans.'),
  q('Le permis D concerne :', ['Le transport de marchandises', 'Le transport en commun de personnes', 'Les motos', 'Les véhicules aménagés'], 1, 'Permis D : transport en commun de personnes, PTAC > 3,5 t, au moins 8 sièges y compris celui du conducteur.'),
  q('À partir de combien de sièges (conducteur compris) parle-t-on de permis D ?', ['5 sièges', '6 sièges', '8 sièges', '10 sièges'], 2, 'Le permis D concerne des véhicules comportant au moins 8 sièges y compris celui du conducteur.'),
  q('Un chauffeur veut conduire un autocar de 30 places. Quel permis ?', ['B', 'C', 'D', 'F'], 2, 'Un autocar est un véhicule de transport en commun de personnes : permis D.'),
  q('Le permis E est :', ['Un permis pour les motos', 'Un permis complémentaire pour attelages remorques ou semi-remorques', 'Un permis pour les infirmes', 'Un permis international'], 1, 'Le permis E est complémentaire : il est destiné aux attelages remorques ou semi-remorques.'),
  q('Le permis F permet à un infirme de conduire un véhicule…', ['Quelconque, sans aménagement', 'Des catégories A, B ou AB spécialement aménagé', 'De la catégorie C uniquement', 'De la catégorie D uniquement'], 1, 'Le permis F concerne les catégories A, B ou AB, spécialement aménagées pour tenir compte de l’infirmité.'),
  q('Quels permis ont un caractère permanent ?', ['A, B et F', 'C, D et E', 'B, C et D', 'A, D et E'], 0, 'Les permis A, B et F sont permanents. C, D et E sont périodiques.'),
  q('Quels permis sont périodiques (renouvelables) ?', ['A, B, F', 'C, D, E', 'A, C, F', 'B, D, F'], 1, 'Les catégories C, D et E sont périodiques, donc renouvelables.'),
  q('Un permis périodique est un permis…', ['Valable à vie', 'Renouvelable', 'Réservé aux étrangers', 'Valable un seul jour'], 1, 'Périodique signifie renouvelable.'),
  q('De 21 à 45 ans, les permis C, D, E sont renouvelables…', ['Tous les ans', 'Tous les 2 ans', 'Tous les 3 ans', 'Tous les 5 ans'], 3, 'De 21 à 45 ans : tous les 5 ans.', { tags: ['chiffres'] }),
  q('De 45 à 55 ans, les permis C, D, E sont renouvelables…', ['Tous les 2 ans', 'Tous les 3 ans', 'Tous les 5 ans', 'Tous les 10 ans'], 1, 'De 45 à 55 ans : tous les 3 ans.', { tags: ['chiffres'] }),
  q('De 55 à 60 ans, les permis C, D, E sont renouvelables…', ['Tous les ans', 'Tous les 2 ans', 'Tous les 3 ans', 'Tous les 5 ans'], 1, 'De 55 à 60 ans : tous les 2 ans.', { tags: ['chiffres'] }),
  q('À partir de 60 ans, les permis C, D, E sont renouvelables…', ['Tous les ans', 'Tous les 2 ans', 'Tous les 3 ans', 'Tous les 5 ans'], 0, 'À partir de 60 ans : tous les ans.', { tags: ['chiffres'] }),
  q('Combien y a-t-il de cas de retrait de permis en Côte d’Ivoire (selon le cours) ?', ['21', '30', '37', '50'], 2, 'Il existe 37 cas en Côte d’Ivoire et 21 cas au plan international.', { tags: ['chiffres'] }),
  q('Combien de cas de retrait existe-t-il au plan international (selon le cours) ?', ['12', '21', '37', '45'], 1, '21 cas au plan international.', { tags: ['chiffres'] }),
  q('Lequel de ces comportements entraîne le retrait du permis ?', ['État d’ivresse', 'Klaxonner dans un virage', 'Utiliser l’essuie-glace', 'Rouler avec les phares de croisement'], 0, 'L’état d’ivresse figure parmi les cas de retrait du permis.'),
  q('Le délit de fuite est…', ['Un cas de retrait de permis', 'Autorisé en cas de pluie', 'Une simple remarque', 'Un cas de renouvellement'], 0, 'Délit de fuite : cas de retrait du permis.'),
  q('Circuler sur la partie gauche de la chaussée en marche normale :', ['Est autorisé de nuit', 'Est un cas de retrait du permis', 'Est autorisé en agglomération', 'Est recommandé'], 1, 'La circulation sur la partie gauche de la chaussée en marche normale est un cas de retrait.'),
  q('Parmi ces cas, lequel est un cas de retrait de permis ?', ['Prêter son véhicule à autrui sans permis', 'Changer ses essuie-glaces', 'Se garer dans un parking', 'Régler ses rétroviseurs'], 0, 'Le prêt de véhicule à autrui sans permis figure dans la liste des cas de retrait.'),
  q('La non-utilisation de la ceinture de sécurité est :', ['Sans conséquence', 'Un cas de retrait du permis', 'Autorisée en ville', 'Autorisée de jour'], 1, 'La non-utilisation des ceintures de sécurité est un cas de retrait.'),
  q('Franchir une ligne continue :', ['Est permis pour dépasser', 'Est un cas de retrait du permis', 'Est permis en agglomération', 'N’a aucun effet'], 1, 'Le franchissement d’une ligne continue est un cas de retrait.'),
  q('Selon le cours, la vigilance du conducteur est constituée…', ['D’observation, d’analyse, de prévention et d’anticipation', 'De vitesse et de réactivité', 'D’audace et de rapidité', 'De klaxon et de feux'], 0, 'La vigilance = observation, analyse, prévention et anticipation.'),
  q('Un conducteur veut tracter une remorque avec son camion : quel permis complémentaire ?', ['A', 'E', 'F', 'B'], 1, 'Le permis E est le permis complémentaire pour attelages remorques ou semi-remorques.'),
  q('Une voiture de tourisme 5 places de 2 tonnes de PTAC nécessite le permis…', ['B', 'C', 'D', 'E'], 0, 'PTAC inférieur à 3,5 t et au plus 9 sièges : permis B.'),
];
