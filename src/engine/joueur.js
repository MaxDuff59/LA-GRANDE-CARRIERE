import { getPoste } from "../data/postes.js";
import { getNation, getOrigine, getHygiene, getAgent } from "../data/profil.js";
import { CLUBS } from "../data/clubs.js";
import { clamp, rint, pick } from "./utils.js";

export const AGE_DEBUT = 18;
export const AGE_FIN = 37;
export const SAISON_DEBUT = 2026;

/**
 * Note globale 20-99, pondérée selon le poste.
 * Les poids vivent dans data/postes.js pour rester modifiables.
 */
export function noteGlobale(stats, poste) {
  let n = 0;
  for (const [attr, poids] of Object.entries(poste.poids)) {
    n += (stats[attr] || 0) * poids;
  }
  // `n` est une moyenne pondérée sur 100 ; la note reste bornée 20-99.
  return clamp(Math.round(n * 0.705 + 12), 20, 99);
}

/**
 * Construit l'état initial d'une carrière.
 * @param {object} setup - { nom, poste, nation, origine, hygiene, agent } (des ids)
 * @param {string[]} perks - ids des avantages équipés
 */
export function creerCarriere(setup, perks = []) {
  const poste = getPoste(setup.poste);
  const nation = getNation(setup.nation);
  const origine = getOrigine(setup.origine);
  const hygiene = getHygiene(setup.hygiene);
  const agent = getAgent(setup.agent);

  // Attributs de départ = base du poste + modificateurs + variance.
  // Bornés à 72 : personne ne débute à 18 ans avec un attribut d'élite,
  // ça se gagne par la progression (voir progression.js).
  const stats = { ...poste.base };
  for (const k in nation.mod) stats[k] = (stats[k] || 0) + nation.mod[k];
  for (const k in origine.mod) stats[k] = (stats[k] || 0) + origine.mod[k];
  for (const k in stats) stats[k] = clamp(stats[k] + rint(-6, 6), 3, 72);
  if (perks.includes("buteur")) stats.technique += 10;

  // Premier club : celui choisi à la création si fourni, sinon tirage
  // auto (Défi du jour, banc d'essai) dans le pays formateur.
  let club = setup.club ? CLUBS.find((c) => c.nom === setup.club) : null;
  if (!club) {
    const locaux = CLUBS.filter((c) => c.pays === nation.id && c.niveau >= 3);
    club = locaux.length ? pick(locaux) : pick(CLUBS.filter((c) => c.niveau >= 4));
  }

  return {
    nom: setup.nom || "Joueur",
    age: AGE_DEBUT,
    saison: SAISON_DEBUT,

    // Références de profil (ids seulement — voir rehydrater)
    posteId: poste.id,
    nationId: nation.id,
    origineId: origine.id,
    hygieneId: hygiene.id,
    agentId: agent.id,
    perks,

    // Objets résolus, réattachés à chaque tour par rehydrater()
    poste, nation, origine, hygiene, agent,

    stats,
    note: noteGlobale(stats, poste),

    club,
    contratRestant: 3,
    salaire: Math.round(club.budget * 1.6 * agent.salaire),
    argent: origine.argent,
    ancienneteClub: 0,

    reput: clamp(20 + origine.hype + hygiene.reput, 0, 100),
    moral: clamp(65 + (hygiene.moral || 0) + (agent.moral || 0), 0, 100),
    usure: 0,
    relationCoach: 50,
    tempsJeu: 30,

    capitaine: false,
    blessure: null,
    suspension: 0,

    selecEligible: true,
    selecMalus: 0,
    internationalCaps: 0,

    carriere: {
      matchs: 0,
      essais: 0,
      points: 0,
      titres: [],
      distinctions: [],
      saisons: [],
    },

    flags: {},
    fini: false,
    finRaison: null,
  };
}

/**
 * Clone l'état et réattache les objets de données.
 * Nécessaire car les fonctions (poste.poids, hygiene.usure…) ne survivent
 * pas à une sérialisation JSON.
 */
export function rehydrater(s) {
  const copie = JSON.parse(JSON.stringify(s));
  copie.poste = getPoste(s.posteId);
  copie.nation = getNation(s.nationId);
  copie.origine = getOrigine(s.origineId);
  copie.hygiene = getHygiene(s.hygieneId);
  copie.agent = getAgent(s.agentId);
  return copie;
}

/** Champs suivis pour afficher l'impact d'un choix. `bon` = un + est bénéfique. */
const CHAMPS_SUIVIS = [
  { cle: "moral", label: "Moral", bon: true },
  { cle: "reput", label: "Réputation", bon: true },
  { cle: "relationCoach", label: "Relation coach", bon: true },
  { cle: "tempsJeu", label: "Temps de jeu", bon: true, suffixe: "%" },
  { cle: "usure", label: "Usure", bon: false },
  { cle: "suspension", label: "Suspension", bon: false, suffixe: " sem." },
  { cle: "argent", label: "Argent", bon: true, suffixe: " k€" },
];

const STAT_LABELS = {
  puissance: "Puissance", vitesse: "Vitesse", technique: "Technique",
  vision: "Vision", mental: "Mental", endurance: "Endurance",
};

/** Photographie les valeurs suivies avant un choix, pour les comparer après. */
export function snapshot(s) {
  const snap = {};
  for (const { cle } of CHAMPS_SUIVIS) snap[cle] = s[cle] || 0;
  snap.stats = { ...s.stats };
  return snap;
}

/**
 * Compare un snapshot à l'état courant et retourne la liste des variations
 * notables, pour les afficher au joueur (ex. « Moral −10 », « Vision +3 »).
 */
export function diffEtat(avant, apres) {
  const out = [];
  for (const { cle, label, bon, suffixe } of CHAMPS_SUIVIS) {
    const d = Math.round((apres[cle] || 0) - (avant[cle] || 0));
    if (d !== 0) out.push({ label, delta: d, bon, suffixe });
  }
  for (const k in apres.stats) {
    const d = Math.round(apres.stats[k] - (avant.stats?.[k] ?? apres.stats[k]));
    if (d !== 0) out.push({ label: STAT_LABELS[k] || k, delta: d, bon: true });
  }
  return out;
}

/** Borne toutes les jauges après une mutation externe (événement). */
export function normaliser(s) {
  s.moral = clamp(s.moral, 0, 100);
  s.reput = clamp(s.reput, 0, 100);
  s.usure = clamp(s.usure, 0, 100);
  s.relationCoach = clamp(s.relationCoach, 0, 100);
  s.tempsJeu = clamp(s.tempsJeu, 0, 100);
  for (const k in s.stats) s.stats[k] = clamp(s.stats[k], 1, 100);
  s.note = noteGlobale(s.stats, s.poste);
  return s;
}
