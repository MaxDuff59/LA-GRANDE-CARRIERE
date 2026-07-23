import { rnd, clamp } from "./utils.js";

/**
 * Courbe de progression annuelle brute (en points sur 100), avant
 * modificateurs. Forte croissance jusqu'à 22, ralentissement, pic vers
 * 27-29 (encore légèrement positif), puis déclin qui s'accélère.
 */
function courbeAge(age) {
  if (age <= 22) return rnd(3.6, 6.8);
  if (age <= 26) return rnd(2.0, 4.4);
  if (age <= 29) return rnd(0.5, 2.4);
  if (age <= 32) return rnd(-2.6, 0.9);
  return rnd(-8.0, -1.5);
}

/**
 * Résistance à l'approche du plafond : au-delà de 60, chaque point
 * devient plus dur à prendre, et les tout derniers sont quasi bloqués.
 * C'est ce qui rend 100 très rare et jamais avant 27-28 ans — il faut
 * empiler des saisons de gains positifs sur un attribut déjà à 90+, ce
 * que la courbe d'âge n'autorise plus qu'à la marge après 29 ans.
 */
function fraisDePlafond(valeur) {
  if (valeur <= 60) return 1;
  if (valeur >= 100) return 0.3;
  return Math.max(0.3, 1 - ((valeur - 60) / 40) ** 1.1);
}

/**
 * Plafond dur lié à l'âge : quels que soient le talent, les perks ou la
 * chance, un attribut ne franchit certains paliers qu'avec la maturité.
 * Garantit qu'un 100 (ou même un quasi-100) n'arrive jamais avant 27 ans.
 */
function plafondAge(age) {
  if (age < 25) return 90;
  if (age < 27) return 95;
  return 100;
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
  if (s.perks.includes("tardif") && s.age < 32 && base < 0) base = 0.3;

  base *= s.hygiene.progress;
  base *= 0.75 + s.tempsJeu / 100;
  base *= 0.8 + s.moral / 250;
  base *= 1 - s.usure / 220;

  const gains = {};
  for (const k of Object.keys(s.stats)) {
    let d = base * rnd(0.4, 1.6);

    // Spécificités par attribut (échelle 0-100).
    if (k === "vitesse" && s.age > 28) d -= rnd(1.0, 3.5);
    if ((k === "vision" || k === "mental") && s.age > 26) d += rnd(0.3, 2.0);
    if (k === "puissance" && s.age < 24) d += rnd(0.3, 1.7);

    if (d > 0) d *= fraisDePlafond(s.stats[k]);

    // Le plafond d'âge ne fait jamais redescendre un attribut déjà acquis,
    // il empêche seulement de le pousser plus haut trop tôt.
    const plafond = Math.max(s.stats[k], plafondAge(s.age));
    s.stats[k] = clamp(s.stats[k] + d, 1, plafond);
    gains[k] = d;
  }

  return gains;
}
