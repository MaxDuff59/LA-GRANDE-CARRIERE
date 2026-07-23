import { creerCarriere, noteGlobale } from "../src/engine/joueur.js";
import { progression } from "../src/engine/progression.js";
import { simulerSaison } from "../src/engine/saison.js";
import { marche, signer, verifierFin } from "../src/engine/marche.js";

const setup = { nom: "T", poste: "centre", nation: "fr", origine: "formation", hygiene: "equilibre", agent: "structure", club: null };
let violations = 0, total = 0, gels = 0;
for (let r = 0; r < 400; r++) {
  const s = creerCarriere(setup, []);
  let prevTj = s.tempsJeu;
  let stagnations = 0;
  for (let i = 0; i < 20 && !s.fini; i++) {
    progression(s); s.note = noteGlobale(s.stats, s.poste);
    const bl = Boolean(s.blessure), su = s.suspension > 0, arriv = s.ancienneteClub === 0, age = s.age;
    simulerSaison(s);
    total++;
    if (age < 30 && !bl && !su && !arriv) {
      if (s.tempsJeu < prevTj) { violations++; }
      if (s.tempsJeu === prevTj && prevTj < 96) stagnations++;
    }
    prevTj = s.tempsJeu;
    s.age += 1;
    if (verifierFin(s)) break;
    const off = marche(s);
    if (off) { const b = off.reduce((a,c)=>c.club.prestige>a.club.prestige?c:a); if (b.club.prestige > s.club.prestige+8) signer(s,b); }
  }
  gels += stagnations;
}
console.log(`Saisons simulées: ${total}`);
console.log(`Baisses ILLEGALES avant 30 (hors blessure/carton/arrivée): ${violations}`);
console.log(`Stagnations avant 30 (même valeur, non plafonné): ${gels}`);
