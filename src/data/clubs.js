/**
 * Les clubs jouables.
 *
 * niveau   : 1 (élite européenne) → 5 (bas de tableau Pro D2)
 * budget   : masse salariale en M€, sert à calculer les salaires proposés
 * prestige : 0-100, détermine les chances de titre et le niveau exigé
 * div      : clé utilisée pour retrouver les compétitions (voir COMPETS)
 *
 * Pour ajouter un club : garde la cohérence budget/prestige/niveau,
 * sinon le marché des transferts proposera des offres incohérentes.
 */
export const CLUBS = [
  // ── Top 14 ──
  { nom: "Toulouse", ville: "Toulouse", niveau: 1, budget: 42, prestige: 96, pays: "fr", div: "Top 14" },
  { nom: "La Rochelle", ville: "La Rochelle", niveau: 1, budget: 38, prestige: 90, pays: "fr", div: "Top 14" },
  { nom: "Bordeaux", ville: "Bordeaux", niveau: 1, budget: 36, prestige: 87, pays: "fr", div: "Top 14" },
  { nom: "Racing", ville: "Paris", niveau: 1, budget: 39, prestige: 85, pays: "fr", div: "Top 14" },
  { nom: "Toulon", ville: "Toulon", niveau: 1, budget: 35, prestige: 84, pays: "fr", div: "Top 14" },
  { nom: "Stade Français", ville: "Paris", niveau: 1, budget: 34, prestige: 83, pays: "fr", div: "Top 14" },
  { nom: "Clermont", ville: "Clermont", niveau: 1, budget: 33, prestige: 82, pays: "fr", div: "Top 14" },
  { nom: "Lyon", ville: "Lyon", niveau: 2, budget: 31, prestige: 76, pays: "fr", div: "Top 14" },
  { nom: "Montpellier", ville: "Montpellier", niveau: 2, budget: 30, prestige: 75, pays: "fr", div: "Top 14" },
  { nom: "Castres", ville: "Castres", niveau: 2, budget: 27, prestige: 73, pays: "fr", div: "Top 14" },
  { nom: "Bayonne", ville: "Bayonne", niveau: 2, budget: 26, prestige: 70, pays: "fr", div: "Top 14" },
  { nom: "Pau", ville: "Pau", niveau: 2, budget: 25, prestige: 66, pays: "fr", div: "Top 14" },
  { nom: "Perpignan", ville: "Perpignan", niveau: 3, budget: 22, prestige: 62, pays: "fr", div: "Top 14" },
  { nom: "Vannes", ville: "Vannes", niveau: 3, budget: 20, prestige: 55, pays: "fr", div: "Top 14" },

  // ── Pro D2 ──
  { nom: "Grenoble", ville: "Grenoble", niveau: 3, budget: 14, prestige: 50, pays: "fr", div: "Pro D2" },
  { nom: "Provence", ville: "Aix", niveau: 3, budget: 13, prestige: 48, pays: "fr", div: "Pro D2" },
  { nom: "Oyonnax", ville: "Oyonnax", niveau: 4, budget: 11, prestige: 44, pays: "fr", div: "Pro D2" },
  { nom: "Mont-de-Marsan", ville: "Mont-de-Marsan", niveau: 4, budget: 10, prestige: 42, pays: "fr", div: "Pro D2" },
  { nom: "Agen", ville: "Agen", niveau: 4, budget: 9, prestige: 40, pays: "fr", div: "Pro D2" },
  { nom: "Colomiers", ville: "Colomiers", niveau: 4, budget: 9, prestige: 38, pays: "fr", div: "Pro D2" },
  { nom: "Nevers", ville: "Nevers", niveau: 4, budget: 8, prestige: 36, pays: "fr", div: "Pro D2" },
  { nom: "Béziers", ville: "Béziers", niveau: 5, budget: 8, prestige: 35, pays: "fr", div: "Pro D2" },
  { nom: "Soyaux-Angoulême", ville: "Angoulême", niveau: 5, budget: 7, prestige: 32, pays: "fr", div: "Pro D2" },
  { nom: "Aurillac", ville: "Aurillac", niveau: 5, budget: 6, prestige: 30, pays: "fr", div: "Pro D2" },

  // ── Étranger ──
  { nom: "Leinster", ville: "Dublin", niveau: 1, budget: 34, prestige: 94, pays: "ie", div: "URC" },
  { nom: "Crusaders", ville: "Christchurch", niveau: 1, budget: 22, prestige: 92, pays: "nz", div: "Super Rugby" },
  { nom: "Saracens", ville: "Londres", niveau: 1, budget: 30, prestige: 86, pays: "en", div: "Premiership" },
  { nom: "Stormers", ville: "Le Cap", niveau: 2, budget: 20, prestige: 80, pays: "za", div: "URC" },
  { nom: "Bath", ville: "Bath", niveau: 2, budget: 26, prestige: 78, pays: "en", div: "Premiership" },
  { nom: "Tokyo Sungoliath", ville: "Tokyo", niveau: 3, budget: 30, prestige: 60, pays: "jp", div: "League One" },
  { nom: "Kobe Steelers", ville: "Kobe", niveau: 3, budget: 28, prestige: 58, pays: "jp", div: "League One" },
];

/** Trophées disponibles selon la division du club. */
export const COMPETS = {
  "Top 14": ["Bouclier de Brennus", "Champions Cup", "Challenge Cup"],
  "Pro D2": ["Titre Pro D2", "Accession"],
  "URC": ["URC", "Champions Cup"],
  "Premiership": ["Premiership", "Champions Cup"],
  "Super Rugby": ["Super Rugby"],
  "League One": ["League One"],
};

/** Nombre de matchs par saison selon la division. */
export const MATCHS_PAR_DIV = {
  "Top 14": 30,
  "Pro D2": 30,
  "URC": 26,
  "Premiership": 26,
  "Super Rugby": 20,
  "League One": 18,
};

/** Helpers pratiques si tu ajoutes des règles liées aux clubs. */
export const getClub = (nom) => CLUBS.find((c) => c.nom === nom);
export const clubsParPays = (pays) => CLUBS.filter((c) => c.pays === pays);
