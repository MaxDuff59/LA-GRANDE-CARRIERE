import { useState, useMemo, useCallback } from "react";
import { POSTES } from "../data/postes.js";
import { NATIONS, ORIGINES, HYGIENES, AGENTS } from "../data/profil.js";
import { CLUBS } from "../data/clubs.js";
import { EVENTS } from "../data/events.js";
import { MAX_PERKS_EQUIPES, PERKS } from "../data/perks.js";
import { creerCarriere, rehydrater, normaliser, noteGlobale } from "./joueur.js";
import { progression } from "./progression.js";
import { simulerSaison } from "./saison.js";
import { marche, signer as signerOffre, verifierFin } from "./marche.js";
import { calculerScore, rang, jetonsGagnes } from "./score.js";
import { pickPondere, seedRandom, seedDuJour, chance } from "./utils.js";

/**
 * Hook central. Expose l'état du jeu et les actions du joueur.
 * Toute la logique métier vit dans engine/, ce hook ne fait qu'orchestrer.
 */
export function useJeu() {
  const [ecran, setEcran] = useState("accueil");
  const [s, setS] = useState(null);
  const [journal, setJournal] = useState([]);
  const [evenement, setEvenement] = useState(null);
  const [offres, setOffres] = useState(null);
  const [defiEnCours, setDefiEnCours] = useState(false);

  // Méta-progression
  const [jetons, setJetons] = useState(6);
  const [debloques, setDebloques] = useState([]);
  const [equipes, setEquipes] = useState([]);
  const [histo, setHisto] = useState([]);

  /** Profil imposé du jour, identique pour tous les joueurs. */
  const configDefi = useMemo(() => {
    const next = seedRandom(seedDuJour());
    return {
      nom: "Défi du jour",
      poste: POSTES[Math.floor(next() * POSTES.length)].id,
      nation: NATIONS[Math.floor(next() * NATIONS.length)].id,
      origine: ORIGINES[Math.floor(next() * ORIGINES.length)].id,
      hygiene: HYGIENES[Math.floor(next() * HYGIENES.length)].id,
      agent: AGENTS[Math.floor(next() * AGENTS.length)].id,
    };
  }, []);

  const ajouterLignes = useCallback((lignes) => {
    setJournal((j) => [...j, ...lignes]);
  }, []);

  /** Démarre une nouvelle carrière. */
  const lancerCarriere = useCallback(
    (setup, defi = false) => {
      const etat = creerCarriere(setup, defi ? [] : equipes);
      setS(etat);
      setDefiEnCours(defi);
      setEvenement(null);
      setOffres(null);
      setJournal([
        { type: "titre", txt: `Saison ${etat.saison} — ${etat.age} ans — ${etat.club.nom} (${etat.club.div})` },
        { type: "info", txt: `Premier contrat professionnel signé. ${etat.salaire} k€ par mois.` },
      ]);
      setEcran("jeu");
    },
    [equipes]
  );

  /** Tire un événement disponible, ou null. */
  const tirerEvenement = useCallback((etat) => {
    const dispo = EVENTS.filter((e) => {
      const dejaVu = etat.flags[`ev_${e.id}`];
      const estUnique = e.unique !== false;
      if (dejaVu && estUnique) return false;
      return !e.cond || e.cond(etat);
    });
    if (!dispo.length || !chance(0.72)) return null;
    return pickPondere(dispo);
  }, []);

  /** Joue une saison entière. */
  const jouerSaison = useCallback(() => {
    if (!s || s.fini || evenement || offres) return;

    const etat = rehydrater(s);
    const lignes = [
      { type: "titre", txt: `━━ Saison ${etat.saison} — ${etat.age} ans — ${etat.club.nom} ━━` },
    ];

    progression(etat);
    etat.note = noteGlobale(etat.stats, etat.poste);

    const res = simulerSaison(etat);
    lignes.push({
      type: "stat",
      txt: `${res.matchs} matchs · ${res.essais} essais · ${res.points} pts · note ${etat.note}`,
    });
    res.log.forEach((txt) => lignes.push({ type: "event", txt }));

    const ev = tirerEvenement(etat);
    if (ev) {
      etat.flags[`ev_${ev.id}`] = true;
      setEvenement(ev);
    }

    etat.age += 1;
    etat.saison += 1;

    if (verifierFin(etat)) {
      lignes.push({ type: "fin", txt: etat.finRaison });
    } else {
      const nouvellesOffres = marche(etat);
      if (nouvellesOffres) setOffres(nouvellesOffres);
    }

    setS(etat);
    ajouterLignes(lignes);
  }, [s, evenement, offres, tirerEvenement, ajouterLignes]);

  /** Applique le choix du joueur sur un événement. */
  const repondreEvenement = useCallback(
    (choix) => {
      const etat = rehydrater(s);
      const consequence = choix.effet(etat);

      // Le perk/événement "japon" force un changement de club
      if (etat.flags.forceClubJapon && !etat.flags.japonApplique) {
        const japonais = CLUBS.filter((c) => c.pays === "jp");
        if (japonais.length) etat.club = japonais[0];
        etat.flags.japonApplique = true;
      }

      normaliser(etat);
      setS(etat);
      ajouterLignes([
        { type: "choix", txt: `▸ ${choix.label}` },
        { type: "conseq", txt: consequence },
      ]);
      setEvenement(null);
    },
    [s, ajouterLignes]
  );

  /** Signe une offre de contrat. */
  const signer = useCallback(
    (offre) => {
      const etat = rehydrater(s);
      const changement = signerOffre(etat, offre);
      setS(etat);
      ajouterLignes([
        {
          type: "transfert",
          txt: changement
            ? `✍️ Signature à ${offre.club.nom} (${offre.club.div}) — ${offre.salaire} k€/mois, ${offre.duree} an${offre.duree > 1 ? "s" : ""}.`
            : `✍️ Prolongation à ${offre.club.nom} — ${offre.salaire} k€/mois, ${offre.duree} an${offre.duree > 1 ? "s" : ""}.`,
        },
      ]);
      setOffres(null);
    },
    [s, ajouterLignes]
  );

  /** Clôt la carrière et enregistre le résultat. */
  const terminerCarriere = useCallback(() => {
    const score = calculerScore(s);
    const r = rang(score);
    setHisto((h) =>
      [
        {
          nom: s.nom,
          score,
          rang: r.titre,
          poste: s.poste.nom,
          date: new Date().toLocaleDateString("fr-FR"),
        },
        ...h,
      ].slice(0, 10)
    );
    if (!defiEnCours) setJetons((j) => j + jetonsGagnes(score));
    setEcran("bilan");
  }, [s, defiEnCours]);

  /** Retraite anticipée volontaire. */
  const prendreRetraite = useCallback(() => {
    const etat = rehydrater(s);
    etat.fini = true;
    etat.finRaison = "Retraite anticipée. Décision personnelle, assumée.";
    setS(etat);
    setOffres(null);
    setEvenement(null);
    ajouterLignes([{ type: "fin", txt: etat.finRaison }]);
  }, [s, ajouterLignes]);

  /** Achat d'un avantage. */
  const acheterPerk = useCallback(
    (perk) => {
      if (jetons < perk.cout || debloques.includes(perk.id)) return;
      setJetons((j) => j - perk.cout);
      setDebloques((d) => [...d, perk.id]);
    },
    [jetons, debloques]
  );

  /** Équipe ou retire un avantage. */
  const basculerPerk = useCallback(
    (perkId) => {
      setEquipes((e) => {
        if (e.includes(perkId)) return e.filter((x) => x !== perkId);
        if (e.length >= MAX_PERKS_EQUIPES) return e;
        return [...e, perkId];
      });
    },
    []
  );

  return {
    // État
    ecran, s, journal, evenement, offres, defiEnCours,
    jetons, debloques, equipes, histo, configDefi,
    perks: PERKS,

    // Actions
    setEcran,
    lancerCarriere,
    jouerSaison,
    repondreEvenement,
    signer,
    terminerCarriere,
    prendreRetraite,
    acheterPerk,
    basculerPerk,
  };
}
