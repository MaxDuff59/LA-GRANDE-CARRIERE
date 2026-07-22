/**
 * ÉVÉNEMENTS NARRATIFS
 * ────────────────────
 * C'est le cœur modifiable du jeu. Plus il y en a, moins les carrières
 * se ressemblent. Vise 30+ événements pour une bonne rejouabilité.
 *
 * Format :
 *   id      : identifiant unique (sert aussi à ne pas rejouer l'événement)
 *   poids   : fréquence relative. 10 = fréquent, 4 = rare.
 *   unique  : true (défaut) = ne se déclenche qu'une fois par carrière
 *   cond    : (s) => bool — conditions d'apparition
 *   titre   : titre affiché
 *   texte   : (s) => string — mise en situation
 *   choix   : [{ label, effet }] — effet(s) mute l'état et retourne
 *             le texte de conséquence affiché au joueur
 *
 * Dans `effet`, tu peux modifier librement :
 *   s.stats.{puissance|vitesse|technique|vision|mental|endurance}
 *   s.usure, s.moral, s.reput, s.argent, s.tempsJeu, s.relationCoach
 *   s.blessure = { nom, semaines }
 *   s.suspension = nombre de semaines
 *   s.capitaine, s.selecEligible, s.selecMalus
 *   s.flags.xxx = true  (pour conditionner d'autres événements)
 *
 * Les valeurs sont automatiquement bornées après application.
 */

export const EVENTS = [
  {
    id: "commotion",
    poids: 10,
    cond: (s) => s.age > 19,
    titre: "Le protocole commotion",
    texte: (s) =>
      `Choc tête contre hanche à la 62ᵉ. Tu te relèves, un peu flou. Le médecin de ${s.club.nom} te regarde. Le match est serré.`,
    choix: [
      {
        label: "Dire que ça va",
        effet: (s) => {
          s.usure += 9; s.moral += 4; s.reput += 3;
          if (Math.random() < 0.32) {
            s.blessure = { nom: "Séquelles neurologiques", semaines: 14 };
            return "Tu as fini le match. Trois semaines plus tard, les maux de tête ne partent plus.";
          }
          return "Tu as tenu. Le staff apprécie, ton cerveau moins.";
        },
      },
      {
        label: "Sortir immédiatement",
        effet: (s) => {
          s.usure -= 3; s.moral -= 3; s.reput -= 2;
          return "Protocole respecté, 12 jours d'arrêt. Certains supporters ont sifflé.";
        },
      },
    ],
  },

  {
    id: "capitanat",
    poids: 9,
    cond: (s) => s.age >= 24 && s.note >= 70 && !s.capitaine && s.ancienneteClub >= 2,
    titre: "Le brassard",
    texte: (s) =>
      `Le capitaine de ${s.club.nom} part en fin de saison. Le staff te sonde. C'est de la charge mentale, des médias, des arbitres à gérer.`,
    choix: [
      {
        label: "Accepter le brassard",
        effet: (s) => {
          s.capitaine = true; s.reput += 12; s.moral -= 5; s.stats.mental += 2;
          return "Capitaine. Tu ne joues plus seulement pour toi.";
        },
      },
      {
        label: "Refuser, rester joueur",
        effet: (s) => {
          s.moral += 5; s.reput -= 4;
          return "Tu as décliné. Le staff a noté que tu n'étais pas un leader.";
        },
      },
    ],
  },

  {
    id: "bagarre",
    poids: 9,
    cond: (s) => s.age >= 20,
    titre: "La générale",
    texte: () =>
      `Ton deuxième ligne se fait marcher dessus au sol. Le ruck dégénère. Tu es à trois mètres.`,
    choix: [
      {
        label: "Rentrer dans le tas",
        effet: (s) => {
          s.reput += 6; s.moral += 6;
          if (Math.random() < 0.45) {
            s.suspension = 4;
            return "Rouge et 4 semaines de suspension. Le vestiaire t'a adopté à vie.";
          }
          return "Coup de poing non vu par l'arbitre. Ton coéquipier ne l'oubliera pas.";
        },
      },
      {
        label: "Rester en dehors",
        effet: (s) => {
          s.reput -= 7; s.moral -= 4;
          return "Tu as reculé. Une image circule. On t'appelle par un surnom, maintenant.";
        },
      },
    ],
  },

  {
    id: "prolongation",
    poids: 9,
    unique: false,
    cond: (s) => s.contratRestant === 1 && s.age < 34,
    titre: "La prolongation anticipée",
    texte: (s) =>
      `${s.club.nom} propose deux ans de plus, tout de suite. C'est confortable, c'est chez toi, et c'est peut-être un plafond.`,
    choix: [
      {
        label: "Prolonger maintenant",
        effet: (s) => {
          s.contratRestant = 3; s.moral += 5; s.flags.fidele = true;
          return "Deux ans de plus. La stabilité a un prix.";
        },
      },
      {
        label: "Se laisser libre en juin",
        effet: (s) => {
          s.moral -= 2; s.flags.libre = true;
          return "Tu seras libre en juin. Les agents savent déjà.";
        },
      },
    ],
  },

  {
    id: "infiltration",
    poids: 8,
    unique: false,
    cond: (s) => s.usure > 45,
    titre: "L'infiltration",
    texte: () =>
      `Demi-finale dans six jours. Ton épaule ne tient plus. Le médecin propose une infiltration : tu joueras, et tu paieras plus tard.`,
    choix: [
      {
        label: "Faire l'infiltration",
        effet: (s) => {
          s.usure += 14; s.moral += 5; s.reput += 5;
          s.flags.infiltre = (s.flags.infiltre || 0) + 1;
          return "Tu as joué la demie. L'épaule ne sera plus jamais la même.";
        },
      },
      {
        label: "Déclarer forfait",
        effet: (s) => {
          s.moral -= 6; s.usure -= 5;
          return "Tu as regardé depuis la tribune. Le club a perdu de 3 points.";
        },
      },
    ],
  },

  {
    id: "offre_japon",
    poids: 8,
    cond: (s) => s.age >= 28 && s.note >= 68 && !s.flags.japon,
    titre: "Le chèque japonais",
    texte: () =>
      `Un club de League One propose 18 mois : 1,1 M€ net, 14 matchs par saison, zéro pression. Le rugby que tu connais s'arrête là.`,
    choix: [
      {
        label: "Signer au Japon",
        effet: (s) => {
          s.flags.japon = true;
          s.argent += 2200;
          s.usure -= 12;
          s.selecEligible = false;
          s.flags.forceClubJapon = true; // traité par le moteur
          return "Kobe. Le soleil, l'argent, et la fin discrète des ambitions internationales.";
        },
      },
      {
        label: "Refuser, je veux jouer le titre",
        effet: (s) => {
          s.moral += 6; s.reput += 4;
          return "Tu restes. Ton banquier ne comprend pas, ton vestiaire si.";
        },
      },
    ],
  },

  {
    id: "jeune",
    poids: 8,
    cond: (s) => s.age >= 29,
    titre: "Le gamin de 19 ans",
    texte: () =>
      `Un espoir du centre de formation joue à ton poste. Il est meilleur que toi au même âge. Le staff te demande de l'accompagner.`,
    choix: [
      {
        label: "Le former sincèrement",
        effet: (s) => {
          s.reput += 10; s.tempsJeu -= 12; s.moral -= 3; s.flags.mentor = true;
          return "Tu lui as tout donné. Il te prendra ta place dans 14 mois.";
        },
      },
      {
        label: "Le tenir à distance",
        effet: (s) => {
          s.tempsJeu += 6; s.reput -= 8; s.moral -= 5;
          return "Tu gardes ta place cette saison. Le vestiaire a vu.";
        },
      },
    ],
  },

  {
    id: "salary_cap",
    poids: 7,
    cond: (s) => s.age >= 23 && s.club.niveau <= 2,
    titre: "Le montage financier",
    texte: (s) =>
      `Le président de ${s.club.nom} propose de faire passer une partie de ton salaire par une société d'image. Légal en apparence. Personne ne pose de questions.`,
    choix: [
      {
        label: "Signer sans lire",
        effet: (s) => {
          s.argent += 500;
          if (Math.random() < 0.28) {
            s.flags.scandale = true; s.reput -= 22;
            return "Deux ans plus tard, la commission ouvre un dossier. Ton nom sort dans la presse.";
          }
          return "L'argent est tombé. Rien n'est jamais remonté.";
        },
      },
      {
        label: "Refuser proprement",
        effet: (s) => {
          s.reput += 5; s.moral += 2;
          return "Tu as demandé un contrat classique. Le président t'a regardé bizarrement.";
        },
      },
    ],
  },

  {
    id: "selection_choix",
    poids: 7,
    unique: false,
    cond: (s) => s.internationalCaps >= 5 && s.age >= 27,
    titre: "Tournée d'été ou repos",
    texte: () =>
      `Le sélectionneur t'appelle pour une tournée de trois tests. Ton club te demande de te reposer : tu sors de 32 matchs.`,
    choix: [
      {
        label: "Répondre présent",
        effet: (s) => {
          s.internationalCaps += 3; s.usure += 11; s.reput += 6;
          return "Trois tests de plus. Ton corps a payé l'addition en septembre.";
        },
      },
      {
        label: "Déclarer forfait",
        effet: (s) => {
          s.usure -= 8; s.flags.forfaitSelec = true;
          s.selecMalus = (s.selecMalus || 0) + 8;
          return "Tu t'es reposé. Le sélectionneur a pris quelqu'un d'autre. Il a bien joué.";
        },
      },
    ],
  },

  {
    id: "media",
    poids: 6,
    cond: (s) => s.reput >= 55,
    titre: "Le micro tendu",
    texte: () =>
      `Après une défaite, un journaliste te demande si le problème vient du staff. La caméra tourne.`,
    choix: [
      {
        label: "Charger le staff",
        effet: (s) => {
          s.reput += 4; s.moral += 4;
          s.relationCoach -= 25;
          return "La phrase a fait la une. L'entraîneur ne t'a plus adressé la parole pendant six semaines.";
        },
      },
      {
        label: "Protéger le groupe",
        effet: (s) => {
          s.relationCoach += 12; s.reput += 2;
          return "Langue de bois maîtrisée. Le staff a apprécié.";
        },
      },
    ],
  },

  {
    id: "reconversion_invest",
    poids: 6,
    cond: (s) => s.age >= 30,
    titre: "L'après",
    texte: () =>
      `Un ami te propose d'investir dans un projet en dehors du rugby. Il faut du temps, et de l'argent, maintenant.`,
    choix: [
      {
        label: "Investir 200 k€",
        effet: (s) => {
          s.argent -= 200; s.moral -= 2;
          if (Math.random() < 0.5) {
            s.flags.business = true; s.argent += 700;
            return "Le projet a marché. Ton après-carrière est réglé.";
          }
          return "Le projet a coulé en 18 mois. L'argent est parti.";
        },
      },
      {
        label: "Passer mon tour",
        effet: (s) => {
          s.moral += 2;
          return "Tu restes concentré sur le terrain.";
        },
      },
    ],
  },

  {
    id: "controle",
    poids: 4,
    cond: (s) => s.age >= 22 && s.hygiene.id === "fetard",
    titre: "Contrôle inopiné",
    texte: () => `6h30, deux préleveurs à ta porte. Tu es rentré à 4h.`,
    choix: [
      {
        label: "Ouvrir et coopérer",
        effet: (s) => {
          s.moral -= 3;
          if (Math.random() < 0.12) {
            s.suspension = 30; s.reput -= 30;
            return "Test positif à une substance récréative. Suspension longue.";
          }
          return "Contrôle négatif. Grosse frayeur.";
        },
      },
      {
        label: "Ne pas ouvrir",
        effet: (s) => {
          s.suspension = 20; s.reput -= 25;
          return "Refus de contrôle. Traité comme un positif.";
        },
      },
    ],
  },

  {
    id: "changement_poste",
    poids: 5,
    cond: (s) => s.age >= 26 && s.age <= 32 && s.tempsJeu < 45,
    titre: "Le glissement de poste",
    texte: (s) =>
      `Le staff te voit ailleurs. Ton profil physique a évolué, ton poste actuel est bouché. Il faudrait tout réapprendre.`,
    choix: [
      {
        label: "Accepter la reconversion",
        effet: (s) => {
          s.stats.technique -= 2;
          s.stats.mental += 3;
          s.tempsJeu += 20;
          s.flags.reconverti = true;
          return "Nouveau poste, nouveau départ. Les premiers mois ont été durs.";
        },
      },
      {
        label: "Refuser, c'est mon poste",
        effet: (s) => {
          s.relationCoach -= 15; s.moral -= 4;
          return "Tu as tenu ta position. Le staff a arrêté de te proposer des solutions.";
        },
      },
    ],
  },

  {
    id: "greve",
    poids: 5,
    cond: (s) => s.age >= 25 && s.reput >= 45,
    titre: "Le bras de fer",
    texte: () =>
      `Le syndicat des joueurs appelle à boycotter une journée de championnat contre la surcharge de matchs. Les leaders sont attendus.`,
    choix: [
      {
        label: "Prendre la parole publiquement",
        effet: (s) => {
          s.reput += 14; s.relationCoach -= 12; s.flags.syndicaliste = true;
          return "Tu es devenu un visage du mouvement. Les présidents t'ont dans le viseur.";
        },
      },
      {
        label: "Rester en retrait",
        effet: (s) => {
          s.moral -= 3;
          return "Tu as joué. Certains coéquipiers ne l'ont pas compris.";
        },
      },
    ],
  },

  {
    id: "blessure_coequipier",
    poids: 6,
    cond: (s) => s.age >= 21,
    titre: "Le plaquage de trop",
    texte: () =>
      `Ton plaquage envoie un adversaire à l'hôpital. Cervicales. Il ne rejouera pas. La commission t'entend jeudi.`,
    choix: [
      {
        label: "Aller le voir à l'hôpital",
        effet: (s) => {
          s.suspension = 6; s.reput += 8; s.moral -= 10;
          return "Il t'a serré la main. Tu penses encore à lui, des années après.";
        },
      },
      {
        label: "Laisser les avocats gérer",
        effet: (s) => {
          s.suspension = 3; s.reput -= 10; s.moral -= 5;
          return "Suspension réduite. La presse a titré sur ton silence.";
        },
      },
    ],
  },
];
