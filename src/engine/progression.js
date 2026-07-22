import { rnd, clamp } from "./utils.js";

/**
 * Courbe de progression annuelle brute, avant modificateurs.
 * Pic de croissance à 18-22, plateau 23-29, déclin après 30.
 */
function courbeAge(age) {
  if (age <= 22) return rnd(1.6, 3.2);
  if (age <= 26) return rnd(0.9, 2.0);
  if (age <= 29) return rnd(0.2, 1.0);
  if (age <= 32) return rnd(-0.9, 0.4);
  return rnd(-2.4, -0.5);
}

/**
 * Fait évoluer les attributs d'une saison.
 * Mute `s.stats` et retourne le détail des gains par attribut.
 *
 * Facteurs pris en compte :
 *  - âge (courbe ci-dessus)
 *  - avantages "precoce" et "tardif"
 *  - hygiène de vie
 *  - temps de jeu (jouer fait progresser)
 *  - moral
 *  - usure (un corps cassé ne progresse plus)
 */
export function progression(s) {
  let base = courbeAge(s.age);

  if (s.perks.includes("precoce") && s.age < 23) base *= 1.25;
  if (s.perks.includes("tardif") && s.age < 32 && base < 0) base = 0.1;

  base *= s.hygiene.progress;
  base *= 0.75 + s.tempsJeu / 100;
  base *= 0.8 + s.moral / 250;
  base *= 1 - s.usure / 220;

  const gains = {};
  for (const k of Object.keys(s.stats)) {
    let d = base * rnd(0.4, 1.6);

    // Spécificités par attribut
    if (k === "vitesse" && s.age > 28) d -= rnd(0.3, 1.1);
    if ((k === "vision" || k === "mental") && s.age > 26) d += rnd(0.1, 0.6);
    if (k === "puissance" && s.age < 24) d += rnd(0.1, 0.5);

    s.stats[k] = clamp(s.stats[k] + d, 1, 30);
    gains[k] = d;
  }

  return gains;
}
