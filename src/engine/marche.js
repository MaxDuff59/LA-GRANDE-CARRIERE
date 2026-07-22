import { CLUBS } from "../data/clubs.js";
import { rint, clamp } from "./utils.js";
import { AGE_FIN } from "./joueur.js";

/**
 * Cote du joueur sur le marché : mélange de niveau, réputation,
 * âge et état physique. C'est elle qui détermine quels clubs appellent.
 */
export function coteMarche(s) {
  return (
    s.note +
    s.reput * 0.22 -
    (s.age > 31 ? (s.age - 31) * 5 : 0) -
    s.usure * 0.18
  );
}

/**
 * Décrémente le contrat et retourne les offres si celui-ci expire.
 * @returns {Array|null} liste d'offres, ou null si le contrat court encore
 */
export function marche(s) {
  s.contratRestant -= 1;
  if (s.contratRestant > 0) return null;

  const cote = coteMarche(s);

  const exterieures = CLUBS
    .filter((c) => c.nom !== s.club.nom)
    .map((c) => ({ c, fit: 100 - Math.abs(c.prestige - cote) + rint(-14, 14) }))
    .filter((x) => x.fit > 55)
    .sort((a, b) => b.fit - a.fit)
    .slice(0, 3)
    .map(({ c }) => ({
      club: c,
      salaire: Math.round(c.budget * 1.6 * (0.6 + cote / 130) * s.agent.salaire),
      duree: s.age > 32 ? 1 : rint(2, 4),
    }));

  // Le club actuel propose toujours quelque chose
  const prolongation = {
    club: s.club,
    salaire: Math.round(s.salaire * (s.tempsJeu > 55 ? 1.15 : 0.9)),
    duree: s.age > 33 ? 1 : 2,
    prolongation: true,
  };

  return [...exterieures, prolongation];
}

/** Applique une offre signée à l'état du joueur. */
export function signer(s, offre) {
  const changementClub = offre.club.nom !== s.club.nom;
  s.club = offre.club;
  s.salaire = offre.salaire;
  s.contratRestant = offre.duree;
  if (changementClub) {
    s.ancienneteClub = 0;
    s.relationCoach = 50;
    s.moral = clamp(s.moral + 4, 0, 100);
    s.capitaine = false;
  }
  return changementClub;
}

/**
 * Vérifie les conditions d'arrêt de carrière.
 * Mute `s.fini` et `s.finRaison`.
 */
export function verifierFin(s) {
  if (s.age > AGE_FIN) {
    s.fini = true;
    s.finRaison = `Tu as tenu jusqu'à ${AGE_FIN} ans. Le corps a dit stop.`;
  } else if (s.usure >= 96) {
    s.fini = true;
    s.finRaison = "Ton corps ne suit plus. Arrêt sur avis médical.";
  } else if (s.moral <= 4) {
    s.fini = true;
    s.finRaison = "Tu n'as plus envie. Tu raccroches sans annonce.";
  } else if (s.note < 42 && s.age > 30) {
    s.fini = true;
    s.finRaison = "Plus aucun club ne te propose de contrat professionnel.";
  }
  return s.fini;
}
