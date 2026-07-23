/**
 * Les clubs jouables.
 *
 * niveau   : 1 (élite européenne) → 7 (bas de tableau Nationale)
 * budget   : masse salariale en M€, sert à calculer les salaires proposés
 * prestige : 0-100, détermine les chances de titre et le niveau exigé
 * div      : clé de division (voir DIVISIONS, COMPETS, MATCHS_PAR_DIV)
 * pays     : sert au choix du club de départ et aux filières d'expatriation
 *
 * Pour ajouter un club : garde la cohérence budget/prestige/niveau,
 * sinon le marché des transferts proposera des offres incohérentes.
 * Repères : prestige 90+ = candidat au titre européen, 70-85 = haut de
 * Top 14, 50-65 = Pro D2, 34-48 = Nationale.
 */
export const CLUBS = [
  // ── Top 14 ──────────────────────────────────────────────────────────
  {
    nom: "Toulouse",
    ville: "Toulouse",
    niveau: 1,
    budget: 42,
    prestige: 96,
    pays: "fr",
    div: "Top 14",
  },
  {
    nom: "Bordeaux",
    ville: "Bordeaux",
    niveau: 1,
    budget: 36,
    prestige: 91,
    pays: "fr",
    div: "Top 14",
  },
  {
    nom: "La Rochelle",
    ville: "La Rochelle",
    niveau: 1,
    budget: 38,
    prestige: 88,
    pays: "fr",
    div: "Top 14",
  },
  {
    nom: "Racing",
    ville: "Paris",
    niveau: 1,
    budget: 39,
    prestige: 85,
    pays: "fr",
    div: "Top 14",
  },
  {
    nom: "Stade Français",
    ville: "Paris",
    niveau: 1,
    budget: 34,
    prestige: 85,
    pays: "fr",
    div: "Top 14",
  },
  {
    nom: "Toulon",
    ville: "Toulon",
    niveau: 1,
    budget: 35,
    prestige: 84,
    pays: "fr",
    div: "Top 14",
  },
  {
    nom: "Clermont",
    ville: "Clermont",
    niveau: 1,
    budget: 33,
    prestige: 84,
    pays: "fr",
    div: "Top 14",
  },
  {
    nom: "Montpellier",
    ville: "Montpellier",
    niveau: 2,
    budget: 30,
    prestige: 83,
    pays: "fr",
    div: "Top 14",
  },
  {
    nom: "Pau",
    ville: "Pau",
    niveau: 2,
    budget: 25,
    prestige: 82,
    pays: "fr",
    div: "Top 14",
  },
  {
    nom: "Bayonne",
    ville: "Bayonne",
    niveau: 2,
    budget: 26,
    prestige: 79,
    pays: "fr",
    div: "Top 14",
  },
  {
    nom: "Castres",
    ville: "Castres",
    niveau: 2,
    budget: 27,
    prestige: 78,
    pays: "fr",
    div: "Top 14",
  },
  {
    nom: "Lyon",
    ville: "Lyon",
    niveau: 2,
    budget: 31,
    prestige: 76,
    pays: "fr",
    div: "Top 14",
  },
  {
    nom: "Perpignan",
    ville: "Perpignan",
    niveau: 3,
    budget: 22,
    prestige: 72,
    pays: "fr",
    div: "Top 14",
  },
  {
    nom: "Vannes",
    ville: "Vannes",
    niveau: 3,
    budget: 20,
    prestige: 70,
    pays: "fr",
    div: "Top 14",
  },

  // ── Pro D2 ──────────────────────────────────────────────────────────
  {
    nom: "Grenoble",
    ville: "Grenoble",
    niveau: 3,
    budget: 14,
    prestige: 65,
    pays: "fr",
    div: "Pro D2",
  },
  {
    nom: "Provence",
    ville: "Aix",
    niveau: 3,
    budget: 13,
    prestige: 65,
    pays: "fr",
    div: "Pro D2",
  },
  {
    nom: "Brive",
    ville: "Brive",
    niveau: 4,
    budget: 12,
    prestige: 63,
    pays: "fr",
    div: "Pro D2",
  },
  {
    nom: "Biarritz",
    ville: "Biarritz",
    niveau: 4,
    budget: 10,
    prestige: 62,
    pays: "fr",
    div: "Pro D2",
  },
  {
    nom: "Soyaux-Angoulême",
    ville: "Angoulême",
    niveau: 5,
    budget: 7,
    prestige: 61,
    pays: "fr",
    div: "Pro D2",
  },
  {
    nom: "Oyonnax",
    ville: "Oyonnax",
    niveau: 4,
    budget: 11,
    prestige: 60,
    pays: "fr",
    div: "Pro D2",
  },
  {
    nom: "Colomiers",
    ville: "Colomiers",
    niveau: 4,
    budget: 9,
    prestige: 60,
    pays: "fr",
    div: "Pro D2",
  },
  {
    nom: "Nevers",
    ville: "Nevers",
    niveau: 4,
    budget: 8,
    prestige: 58,
    pays: "fr",
    div: "Pro D2",
  },
  {
    nom: "Agen",
    ville: "Agen",
    niveau: 4,
    budget: 9,
    prestige: 57,
    pays: "fr",
    div: "Pro D2",
  },
  {
    nom: "Béziers",
    ville: "Béziers",
    niveau: 5,
    budget: 8,
    prestige: 55,
    pays: "fr",
    div: "Pro D2",
  },
  {
    nom: "Aurillac",
    ville: "Aurillac",
    niveau: 5,
    budget: 6,
    prestige: 55,
    pays: "fr",
    div: "Pro D2",
  },
  {
    nom: "Montauban",
    ville: "Montauban",
    niveau: 5,
    budget: 7,
    prestige: 54,
    pays: "fr",
    div: "Pro D2",
  },
  {
    nom: "Dax",
    ville: "Dax",
    niveau: 5,
    budget: 6,
    prestige: 52,
    pays: "fr",
    div: "Pro D2",
  },
  {
    nom: "Carcassonne",
    ville: "Carcassonne",
    niveau: 5,
    budget: 6,
    prestige: 51,
    pays: "fr",
    div: "Pro D2",
  },

  // ── Nationale ───────────────────────────────────────────────────────
  // Semi-professionnel : petits budgets, souvent un métier à côté.
  // Le vrai bas de l'échelle, point de départ des profils modestes.
  {
    nom: "Chambéry",
    ville: "Chambéry",
    niveau: 5,
    budget: 4.5,
    prestige: 48,
    pays: "fr",
    div: "Nationale",
  },
  {
    nom: "Narbonne",
    ville: "Narbonne",
    niveau: 5,
    budget: 4.8,
    prestige: 47,
    pays: "fr",
    div: "Nationale",
  },
  {
    nom: "Massy",
    ville: "Massy",
    niveau: 6,
    budget: 4.0,
    prestige: 46,
    pays: "fr",
    div: "Nationale",
  },
  {
    nom: "Bourgoin-Jallieu",
    ville: "Bourgoin",
    niveau: 6,
    budget: 3.8,
    prestige: 45,
    pays: "fr",
    div: "Nationale",
  },
  {
    nom: "Albi",
    ville: "Albi",
    niveau: 6,
    budget: 3.6,
    prestige: 44,
    pays: "fr",
    div: "Nationale",
  },
  {
    nom: "Tarbes",
    ville: "Tarbes",
    niveau: 6,
    budget: 3.4,
    prestige: 43,
    pays: "fr",
    div: "Nationale",
  },
  {
    nom: "Valence Romans",
    ville: "Valence",
    niveau: 6,
    budget: 3.5,
    prestige: 42,
    pays: "fr",
    div: "Nationale",
  },
  {
    nom: "Suresnes",
    ville: "Suresnes",
    niveau: 6,
    budget: 3.2,
    prestige: 41,
    pays: "fr",
    div: "Nationale",
  },
  {
    nom: "Blagnac",
    ville: "Blagnac",
    niveau: 7,
    budget: 2.9,
    prestige: 39,
    pays: "fr",
    div: "Nationale",
  },
  {
    nom: "Nice",
    ville: "Nice",
    niveau: 7,
    budget: 2.7,
    prestige: 37,
    pays: "fr",
    div: "Nationale",
  },
  {
    nom: "Périgueux",
    ville: "Périgueux",
    niveau: 7,
    budget: 2.6,
    prestige: 36,
    pays: "fr",
    div: "Nationale",
  },
  {
    nom: "Bourg-en-Bresse",
    ville: "Bourg",
    niveau: 7,
    budget: 2.4,
    prestige: 34,
    pays: "fr",
    div: "Nationale",
  },

  // ── Premiership (Angleterre) ────────────────────────────────────────
  // Salary cap strict : moins d'écart entre les clubs qu'en France.
  {
    nom: "Saracens",
    ville: "Londres",
    niveau: 1,
    budget: 30,
    prestige: 88,
    pays: "en",
    div: "Premiership",
  },
  {
    nom: "Northampton",
    ville: "Northampton",
    niveau: 1,
    budget: 28,
    prestige: 85,
    pays: "en",
    div: "Premiership",
  },
  {
    nom: "Bath",
    ville: "Bath",
    niveau: 2,
    budget: 26,
    prestige: 84,
    pays: "en",
    div: "Premiership",
  },
  {
    nom: "Leicester",
    ville: "Leicester",
    niveau: 2,
    budget: 27,
    prestige: 82,
    pays: "en",
    div: "Premiership",
  },
  {
    nom: "Harlequins",
    ville: "Londres",
    niveau: 2,
    budget: 26,
    prestige: 80,
    pays: "en",
    div: "Premiership",
  },
  {
    nom: "Sale",
    ville: "Manchester",
    niveau: 2,
    budget: 25,
    prestige: 78,
    pays: "en",
    div: "Premiership",
  },
  {
    nom: "Bristol",
    ville: "Bristol",
    niveau: 2,
    budget: 25,
    prestige: 76,
    pays: "en",
    div: "Premiership",
  },
  {
    nom: "Exeter",
    ville: "Exeter",
    niveau: 3,
    budget: 23,
    prestige: 74,
    pays: "en",
    div: "Premiership",
  },
  {
    nom: "Gloucester",
    ville: "Gloucester",
    niveau: 3,
    budget: 23,
    prestige: 72,
    pays: "en",
    div: "Premiership",
  },
  {
    nom: "Newcastle",
    ville: "Newcastle",
    niveau: 3,
    budget: 20,
    prestige: 66,
    pays: "en",
    div: "Premiership",
  },

  // ── URC (Irlande, Écosse, Galles, Italie, Afrique du Sud) ────────────
  // Le championnat le plus international : cinq pays, un seul plateau.
  {
    nom: "Leinster",
    ville: "Dublin",
    niveau: 1,
    budget: 34,
    prestige: 94,
    pays: "ie",
    div: "URC",
  },
  {
    nom: "Munster",
    ville: "Limerick",
    niveau: 1,
    budget: 27,
    prestige: 84,
    pays: "ie",
    div: "URC",
  },
  {
    nom: "Bulls",
    ville: "Pretoria",
    niveau: 2,
    budget: 21,
    prestige: 82,
    pays: "za",
    div: "URC",
  },
  {
    nom: "Stormers",
    ville: "Le Cap",
    niveau: 2,
    budget: 20,
    prestige: 81,
    pays: "za",
    div: "URC",
  },
  {
    nom: "Glasgow",
    ville: "Glasgow",
    niveau: 2,
    budget: 20,
    prestige: 79,
    pays: "sc",
    div: "URC",
  },
  {
    nom: "Sharks",
    ville: "Durban",
    niveau: 2,
    budget: 20,
    prestige: 78,
    pays: "za",
    div: "URC",
  },
  {
    nom: "Ulster",
    ville: "Belfast",
    niveau: 2,
    budget: 22,
    prestige: 76,
    pays: "ie",
    div: "URC",
  },
  {
    nom: "Édimbourg",
    ville: "Édimbourg",
    niveau: 3,
    budget: 18,
    prestige: 72,
    pays: "sc",
    div: "URC",
  },
  {
    nom: "Connacht",
    ville: "Galway",
    niveau: 3,
    budget: 17,
    prestige: 68,
    pays: "ie",
    div: "URC",
  },
  {
    nom: "Lions",
    ville: "Johannesburg",
    niveau: 3,
    budget: 16,
    prestige: 68,
    pays: "za",
    div: "URC",
  },
  {
    nom: "Ospreys",
    ville: "Swansea",
    niveau: 3,
    budget: 15,
    prestige: 67,
    pays: "wa",
    div: "URC",
  },
  {
    nom: "Cardiff",
    ville: "Cardiff",
    niveau: 3,
    budget: 15,
    prestige: 66,
    pays: "wa",
    div: "URC",
  },
  {
    nom: "Scarlets",
    ville: "Llanelli",
    niveau: 3,
    budget: 14,
    prestige: 65,
    pays: "wa",
    div: "URC",
  },
  {
    nom: "Benetton",
    ville: "Trévise",
    niveau: 3,
    budget: 13,
    prestige: 64,
    pays: "it",
    div: "URC",
  },
  {
    nom: "Zebre",
    ville: "Parme",
    niveau: 4,
    budget: 9,
    prestige: 52,
    pays: "it",
    div: "URC",
  },

  // ── Super Rugby (Nouvelle-Zélande, Australie, Pacifique) ─────────────
  // Budgets faibles, niveau de jeu très haut : on y va pour le rugby,
  // pas pour l'argent. Saison courte mais intensité maximale.
  {
    nom: "Crusaders",
    ville: "Christchurch",
    niveau: 1,
    budget: 22,
    prestige: 93,
    pays: "nz",
    div: "Super Rugby",
  },
  {
    nom: "Blues",
    ville: "Auckland",
    niveau: 1,
    budget: 20,
    prestige: 86,
    pays: "nz",
    div: "Super Rugby",
  },
  {
    nom: "Chiefs",
    ville: "Hamilton",
    niveau: 2,
    budget: 19,
    prestige: 85,
    pays: "nz",
    div: "Super Rugby",
  },
  {
    nom: "Hurricanes",
    ville: "Wellington",
    niveau: 2,
    budget: 19,
    prestige: 83,
    pays: "nz",
    div: "Super Rugby",
  },
  {
    nom: "Brumbies",
    ville: "Canberra",
    niveau: 2,
    budget: 17,
    prestige: 80,
    pays: "au",
    div: "Super Rugby",
  },
  {
    nom: "Highlanders",
    ville: "Dunedin",
    niveau: 3,
    budget: 16,
    prestige: 74,
    pays: "nz",
    div: "Super Rugby",
  },
  {
    nom: "Reds",
    ville: "Brisbane",
    niveau: 3,
    budget: 16,
    prestige: 73,
    pays: "au",
    div: "Super Rugby",
  },
  {
    nom: "Waratahs",
    ville: "Sydney",
    niveau: 3,
    budget: 16,
    prestige: 72,
    pays: "au",
    div: "Super Rugby",
  },
  {
    nom: "Force",
    ville: "Perth",
    niveau: 4,
    budget: 13,
    prestige: 62,
    pays: "au",
    div: "Super Rugby",
  },
  {
    nom: "Fijian Drua",
    ville: "Suva",
    niveau: 4,
    budget: 10,
    prestige: 60,
    pays: "fj",
    div: "Super Rugby",
  },
  {
    nom: "Moana Pasifika",
    ville: "Auckland",
    niveau: 4,
    budget: 10,
    prestige: 55,
    pays: "nz",
    div: "Super Rugby",
  },

  // ── League One (Japon) ──────────────────────────────────────────────
  // Gros salaires, peu de matchs, prestige sportif limité.
  // La destination de fin de carrière par excellence.
  {
    nom: "Saitama Wild Knights",
    ville: "Saitama",
    niveau: 3,
    budget: 31,
    prestige: 64,
    pays: "jp",
    div: "League One",
  },
  {
    nom: "Tokyo Sungoliath",
    ville: "Tokyo",
    niveau: 3,
    budget: 30,
    prestige: 62,
    pays: "jp",
    div: "League One",
  },
  {
    nom: "Toshiba Brave Lupus",
    ville: "Tokyo",
    niveau: 3,
    budget: 29,
    prestige: 61,
    pays: "jp",
    div: "League One",
  },
  {
    nom: "Kobe Steelers",
    ville: "Kobe",
    niveau: 3,
    budget: 28,
    prestige: 58,
    pays: "jp",
    div: "League One",
  },
  {
    nom: "Kubota Spears",
    ville: "Funabashi",
    niveau: 4,
    budget: 27,
    prestige: 57,
    pays: "jp",
    div: "League One",
  },
  {
    nom: "Yokohama Eagles",
    ville: "Yokohama",
    niveau: 4,
    budget: 26,
    prestige: 56,
    pays: "jp",
    div: "League One",
  },
  {
    nom: "Shizuoka Blue Revs",
    ville: "Shizuoka",
    niveau: 4,
    budget: 24,
    prestige: 52,
    pays: "jp",
    div: "League One",
  },
  {
    nom: "Black Rams",
    ville: "Tokyo",
    niveau: 4,
    budget: 23,
    prestige: 50,
    pays: "jp",
    div: "League One",
  },
];

/**
 * Métadonnées par division — c'est ici que les championnats se différencient
 * vraiment, au-delà du simple nom.
 *
 * libelle   : nom lisible
 * article   : "du ", "de ", "de l'" — évite "meilleur joueur du URC"
 * matchs    : volume d'une saison pleine
 * usure     : multiplicateur d'usure propre au championnat.
 *             Top 14 = référence (1.00). Super Rugby très intense mais
 *             saison courte, League One doux, Nationale = terrains gras
 *             et staff médical réduit.
 * selection : visibilité pour la sélection nationale. Jouer en Nationale
 *             ou au Japon ferme quasiment la porte de l'équipe nationale.
 * salaire   : multiplicateur appliqué aux offres de contrat.
 *
 * Note : `usure` et `selection` ne sont pas encore lus par engine/ —
 * à câbler dans saison.js (charge d'usure + seuil de sélection) et
 * marche.js (calcul du salaire proposé).
 */
export const DIVISIONS = {
  "Top 14": {
    libelle: "Top 14",
    article: "du ",
    matchs: 30,
    usure: 1.0,
    selection: 1.0,
    salaire: 1.0,
  },
  "Pro D2": {
    libelle: "Pro D2",
    article: "de ",
    matchs: 30,
    usure: 0.95,
    selection: 0.45,
    salaire: 0.7,
  },
  Nationale: {
    libelle: "Nationale",
    article: "de ",
    matchs: 26,
    usure: 1.05,
    selection: 0.1,
    salaire: 0.35,
  },
  Premiership: {
    libelle: "Premiership",
    article: "de ",
    matchs: 26,
    usure: 1.0,
    selection: 0.95,
    salaire: 0.9,
  },
  URC: {
    libelle: "URC",
    article: "de l'",
    matchs: 24,
    usure: 0.92,
    selection: 0.95,
    salaire: 0.8,
  },
  "Super Rugby": {
    libelle: "Super Rugby",
    article: "de ",
    matchs: 18,
    usure: 1.12,
    selection: 1.05,
    salaire: 0.65,
  },
  "League One": {
    libelle: "League One",
    article: "de ",
    matchs: 16,
    usure: 0.75,
    selection: 0.25,
    salaire: 1.35,
  },
};

/** Trophées disponibles selon la division du club. */
export const COMPETS = {
  "Top 14": ["Bouclier de Brennus", "Champions Cup", "Challenge Cup"],
  "Pro D2": ["Titre de Pro D2", "Accession en Top 14"],
  Nationale: ["Titre de Nationale", "Accession en Pro D2"],
  Premiership: ["Premiership", "Champions Cup", "Challenge Cup"],
  URC: ["URC", "Champions Cup", "Challenge Cup"],
  "Super Rugby": ["Super Rugby Pacific"],
  "League One": ["League One"],
};

/** Nombre de matchs par saison, dérivé de DIVISIONS. */
export const MATCHS_PAR_DIV = Object.fromEntries(
  Object.entries(DIVISIONS).map(([cle, d]) => [cle, d.matchs]),
);

/** Métadonnées d'une division, avec repli sûr si la clé est inconnue. */
export const infosDiv = (div) =>
  DIVISIONS[div] || {
    libelle: div,
    article: "de ",
    matchs: 26,
    usure: 1,
    selection: 1,
    salaire: 1,
  };

/** "du Top 14", "de l'URC", "de Nationale" — pour les phrases du journal. */
export const nomDivision = (div) => {
  const d = infosDiv(div);
  return `${d.article}${d.libelle}`;
};

/** Helpers pratiques si tu ajoutes des règles liées aux clubs. */
export const getClub = (nom) => CLUBS.find((c) => c.nom === nom);
export const clubsParPays = (pays) => CLUBS.filter((c) => c.pays === pays);
export const clubsParDiv = (div) => CLUBS.filter((c) => c.div === div);

/**
 * Filières d'expatriation : où part un jeune dont le pays n'a pas de
 * plateau professionnel à son niveau. Reflète les routes réelles —
 * les Géorgiens et Argentins passent par la France, les Fidjiens par
 * le Pacifique puis l'Europe.
 */
const FILIERES = {
  ge: ["Pro D2", "Nationale", "Top 14"],
  ar: ["Pro D2", "Top 14", "Premiership"],
  fj: ["Super Rugby", "Pro D2", "Nationale"],
  it: ["URC", "Pro D2", "Nationale"],
  za: ["URC", "Pro D2"],
  nz: ["Super Rugby", "League One"],
  au: ["Super Rugby", "League One"],
  fr: ["Pro D2", "Nationale"],
  en: ["Premiership", "Pro D2"],
  ie: ["URC", "Premiership"],
  sc: ["URC", "Premiership"],
  wa: ["URC", "Premiership"],
};

/**
 * Éventail de premiers clubs proposés à un jeune de 18 ans, du plus
 * modeste au plus huppé. Un club par tranche de prestige, tiré au hasard
 * dans sa tranche : deux parties ne proposent pas les mêmes clubs, mais
 * il y a toujours un vrai choix — jouer beaucoup en bas, ou se battre
 * pour du temps de jeu dans une meilleure équipe.
 */
export function clubsDeDepart(nationId, n = 3) {
  let pool = CLUBS.filter((c) => c.pays === nationId && c.prestige <= 75);

  // Nations sans plateau propre à ce niveau : le joueur part à l'étranger
  // par la filière habituelle de son pays, plutôt qu'au hasard sur la
  // planète. Un Géorgien atterrit en Pro D2, pas aux Fidji.
  if (pool.length < n) {
    const filiere = FILIERES[nationId] || ["Pro D2", "Nationale"];
    const appoint = CLUBS.filter(
      (c) => filiere.includes(c.div) && c.prestige <= 68 && !pool.includes(c),
    );
    pool = [...pool, ...appoint];
  }

  pool = [...pool].sort((a, b) => a.prestige - b.prestige);
  if (pool.length <= n) return pool;

  const taille = pool.length / n;
  const choisis = [];
  for (let i = 0; i < n; i++) {
    const debut = Math.floor(i * taille);
    const fin = Math.max(Math.floor((i + 1) * taille), debut + 1);
    const tranche = pool.slice(debut, fin);
    choisis.push(tranche[Math.floor(Math.random() * tranche.length)]);
  }
  return choisis;
}
