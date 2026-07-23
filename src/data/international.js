/**
 * DONNÉES INTERNATIONALES
 * ───────────────────────
 * Le calendrier des sélections nationales : grands tournois, tournées et
 * Coupe du Monde. Tout part de la FORCE de chaque équipe, qui fixe ses
 * probabilités de victoire (voir engine/international.js).
 *
 * Pour rééquilibrer une nation, change sa `force` ici. 60 = nation
 * mineure, 75 = solide, 90+ = candidate au titre mondial.
 */

/** Toutes les sélections impliquées, jouables ou non. */
export const SELECTIONS = {
  // Hémisphère nord — Tournoi des Six Nations
  fr: { nom: "France", flag: "🇫🇷", force: 88 },
  en: { nom: "Angleterre", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", force: 86 },
  ie: { nom: "Irlande", flag: "🇮🇪", force: 90 },
  sc: { nom: "Écosse", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", force: 78 },
  wa: { nom: "Pays de Galles", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", force: 76 },
  it: { nom: "Italie", flag: "🇮🇹", force: 66 },

  // Hémisphère sud — Rugby Championship
  nz: { nom: "Nouvelle-Zélande", flag: "🇳🇿", force: 94 },
  za: { nom: "Afrique du Sud", flag: "🇿🇦", force: 92 },
  au: { nom: "Australie", flag: "🇦🇺", force: 83 },
  ar: { nom: "Argentine", flag: "🇦🇷", force: 84 },

  // Pacifique — Pacific Nations Cup
  fj: { nom: "Fidji", flag: "🇫🇯", force: 76 },
  jp: { nom: "Japon", flag: "🇯🇵", force: 74 },
  sm: { nom: "Samoa", flag: "🇼🇸", force: 71 },
  to: { nom: "Tonga", flag: "🇹🇴", force: 66 },

  // Europe tier 2 — Rugby Europe Championship
  ge: { nom: "Géorgie", flag: "🇬🇪", force: 73 },
  pt: { nom: "Portugal", flag: "🇵🇹", force: 66 },
  ro: { nom: "Roumanie", flag: "🇷🇴", force: 61 },
  es: { nom: "Espagne", flag: "🇪🇸", force: 59 },
};

/**
 * Les grands tournois annuels, avec leur fenêtre et leurs participants.
 *   mois        : période dans la saison (affiché au joueur)
 *   membres     : codes des équipes engagées
 *   absenceClub : part des matchs de club manqués par un international
 *                 pendant le tournoi (le Rugby Championship tombe en
 *                 pleine saison de club au nord → forte absence).
 */
export const CIRCUITS = {
  "6n": {
    id: "6n",
    nom: "Tournoi des Six Nations",
    court: "Six Nations",
    mois: "février-mars",
    membres: ["fr", "en", "ie", "sc", "wa", "it"],
    absenceClub: 0.1,
  },
  rc: {
    id: "rc",
    nom: "The Rugby Championship",
    court: "Rugby Championship",
    mois: "septembre-novembre",
    membres: ["nz", "za", "au", "ar"],
    absenceClub: 0.22, // en pleine saison de club au nord
    aller_retour: true, // chaque équipe se rencontre deux fois
  },
  pnc: {
    id: "pnc",
    nom: "Pacific Nations Cup",
    court: "Pacific Nations Cup",
    mois: "été",
    membres: ["fj", "jp", "sm", "to"],
    absenceClub: 0.12,
  },
  rec: {
    id: "rec",
    nom: "Rugby Europe Championship",
    court: "Rugby Europe",
    mois: "février-mars",
    membres: ["ge", "pt", "ro", "es"],
    absenceClub: 0.08,
  },
};

/** Le tournoi principal de chaque nation jouable. */
export const CIRCUIT_NATION = {
  fr: "6n", ie: "6n", it: "6n",
  nz: "rc", za: "rc", ar: "rc",
  fj: "pnc",
  ge: "rec",
};

/**
 * Adversaires des fenêtres de tournée (tests d'été et d'automne), par
 * hémisphère. Un nordiste tourne au sud l'été et reçoit le sud en
 * automne ; l'inverse pour un sudiste.
 */
export const TOURNEES = {
  nord: ["nz", "za", "au", "ar", "fj", "jp"], // adversaires d'un nordiste
  sud: ["fr", "en", "ie", "sc", "wa", "it"], // adversaires d'un sudiste
};

/** Hémisphère de chaque nation jouable (sens des tournées). */
export const HEMISPHERE = {
  fr: "nord", ie: "nord", it: "nord", ge: "nord",
  nz: "sud", za: "sud", ar: "sud", fj: "sud",
};

/** Équipes présentes à la Coupe du Monde (bracket simplifié). */
export const POULE_CDM = [
  "nz", "za", "ie", "fr", "en", "ar", "au", "wa", "sc", "fj", "it", "jp", "ge", "sm",
];
