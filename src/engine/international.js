/**
 * MOTEUR INTERNATIONAL
 * ────────────────────
 * Simule la saison de sélection d'un joueur : grand tournoi (Six Nations,
 * Rugby Championship, tier 2), tournées d'été/automne et Coupe du Monde.
 *
 * Tout repose sur la FORCE des équipes (data/international.js) : deux
 * équipes de force différente n'ont pas la même probabilité de gagner.
 * Le niveau du joueur (`note`) rehausse légèrement sa nation.
 *
 * Le point d'entrée est `simulerCampagne(s, log)`. S'il existe un match à
 * enjeu (titre en jeu à la dernière journée, finale de Coupe du Monde), la
 * campagne renvoie un `decider` : le résultat n'est PAS joué, il attend une
 * action du joueur (voir construireCartesInternationales / finaliserDecider).
 */

import {
  SELECTIONS, CIRCUITS, CIRCUIT_NATION, TOURNEES, HEMISPHERE, POULE_CDM,
} from "../data/international.js";
import { rnd, rint, clamp, pick, chance } from "./utils.js";

/** Probabilité qu'une force `fa` batte une force `fb` (edge = avantage). */
function pWin(fa, fb, edge = 0) {
  return 1 / (1 + Math.pow(10, (fb - fa - edge) / 16));
}

/** Apport du joueur à sa sélection, en points de force. */
function boostJoueur(note) {
  return clamp((note - 80) * 0.4, -6, 7);
}

/** Génère un score de rugby plausible ; le vainqueur mène toujours. */
function genererScore(ecartForce) {
  const perdant = rint(3, 24);
  const marge = clamp(Math.round(rnd(1, 12) + Math.abs(ecartForce) * 0.4), 1, 46);
  return [perdant + marge, perdant]; // [vainqueur, perdant]
}

/** Joue un match entre deux codes ; retourne le détail vu depuis `a`. */
function jouerMatch(a, b, forceA, forceB, edgeA = 0) {
  const aGagne = chance(pWin(forceA, forceB, edgeA));
  const [sv, sp] = genererScore(forceA - forceB);
  return { a, b, sa: aGagne ? sv : sp, sb: aGagne ? sp : sv };
}

/**
 * Classement d'un groupe à partir d'une liste de matchs {a,b,sa,sb}.
 * Barème rugby : victoire 4 pts, nul 2, + bonus offensif (marge ≥ 15) et
 * défensif (défaite ≤ 7). Départage au goal-average.
 */
function classementDe(membres, matchs, boostPour = null, boost = 0) {
  const t = {};
  for (const m of membres) t[m] = { code: m, ...SELECTIONS[m], j: 0, v: 0, d: 0, pts: 0, diff: 0 };
  for (const { a, b, sa, sb } of matchs) {
    t[a].j++; t[b].j++;
    t[a].diff += sa - sb; t[b].diff += sb - sa;
    if (sa > sb) {
      t[a].v++; t[b].d++; t[a].pts += 4;
      if (sa - sb >= 15) t[a].pts += 1;
      if (sa - sb <= 7) t[b].pts += 1;
    } else {
      t[b].v++; t[a].d++; t[b].pts += 4;
      if (sb - sa >= 15) t[b].pts += 1;
      if (sb - sa <= 7) t[a].pts += 1;
    }
  }
  return Object.values(t).sort(
    (x, y) =>
      y.pts - x.pts ||
      y.diff - x.diff ||
      (y.force + (y.code === boostPour ? boost : 0)) - (x.force + (x.code === boostPour ? boost : 0))
  );
}

/** Transforme un match {a,b,sa,sb} en ligne vue depuis la nation. */
function versParcours(nation, m) {
  const estA = m.a === nation;
  const adv = estA ? m.b : m.a;
  const nBut = estA ? m.sa : m.sb;
  const aBut = estA ? m.sb : m.sa;
  return { adv, advNom: SELECTIONS[adv].nom, advFlag: SELECTIONS[adv].flag, gagne: nBut > aBut, score: [nBut, aBut] };
}

/**
 * Simule le grand tournoi de la nation. Désigne le match contre le plus
 * fort adversaire comme « match à enjeu » : s'il décide du titre (gagner =
 * champion, perdre = pas champion), on le laisse en suspens dans `decider`.
 */
function simulerTournoi(key, nation, boost) {
  const circ = CIRCUITS[key];
  const membres = circ.membres;
  const forceEff = (c) => SELECTIONS[c].force + (c === nation ? boost : 0);

  // Adversaire du match décisif : le plus fort des autres.
  const advDecisif = membres
    .filter((m) => m !== nation)
    .sort((x, y) => SELECTIONS[y].force - SELECTIONS[x].force)[0];

  // Toutes les confrontations, sauf UNE rencontre nation–advDecisif laissée
  // en suspens (deux fois si le tournoi est en aller-retour).
  const matchs = [];
  let suspenduPose = false;
  for (let i = 0; i < membres.length; i++) {
    for (let j = i + 1; j < membres.length; j++) {
      const a = membres[i], b = membres[j];
      const rencontres = circ.aller_retour ? 2 : 1;
      for (let r = 0; r < rencontres; r++) {
        const estDecisif = (a === nation || b === nation) &&
          (a === advDecisif || b === advDecisif);
        if (estDecisif && !suspenduPose) { suspenduPose = true; continue; }
        matchs.push(jouerMatch(a, b, forceEff(a), forceEff(b)));
      }
    }
  }

  const pWinNation = pWin(forceEff(nation), forceEff(advDecisif));

  const scenario = (nationGagne) => {
    const [sv, sp] = genererScore(forceEff(nation) - forceEff(advDecisif));
    const dm = nationGagne
      ? { a: nation, b: advDecisif, sa: sv, sb: sp }
      : { a: nation, b: advDecisif, sa: sp, sb: sv };
    const tous = [...matchs, dm];
    const standings = classementDe(membres, tous, nation, boost);
    const rang = standings.findIndex((e) => e.code === nation) + 1;
    const parcours = tous.filter((m) => m.a === nation || m.b === nation).map((m) => versParcours(nation, m));
    return { standings, rang, champion: rang === 1, parcours };
  };

  const win = scenario(true);
  const lose = scenario(false);

  // Match à enjeu seulement s'il décide vraiment du titre.
  if (win.champion && !lose.champion) {
    const parcoursBase = matchs
      .filter((m) => m.a === nation || m.b === nation)
      .map((m) => versParcours(nation, m));
    return {
      key, court: circ.court, nom: circ.nom, mois: circ.mois,
      decider: {
        type: key, adv: advDecisif, advNom: SELECTIONS[advDecisif].nom,
        advFlag: SELECTIONS[advDecisif].flag, pWin: pWinNation,
        parcoursBase, scenarioWin: win, scenarioLose: lose,
      },
    };
  }

  // Pas d'enjeu : on tranche le match et on fige le tournoi.
  const fige = chance(pWinNation) ? win : lose;
  return {
    key, court: circ.court, nom: circ.nom, mois: circ.mois, decider: null,
    parcours: fige.parcours, standings: fige.standings, rang: fige.rang, champion: fige.champion,
    caps: fige.parcours.length,
  };
}

/** Deux fenêtres de tests (été, automne) contre l'autre hémisphère. */
function simulerTournees(nation, boost) {
  const forceN = SELECTIONS[nation].force + boost;
  const adversaires = [...TOURNEES[HEMISPHERE[nation]]];
  const fenetre = (nom, dom) => {
    const matchs = [];
    for (let k = 0; k < 2 && adversaires.length; k++) {
      const adv = adversaires.splice(rint(0, adversaires.length - 1), 1)[0];
      const m = jouerMatch(nation, adv, forceN, SELECTIONS[adv].force, dom ? 5 : -3);
      matchs.push({ ...versParcours(nation, m), dom });
    }
    return { nom, matchs };
  };
  return [fenetre("Tournée d'été", HEMISPHERE[nation] === "nord" ? false : true),
          fenetre("Tests d'automne", HEMISPHERE[nation] === "nord" ? true : false)];
}

/**
 * Parcours en Coupe du Monde (poules puis élimination directe). La finale,
 * si elle est atteinte, devient le match à enjeu.
 */
function simulerCoupeDuMonde(nation, boost, annee) {
  const forceN = SELECTIONS[nation].force + boost;
  const parcours = [];
  const advPossibles = POULE_CDM.filter((c) => c !== nation);

  // Poules : une nation solide passe presque toujours.
  if (!chance(clamp((forceN - 55) / 45, 0.35, 0.97))) {
    parcours.push({ tour: "Poules", resume: "Éliminé dès les poules." });
    return { parcours, resultat: "Éliminé en poules", finale: false, caps: 3 };
  }
  parcours.push({ tour: "Poules", resume: "Sorti premier de poule." });

  const tours = [
    { nom: "Quart de finale", cible: 78 },
    { nom: "Demi-finale", cible: 86 },
  ];
  let caps = 3;
  for (const t of tours) {
    caps++;
    const adv = advPossibles
      .filter((c) => Math.abs(SELECTIONS[c].force - t.cible) < 12)
      .sort(() => Math.random() - 0.5)[0] || pick(advPossibles);
    const m = jouerMatch(nation, adv, forceN, SELECTIONS[adv].force);
    const p = versParcours(nation, m);
    parcours.push({ tour: t.nom, ...p });
    if (!p.gagne) {
      return { parcours, resultat: `Éliminé en ${t.nom.toLowerCase()}`, finale: false, caps };
    }
  }

  // Finale atteinte : match à enjeu.
  caps++;
  const advF = advPossibles.sort((x, y) => SELECTIONS[y].force - SELECTIONS[x].force)[0];
  return {
    parcours, finale: true, caps,
    decider: {
      type: "cdm", adv: advF, advNom: SELECTIONS[advF].nom, advFlag: SELECTIONS[advF].flag,
      pWin: pWin(forceN, SELECTIONS[advF].force),
    },
  };
}

/**
 * Le joueur est-il sélectionné en équipe nationale cette saison ?
 * Le seuil de note dépend de la concurrence dans la nation (selecDiff) :
 * ~72 en France, plus haut dans une nation reine (Nouvelle-Zélande), plus
 * bas dans une nation mineure. Ajouté, jamais multiplié — sinon les grandes
 * nations exigeraient une note inatteignable.
 */
export function estSelectionne(s) {
  if (!s.selecEligible) return false;
  const seuil =
    66 + (s.nation.selecDiff - 1) * 15 +
    (s.selecMalus || 0) -
    (s.perks.includes("chouchou") ? 6 : 0);
  return s.note >= seuil && s.tempsJeu > 45;
}

/**
 * Simule toute la saison internationale et applique immédiatement ses
 * effets « certains » (sélections, réputation, usure, titres sans enjeu).
 * Un éventuel match à enjeu est laissé dans `campagne.decider`.
 * @returns {object|null} la campagne, ou null si non sélectionné.
 */
export function simulerCampagne(s, log) {
  if (!HEMISPHERE[s.nationId] || !estSelectionne(s)) return null;

  const boost = boostJoueur(s.note);
  const annee = s.saison;
  const circuitKey = CIRCUIT_NATION[s.nationId];

  const tournoi = simulerTournoi(circuitKey, s.nationId, boost);
  const tournees = simulerTournees(s.nationId, boost);
  const cdm = annee % 4 === 3 && POULE_CDM.includes(s.nationId)
    ? simulerCoupeDuMonde(s.nationId, boost, annee)
    : null;

  // Caps : tous les matchs joués comptent, quel que soit l'enjeu.
  let caps = tournees.reduce((n, f) => n + f.matchs.length, 0);
  caps += tournoi.decider
    ? tournoi.decider.parcoursBase.length + 1
    : tournoi.parcours.length;
  if (cdm) caps += cdm.caps;
  s.internationalCaps += caps;
  s.reput = clamp(s.reput + 6 + Math.round(caps / 3), 0, 100);
  s.usure = clamp(s.usure + 2 + caps * 0.25, 0, 100);

  // Absence en club pendant le tournoi (surtout le Rugby Championship).
  const absence = CIRCUITS[circuitKey].absenceClub;
  if (absence > 0.15) s.relationCoach = clamp(s.relationCoach - 5, 0, 100);

  if (s.internationalCaps >= 50 && !s.flags.cap50) {
    s.flags.cap50 = true;
    s.carriere.distinctions.push(`50ᵉ sélection (${annee})`);
  }
  log.push(`${s.nation.flag} Saison internationale avec ${s.nation.nom} (${caps} sélections).`);

  // Un seul match à enjeu interactif par saison : la finale de Coupe du
  // Monde prime. Si le tournoi avait aussi un enjeu, il est alors tranché
  // automatiquement pour que son classement reste complet.
  let decider = null;
  if (cdm && cdm.finale) {
    decider = { ...cdm.decider, competition: "Coupe du Monde" };
    if (tournoi.decider) figerTournoi(s, tournoi, tournoi.nom, annee, chance(tournoi.decider.pWin), log);
  } else if (tournoi.decider) {
    decider = { ...tournoi.decider, competition: tournoi.nom };
  } else if (tournoi.champion) {
    // Titre sans enjeu : appliqué tout de suite.
    gagnerTitre(s, tournoi.nom, annee, log);
  }

  return { annee, nation: s.nationId, tournoi, tournees, cdm, caps, decider };
}

/** Fige un tournoi à enjeu selon l'issue de son match décisif. */
function figerTournoi(s, tournoi, nom, annee, gagne, log) {
  const sc = gagne ? tournoi.decider.scenarioWin : tournoi.decider.scenarioLose;
  tournoi.parcours = sc.parcours;
  tournoi.standings = sc.standings;
  tournoi.rang = sc.rang;
  tournoi.champion = sc.champion;
  if (gagne) gagnerTitre(s, nom, annee, log);
}

/** Enregistre un titre international et ses bonus. */
function gagnerTitre(s, nomTitre, annee, log) {
  s.carriere.titres.push({ nom: nomTitre, annee, club: s.nation.nom });
  s.reput = clamp(s.reput + (nomTitre === "Coupe du Monde" ? 22 : 12), 0, 100);
  s.moral = clamp(s.moral + (nomTitre === "Coupe du Monde" ? 20 : 12), 0, 100);
  if (log) log.push(`🏆 ${nomTitre} remporté avec ${s.nation.nom} !`);
}

/**
 * Applique le résultat du match à enjeu une fois la décision du joueur
 * tranchée. Fige aussi les données du tournoi pour l'affichage du récap.
 */
export function finaliserDecider(s, campagne, gagne) {
  const d = campagne.decider;
  d.resolu = gagne;

  if (d.type === "cdm") {
    campagne.cdm.resultat = gagne ? "Champion du monde" : "Finaliste";
    const [v, p] = genererScore(6); // score serré de finale
    campagne.cdm.parcours.push({
      tour: "Finale", adv: d.adv, advNom: d.advNom, advFlag: d.advFlag,
      gagne, score: gagne ? [v, p] : [p, v],
    });
    if (gagne) gagnerTitre(s, "Coupe du Monde", campagne.annee, null);
    else { s.reput = clamp(s.reput + 10, 0, 100); s.moral = clamp(s.moral - 4, 0, 100); }
    return;
  }

  // Tournoi (Six Nations, Rugby Championship, tier 2)
  figerTournoi(s, campagne.tournoi, campagne.tournoi.nom, campagne.annee, gagne, null);
  if (!gagne) s.moral = clamp(s.moral - 4, 0, 100);
}

/** Probabilité de réussite du geste décisif selon l'option et le profil. */
function pReussite(s, base, cle) {
  const paires = {
    but: (s.stats.technique + s.stats.mental) / 2,
    main: (s.stats.vitesse + s.stats.vision) / 2,
    def: (s.stats.puissance + s.stats.mental) / 2,
  };
  const bonus = (paires[cle] - 60) / 200; // ±0.2 environ
  return clamp(base + bonus, 0.08, 0.94);
}

/**
 * Construit les cartes de fin de campagne à insérer dans la file :
 * l'action décisive (si match à enjeu) puis le récap du parcours.
 * Les effets de l'action décisive muent `s` ET figent `campagne`.
 */
export function construireCartesInternationales(campagne) {
  const cards = [];

  if (campagne.decider) {
    const d = campagne.decider;
    const buteur = null; // options génériques, indépendantes du poste
    const optionIssues = (cle, txtOk, txtKo) => [
      {
        poids: (s) => Math.round(pReussite(s, d.pWin, cle) * 100),
        txt: txtOk,
        effet: (s) => {
          finaliserDecider(s, campagne, true);
          s.moral = clamp(s.moral + 6, 0, 100);
          return txtOk;
        },
      },
      {
        poids: (s) => Math.round((1 - pReussite(s, d.pWin, cle)) * 100),
        txt: txtKo,
        effet: (s) => {
          finaliserDecider(s, campagne, false);
          return txtKo;
        },
      },
    ];

    cards.push({
      kind: "intlFinal",
      id: `intlfinal-${campagne.annee}`,
      titre: `${d.competition} — le dénouement`,
      campagne,
      texte: (s) =>
        `${s.nation.flag} Dernière minute face à ${d.advNom} ${d.advFlag}, le titre au bout. ` +
        `À ${Math.round(d.pWin * 100)} % sur le papier, tout se joue sur cette action. À toi.`,
      choix: [
        {
          label: "Tenter la pénalité de la gagne",
          issues: optionIssues(
            "but",
            `La pénalité fend les perches. ${d.advNom} est battu — titre !`,
            `Le ballon frôle le poteau et sort. Le titre s'envole d'un rien.`
          ),
        },
        {
          label: "Jouer le titre à la main",
          issues: optionIssues(
            "main",
            `Une dernière passe, l'essai au coin ! Vous soulevez le trophée.`,
            `Ballon gratté sur la ligne. Fin du match, si près du but.`
          ),
        },
      ],
    });
  }

  cards.push({ kind: "intl", id: `intl-${campagne.annee}`, campagne });
  return cards;
}

/** Résout automatiquement le match à enjeu (banc d'essai, hors interface). */
export function resoudreDeciderAuto(s, campagne) {
  if (!campagne || !campagne.decider) return;
  finaliserDecider(s, campagne, chance(campagne.decider.pWin));
}
