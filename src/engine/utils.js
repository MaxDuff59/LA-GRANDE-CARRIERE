/** Utilitaires numériques et aléatoires partagés par tout le moteur. */

export const rnd = (a, b) => a + Math.random() * (b - a);
export const rint = (a, b) => Math.floor(rnd(a, b + 1));
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
export const chance = (p) => Math.random() < p;

/** Tire un élément d'une liste pondérée par la propriété `poids`. */
export function pickPondere(items) {
  const total = items.reduce((a, x) => a + (x.poids || 1), 0);
  let r = Math.random() * total;
  for (const x of items) {
    r -= x.poids || 1;
    if (r <= 0) return x;
  }
  return items[items.length - 1];
}

/**
 * Tire une issue dont le poids est une fonction de l'état (actions de match).
 * Le plancher évite qu'un attribut très élevé rende une issue strictement
 * impossible : il reste toujours un fond d'aléa.
 */
export function pickPondereDyn(items, s) {
  return pickPondere(items.map((x) => ({ ...x, poids: Math.max(0.5, x.poids(s)) })));
}

/**
 * Générateur pseudo-aléatoire déterministe (LCG).
 * Sert au Défi du jour : même graine = même profil pour tout le monde.
 */
export function seedRandom(seed) {
  let x = seed;
  return () => {
    x = (x * 1103515245 + 12345) % 2147483648;
    return x / 2147483648;
  };
}

/** Graine du jour, au format AAAAMMJJ. */
export function seedDuJour(date = new Date()) {
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
}
