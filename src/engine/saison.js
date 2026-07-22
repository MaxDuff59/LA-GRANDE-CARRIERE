import { COMPETS, MATCHS_PAR_DIV } from "../data/clubs.js";
import { rnd, rint, clamp, pick, chance } from "./utils.js";

/** Catalogue des blessures graves possibles. */
const BLESSURES = [
  { nom: "Rupture des ligaments croisés", semaines: 34, usure: 16 },
  { nom: "Hernie cervicale", semaines: 26, usure: 18 },
  { nom: "Luxation d'épaule (opérée)", semaines: 22, usure: 12 },
  { nom: "Fracture du péroné", semaines: 18, usure: 9 },
  { nom: "Rupture du tendon d'Achille", semaines: 28, usure: 15 },
  { nom: "Déchirure ischio-jambiers", semaines: 8, usure: 5 },
  { nom: "Fracture de la main", semaines: 7, usure: 3 },
];

/** Temps de jeu en % selon l'écart de niveau avec le club. */
function calculerTempsJeu(s) {
  const attendu = s.club.prestige * 0.72 + 18;
  const ecart = s.note - attendu;
  let tj = 45 + ecart * 3.4 + (s.relationCoach - 50) * 0.4 + rint(-10, 10);
  if (s.suspension > 0) tj -= s.suspension * 2.2;
  if (s.age >= 33) tj *= 0.88;
  return Math.round(clamp(tj, 4, 96));
}

/** Résultat collectif du club sur la saison. */
function resultatCollectif(s, log) {
  const perf =
    s.club.prestige +
    rint(-22, 22) +
    (s.tempsJeu > 55 ? (s.note - 70) * 0.4 : 0);

  const compets = COMPETS[s.club.div] || ["Titre national"];

  if (perf > 88 && chance(0.35)) {
    const titre = pick(compets);
    s.carriere.titres.push({ nom: titre, annee: s.saison, club: s.club.nom });
    s.moral += 14;
    s.reput += 9;
    log.push(`🏆 ${titre} remporté avec ${s.club.nom} !`);
    return true;
  }
  if (perf > 78) log.push(`Finale perdue avec ${s.club.nom}.`);
  else if (perf < 42 && s.club.niveau >= 3) log.push("Saison difficile, maintien arraché.");
  return false;
}

/** Sélection nationale et trophées internationaux. */
function selectionNationale(s, log) {
  const seuil =
    74 * s.nation.selecDiff +
    (s.selecMalus || 0) -
    (s.perks.includes("chouchou") ? 9 : 0);

  if (!s.selecEligible || s.note < seuil || s.tempsJeu <= 45) return;

  const caps = rint(3, 11);
  s.internationalCaps += caps;
  s.reput += 7;
  log.push(`${s.nation.flag} ${caps} sélections avec ${s.nation.nom} (total : ${s.internationalCaps}).`);

  if (s.internationalCaps >= 50 && !s.flags.cap50) {
    s.flags.cap50 = true;
    s.carriere.distinctions.push(`50ᵉ sélection (${s.saison})`);
  }

  if (chance(0.12) && s.note > 84) {
    s.carriere.titres.push({ nom: "Tournoi des Six Nations", annee: s.saison, club: s.nation.nom });
    log.push(`🏆 Tournoi remporté avec ${s.nation.nom} !`);
  }

  // Coupe du Monde tous les 4 ans
  if (s.saison % 4 === 2 && chance(0.14) && s.note > 86) {
    s.carriere.titres.push({ nom: "Coupe du Monde", annee: s.saison, club: s.nation.nom });
    log.push(`🌍🏆 CHAMPION DU MONDE avec ${s.nation.nom} !`);
  }
}

/** Distinctions individuelles. */
function distinctions(s, essais, log) {
  if (s.note >= 88 && s.tempsJeu > 60 && chance(0.3)) {
    s.carriere.distinctions.push(`Meilleur joueur du ${s.club.div} (${s.saison})`);
    s.reput += 12;
    log.push(`⭐ Élu meilleur joueur du ${s.club.div}.`);
  }
  if (essais >= 12 && chance(0.5)) {
    s.carriere.distinctions.push(`Meilleur marqueur — ${essais} essais (${s.saison})`);
    log.push(`⭐ Meilleur marqueur de la saison : ${essais} essais.`);
  }
  if (s.note >= 92 && s.internationalCaps > 15 && chance(0.16)) {
    s.carriere.distinctions.push(`Joueur mondial de l'année (${s.saison})`);
    s.reput += 20;
    log.push("🥇 JOUEUR MONDIAL DE L'ANNÉE.");
  }
}

/**
 * Joue une saison complète. Mute `s` et retourne un résumé.
 * @returns {{ log: string[], matchs: number, essais: number, points: number }}
 */
export function simulerSaison(s) {
  const log = [];

  // Purge de la blessure de la saison précédente
  if (s.blessure) {
    log.push(`🩹 ${s.blessure.nom} : ${s.blessure.semaines} semaines d'absence.`);
    s.blessure = null;
  }

  // Temps de jeu et volume de matchs
  s.tempsJeu = calculerTempsJeu(s);
  if (s.suspension > 0) {
    log.push(`🟥 ${s.suspension} semaines de suspension purgées.`);
    s.suspension = 0;
  }

  const matchsMax = MATCHS_PAR_DIV[s.club.div] || 26;
  const matchs = Math.round(matchsMax * (s.tempsJeu / 100));
  s.carriere.matchs += matchs;

  // Essais
  const facteur = (s.note / 70) * (0.6 + s.stats.vitesse / 30);
  const essais = Math.max(0, Math.round(matchs * s.poste.essaiRate * facteur * rnd(0.6, 1.5)));
  s.carriere.essais += essais;

  // Points (essais + pénalités si buteur)
  let points = essais * 5;
  const estButeur = s.poste.buteur || s.perks.includes("buteur");
  if (estButeur && s.note > 60) {
    points += Math.round(matchs * rnd(4, 11) * (s.stats.technique / 18));
  }
  s.carriere.points += points;

  // Usure physique.
  // La charge dépend du volume joué, du poste et de l'hygiène ; la
  // récupération décroît avec l'âge. Calibré pour qu'un pilier au régime
  // "bon vivant" casse vers 30-32 ans, et qu'un ailier "pro absolu"
  // puisse tenir jusqu'à 36-37.
  const charge =
    matchs * 0.30 * s.poste.usure * s.hygiene.usure * (1 + (s.age - 18) * 0.030);
  const recup = s.age < 25 ? 7 : s.age < 30 ? 5.5 : 4;
  s.usure = clamp(s.usure + charge - recup, 0, 100);

  // Blessure aléatoire
  let pBlessure = 0.09 + s.usure / 320 + (s.age > 30 ? 0.06 : 0);
  if (s.perks.includes("genoux")) pBlessure *= 0.65;
  if (chance(pBlessure)) {
    const b = pick(BLESSURES);
    s.blessure = b;
    s.usure = clamp(s.usure + b.usure, 0, 100);
    s.moral -= 12;
    log.push(`💥 Blessure : ${b.nom}.`);
  }

  const titreGagne = resultatCollectif(s, log);
  selectionNationale(s, log);
  distinctions(s, essais, log);

  // Revenus de la saison (en k€)
  const prime = titreGagne ? 120 : 0;
  const mult = s.perks.includes("argent") ? 1.25 : 1;
  s.argent += Math.round(((s.salaire * 12) / 1000 * 10 + prime) * mult);

  // Dérive des jauges
  s.moral = clamp(s.moral + (s.tempsJeu > 60 ? 5 : -7) + rint(-4, 4), 0, 100);
  if (s.perks.includes("leader")) s.moral = Math.max(s.moral, 30);
  s.reput = clamp(s.reput + (s.tempsJeu > 55 ? 2 : -2), 0, 100);
  s.relationCoach = clamp(s.relationCoach + rint(-8, 8), 0, 100);

  s.ancienneteClub += 1;
  s.carriere.saisons.push({
    saison: s.saison,
    age: s.age,
    club: s.club.nom,
    note: s.note,
    matchs,
    essais,
  });

  return { log, matchs, essais, points };
}
