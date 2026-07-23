/**
 * Les quatre axes de personnalisation hors poste.
 * Chacun modifie les attributs de départ et/ou la simulation.
 */

/**
 * mod        : bonus/malus appliqués aux attributs de départ (sur 100)
 * selecDiff  : multiplicateur du seuil de sélection nationale
 *              (1.45 = il faut être 45 % meilleur pour être appelé)
 */
export const NATIONS = [
  {
    id: "fr", nom: "France", flag: "🇫🇷", tier: 1,
    desc: "Le Top 14 sous les yeux. Concurrence maximale.",
    mod: { technique: 3, vision: 3 },
    selecDiff: 1.0,
  },
  {
    id: "nz", nom: "Nouvelle-Zélande", flag: "🇳🇿", tier: 1,
    desc: "Né avec un ballon. Mais 5 millions de concurrents.",
    mod: { technique: 7, vision: 7, vitesse: 3 },
    selecDiff: 1.45,
  },
  {
    id: "za", nom: "Afrique du Sud", flag: "🇿🇦", tier: 1,
    desc: "Le combat d'abord. Physique hors norme.",
    mod: { puissance: 10, mental: 3 },
    selecDiff: 1.35,
  },
  {
    id: "ie", nom: "Irlande", flag: "🇮🇪", tier: 1,
    desc: "Discipline, structure, intelligence de jeu.",
    mod: { vision: 7, mental: 7 },
    selecDiff: 1.15,
  },
  {
    id: "ar", nom: "Argentine", flag: "🇦🇷", tier: 1,
    desc: "La mêlée dans le sang, l'exil comme destin.",
    mod: { puissance: 7, mental: 7 },
    selecDiff: 0.85,
  },
  {
    id: "fj", nom: "Fidji", flag: "🇫🇯", tier: 2,
    desc: "Talent brut, offload magique. Structures fragiles.",
    mod: { vitesse: 10, technique: 7, endurance: -3 },
    selecDiff: 0.55,
  },
  {
    id: "ge", nom: "Géorgie", flag: "🇬🇪", tier: 2,
    desc: "Une nation de piliers. Peu de vitrine.",
    mod: { puissance: 10, endurance: 3, vision: -3 },
    selecDiff: 0.50,
  },
  {
    id: "it", nom: "Italie", flag: "🇮🇹", tier: 2,
    desc: "Le Tournoi tous les ans. Les victoires, moins souvent.",
    mod: { mental: 3, puissance: 3 },
    selecDiff: 0.65,
  },
];

/**
 * argent : capital de départ en k€
 * hype   : réputation de départ
 */
export const ORIGINES = [
  {
    id: "formation", nom: "Centre de formation",
    desc: "Structuré depuis 14 ans. Tout est cadré.",
    mod: { technique: 10, mental: 7 }, argent: 0, hype: 5,
  },
  {
    id: "village", nom: "Club de village",
    desc: "Terrain gras, troisième mi-temps, apprentissage brut.",
    mod: { puissance: 7, mental: 10, technique: -3 }, argent: 0, hype: -5,
  },
  {
    id: "reconversion", nom: "Reconversion athlétique",
    desc: "Sprinteur avant. Rugby découvert à 17 ans.",
    mod: { vitesse: 17, endurance: 7, technique: -13, vision: -10 }, argent: 0, hype: 0,
  },
  {
    id: "fils", nom: "Fils de joueur pro",
    desc: "Le nom ouvre des portes. Et attire les regards.",
    mod: { vision: 10, mental: -7 }, argent: 40, hype: 20,
  },
  {
    id: "iles", nom: "Filière îles du Pacifique",
    desc: "Arrivé à 18 ans, sans repères, avec le feu.",
    mod: { puissance: 7, vitesse: 10, mental: 10, vision: -7 }, argent: -10, hype: 5,
  },
];

/**
 * usure    : multiplicateur d'usure par saison
 * progress : multiplicateur de progression des attributs
 */
export const HYGIENES = [
  {
    id: "pro", nom: "Pro absolu",
    desc: "Sommeil, diète, kiné. Aucune fantaisie.",
    usure: 0.78, progress: 1.18, reput: 6, moral: -4,
  },
  {
    id: "equilibre", nom: "Équilibré",
    desc: "Sérieux à l'entraînement, vivant en dehors.",
    usure: 1.0, progress: 1.0, reput: 0, moral: 0,
  },
  {
    id: "fetard", nom: "Bon vivant",
    desc: "Troisième mi-temps sacrée. Le vestiaire t'adore.",
    usure: 1.28, progress: 0.86, reput: -6, moral: 8,
  },
];

/**
 * salaire   : multiplicateur sur toutes les offres salariales
 * transfert : influence la qualité des clubs qui te contactent
 */
export const AGENTS = [
  {
    id: "requin", nom: "Le requin",
    desc: "Négocie fort, brûle les ponts. Salaires ×1.4.",
    salaire: 1.4, transfert: 1.25, reput: -5,
  },
  {
    id: "famille", nom: "Ton oncle",
    desc: "Loyal, pas outillé. Salaires ×0.85, moral solide.",
    salaire: 0.85, transfert: 0.8, reput: 4, moral: 5,
  },
  {
    id: "structure", nom: "Grosse agence",
    desc: "Réseau international, tu es un dossier parmi 200.",
    salaire: 1.15, transfert: 1.4, reput: 2,
  },
  {
    id: "aucun", nom: "Aucun agent",
    desc: "Tu gères seul. Moins d'argent, zéro parasite.",
    salaire: 0.75, transfert: 0.55, reput: 6, moral: 3,
  },
];

export const getNation = (id) => NATIONS.find((n) => n.id === id);
export const getOrigine = (id) => ORIGINES.find((o) => o.id === id);
export const getHygiene = (id) => HYGIENES.find((h) => h.id === id);
export const getAgent = (id) => AGENTS.find((a) => a.id === id);
