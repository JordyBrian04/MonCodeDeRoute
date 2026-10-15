# Mon Code de la Route — Côte d'Ivoire 🇨🇮

Application mobile de préparation au **Code de la Route ivoirien** (React Native + Expo, TypeScript).
Tout le contenu (cours + ~320 questions) vient **exclusivement** des pages de ton document officiel.

## 1. Lancer l'application

```bash
cd MonCodeDeRoute
npm install            # installe les dépendances (package.json mis à jour)
npx expo install --fix # aligne les versions sur le SDK Expo si besoin
npx expo start         # puis scanner le QR code avec Expo Go, ou taper i / a
```

- Typecheck : `npx tsc --noEmit` (doit afficher 0 erreur).
- Sur téléphone : installe **Expo Go**, scanne le QR code (même Wi-Fi que le Mac).
- Simulateur iOS : touche `i` · émulateur Android : touche `a`.

### Notifications locales (Expo Notifications)

- Le plugin `expo-notifications` est déclaré dans `app.json` (couleur, canal Android « rappels »).
- Au premier lancement l'app demande l'autorisation. Tu peux tout régler dans **Accueil → ⚙️ Réglages** :
  interrupteur général, rappel de série, défi du jour, encouragements (chacun avec son **heure** réglable par pas de 15 min),
  rappels d'examens, et un bouton **« Envoyer une notification test »** (arrive en 5 s).
- Principe : l'app planifie les **7 prochains jours** en notifications ponctuelles pour pouvoir personnaliser chaque message
  (série, J-X avant l'examen, nombre d'erreurs, prochaine étape…). Tout est replanifié à l'ouverture et après chaque activité.
  Le rappel de série du jour est annulé si tu as déjà fait ton activité.
- Les notifications locales ne demandent ni serveur ni internet.
- Si elles ne s'affichent pas dans Expo Go sur Android, utilise un build de développement :
  `npx expo run:android` (ou EAS Build). Sur le web elles sont désactivées volontairement.
- iOS : pense à autoriser les notifications pour Expo Go / l'app dans Réglages du téléphone.

## 2. Structure du projet

```
app/                      Expo Router (écrans)
  _layout.tsx             racine : thème, hydratation du store, notifications, célébrations
  (tabs)/                 index (Accueil) · learn (Parcours) · games · exams · profile
  chapter/[id].tsx        lecteur de leçon (+ déblocage du questionnaire)
  quiz.tsx                moteur d'écran de quiz (chapitre, mini, inter, final, blanc, défis…)
  games/                  memory · speed · priorities · match · situations
  settings.tsx · history.tsx
src/
  data/                   10 chapitres (cours + questions), panneaux, situations, scènes de priorité
  features/
    progress/             parcours (17 étapes), déblocage, sélecteurs
    quiz/                 moteur : tirage, mélange, notation, thèmes, contexte
    streak/               logique de série + protection
    gamification/         XP, titres, 19 badges
    notifications/        service (planification) + messages personnalisés
    games/                définition & verrouillage des jeux
  store/                  Zustand + persist (AsyncStorage)
  components/             ui · feedback (confettis, série, célébrations) · quiz · games · lesson · signs
  theme/                  palettes clair/sombre, tokens, ThemeProvider
```

Stack : Expo SDK 57, TypeScript strict, Expo Router, Zustand (persist AsyncStorage), Reanimated 4, Gesture Handler,
Expo Notifications, Expo Haptics, Expo Linear Gradient, react-native-svg (panneaux dessinés en vectoriel).
Design en `StyleSheet` organisé (tokens + thème), architecture modulaire par fonctionnalités.

## 3. Découpe en 10 chapitres (suit ton sommaire)

| # | Chapitre | Pages du document |
|---|----------|-------------------|
| 1 | Le permis de conduire | 2 à 5 |
| 2 | La signalisation routière | 6 à 11 |
| 3 | La route et l'autoroute | 11 à 15 |
| 4 | Arrêt, stationnement, croisement et dépassement | 16 à 18 |
| 5 | Les règles de la circulation | 19 et 20 |
| 6 | Les dégagements (priorités) | 21 à 23 |
| 7 | Le carrefour à sens giratoire | 24 (+ rappels 8 et 14) |
| 8 | Le véhicule automobile | 25 à 32 |
| 9 | La conduite automobile | 33 + 36 |
| 10 | La chaîne cinématique | 34 et 35 |

### Parcours verrouillé (17 étapes, dans cet ordre)

`Ch1 → Ch2 → Mini 1 (ch1-2) → Ch3 → Ch4 → Mini 2 (ch3-4) → Ch5 → Examen intermédiaire (ch1-5) → Ch6 → Mini 3 (ch5-6) → Ch7 → Ch8 → Mini 4 (ch7-8) → Ch9 → Ch10 → Mini 5 (ch9-10) → Examen final (ch1-10)`

Une étape ne s'ouvre que si la précédente est réussie.

| Évaluation | Questions | Tirage | Note pour avancer | Correction |
|---|---|---|---|---|
| Chapitre | 20 | 20 parmi le chapitre | **16/20** (échec → nouveau tirage, questions et réponses mélangées) | immédiate + explication |
| Mini-examen /40 | 40 | 20 par chapitre concerné | 28/40 (70 %) | à la fin |
| Intermédiaire /60 | 60 | 12 par chapitre (1 à 5) | 42/60 (70 %) | à la fin |
| Final /100 | 100 | 10 par chapitre (1 à 10) | 70/100 (70 %) | à la fin |

> Le seuil de 70 % des examens est une hypothèse (ton énoncé ne donne que 16/20 pour les chapitres) :
> modifiable en une ligne dans `src/features/progress/path.ts` (`EXAM_PASS_RATIO`).

## 4. Exemples de questions (extraits réels de l'app)

- **Chapitre 3 (questionnaire /20, correction immédiate)** — « Que signifie le système RAS dans un virage ? »
  → *Ralentir – Avertir – Serrer à droite* · « Dans un virage dangereux, il faut ralentir jusqu'à… » → *40 km/h*.
- **Mini-examen (ch. 5 + 6, /40)** — « Vitesse maximale autorisée en agglomération » → *60 km/h* ·
  « La bleue (qui doit céder) peut passer… » → *quand la route abordée sera libre*.
- **Examen intermédiaire (ch. 1 à 5, /60)** — mélange : permis (catégories/âges), panneaux (formes, couleurs), RASVO, stationnement, vitesses.
- **Examen final (ch. 1 à 10, /100)** — mêmes types, avec en plus véhicule, VIF, chaîne cinématique (les 11 étapes du départ).
- **Examen blanc** — questions tirées de tes chapitres validés, au nombre choisi (10/20/40/60/100).
- **Questions avec panneau dessiné** — le panneau (SVG) s'affiche au-dessus de la question, ex. le losange « route prioritaire ».

Chaque question a 2 à 4 réponses, **une explication** et un chapitre de rattachement (utilisé pour l'analyse des points faibles).

## 5. Examen blanc

- Débloqué après **2 chapitres validés** (onglet Examens).
- Réglages : **nombre de questions** (10 · 20 · 40 · 60 · 100, selon le stock disponible) et **chronomètre** (auto = 45 s/question, ou 10 à 60 min).
- **Pas de retour immédiat** : on peut revenir en arrière pour modifier, puis terminer. À la fin du temps, le test se rend automatiquement.
- Résultat : note, % et durée, **analyse par chapitre** (barres + « points faibles à revoir » + bouton vers le chapitre),
  **correction détaillée** (ta réponse, la bonne, l'explication) filtrable sur les erreurs.
- **Évolution** des scores (histogramme dans Examens et Historique) ; tentatives illimitées. Badges : 1er blanc, 5 blancs, 90 %.

## 6. Série (streak) 🔥

- Une « journée active » = au moins une activité (leçon lue, quiz, jeu, défi). Calcul sur le jour local (Abidjan, pas d'UTC).
- Carte bien visible sur l'Accueil : grosse flamme animée (qui « respire » quand tu es actif aujourd'hui), nombre de jours,
  message d'encouragement qui change selon la durée (1, 3, 7, 14, 21, 30 jours…), **7 derniers jours**, record, protections.
- **Animation spéciale** à chaque augmentation (carte plein écran, flamme qui rebondit, compteur, confettis aux paliers 3/7/14/21/30/50/100).
- **Protection de série** 🧊 (activable dans Réglages) : 1 gagnée tous les 7 jours de série (max 2), utilisée **automatiquement** si tu manques un seul jour.
- Si la série est cassée, elle repart à 1 sans punition cachée ; la flamme grisée sur l'Accueil montre qu'il faut agir aujourd'hui.

## 7. Jeux éducatifs 🎮

Chaque jeu se **débloque quand le chapitre concerné a été lu** (la connaissance d'abord) et rapporte de l'XP + un record.

| Jeu | Débloqué | Principe |
|---|---|---|
| ⚡ Quiz rapide | 1er chapitre lu | 60 s ; bonne réponse +1 (combos) ; erreur = −5 s ; questions de tes chapitres lus |
| 🧠 Memory des panneaux | Chapitre 2 | 6 paires panneau ↔ nom, cartes qui se retournent (3D) ; moins de coups = plus de points ; le sens du panneau s'affiche à chaque paire |
| 🔗 Associer panneau / sens | Chapitre 2 | 3 manches de 5 : touche un panneau puis sa signification ; chaque erreur coûte 1 point |
| 🚗 Jeu des priorités | Chapitre 6 | Carrefour vu de dessus avec panneaux (STOP, cédez, route prioritaire, priorité ponctuelle, priorité à droite) : touche les voitures dans l'ordre de passage (6 scènes, règle + explication après chaque scène) |
| 🎬 Simulations | ≥ 3 situations débloquées | Mini-histoires au volant (virage, intersection, giratoire…) : 3 choix, explication de la règle |

## 8. Défis 📅

- **Défi du jour** : 10 questions identiques pour toute la journée (tirage déterministe sur la date), +XP bonus la 1re fois, compté dans le badge « Habitué du défi ».
- **Défis par thème** (9) : Permis & retraits · Panneaux & feux · Routes & autoroutes · Arrêt, dépassement… · Vitesse & sécurité · Priorités & ronds-points ·
  Voyants & mécanique · Conduite & démarrage · **Chiffres clés** (toutes les valeurs à connaître par cœur). 10 questions, **1 à 3 étoiles** (50 / 80 / 100 %).
- **Mes erreurs** : toutes les questions ratées sont mémorisées ; elles disparaissent quand tu réponds juste.
- **Révision libre** d'un chapitre validé (15 questions, sans pression, 0,5× XP).

## 9. Motivation

XP (≈ 2 points par bonne réponse, bonus 1er succès / score parfait / défi), **6 titres** (Piéton curieux → Élève conducteur → Conducteur prudent → Pilote averti → As du Code → Maître du Code),
**19 badges**, barres de progression partout, score ring animé, confettis, retours haptiques, compte à rebours **J-X** avant ton examen officiel (date réglable, 14 jours par défaut).

## 10. Design system

- **Palette** inspirée du drapeau ivoirien : vert `#0A8F5B`, orange `#F77F00`, blanc ; états succès `#12A150`, erreur `#E03A3A`, alerte `#E5A000`, info `#2478E0`, flamme `#FF6A13`, or `#F2B600`.
- **Clair** : fond `#F6F8F5`, cartes `#FFFFFF`, texte `#14221A`. **Sombre** : fond `#0C1410`, cartes `#15211B`, texte `#EAF3EE`, vert `#2BCB86`, orange `#FF9A2E`.
- Thème : **Système / Clair / Sombre** (réglage manuel + préférence du téléphone). Une couleur par chapitre (identité visuelle).
- **Typographie** (système) : Hero 36/800 · H1 28/800 · H2 22/700 · H3 18/700 · Body 16/400 · Small 14 · Caption 12.
- **Rayons** 8 · 14 · 20 · 28 · pilule ; **espacements** 4 · 8 · 12 · 16 · 24 · 32 ; ombres 3 niveaux (iOS/Android).
- **Composants** : `Screen`, `Card`, `Button` (5 variantes), `PressableScale` (rebond + haptique), `ProgressBar` animée, `ScoreRing`, `Chip`, `Header`,
  `OptionPills`, `SwitchRow`, `TimeStepper`, `QuizOption` (pulse si juste, **shake** si faux), `StreakCard`, `Confetti`, `CelebrationOverlay`, `SignShape` (panneaux SVG).
- **Animations** (Reanimated) : entrées en cascade, barres/anneaux animés, rebonds tactiles, flip 3D des cartes, flamme, confettis, transitions d'écran.

## 11. Remarques sur ton document

- Le sommaire annonce **37 cas de retrait** du permis ; les pages en détaillent **36** (l'app l'indique dans la leçon).
- La formule de la force centrifuge est écrite telle quelle dans le cours (`FC = 4 × V`) ; l'app la reprend.
- Quelques coquilles du document (« déboisement », « statère », « déclenché ») ont été corrigées dans le sens évident (débouchement, starter, enclenchée).
- La page **IMG_5185** est absente de l'archive : si elle contient du contenu, envoie-la et je l'intègre.
- Le cours ne contient pas d'images de panneaux : ils sont **dessinés** à partir de leur description (forme, couleur, symbole), donc approximatifs.
- Les questions ont été vérifiées contre les pages (aucune mauvaise réponse détectée) ; relis-les quand même pendant ton apprentissage et dis-moi si un point t'étonne.
