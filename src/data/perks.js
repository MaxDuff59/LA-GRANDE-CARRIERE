/**
 * Avantages achetables avec les jetons. 2 équipables maximum.
 * Les effets sont appliqués dans engine/ — si tu ajoutes un perk ici,
 * pense à le câbler dans le module concerné :
 *   genoux   → engine/saison.js (probabilité de blessure)
 *   buteur   → engine/joueur.js + engine/saison.js
 *   leader   → engine/saison.js (plancher de moral)
 *   precoce  → engine/progression.js
 *   tardif   → engine/progression.js
 *   argent   → engine/saison.js (revenus)
 *   chouchou → engine/saison.js (seuil de sélection)
 */
export const PERKS = [
  { id: "genoux", nom: "Genoux d'acier", cout: 3, desc: "Risque de blessure grave réduit de 35 %." },
  { id: "buteur", nom: "Pied droit chirurgical", cout: 3, desc: "+3 technique de départ, buteur quel que soit le poste." },
  { id: "leader", nom: "Voix du vestiaire", cout: 4, desc: "Le moral ne descend jamais sous 30." },
  { id: "precoce", nom: "Éclosion précoce", cout: 2, desc: "Progression ×1.25 avant 23 ans." },
  { id: "tardif", nom: "Révélé sur le tard", cout: 2, desc: "Aucun déclin avant 32 ans." },
  { id: "argent", nom: "Sens des affaires", cout: 3, desc: "Revenus +25 %, primes doublées." },
  { id: "chouchou", nom: "Chouchou du sélectionneur", cout: 5, desc: "Seuil de sélection nationale abaissé." },
];

export const MAX_PERKS_EQUIPES = 2;
