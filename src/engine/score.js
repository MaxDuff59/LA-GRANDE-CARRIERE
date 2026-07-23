/**
 * Barème du score final.
 * C'est ici qu'on équilibre : si les carrières "Coupe du Monde"
 * écrasent tout, baisse VALEUR_TITRES. Ajuste après quelques parties.
 */
const VALEUR_TITRES = {
  "Coupe du Monde": 1400,
  "Champions Cup": 700,
  "Bouclier de Brennus": 650,
  "Tournoi des Six Nations": 450,
  "URC": 400,
  "Premiership": 400,
  "Super Rugby": 400,
  "Challenge Cup": 300,
  "League One": 200,
  "Titre Pro D2": 180,
  "Accession": 150,
};
const TITRE_DEFAUT = 250;

const POINTS = {
  parMatch: 4,
  parEssai: 14,
  parSelection: 22,
  parDistinction: 180,
  parNoteFinale: 12,
  bonusCapitaine: 300,
  malusScandale: -400,
};

/**
 * Les essais sont normalisés par le taux attendu au poste : un pilier
 * à 15 essais en carrière a autant de mérite qu'un ailier à 80.
 * Sans ça, les postes d'avants sont structurellement désavantagés.
 */
function scoreEssais(s) {
  const reference = 0.30; // taux d'essais d'un centre, poste médian
  const ratio = reference / Math.max(s.poste.essaiRate, 0.05);
  return s.carriere.essais * POINTS.parEssai * ratio;
}

export function calculerScore(s) {
  let score = 0;

  score += s.carriere.matchs * POINTS.parMatch;
  score += scoreEssais(s);
  score += s.internationalCaps * POINTS.parSelection;
  score += s.carriere.distinctions.length * POINTS.parDistinction;
  score += Math.round(s.note * POINTS.parNoteFinale);

  for (const t of s.carriere.titres) {
    score += VALEUR_TITRES[t.nom] ?? TITRE_DEFAUT;
  }

  // Bonus de longévité, pondéré par la dureté du poste : tenir 15 saisons
  // en première ligne vaut plus que 15 saisons à l'aile.
  const saisons = s.carriere.saisons.length;
  score += Math.round(saisons * 40 * s.poste.usure);

  if (s.capitaine) score += POINTS.bonusCapitaine;
  if (s.flags.scandale) score += POINTS.malusScandale;

  return Math.max(0, Math.round(score));
}

/**
 * Paliers calibrés sur la distribution réelle (voir test-moteur.mjs).
 * Objectif : "Légende absolue" doit rester à ~2 % des carrières, et la
 * médiane doit tomber sur "International solide". Si tu modifies le
 * barème au-dessus, relance le test et recale ces seuils.
 */
const RANGS = [
  { min: 7800, titre: "LÉGENDE ABSOLUE", couleur: "#E8C547" },
  { min: 5900, titre: "ICÔNE", couleur: "#E8C547" },
  { min: 4900, titre: "GRAND JOUEUR", couleur: "#7FB069" },
  { min: 3900, titre: "INTERNATIONAL SOLIDE", couleur: "#7FB069" },
  { min: 2800, titre: "BON PROFESSIONNEL", couleur: "#9BA7B4" },
  { min: 1300, titre: "CARRIÈRE HONNÊTE", couleur: "#9BA7B4" },
  { min: 0, titre: "PASSAGE ÉCLAIR", couleur: "#8A7F76" },
];

export function rang(score) {
  return RANGS.find((r) => score >= r.min);
}

/** Jetons gagnés en fin de carrière (hors Défi du jour). */
export function jetonsGagnes(score) {
  return Math.floor(score / 650) + 1;
}
