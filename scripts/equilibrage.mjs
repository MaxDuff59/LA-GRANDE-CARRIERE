/**
 * Banc d'essai du moteur, hors React.
 *
 *   npm run equilibrage
 *
 * Simule des centaines de carrières complètes et affiche la distribution
 * des scores, des rangs et des fins de carrière. Lance-le à chaque fois
 * que tu modifies un barème (score.js), la courbe d'usure (saison.js)
 * ou la progression (progression.js) : c'est le seul moyen de voir si
 * ton changement casse l'équilibre général.
 *
 * Ce que tu veux voir :
 *   - la médiane tombe sur "INTERNATIONAL SOLIDE"
 *   - "LÉGENDE ABSOLUE" reste sous 3 %
 *   - les trois causes de fin de carrière sont toutes représentées
 *   - aucun poste n'est systématiquement en tête ou en queue
 *   - aucune action de match n'a d'option réussie < 35 % ou > 80 % à
 *     attributs moyens : en dessous l'option n'est jamais choisie, au
 *     dessus la décision n'en est plus une
 *
 * SANS_ACTIONS=1 npm run equilibrage  neutralise les actions de match.
 * Compare les deux écarts entre postes : si l'écart se creuse quand tu
 * ajoutes une action, c'est qu'elle taxe les postes qui la tirent
 * (usure en trop, échecs plus lourds que les réussites).
 */

import { POSTES } from "../src/data/postes.js";
import { NATIONS, ORIGINES, HYGIENES, AGENTS } from "../src/data/profil.js";
import { EVENTS } from "../src/data/events.js";
import { ACTIONS } from "../src/data/actions.js";
import { creerCarriere, rehydrater, normaliser, noteGlobale } from "../src/engine/joueur.js";
import { progression } from "../src/engine/progression.js";
import { simulerSaison } from "../src/engine/saison.js";
import { marche, verifierFin, signer } from "../src/engine/marche.js";
import { calculerScore, rang } from "../src/engine/score.js";
import { pickPondere, pickPondereDyn, pick, chance } from "../src/engine/utils.js";

const NB_CARRIERES = Number(process.argv[2]) || 500;

/** Joue une carrière entière en choisissant les événements au hasard. */
function simulerCarriere(setup, perks = []) {
  let s = creerCarriere(setup, perks);
  let tours = 0;

  while (!s.fini && tours < 40) {
    tours++;
    s = rehydrater(s);
    progression(s);
    s.note = noteGlobale(s.stats, s.poste);
    simulerSaison(s);

    // Actions de match : 1 à 2 par saison, choix et issue au hasard.
    if (!process.env.SANS_ACTIONS && s.tempsJeu >= 25) {
      const possibles = ACTIONS.filter((a) => !a.cond || a.cond(s));
      const n = chance(0.35) ? 2 : 1;
      for (let k = 0; k < n && possibles.length; k++) {
        const a = pickPondere(possibles);
        possibles.splice(possibles.indexOf(a), 1);
        const issue = pickPondereDyn(pick(a.choix).issues, s);
        if (typeof issue.txt !== "string") {
          throw new Error(`L'action "${a.id}" a une issue sans texte.`);
        }
        issue.effet(s);
        normaliser(s);
      }
    }

    const dispo = EVENTS.filter((e) => {
      if (s.flags[`ev_${e.id}`] && e.unique !== false) return false;
      return !e.cond || e.cond(s);
    });
    if (dispo.length && chance(0.72)) {
      const ev = pickPondere(dispo);
      s.flags[`ev_${ev.id}`] = true;
      const choix = pick(ev.choix);
      const consequence = choix.effet(s);
      if (typeof consequence !== "string") {
        throw new Error(`L'événement "${ev.id}" ne retourne pas de texte de conséquence.`);
      }
      normaliser(s);
    }

    s.age++;
    s.saison++;

    if (!verifierFin(s)) {
      const offres = marche(s);
      if (offres) {
        if (!offres.length) throw new Error("Le marché n'a proposé aucune offre.");
        signer(s, pick(offres));
      }
    }
  }

  return { s, tours, score: calculerScore(s) };
}

const pad = (v, n) => String(v).padStart(n);

// ── 1. Cohérence des données ──────────────────────────────────────────
console.log("── Poids des attributs par poste (doivent sommer à 1) ──");
let erreurs = 0;
for (const p of POSTES) {
  const somme = Object.values(p.poids).reduce((a, b) => a + b, 0);
  const ok = Math.abs(somme - 1) < 0.001;
  if (!ok) erreurs++;
  console.log(`${ok ? "✓" : "✗"} ${p.nom.padEnd(18)} ${somme.toFixed(3)}`);
}

// ── 2. Une carrière type par poste ────────────────────────────────────
console.log("\n── Carrière de référence par poste ──");
for (const p of POSTES) {
  const { s, tours, score } = simulerCarriere({
    nom: "Test",
    poste: p.id,
    nation: "fr",
    origine: "formation",
    hygiene: "equilibre",
    agent: "structure",
  });
  console.log(
    `${p.nom.padEnd(18)} ${pad(tours, 2)} saisons · note ${pad(s.note, 2)} · ` +
      `${pad(s.carriere.matchs, 3)}m ${pad(s.carriere.essais, 3)}e · ` +
      `${pad(s.internationalCaps, 2)} sél · ${s.carriere.titres.length} titres · ` +
      `${pad(score, 5)} (${rang(score).titre})`
  );
}

// ── 3. Taux de réussite des actions de match ──────────────────────────
// Calculé exactement à partir des poids, pas par échantillonnage.
// Convention : la PREMIÈRE issue d'un choix est celle qui réussit.
console.log("\n── Actions de match : réussite de la 1ʳᵉ issue (moyen 47 / élite 73) ──");

const profil = (v) => ({
  stats: { puissance: v, vitesse: v, technique: v, vision: v, mental: v, endurance: v },
});

const probas = (choix, s) => {
  const poids = choix.issues.map((i) => Math.max(0.5, i.poids(s)));
  const total = poids.reduce((a, b) => a + b, 0);
  if (!Number.isFinite(total) || total <= 0) return null;
  return poids.map((p) => p / total);
};

/**
 * Espérance de gain d'un choix, en "points de carrière" arbitraires.
 * Elle doit être proche de zéro à attributs moyens : une action de match
 * est un pari, pas une taxe. Si elle est nettement négative, les postes
 * qui tirent beaucoup d'actions sont pénalisés sans l'avoir mérité.
 */
const POIDS_EV = { moral: 1, reput: 1.5, relationCoach: 0.8, usure: -1.2, suspension: -4 };

const ev = (choix, s) => {
  const p = probas(choix, s);
  let total = 0;
  choix.issues.forEach((issue, i) => {
    const avant = { moral: 50, reput: 50, relationCoach: 50, usure: 20, suspension: 0 };
    const sonde = { ...s, ...avant, carriere: { essais: 0, points: 0, saisons: [] } };
    issue.effet(sonde);
    let delta = 0;
    for (const [k, w] of Object.entries(POIDS_EV)) delta += (sonde[k] - avant[k]) * w;
    delta += sonde.carriere.essais * 8 + sonde.carriere.points * 1.5;
    total += p[i] * delta;
  });
  return total;
};

for (const a of ACTIONS) {
  for (const c of a.choix) {
    const p14 = probas(c, profil(47));
    const p22 = probas(c, profil(73));
    if (!p14 || !p22) throw new Error(`Poids invalides sur "${a.id}".`);
    const [moyen, elite] = [p14[0] * 100, p22[0] * 100];
    const [ev14, ev22] = [ev(c, profil(47)), ev(c, profil(73))];

    const ok = moyen >= 35 && moyen <= 80 && elite >= moyen && ev14 >= -2 && ev22 > ev14;
    if (!ok) erreurs++;
    console.log(
      `${ok ? "✓" : "✗"} ${a.id.padEnd(20)} ${c.label.slice(0, 28).padEnd(29)} ` +
        `${pad(moyen.toFixed(0), 3)} % → ${pad(elite.toFixed(0), 3)} %   ` +
        `gain ${pad(ev14.toFixed(1), 6)} → ${pad(ev22.toFixed(1), 6)}`
    );
  }
}

// ── 4. Distribution sur un large échantillon ──────────────────────────
console.log(`\n── Distribution sur ${NB_CARRIERES} carrières aléatoires ──`);
const scores = [];
const fins = {};
const parPoste = {};

for (let i = 0; i < NB_CARRIERES; i++) {
  const poste = pick(POSTES);
  const { s, score } = simulerCarriere({
    nom: "X",
    poste: poste.id,
    nation: pick(NATIONS).id,
    origine: pick(ORIGINES).id,
    hygiene: pick(HYGIENES).id,
    agent: pick(AGENTS).id,
  });

  if (Number.isNaN(score)) throw new Error("Score NaN détecté.");
  if (Number.isNaN(s.note)) throw new Error("Note NaN détectée.");
  if (s.usure < 0 || s.usure > 100) throw new Error(`Usure hors bornes : ${s.usure}`);
  if (s.moral < 0 || s.moral > 100) throw new Error(`Moral hors bornes : ${s.moral}`);

  scores.push(score);
  fins[s.finRaison] = (fins[s.finRaison] || 0) + 1;
  (parPoste[poste.nom] ||= []).push(score);
}

scores.sort((a, b) => a - b);
const pct = (q) => scores[Math.floor(scores.length * q)];
console.log(
  `min ${scores[0]} · p25 ${pct(0.25)} · médiane ${pct(0.5)} · ` +
    `p75 ${pct(0.75)} · p90 ${pct(0.9)} · max ${scores[scores.length - 1]}`
);

console.log("\nFins de carrière :");
for (const [raison, n] of Object.entries(fins).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${pad(n, 4)}  ${raison}`);
}

console.log("\nRangs obtenus :");
const rangs = {};
for (const sc of scores) {
  const t = rang(sc).titre;
  rangs[t] = (rangs[t] || 0) + 1;
}
for (const [titre, n] of Object.entries(rangs)) {
  const part = ((n / scores.length) * 100).toFixed(1);
  console.log(`  ${pad(n, 4)}  ${pad(part, 5)}%  ${titre}`);
}

console.log("\nScore médian par poste (écart max acceptable : ~25 %) :");
const medianes = Object.entries(parPoste)
  .map(([nom, arr]) => {
    arr.sort((a, b) => a - b);
    return [nom, arr[Math.floor(arr.length / 2)]];
  })
  .sort((a, b) => b[1] - a[1]);
for (const [nom, med] of medianes) console.log(`  ${nom.padEnd(18)} ${pad(med, 5)}`);
const ecart = ((medianes[0][1] - medianes.at(-1)[1]) / medianes.at(-1)[1]) * 100;
console.log(`  → écart entre le meilleur et le pire poste : ${ecart.toFixed(0)} %`);

if (erreurs) {
  console.log("\n❌ Des poids de poste sont incorrects.");
  process.exit(1);
}
console.log("\n✅ Aucune erreur détectée.");
