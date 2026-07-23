import { useState, useMemo, useCallback } from "react";
import { POSTES } from "../data/postes.js";
import { NATIONS, ORIGINES, HYGIENES, AGENTS } from "../data/profil.js";
import { CLUBS } from "../data/clubs.js";
import { EVENTS } from "../data/events.js";
import { ACTIONS } from "../data/actions.js";
import { VIE } from "../data/vie.js";
import { MAX_PERKS_EQUIPES, PERKS } from "../data/perks.js";
import { creerCarriere, rehydrater, normaliser, noteGlobale, snapshot, diffEtat } from "./joueur.js";
import { progression } from "./progression.js";
import { simulerSaison } from "./saison.js";
import { construireCartesInternationales } from "./international.js";
import { marche, signer as signerOffre, verifierFin } from "./marche.js";
import { calculerScore, rang, jetonsGagnes } from "./score.js";
import { pickPondere, pickPondereDyn, seedRandom, seedDuJour, chance } from "./utils.js";

/**
 * Hook central. Expose l'état du jeu et les actions du joueur.
 * Toute la logique métier vit dans engine/, ce hook ne fait qu'orchestrer.
 */
export function useJeu() {
  const [ecran, setEcran] = useState("accueil");
  const [s, setS] = useState(null);
  const [journal, setJournal] = useState([]);
  const [offres, setOffres] = useState(null);
  const [defiEnCours, setDefiEnCours] = useState(false);

  /**
   * File des interactions en attente de réponse : d'abord les actions de
   * match, puis l'événement narratif de fin de saison. Un seul slot ne
   * suffisait plus, il peut y avoir jusqu'à trois cartes à enchaîner.
   */
  const [file, setFile] = useState([]);
  const evenement = file[0] ?? null;

  /**
   * Issue de la décision en cours, affichée dans le même modal avant de
   * passer à la suivante. Sans cette étape, le résultat d'une action de
   * match disparaîtrait derrière la carte suivante.
   */
  const [resultat, setResultat] = useState(null);

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
      setFile([]);
      setResultat(null);
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

  /**
   * Tire 1 à 2 actions de match pour la saison écoulée.
   * Contrairement aux événements, aucun flag n'est posé : elles sont
   * répétables d'une saison à l'autre — mais jamais deux fois la même
   * dans la même saison.
   */
  const tirerActions = useCallback((etat) => {
    if (etat.tempsJeu < 25) return [];

    const dispo = ACTIONS.filter((a) => !a.cond || a.cond(etat));
    if (!dispo.length) return [];

    const tirees = [];
    const n = chance(0.35) ? 2 : 1;
    for (let k = 0; k < n && dispo.length; k++) {
      const a = pickPondere(dispo);
      tirees.push(a);
      dispo.splice(dispo.indexOf(a), 1);
    }
    return tirees;
  }, []);

  /**
   * Tire un événement « hygiène de vie », ou null. Répétable (aucun flag),
   * environ une saison sur deux, filtré par le profil du joueur.
   */
  const tirerVie = useCallback((etat) => {
    const dispo = VIE.filter((e) => !e.cond || e.cond(etat));
    if (!dispo.length || !chance(0.48)) return null;
    return pickPondere(dispo);
  }, []);

  /** Joue une saison entière. */
  const jouerSaison = useCallback(() => {
    if (!s || s.fini || file.length || offres) return;

    const etat = rehydrater(s);

    progression(etat);
    etat.note = noteGlobale(etat.stats, etat.poste);

    const res = simulerSaison(etat);

    // Le résultat chiffré et le narratif de saison ne sont PAS écrits au
    // journal tout de suite : ce serait dévoiler l'issue avant que le joueur
    // ne réponde aux actions de match qui suivent. On les diffère jusqu'à la
    // carte de bilan, qui clôt la saison — voir `continuer`.
    const bilanLignes = [
      {
        type: "stat",
        txt: `${res.matchs} matchs · ${res.essais} essais · ${res.points} pts · note ${etat.note}`,
      },
      ...res.log.map((txt) => ({ type: "event", txt })),
    ];

    // Tirés avant le vieillissement : les `cond` d'âge et les conséquences
    // (usure, moral) doivent porter sur la saison qui vient d'être jouée.
    // Ordre d'apparition : actions de match, hygiène de vie, puis narratif.
    const actions = tirerActions(etat);
    const vie = tirerVie(etat);
    const ev = tirerEvenement(etat);
    if (ev) etat.flags[`ev_${ev.id}`] = true;

    // Saison internationale (action décisive éventuelle + récap du parcours),
    // insérée avant le récap de club qui clôt toujours la file.
    const intl = res.campagne ? construireCartesInternationales(res.campagne) : [];

    etat.age += 1;
    etat.saison += 1;

    if (verifierFin(etat)) {
      bilanLignes.push({ type: "fin", txt: etat.finRaison });
    } else {
      const nouvellesOffres = marche(etat);
      if (nouvellesOffres) setOffres(nouvellesOffres);
    }

    // La carte de bilan porte les lignes différées : elles rejoignent le
    // journal seulement quand le joueur la valide (`continuer`).
    const recap = {
      kind: "recap",
      id: `recap-${res.bilan.saison}`,
      bilan: res.bilan,
      journal: bilanLignes,
    };
    setFile([...actions, ...(vie ? [vie] : []), ...(ev ? [ev] : []), ...intl, recap]);

    setS(etat);
    // Seul l'en-tête de saison s'affiche d'emblée : il situe les actions à
    // venir sans rien dévoiler du résultat.
    ajouterLignes([
      { type: "titre", txt: `━━ Saison ${res.bilan.saison} — ${res.bilan.age} ans — ${res.bilan.club} ━━` },
    ]);
  }, [s, file, offres, tirerActions, tirerVie, tirerEvenement, ajouterLignes]);

  /** Applique le choix du joueur sur une action de match ou un événement. */
  const repondreEvenement = useCallback(
    (choix) => {
      const etat = rehydrater(s);
      const avant = snapshot(etat);

      // Une action de match n'a pas d'effet écrit d'avance : on tire une
      // issue parmi celles du choix, pondérée par les attributs.
      let consequence;
      if (choix.issues) {
        const issue = pickPondereDyn(choix.issues, etat);
        issue.effet(etat);
        consequence = issue.txt;
      } else {
        consequence = choix.effet(etat);
      }

      // Le perk/événement "japon" force un changement de club
      if (etat.flags.forceClubJapon && !etat.flags.japonApplique) {
        const japonais = CLUBS.filter((c) => c.pays === "jp");
        if (japonais.length) etat.club = japonais[0];
        etat.flags.japonApplique = true;
      }

      normaliser(etat);
      const effets = diffEtat(avant, etat);
      setS(etat);
      const typeConseq =
        evenement?.kind === "action"
          ? "action"
          : evenement?.kind === "hygiene"
          ? "hygiene"
          : evenement?.kind === "intlFinal"
          ? "intl"
          : "conseq";
      ajouterLignes([
        { type: "choix", txt: `▸ ${choix.label}` },
        { type: typeConseq, txt: consequence },
      ]);
      // La carte reste ouverte : c'est `continuer` qui dépile.
      setResultat({ label: choix.label, txt: consequence, effets });
    },
    [s, evenement, ajouterLignes]
  );

  /** Ferme l'issue affichée et passe à la décision suivante. */
  const continuer = useCallback(() => {
    setResultat(null);
    setFile((f) => {
      const [tete, ...reste] = f;
      // La carte de bilan porte le résultat différé de la saison : il rejoint
      // le journal maintenant, une fois les actions de match résolues.
      if (tete?.journal) ajouterLignes(tete.journal);
      return reste;
    });
  }, [ajouterLignes]);

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
    setFile([]);
    setResultat(null);
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
    ecran, s, journal, evenement, resultat, offres, defiEnCours,
    jetons, debloques, equipes, histo, configDefi,
    perks: PERKS,

    // Actions
    setEcran,
    lancerCarriere,
    jouerSaison,
    repondreEvenement,
    continuer,
    signer,
    terminerCarriere,
    prendreRetraite,
    acheterPerk,
    basculerPerk,
  };
}
