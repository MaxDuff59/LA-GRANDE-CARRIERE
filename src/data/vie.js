/**
 * ÉVÉNEMENTS « HYGIÈNE DE VIE »
 * ────────────────────────────
 * Ce qui se joue en dehors du terrain : la troisième mi-temps, le poids,
 * les nuits, les tentations. Répétables (aucun flag posé), tirés ~1 saison
 * sur deux. Ils touchent surtout l'usure, le moral, la réputation et
 * parfois l'endurance ou la puissance — la façon dont un corps traverse
 * quinze ans de carrière.
 *
 * Même format que data/events.js : { id, poids, cond, titre, texte, choix }
 * où chaque choix a un `effet(s)` qui mute l'état et retourne le texte de
 * conséquence. L'impact chiffré (Moral −8, Usure +6…) est affiché
 * automatiquement, pas besoin de le décrire dans le texte.
 *
 * `cond` sert à coller au personnage : un « bon vivant » (hygiene fetard)
 * croise plus souvent ces situations qu'un « pro absolu ».
 */

const LISTE = [
  {
    id: "troisieme_mi_temps",
    poids: 12,
    cond: (s) => s.age >= 19 && s.hygiene.id !== "pro",
    titre: "La troisième mi-temps",
    texte: (s) =>
      `Victoire à domicile. Le vestiaire de ${s.club.nom} enchaîne, et personne ne compte s'arrêter avant l'aube. Tu joues dans six jours.`,
    choix: [
      {
        label: "Rester jusqu'au bout",
        effet: (s) => {
          s.moral += 9;
          s.reput += 4;
          s.usure += 6;
          const r = Math.random();
          if (r < 0.14) {
            s.blessure = { nom: "Entorse bête sur la piste de danse", semaines: 3 };
            s.usure += 6;
            return "Chute idiote à 3h du matin. Entorse. Le staff ne rigole pas du tout.";
          }
          if (r < 0.4) {
            s.relationCoach -= 6;
            return "Soirée mémorable. Réveil catastrophique, entraînement du lundi sabordé.";
          }
          return "Le genre de nuit qui soude un groupe pour toute une saison.";
        },
      },
      {
        label: "Rentrer après une heure",
        effet: (s) => {
          s.usure -= 3;
          s.moral -= 3;
          s.relationCoach += 2;
          return "Un verre, une photo, au lit. Le corps te remerciera dimanche.";
        },
      },
    ],
  },

  {
    id: "boite_nuit",
    poids: 8,
    cond: (s) => s.age >= 20 && s.hygiene.id === "fetard",
    titre: "Minuit passé, ça chauffe",
    texte: () =>
      `Un type éméché cherche l'embrouille avec ton coéquipier au bar. Trois téléphones filment déjà. Tu sens que ça peut partir vite.`,
    choix: [
      {
        label: "Monter au créneau",
        effet: (s) => {
          const r = Math.random();
          if (r < 0.45) {
            s.flags.scandale = true;
            s.reput -= 20;
            s.moral -= 8;
            return "La vidéo tourne en boucle le lendemain. Le club publie un communiqué gêné.";
          }
          s.reput -= 4;
          s.moral += 3;
          return "Ça se calme sans dégât. Tu as eu chaud, très chaud.";
        },
      },
      {
        label: "Sortir ton coéquipier de là",
        effet: (s) => {
          s.moral += 4;
          s.reput += 3;
          return "Tu l'attrapes par le bras et tu files. Personne n'a rien filmé qui compte.";
        },
      },
    ],
  },

  {
    id: "prise_de_poids",
    poids: 9,
    cond: (s) => s.age >= 22 && (s.hygiene.id === "fetard" || s.usure > 40),
    titre: "La pesée du lundi",
    texte: () =>
      `Le préparateur physique repose la balance et te regarde longuement. « Trois kilos de trop. On en fait quoi ? »`,
    choix: [
      {
        label: "Diète stricte et double séance",
        effet: (s) => {
          s.stats.endurance += 2;
          s.usure -= 4;
          s.moral -= 5;
          return "Six semaines de privation. Le corps répond, la vie sociale trinque.";
        },
      },
      {
        label: "« Je gère, t'inquiète »",
        effet: (s) => {
          s.stats.endurance -= 2;
          s.usure += 5;
          s.relationCoach -= 4;
          return "Tu n'as rien changé. Le staff a noté, et ta VMA aussi.";
        },
      },
    ],
  },

  {
    id: "coupure_ete",
    poids: 8,
    cond: (s) => s.age >= 21,
    titre: "La coupure d'été",
    texte: () =>
      `Cinq semaines sans rugby devant toi. Un pote monte un trip surf-fête à l'autre bout du monde. Ton corps, lui, réclame du repos.`,
    choix: [
      {
        label: "Vraie coupure, repos total",
        effet: (s) => {
          s.usure -= 10;
          s.moral += 4;
          return "Sommeil, kiné, plage sans excès. Tu reviens neuf pour la reprise.";
        },
      },
      {
        label: "Enchaîner les festivals",
        effet: (s) => {
          s.usure += 4;
          s.moral += 8;
          s.reput += 2;
          return "Un été de légende. La reprise, en revanche, a piqué.";
        },
      },
    ],
  },

  {
    id: "muscu_extra",
    poids: 8,
    cond: (s) => s.age >= 20 && s.age <= 31,
    titre: "La salle en plus",
    texte: () =>
      `Un préparateur privé te propose un programme de force le soir, en plus des séances du club. Des résultats promis, mais une charge en plus sur un corps déjà sollicité.`,
    choix: [
      {
        label: "Prendre le programme",
        effet: (s) => {
          const r = Math.random();
          if (r < 0.2) {
            s.blessure = { nom: "Élongation à la charge", semaines: 4 };
            return "Tu as tiré sur la corde. Élongation. Le club apprécie moyennement le programme parallèle.";
          }
          s.stats.puissance += 2;
          s.usure += 4;
          return "Trois mois plus tard, tu pousses plus lourd et ça se voit sur le terrain.";
        },
      },
      {
        label: "Rester sur le protocole du club",
        effet: (s) => {
          s.relationCoach += 3;
          return "Tu suis la ligne du staff. Progrès plus lents, mais un corps préservé.";
        },
      },
    ],
  },

  {
    id: "sommeil",
    poids: 7,
    cond: (s) => s.age >= 23 && s.hygiene.id !== "pro",
    titre: "Les nuits blanches",
    texte: () =>
      `Tu dors mal depuis des semaines : jeux vidéo, écrans, esprit qui tourne. Le staff propose un suivi du sommeil. C'est contraignant.`,
    choix: [
      {
        label: "Suivre le protocole sommeil",
        effet: (s) => {
          s.usure -= 5;
          s.moral += 3;
          s.stats.mental += 1;
          return "Couvre-feu numérique, chambre au noir. Tu récupères enfin vraiment.";
        },
      },
      {
        label: "Continuer comme ça",
        effet: (s) => {
          s.usure += 3;
          s.moral -= 4;
          return "Rien ne change. La fatigue s'installe, sourde, saison après saison.";
        },
      },
    ],
  },

  {
    id: "alcool_gestion",
    poids: 6,
    cond: (s) => s.age >= 24 && s.hygiene.id === "fetard",
    titre: "Le verre de trop",
    texte: () =>
      `Un ancien du vestiaire te prend à part : « J'ai vu des carrières se finir au bar, pas sur le terrain. Fais gaffe. » Ça te reste en tête.`,
    choix: [
      {
        label: "Lever le pied sérieusement",
        effet: (s) => {
          s.usure -= 6;
          s.stats.endurance += 1;
          s.moral -= 3;
          return "Tu ralentis nettement. Moins de rires le samedi, plus de jambes le dimanche.";
        },
      },
      {
        label: "« Je contrôle »",
        effet: (s) => {
          s.moral += 3;
          s.usure += 4;
          return "Rien ne change. Tu contrôles. Enfin, c'est ce que tu te dis.";
        },
      },
    ],
  },
];

/** Marqués `kind: "hygiene"` pour l'affichage (couleur nuit) et le journal. */
export const VIE = LISTE.map((e) => ({ ...e, kind: "hygiene" }));
