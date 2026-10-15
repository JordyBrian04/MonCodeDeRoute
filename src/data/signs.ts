import type { SignDef, SignSpec } from './types';

const RED = '#D62828';
const BLUE = '#1D5FBF';
const GREEN = '#1F8A4C';
const YELLOW = '#F5C518';
const WHITE = '#FFFFFF';
const BLACK = '#111111';

export const S: Record<string, SignSpec> = {
  danger: { shape: 'triangle', border: RED, fill: WHITE, glyph: 'exclam', glyphColor: BLACK },
  interdiction: { shape: 'circle', border: RED, fill: WHITE, text: '50', textColor: BLACK },
  obligation: { shape: 'circle', border: BLUE, fill: BLUE, glyph: 'arrowUp', glyphColor: WHITE },
  stationnement: { shape: 'circle', border: RED, fill: BLUE, slash: true },
  indication: { shape: 'square', border: BLUE, fill: BLUE, text: 'P', textColor: WHITE },
  temporaire: { shape: 'triangle', border: RED, fill: YELLOW, glyph: 'exclam', glyphColor: BLACK },
  dirAutoroute: { shape: 'rect', border: BLUE, fill: BLUE, text: 'A', textColor: WHITE },
  dirNationale: { shape: 'rect', border: GREEN, fill: GREEN, text: 'N', textColor: WHITE },
  dirAgglo: { shape: 'rect', border: '#9AA5A0', fill: WHITE, text: 'Ville', textColor: BLACK },
  prioDroite: { shape: 'triangle', border: RED, fill: WHITE, glyph: 'cross', glyphColor: BLACK },
  routePrioritaire: { shape: 'diamond', border: WHITE, fill: YELLOW, outline: '#222222' },
  prioPonctuelle: { shape: 'triangle', border: RED, fill: WHITE, glyph: 'priority', glyphColor: BLACK },
  stop: { shape: 'octagon', border: WHITE, fill: RED, text: 'STOP', textColor: WHITE, outline: RED },
  cedez: { shape: 'triangleDown', border: RED, fill: WHITE },
  giratoire: { shape: 'triangle', border: RED, fill: WHITE, glyph: 'roundabout', glyphColor: BLACK },
};

/** Panneaux utilisés dans les jeux (memory, association). Les catégories viennent du cours. */
export const SIGN_DEFS: SignDef[] = [
  { id: 'danger', name: 'Signal de danger', meaning: 'Triangle, bordure rouge, fond blanc : vigilance spéciale, ralentir', spec: S.danger, category: 'Danger' },
  { id: 'interdiction', name: 'Interdiction', meaning: 'Rond, bordure rouge, fond blanc, symbole noir : prescription absolue', spec: S.interdiction, category: 'Prescription' },
  { id: 'obligation', name: 'Obligation', meaning: 'Rond, fond bleu, symbole blanc : prescription absolue', spec: S.obligation, category: 'Prescription' },
  { id: 'stationnement', name: 'Stationnement', meaning: 'Rond, bordure rouge, fond bleu barré d’une barre oblique rouge', spec: S.stationnement, category: 'Prescription' },
  { id: 'indication', name: 'Simple indication', meaning: 'Carré ou rectangle, fond bleu ou blanc : renseigne l’usager', spec: S.indication, category: 'Indication' },
  { id: 'temporaire', name: 'Signal temporaire', meaning: 'Triangle, bordure rouge, fond jaune : chantier / situation temporaire', spec: S.temporaire, category: 'Temporaire' },
  { id: 'autoroute', name: 'Direction : autoroute', meaning: 'Panneau de direction à fond bleu : autoroute (A)', spec: S.dirAutoroute, category: 'Direction' },
  { id: 'nationale', name: 'Direction : route nationale', meaning: 'Panneau de direction à fond vert : route nationale (N)', spec: S.dirNationale, category: 'Direction' },
  { id: 'agglo', name: 'Direction : agglomération', meaning: 'Panneau de direction à fond blanc : en agglomération', spec: S.dirAgglo, category: 'Direction' },
  { id: 'prioDroite', name: 'Priorité à droite', meaning: 'Triangle avec une croix : je cède à tout usager venant de ma droite', spec: S.prioDroite, category: 'Priorité' },
  { id: 'routePrioritaire', name: 'Route prioritaire', meaning: 'Losange : priorité de passage à toutes les intersections', spec: S.routePrioritaire, category: 'Priorité' },
  { id: 'prioPonctuelle', name: 'Priorité ponctuelle', meaning: 'Priorité valable seulement à l’intersection annoncée', spec: S.prioPonctuelle, category: 'Priorité' },
  { id: 'stop', name: 'STOP', meaning: 'Perte de priorité : arrêt obligatoire, je cède à gauche et à droite', spec: S.stop, category: 'Priorité' },
  { id: 'cedez', name: 'Cédez le passage', meaning: 'Perte de priorité : je laisse passer les usagers de gauche et de droite', spec: S.cedez, category: 'Priorité' },
  { id: 'giratoire', name: 'Carrefour à sens giratoire', meaning: 'Rond-point : priorité à gauche (aux véhicules déjà dans l’anneau) si marquage au sol', spec: S.giratoire, category: 'Priorité' },
];
