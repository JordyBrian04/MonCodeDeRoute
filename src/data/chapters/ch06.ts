import type { Chapter, Question } from '../types';
import { qbuilder } from '../qb';
import { S } from '../signs';

export const chapter6: Chapter = {
  id: 6,
  title: 'Les dégagements (priorités)',
  shortTitle: 'Dégagements',
  emoji: '🔀',
  summary: 'Qui passe en premier ? Priorité à droite, céder le passage, priorité de passage, intersections complexes.',
  pages: 'pages 21 à 23',
  sections: [
    {
      id: 'droite',
      title: 'Priorité à droite',
      emoji: '👉',
      blocks: [
        {
          type: 'key',
          title: 'Sans signalisation',
          text: 'Règle : céder le passage aux usagers venant de la droite.',
        },
        {
          type: 'signs',
          title: 'Avec signalisation (triangle + croix)',
          items: [{ sign: S.prioDroite, label: 'À proximité d’une intersection : obligation de céder le passage au véhicule débouchant des routes situées à droite.' }],
        },
        {
          type: 'example',
          title: 'Schéma du cours (3 véhicules)',
          text: 'Trois véhicules arrivent à une intersection sans panneau : la rouge (qui n’a personne à sa droite) passe en premier. Ensuite c’est la bleue. La verte passe en dernier, car elle doit céder à celle qui vient de sa droite.',
        },
        {
          type: 'example',
          title: 'Autre schéma : un véhicule qui tourne',
          text: 'Dans un autre cas du cours, la bleue passe ; la jaune tourne et passe derrière la bleue ; la rouge passe la dernière. Un véhicule qui tourne doit attendre que la voie soit libre.',
        },
      ],
    },
    {
      id: 'ceder',
      title: 'Céder le passage',
      emoji: '🔻',
      blocks: [
        {
          type: 'signs',
          title: 'Perte de priorité',
          items: [
            { sign: S.cedez, label: 'Cédez le passage' },
            { sign: S.stop, label: 'STOP' },
          ],
        },
        { type: 'key', text: 'Règle : je dois céder le passage aux usagers venant de la gauche et de la droite.' },
        {
          type: 'example',
          title: 'Schéma du cours',
          text: 'Les véhicules qui bénéficient d’une priorité ponctuelle (la rouge et la verte) passent d’abord. La bleue passe quand la route abordée sera libre.',
        },
        {
          type: 'example',
          title: 'Schéma du cours (variante)',
          text: 'La bleue passe, la jaune tourne en passant derrière la bleue, puis la rouge et la verte passent.',
        },
        {
          type: 'p',
          text: 'Intersection complexe : STOP avec panonceau-schéma. Les branches prioritaires sont figurées en traits épais sur le panonceau.',
        },
      ],
    },
    {
      id: 'ponctuelle',
      title: 'Priorité ponctuelle et priorité de passage',
      emoji: '⭐',
      blocks: [
        {
          type: 'signs',
          items: [
            { sign: S.prioPonctuelle, label: 'Priorité ponctuelle' },
            { sign: S.routePrioritaire, label: 'Route prioritaire' },
          ],
        },
        {
          type: 'table',
          rows: [
            ['Priorité ponctuelle (« priorité passage »)', 'La route sur laquelle on circule bénéficie d’une priorité ponctuelle, c’est-à-dire valable seulement à l’intersection annoncée.'],
            ['Priorité de passage', 'La route sur laquelle on circule est prioritaire à toutes les intersections (panneau losange).'],
          ],
        },
        {
          type: 'example',
          title: 'Schémas du cours',
          text: 'Priorité ponctuelle : la verte qui en bénéficie passe ; la rouge et la jaune passent quand la route abordée est libre. Autre cas : la rouge passe, la bleue tourne en passant derrière la rouge, la jaune passe dès que la voie est libre.\nPriorité de passage : la bleue (sur route prioritaire) passe ; la rouge et la jaune quand la route prioritaire est libre. Autre cas : la jaune passe, la bleue tourne en passant derrière la jaune, la rouge s’arrête au STOP et repart lorsque la route est libre.',
        },
        {
          type: 'key',
          title: 'Moyen mnémotechnique',
          text: 'Aucun signe → je regarde à droite. Cédez / STOP → je laisse passer tout le monde. Losange → c’est moi qui ai la priorité.',
        },
      ],
    },
  ],
};

const { q, tf } = qbuilder(6);

export const questions6: Question[] = [
  q('Sans signalisation à une intersection, la règle est de…', ['Passer en premier', 'Céder le passage aux usagers venant de la droite', 'Céder le passage aux usagers venant de la gauche', 'S’arrêter 5 secondes'], 1, 'Priorité à droite sans signalisation : céder le passage aux usagers venant de la droite.'),
  q('Quel panneau annonce la priorité à droite à proximité d’une intersection ?', ['Le losange', 'Le triangle avec une croix', 'Le STOP', 'Le panneau bleu'], 1, 'Triangle avec une croix : obligation de céder le passage aux véhicules débouchant des routes situées à droite.', { sign: S.prioDroite }),
  q('Avec la signalisation « priorité à droite », il faut…', ['Céder le passage au véhicule débouchant des routes situées à droite', 'Accélérer', 'Passer sans regarder', 'Klaxonner et passer'], 0, 'À proximité d’une intersection : obligation de céder le passage au véhicule débouchant des routes situées à droite.'),
  q('Trois voitures arrivent à une intersection sans panneau. La rouge n’a personne à sa droite. Qui passe en premier ?', ['La rouge', 'La verte', 'La bleue', 'Toutes ensemble'], 0, 'Celle qui n’a personne à sa droite passe en premier.'),
  q('Vous arrivez à une intersection sans panneau et un véhicule vient de votre droite. Que faites-vous ?', ['Vous passez en premier', 'Vous lui cédez le passage', 'Vous klaxonnez et passez', 'Vous reculez'], 1, 'Priorité à droite : vous cédez le passage à l’usager de droite.'),
  q('Le STOP et le « Cédez le passage » imposent…', ['La priorité de passage', 'La règle de céder le passage (perte de priorité)', 'La priorité à droite', 'Le stationnement'], 1, 'STOP et cédez le passage introduisent la perte de priorité.', { sign: S.stop }),
  q('Avec la règle de céder le passage, je dois céder aux usagers venant…', ['De la gauche et de la droite', 'De la droite seulement', 'De la gauche seulement', 'De l’arrière'], 0, 'Je dois céder le passage aux usagers venant de la gauche et de la droite.'),
  q('Un véhicule qui bénéficie d’une priorité ponctuelle passe…', ['Avant ceux qui doivent céder le passage', 'Après tous les autres', 'En dernier', 'En s’arrêtant'], 0, 'Les véhicules bénéficiant de la priorité ponctuelle passent avant ceux qui doivent céder.'),
  q('Si le véhicule bleu doit céder, quand passe-t-il ?', ['Quand la route abordée est libre', 'Immédiatement', 'Jamais', 'Seulement la nuit'], 0, 'Il passe quand la route abordée sera libre.'),
  q('Que signifie « STOP avec panonceau schéma » ?', ['Un STOP dans une intersection complexe, avec un schéma montrant les branches prioritaires', 'Un parking', 'Une zone de chantier', 'Un feu'], 0, 'Intersection complexe : le panonceau schéma figure les branches prioritaires en traits épais.'),
  q('Sur le panonceau schéma, les branches prioritaires sont figurées…', ['En traits épais', 'En pointillés', 'En rouge uniquement', 'En bleu uniquement'], 0, 'Les branches prioritaires sont figurées en traits épais.'),
  q('La priorité ponctuelle est valable…', ['Seulement à l’intersection annoncée', 'À toutes les intersections', 'Sur toute la route', 'Uniquement en ville'], 0, 'Priorité ponctuelle : valable seulement à l’intersection annoncée.', { sign: S.prioPonctuelle }),
  q('Avec la priorité de passage (route prioritaire), la route sur laquelle on circule est prioritaire…', ['À toutes les intersections', 'Seulement à l’intersection annoncée', 'Jamais', 'De nuit seulement'], 0, 'La route sur laquelle on circule est prioritaire à toutes les intersections.', { sign: S.routePrioritaire }),
  q('Quel panneau indique une route prioritaire ?', ['Le losange', 'Le STOP', 'Le triangle pointe en bas', 'Le rond bleu'], 0, 'Le losange indique une route prioritaire.', { sign: S.routePrioritaire }),
  q('Vous circulez sur une route prioritaire. À l’intersection, un véhicule débouche d’une route avec STOP. Qui passe ?', ['Vous', 'Lui', 'Personne', 'Les deux ensemble'], 0, 'Vous avez la priorité de passage : le véhicule au STOP doit s’arrêter et repartir quand la route est libre.'),
  q('Un véhicule arrive à un STOP. Il doit…', ['S’arrêter et repartir lorsque la route est libre', 'Ralentir seulement', 'Passer sans regarder', 'Klaxonner'], 0, 'La rouge s’arrête au STOP et repart lorsque la route est libre.'),
  q('Quelle règle correspond au panneau « Cédez le passage » ?', ['Priorité à droite', 'Perte de priorité (céder le passage)', 'Priorité de passage', 'Priorité ponctuelle'], 1, 'Le panneau cédez le passage introduit la règle de céder le passage / perte de priorité.', { sign: S.cedez }),
  tf('Un véhicule qui tourne doit passer derrière le véhicule qui continue tout droit, quand c’est celui-ci qui passe.', true, 'Dans les schémas du cours, le véhicule qui tourne passe derrière celui qui a la priorité.'),
  q('À une intersection sans signalisation avec trois véhicules, celui qui passe en dernier est celui qui…', ['Doit céder à un véhicule venant de sa droite', 'N’a personne à sa droite', 'Klaxonne', 'A les phares allumés'], 0, 'Il cède à celui qui vient de sa droite (priorité à droite).'),
  q('Quelle est la règle pour la priorité à droite avec signalisation ?', ['Céder le passage au véhicule débouchant des routes situées à droite', 'Passer sans tenir compte des autres', 'S’arrêter 10 secondes', 'Aller à gauche'], 0, 'Obligation de céder le passage au véhicule débouchant des routes situées à droite.'),
  q('Quelle règle s’applique quand on aborde une intersection sans aucun panneau ni marquage ?', ['La priorité à droite', 'La priorité à gauche', 'La priorité de passage', 'Aucune règle'], 0, 'La priorité à droite s’applique aussi à une intersection sans signalisation.'),
  q('Le cours range « STOP » et « Cédez le passage » dans quelle règle ?', ['Règle de céder le passage ou perte de priorité', 'Priorité à droite', 'Priorité de passage', 'Priorité à gauche'], 0, 'C’est la règle de céder le passage ou la perte de priorité.', { sign: S.stop }),
  q('Un véhicule circule sur une route à priorité ponctuelle et aborde l’intersection annoncée. Il…', ['Passe en premier', 'Cède à tous', 'S’arrête', 'Fait demi-tour'], 0, 'À l’intersection annoncée, la priorité ponctuelle lui donne le passage.'),
  q('Après la priorité ponctuelle, quand les autres véhicules (rouge et jaune) passent-ils ?', ['Quand la route abordée est libre', 'Avant la verte', 'Jamais', 'Sans regarder'], 0, 'La rouge et la jaune passent quand la route abordée sera libre.'),
  q('Pour une intersection avec règle de céder le passage, la bleue (qui doit céder) peut passer…', ['Quand la route abordée sera libre', 'Avant la rouge', 'Quand elle veut', 'En klaxonnant'], 0, 'La bleue passe quand la route abordée sera libre.'),
  q('Dans quel cas le véhicule qui tourne « passe derrière » un autre ?', ['Quand il doit laisser passer le véhicule prioritaire', 'Quand il est pressé', 'Jamais', 'Quand il klaxonne'], 0, 'Il doit laisser passer le véhicule prioritaire et passe derrière lui.'),
];
