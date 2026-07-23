import { creerCarriere, noteGlobale } from "../src/engine/joueur.js";
import { progression } from "../src/engine/progression.js";
import { simulerSaison } from "../src/engine/saison.js";

const setup = { nom: "Test", poste: "centre", nation: "fr", origine: "formation", hygiene: "equilibre", agent: "structure", club: null };

function run(label) {
  const s = creerCarriere(setup, []);
  console.log(`\n=== ${label} — depart prestige ${s.club.prestige} (${s.club.div}) ===`);
  console.log("age | note | prestige | ancien | tj");
  for (let i = 0; i < 16 && s.age < 34; i++) {
    progression(s);
    s.note = noteGlobale(s.stats, s.poste);
    simulerSaison(s);
    console.log(`${String(s.age).padStart(3)} | ${String(s.note).padStart(4)} | ${String(s.club.prestige).padStart(8)} | ${String(s.ancienneteClub).padStart(6)} | ${s.tempsJeu}`);
    s.age += 1;
  }
}
for (let r = 0; r < 3; r++) run(`Carriere ${r + 1}`);
