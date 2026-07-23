import { creerCarriere, noteGlobale } from "../src/engine/joueur.js";
import { progression } from "../src/engine/progression.js";
import { simulerSaison } from "../src/engine/saison.js";
import { marche, signer, verifierFin } from "../src/engine/marche.js";

const setup = { nom: "Test", poste: "centre", nation: "fr", origine: "formation", hygiene: "equilibre", agent: "structure", club: null };

function run(label) {
  const s = creerCarriere(setup, []);
  console.log(`\n=== ${label} — depart ${s.club.nom} prestige ${s.club.prestige} ===`);
  console.log("age | note | club(prestige) | tj | evt");
  for (let i = 0; i < 18 && !s.fini; i++) {
    progression(s);
    s.note = noteGlobale(s.stats, s.poste);
    const clubAvant = s.club.nom; const blAvant = Boolean(s.blessure); const suAvant = s.suspension>0;
    const prestigeAvant = s.club.prestige;
    simulerSaison(s);
    s.age += 1;
    if (verifierFin(s)) break;
    // simule un joueur ambitieux : signe l'offre au plus gros prestige
    const offres = marche(s);
    let evt = "";
    if (offres && offres.length) {
      const best = offres.reduce((a, b) => (b.club.prestige > a.club.prestige ? b : a));
      const marqueur = (blAvant?" [BLESSE]":"") + (suAvant?" [CARTON]":"");
      evt += marqueur;
      if (best.club.prestige > s.club.prestige + 8) {
        const chg = signer(s, best);
        if (chg) evt = `-> ${best.club.nom} (prestige ${best.club.prestige})`;
      }
    }
    console.log(`${String(s.age-1).padStart(3)} | ${String(s.note).padStart(4)} | ${s.club.nom.slice(0,14).padEnd(14)}(${String(prestigeAvant).padStart(2)}) | ${String(s.tempsJeu).padStart(3)} | ${evt}`);
  }
}
for (let r = 0; r < 4; r++) run(`Carriere ${r + 1}`);
