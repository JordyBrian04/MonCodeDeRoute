import type { Chapter, Question } from '../types';
import { qbuilder } from '../qb';

export const chapter9: Chapter = {
  id: 9,
  title: 'La conduite automobile',
  shortTitle: 'Conduite',
  emoji: '🧑‍✈️',
  summary: 'Définition, conditions d’apprentissage, système VIF, mise en marche du moteur et champ visuel du conducteur.',
  pages: 'page 33 + page 36',
  sections: [
    {
      id: 'definition',
      title: 'Définition & conditions d’apprentissage',
      emoji: '📘',
      blocks: [
        {
          type: 'p',
          text: 'La conduite automobile est une activité sensorimotrice qui consiste à faire fonctionner une automobile dans le but de se déplacer. Elle peut aussi être définie comme une activité collective dans un espace social. Elle est soumise aux règles du code de la route et à celles du savoir-vivre et du savoir-être.',
        },
        {
          type: 'list',
          title: 'Les conditions d’apprentissage — le candidat…',
          items: [
            'Va monter en voiture',
            'Regarde si aucun pneu n’est dégonflé et si les phares ne sont pas endommagés',
            'S’installe au poste de conduite : règle le siège et les rétroviseurs, boucle la ceinture de sécurité',
            'Met le moteur en marche sans hésitation ni erreur',
            'Démarre le véhicule sans caler ni à-coup',
          ],
        },
        {
          type: 'example',
          title: 'Mise en situation',
          text: 'Avant de partir, tu fais le tour de la voiture : pneus gonflés, phares intacts. Tu t’assois, tu règles le siège puis les rétroviseurs, tu boucles ta ceinture. Seulement alors tu mets le contact.',
        },
      ],
    },
    {
      id: 'vif',
      title: 'Les 3 phases de démarrage : VIF',
      emoji: '🔑',
      blocks: [
        {
          type: 'mnemo',
          code: 'VIF',
          title: 'Système à appliquer au démarrage',
          items: [
            { letter: 'V', text: 'Vitesse à passer' },
            { letter: 'I', text: 'Indication de changement de direction (clignotant)' },
            { letter: 'F', text: 'Frein à main baissé' },
          ],
        },
        {
          type: 'list',
          title: 'Il change de vitesse…',
          items: ['Sans caler', 'Au moment convenable', 'Sans regarder le levier de vitesse'],
        },
        {
          type: 'list',
          title: 'La mise en marche du moteur',
          ordered: true,
          items: [
            'Vérifier le point mort (V = 0 km/h)',
            'Établir le contact',
            'Actionner le starter si le moteur est froid',
            'Actionner le démarreur',
            'Supprimer l’action du starter sitôt que le moteur est en route',
          ],
        },
      ],
    },
    {
      id: 'champ-visuel',
      title: 'Le champ visuel du conducteur',
      emoji: '👁️',
      blocks: [
        { type: 'p', text: 'Par définition, c’est l’angle dans lequel le conducteur aperçoit un sujet ou un obstacle. À chaque vitesse correspond un angle bien précis.' },
        {
          type: 'table',
          title: 'Plus on va vite, plus le champ de vision se rétrécit',
          rows: [
            ['30 km/h', 'Champ visuel de 120°'],
            ['80 km/h', 'Champ visuel de 60°'],
            ['100 km/h', 'Champ visuel de 45°'],
            ['130 km/h', 'Champ visuel de 30°'],
          ],
        },
        {
          type: 'example',
          title: 'Mise en situation',
          text: 'À 30 km/h tu vois très large : le piéton sur le bord de la route et le cycliste sont dans ton champ visuel. À 130 km/h, tu vois comme à travers un tunnel : un enfant sur le côté peut te « disparaître » de la vue.',
        },
      ],
    },
  ],
};

const { q, tf } = qbuilder(9);

export const questions9: Question[] = [
  q('La conduite automobile est une activité…', ['Sensorimotrice', 'Uniquement mentale', 'Uniquement physique', 'Passive'], 0, 'Activité sensorimotrice qui consiste à faire fonctionner une automobile pour se déplacer.'),
  q('La conduite peut aussi être définie comme…', ['Une activité collective dans un espace social', 'Un sport', 'Un jeu', 'Un métier obligatoire'], 0, 'Elle peut être définie comme une activité collective dans un espace social.'),
  q('La conduite est soumise…', ['Aux règles du code de la route et du savoir-vivre / savoir-être', 'Seulement au bon sens', 'Aux règles de la mécanique', 'À aucune règle'], 0, 'Règles du code de la route et du savoir-vivre, savoir-être.'),
  q('Avant de monter en voiture, le candidat regarde…', ['Qu’aucun pneu n’est dégonflé et que les phares ne sont pas endommagés', 'La météo', 'Le niveau de la radio', 'Le prix du carburant'], 0, 'Il regarde si aucun pneu n’est dégonflé et si les phares ne sont pas endommagés.'),
  q('Au poste de conduite, le candidat…', ['Règle le siège et les rétroviseurs et boucle la ceinture', 'Éteint les rétroviseurs', 'Ouvre le coffre', 'Met le frein à main'], 0, 'Il règle le siège, les rétroviseurs, boucle la ceinture de sécurité.'),
  q('Le candidat met le moteur en marche…', ['Sans hésitation ni erreur', 'En hésitant', 'En accélérant à fond', 'Sans vérifier'], 0, 'Il met le moteur en marche sans hésitation ni erreur.'),
  q('Le candidat démarre le véhicule…', ['Sans caler ni à-coup', 'Brutalement', 'En klaxonnant', 'Sans regarder'], 0, 'Il démarre le véhicule sans caler ni à-coup.'),
  q('Combien de phases de démarrage le système VIF comporte-t-il ?', ['2', '3', '4', '5'], 1, 'Trois : vitesse, indication, frein à main.', { tags: ['chiffres'] }),
  q('Dans VIF, que signifie V ?', ['Vitesse à passer', 'Vitesse maximale', 'Vérifier', 'Vitre'], 0, 'V = vitesse à passer.'),
  q('Dans VIF, que signifie I ?', ['Indication de changement de direction', 'Inspection', 'Immobiliser', 'Issue'], 0, 'I = indication de changement de direction (clignotant).'),
  q('Dans VIF, que signifie F ?', ['Frein à main baissé', 'Feux allumés', 'Fermer la portière', 'Freinage fort'], 0, 'F = frein à main baissé.'),
  q('Pour changer de vitesse, le conducteur doit…', ['Passer sans caler, au moment convenable, sans regarder le levier', 'Regarder le levier à chaque fois', 'Caler pour sentir', 'Passer en klaxonnant'], 0, 'Sans caler, au moment convenable, sans regarder le levier de vitesse.'),
  q('Quelle est la première étape de la mise en marche du moteur ?', ['Vérifier le point mort (V = 0 km/h)', 'Actionner le démarreur', 'Établir le contact', 'Actionner le starter'], 0, '1 – vérifier le point mort.'),
  q('Quelle étape vient juste après « établir le contact » ?', ['Actionner le starter si le moteur est froid', 'Supprimer l’action du starter', 'Vérifier le point mort', 'Débrayer'], 0, 'Ordre : point mort → contact → starter (si froid) → démarreur → supprimer le starter.'),
  q('On actionne le starter…', ['Si le moteur est froid', 'Si le moteur est chaud', 'Toujours', 'Jamais'], 0, 'On actionne le starter si le moteur est froid.'),
  q('Quand supprime-t-on l’action du starter ?', ['Sitôt que le moteur est en route', 'Avant de démarrer', 'Après 10 minutes', 'Jamais'], 0, 'Dès que le moteur est en route.'),
  q('Ordre correct de la mise en marche du moteur :', ['Point mort – contact – starter – démarreur – supprimer le starter', 'Démarreur – contact – point mort', 'Contact – démarreur – point mort', 'Starter – point mort – contact'], 0, 'Point mort, contact, starter (moteur froid), démarreur, suppression du starter.'),
  q('Le champ visuel du conducteur est…', ['L’angle dans lequel le conducteur aperçoit un sujet ou un obstacle', 'La largeur de la route', 'La distance d’arrêt', 'La puissance des phares'], 0, 'Par définition, c’est l’angle dans lequel le conducteur aperçoit un sujet ou un obstacle.'),
  q('À 30 km/h, le champ visuel est d’environ…', ['30°', '45°', '60°', '120°'], 3, 'À 30 km/h : 120°.', { tags: ['chiffres'] }),
  q('À 80 km/h, le champ visuel est d’environ…', ['120°', '60°', '45°', '30°'], 1, 'À 80 km/h : 60°.', { tags: ['chiffres'] }),
  q('À 100 km/h, le champ visuel est d’environ…', ['120°', '60°', '45°', '30°'], 2, 'À 100 km/h : 45°.', { tags: ['chiffres'] }),
  q('À 130 km/h, le champ visuel est d’environ…', ['120°', '60°', '45°', '30°'], 3, 'À 130 km/h : 30°.', { tags: ['chiffres'] }),
  q('Quand la vitesse augmente, le champ visuel…', ['Se rétrécit', 'S’élargit', 'Reste identique', 'Disparaît à 50 km/h'], 0, 'Plus on va vite, plus l’angle se réduit.'),
  tf('À chaque vitesse correspond un angle de champ visuel bien précis.', true, 'Le cours donne un tableau vitesse ↔ angle.'),
  q('Le « système VIF » s’applique…', ['Au démarrage', 'Au stationnement', 'Au dépassement', 'Au croisement'], 0, 'VIF = 3 phases de démarrage.'),
];
