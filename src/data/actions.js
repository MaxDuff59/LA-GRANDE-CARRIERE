/**
 * ACTIONS DE MATCH
 * ────────────────
 * Des micro-décisions vécues sur le terrain, 1 à 2 par saison. À la
 * différence des EVENTS narratifs, elles sont **répétables** (aucun flag
 * n'est posé) et leur résultat n'est pas écrit d'avance : chaque choix
 * ouvre plusieurs issues tirées au sort, pondérées par tes attributs.
 *
 * Format :
 *   id     : identifiant unique
 *   poids  : fréquence relative du tirage. 10 = fréquent, 5 = rare.
 *   cond   : (s) => bool — qui peut vivre cette action (poste, âge…)
 *   titre  : titre affiché
 *   texte  : (s) => string — la mise en situation, juste avant la décision
 *   choix  : [{ label, issues }]
 *
 * Une `issue` = une fin possible pour ce choix :
 *   poids  : (s) => number — poids RELATIF, pas une probabilité.
 *            Deux issues à 60 et 40 donnent 60 % / 40 %. Inutile donc de
 *            faire la somme à 100, il suffit de comparer les issues entre
 *            elles. Un plancher est appliqué par le moteur : une stat très
 *            haute ne rend jamais un échec strictement impossible.
 *   txt    : conséquence affichée au joueur
 *   effet  : (s) => void — mute l'état (mêmes champs que dans events.js)
 *
 * ÉQUILIBRAGE — la règle : à attributs moyens (~47 sur 100), les deux
 * options doivent tourner autour de 55-60 % de réussite. C'est la STAT qui
 * déplace le curseur, pas l'option. Une option plus risquée doit payer plus.
 */

const AVANTS = ["pilier", "talonneur", "deuxieme", "troisieme", "numero8"];

/** Inscrit un essai au bilan : carrière + saison en cours. */
function essai(s) {
  s.carriere.essais += 1;
  s.carriere.points += 5;
  const derniere = s.carriere.saisons[s.carriere.saisons.length - 1];
  if (derniere) derniere.essais += 1;
}

/** Inscrit des points au pied. */
function points(s, n) {
  s.carriere.points += n;
}

const LISTE = [
  {
    id: "deux_contre_un",
    poids: 10,
    cond: (s) => s.poste.essaiRate >= 0.22,
    titre: "2 contre 1",
    texte: (s) =>
      `62ᵉ minute, 22 mètres adverses. Tu perces la ligne d'avantage et il ne reste qu'un défenseur devant toi — ton ailier arrive à l'intérieur, lancé, seul. Le stade de ${s.club.nom} se lève.`,
    choix: [
      {
        label: "Faire la passe",
        issues: [
          {
            poids: (s) => 20 + s.stats.vision * 0.48 + s.stats.technique * 0.24,
            txt: "Tu fixes, tu donnes au cordeau. Essai à l'aile, plein axe. Le geste juste.",
            effet: (s) => {
              s.moral += 8;
              s.reput += 7;
              s.relationCoach += 8;
            },
          },
          {
            poids: (s) => 45 - s.stats.vision * 0.18,
            txt: "Passe télégraphiée. Le centre adverse la lit, l'intercepte, et part de 80 mètres. Silence dans le stade.",
            effet: (s) => {
              s.moral -= 10;
              s.reput -= 4;
              s.relationCoach -= 8;
            },
          },
        ],
      },
      {
        label: "Y aller en solo",
        issues: [
          {
            poids: (s) => 14 + s.stats.vitesse * 0.57 + s.stats.puissance * 0.27,
            txt: "Cadrage-débordement. Tu aplatis sous les poteaux sans être touché. Le genre d'essai qui tourne en boucle.",
            effet: (s) => {
              essai(s);
              s.moral += 4;
              s.reput += 3;
            },
          },
          {
            poids: (s) => 48 - s.stats.vitesse * 0.21,
            txt: "Plaqué à cinq mètres, ballon rendu. Ton ailier était seul. Le banc hurle, le coach ne dit rien — c'est pire.",
            effet: (s) => {
              s.usure += 4;
              s.moral -= 4;
              s.relationCoach -= 7;
            },
          },
        ],
      },
    ],
  },

  {
    id: "penalite_79",
    poids: 8,
    cond: (s) => (s.poste.buteur || s.perks.includes("buteur")) && s.tempsJeu > 40,
    titre: "La pénalité de la 79ᵉ",
    texte: (s) =>
      `Vous êtes menés de deux points. Pénalité à 42 mètres, légèrement excentrée, vent de face. L'arbitre attend ta décision. Le capitaine te regarde : c'est toi qui tapes.`,
    choix: [
      {
        label: "Taper les perches",
        issues: [
          {
            poids: (s) => 12 + s.stats.technique * 0.66 + s.stats.mental * 0.33,
            txt: "Frappe pure. Le ballon passe à un mètre au-dessus de la barre. Victoire au buzzer.",
            effet: (s) => {
              points(s, 3);
              s.moral += 12;
              s.reput += 8;
              s.relationCoach += 6;
              s.stats.mental += 1; // réussir sous pression forge le mental
            },
          },
          {
            poids: (s) => 52 - s.stats.mental * 0.24,
            txt: "Trop appuyé. Le ballon meurt sur le poteau gauche. Défaite. Tu mets vingt minutes à sortir des vestiaires.",
            effet: (s) => {
              s.moral -= 13;
              s.reput -= 5;
              s.stats.mental -= 1; // et rater laisse un doute
            },
          },
        ],
      },
      {
        label: "Jouer la touche à 5 mètres",
        issues: [
          {
            poids: (s) => 16 + s.stats.puissance * 0.3 + s.stats.mental * 0.27,
            txt: "Touche assurée, maul lancé, l'arbitre lève le bras. Essai collectif, victoire de cinq points. Le pack te porte.",
            effet: (s) => {
              points(s, 5);
              s.moral += 15;
              s.reput += 10;
              s.relationCoach += 8;
            },
          },
          {
            poids: (s) => 60 - s.stats.mental * 0.21,
            txt: "Maul écroulé, mêlée pour eux, coup de pied en tribunes. Fini. Tu as refusé trois points certains devant 20 000 personnes.",
            effet: (s) => {
              s.moral -= 9;
              s.reput -= 5;
              s.relationCoach -= 7;
            },
          },
        ],
      },
    ],
  },

  {
    id: "plaquage_limite",
    poids: 10,
    cond: (s) => s.age > 19,
    titre: "La zone rouge",
    texte: () =>
      `L'ouvreur adverse se lance dans l'intervalle, ballon sous le bras. Tu arrives lancé, en face. Tu as un dixième de seconde : le cueillir haut et l'arrêter net, ou plonger bas et prendre le risque qu'il te passe dessus.`,
    choix: [
      {
        label: "L'arrêter haut",
        issues: [
          {
            poids: (s) => 26 + s.stats.technique * 0.36,
            txt: "Épaule à hauteur de plexus, bras qui enveloppent. Plaquage énorme, ballon lâché, et l'arbitre laisse jouer.",
            effet: (s) => {
              s.reput += 7;
              s.moral += 7;
              s.relationCoach += 5;
            },
          },
          {
            poids: (s) => 40 - s.stats.technique * 0.27,
            txt: "Contact tête contre tête. Rouge direct, pas de circonstance atténuante. Commission de discipline.",
            effet: (s) => {
              s.suspension += 3;
              s.reput -= 4;
              s.moral -= 6;
              s.relationCoach -= 4;
            },
          },
        ],
      },
      {
        label: "Plonger bas",
        issues: [
          {
            poids: (s) => 30 + s.stats.technique * 0.3 + s.stats.puissance * 0.18,
            txt: "Plaquage aux chevilles, propre. Il tombe, le ballon est mort. Rien de spectaculaire, tout de juste.",
            effet: (s) => {
              s.relationCoach += 5;
              s.moral += 4;
              s.reput += 2;
              s.usure += 1;
            },
          },
          {
            poids: (s) => 42 - s.stats.puissance * 0.24,
            txt: "Tu glisses, il te passe dessus avec un raffut. Essai plein axe. Le ralenti tourne toute la semaine.",
            effet: (s) => {
              s.moral -= 5;
              s.reput -= 3;
              s.relationCoach -= 3;
              s.usure += 2;
            },
          },
        ],
      },
    ],
  },

  {
    id: "ballon_porte",
    poids: 9,
    cond: (s) => AVANTS.includes(s.posteId),
    titre: "Touche à cinq mètres",
    texte: (s) =>
      `78ᵉ minute, trois points d'écart, touche à cinq mètres. Le pack de ${s.club.nom} a dominé la mêlée toute la partie. Les trois-quarts réclament le ballon, les avants réclament un maul.`,
    choix: [
      {
        label: "Pousser le ballon porté",
        issues: [
          {
            poids: (s) => 18 + s.stats.puissance * 0.45 + s.stats.endurance * 0.21,
            txt: "Le maul avance de huit mètres sans jamais s'arrêter. Tu es au fond, ballon collé au ventre. Essai.",
            effet: (s) => {
              essai(s);
              s.moral += 10;
              s.reput += 5;
              s.usure += 1;
            },
          },
          {
            poids: (s) => 46 - s.stats.puissance * 0.21,
            txt: "Maul stoppé net puis écroulé. Pénalité contre vous pour obstruction. Vous ne reverrez plus le ballon.",
            effet: (s) => {
              s.moral -= 8;
              s.usure += 2;
              s.relationCoach -= 4;
            },
          },
        ],
      },
      {
        label: "Ouvrir aux trois-quarts",
        issues: [
          {
            poids: (s) => 22 + s.stats.vision * 0.42 + s.stats.technique * 0.21,
            txt: "Ballon propre, deux temps de jeu, essai à l'aile opposée. Ce n'est pas le tien, mais c'est ta décision.",
            effet: (s) => {
              s.moral += 7;
              s.reput += 3;
              s.relationCoach += 5;
            },
          },
          {
            poids: (s) => 44 - s.stats.vision * 0.18,
            txt: "Ballon lent, plaquage, grattage adverse. Le pack te fait comprendre au repli ce qu'il pense de ton choix.",
            effet: (s) => {
              s.moral -= 6;
              s.relationCoach -= 5;
            },
          },
        ],
      },
    ],
  },

  {
    id: "melee_cinq_metres",
    poids: 9,
    cond: (s) => ["pilier", "talonneur", "deuxieme"].includes(s.posteId),
    titre: "Mêlée à cinq mètres",
    texte: (s) =>
      `Mêlée à cinq mètres de leur ligne, introduction pour ${s.club.nom}. Tu sens que le pilier d'en face est cuit — il a reculé sur les trois dernières. L'arbitre regarde la première ligne. Une de plus et il siffle.`,
    choix: [
      {
        label: "Attaquer la mêlée, le faire craquer",
        issues: [
          {
            poids: (s) => 18 + s.stats.puissance * 0.48 + s.stats.endurance * 0.21,
            txt: "Tu prends l'ascendant à l'impact et tu ne le lâches plus. Il s'écroule. Pénalité, bras levé, et le stade qui gronde. C'est ton match.",
            effet: (s) => {
              s.reput += 8;
              s.moral += 8;
              s.relationCoach += 6;
              s.usure += 2;
            },
          },
          {
            poids: (s) => 44 - s.stats.puissance * 0.21,
            txt: "Tu montes trop haut en cherchant la pénalité. L'arbitre siffle contre toi, et te prévient : la prochaine, c'est jaune.",
            effet: (s) => {
              s.moral -= 7;
              s.relationCoach -= 5;
              s.usure += 2;
            },
          },
        ],
      },
      {
        label: "Assurer, sortir un ballon propre",
        issues: [
          {
            poids: (s) => 34 + s.stats.technique * 0.3 + s.stats.endurance * 0.18,
            txt: "Mêlée stable, ballon au pied du numéro 8, jeu lancé sans perdre une seconde. Le travail de l'ombre.",
            effet: (s) => {
              s.relationCoach += 5;
              s.moral += 3;
            },
          },
          {
            poids: (s) => 40 - s.stats.endurance * 0.21,
            txt: "Mêlée qui tourne malgré toi. Introduction rendue, occasion perdue. Le pack te regarde sans rien dire.",
            effet: (s) => {
              s.moral -= 4;
              s.relationCoach -= 3;
              s.usure += 2;
            },
          },
        ],
      },
    ],
  },

  {
    id: "relance_en_but",
    poids: 8,
    cond: (s) => ["ailier", "arriere", "demi"].includes(s.posteId),
    titre: "Chandelle dans l'en-but",
    texte: () =>
      `Ballon haut, très haut, qui retombe dans ton en-but. Trois joueurs adverses arrivent à pleine vitesse. Tu as le temps de réfléchir pendant sa descente — pas plus.`,
    choix: [
      {
        label: "Relancer",
        issues: [
          {
            poids: (s) => 10 + s.stats.vitesse * 0.51 + s.stats.vision * 0.3,
            txt: "Tu prends le ballon à deux mains, tu élimines le premier, puis le deuxième. Cinquante mètres gagnés d'un coup. Le stade explose.",
            effet: (s) => {
              s.moral += 11;
              s.reput += 9;
              s.usure += 2;
            },
          },
          {
            poids: (s) => 50 - s.stats.vitesse * 0.24,
            txt: "Plaqué dans ton propre en-but, ballon gratté. Essai encaissé le plus bête de la saison.",
            effet: (s) => {
              s.moral -= 10;
              s.reput -= 6;
              s.relationCoach -= 7;
              s.usure += 3;
            },
          },
        ],
      },
      {
        label: "Aplatir et taper en touche",
        issues: [
          {
            poids: (s) => 34 + s.stats.technique * 0.33 + s.stats.mental * 0.15,
            txt: "Renvoi aux 22 trouvé, quarante mètres, en touche. Sans génie, sans danger. Le coach hoche la tête.",
            effet: (s) => {
              s.relationCoach += 4;
              s.moral += 2;
            },
          },
          {
            poids: (s) => 40 - s.stats.technique * 0.27,
            txt: "Coup de pied vrillé qui reste dans le terrain. Contre-attaque, essai encaissé trois temps de jeu plus tard.",
            effet: (s) => {
              s.moral -= 7;
              s.relationCoach -= 4;
            },
          },
        ],
      },
    ],
  },

  {
    id: "gratte_au_sol",
    poids: 9,
    cond: (s) => ["troisieme", "numero8", "talonneur", "centre"].includes(s.posteId),
    titre: "Le ballon au sol",
    texte: () =>
      `Plaquage réussi de ton deuxième ligne, le porteur est au sol, le ballon est là, à découvert. Personne n'est encore arrivé pour le protéger. Tu es le premier soutien.`,
    choix: [
      {
        label: "Aller gratter",
        issues: [
          {
            poids: (s) => 20 + s.stats.technique * 0.39 + s.stats.puissance * 0.27,
            txt: "Appuis calés, dos plat, mains sur le ballon. L'arbitre siffle pour toi. Turnover dans leurs 22.",
            effet: (s) => {
              s.reput += 6;
              s.moral += 6;
              s.relationCoach += 5;
            },
          },
          {
            poids: (s) => 44 - s.stats.technique * 0.24,
            txt: "Déblayé au moment où tu poses les mains. Pénalité contre toi pour non-libération, trois points encaissés.",
            effet: (s) => {
              s.moral -= 6;
              s.relationCoach -= 5;
              s.usure += 2;
            },
          },
        ],
      },
      {
        label: "Sécuriser le ruck",
        issues: [
          {
            poids: (s) => 40 + s.stats.puissance * 0.24,
            txt: "Tu déblaies proprement les deux premiers arrivants. Ballon rapide, jeu qui continue. Personne ne le verra.",
            effet: (s) => {
              s.relationCoach += 4;
              s.moral += 3;
            },
          },
          {
            poids: (s) => 34 - s.stats.endurance * 0.18,
            txt: "Tu arrives une demi-seconde trop tard, un genou dans les côtes. Ballon quand même sauvé, côtes moins.",
            effet: (s) => {
              s.usure += 4;
              s.moral -= 3;
            },
          },
        ],
      },
    ],
  },

  {
    id: "touche_decisive",
    poids: 7,
    cond: (s) => ["talonneur", "deuxieme"].includes(s.posteId),
    titre: "Le lancer",
    texte: (s) =>
      `Touche à sept mètres de leur ligne, dernière minute, un point d'écart. ${s.club.nom} joue sa saison sur ce ballon. Le capitaine te laisse choisir la combinaison.`,
    choix: [
      {
        label: "Sur le 2, ballon court",
        issues: [
          {
            poids: (s) => 32 + s.stats.technique * 0.36,
            txt: "Ballon court, sauteur servi à hauteur de bras. Maul, essai, victoire. Le geste le plus simple était le bon.",
            effet: (s) => {
              points(s, 5);
              s.moral += 9;
              s.reput += 5;
              s.relationCoach += 5;
            },
          },
          {
            poids: (s) => 38 - s.stats.technique * 0.24,
            txt: "Lancer pas droit. Mêlée adverse, coup de pied en tribunes. Ta saison finit sur ce geste-là.",
            effet: (s) => {
              s.moral -= 12;
              s.reput -= 6;
              s.relationCoach -= 8;
            },
          },
        ],
      },
      {
        label: "En fond de touche, dans le trou",
        issues: [
          {
            poids: (s) => 14 + s.stats.technique * 0.42 + s.stats.vision * 0.3,
            txt: "Ballon tendu de vingt mètres, pile dans les mains du troisième ligne lancé. Essai en coin, personne ne l'a vu venir.",
            effet: (s) => {
              points(s, 5);
              s.moral += 16;
              s.reput += 12;
              s.relationCoach += 9;
              s.stats.vision += 1; // le geste juste sous pression affine la lecture
            },
          },
          {
            poids: (s) => 56 - s.stats.vision * 0.24,
            txt: "Interception en fond de touche. Contre-attaque de quatre-vingts mètres, essai encaissé, sirène. Tu restes assis sur la pelouse un long moment.",
            effet: (s) => {
              s.moral -= 15;
              s.reput -= 8;
              s.relationCoach -= 10;
              s.stats.mental -= 1;
            },
          },
        ],
      },
    ],
  },

  {
    id: "gestion_fin_match",
    poids: 8,
    cond: (s) => ["demi", "ouverture"].includes(s.posteId),
    titre: "Les deux dernières minutes",
    texte: () =>
      `Vous menez de trois points, il reste quatre-vingt-dix secondes, ballon dans vos 22 après une mêlée gagnée. Le banc fait des signes que tu ne comprends pas. C'est toi qui as le ballon.`,
    choix: [
      {
        label: "Taper en touche et défendre",
        issues: [
          {
            poids: (s) => 30 + s.stats.technique * 0.33 + s.stats.mental * 0.24,
            txt: "Coup de pied en spirale, quarante-cinq mètres, sortie franche. Touche adverse, sirène, victoire. Zéro romantisme, trois points au classement.",
            effet: (s) => {
              s.moral += 7;
              s.reput += 5;
              s.relationCoach += 7;
            },
          },
          {
            poids: (s) => 42 - s.stats.mental * 0.27,
            txt: "Le coup de pied reste dans le terrain. Contre-attaque, six temps de jeu, essai encaissé à la sirène. Défaite.",
            effet: (s) => {
              s.moral -= 11;
              s.reput -= 5;
              s.relationCoach -= 8;
            },
          },
        ],
      },
      {
        label: "Garder le ballon et jouer les temps",
        issues: [
          {
            poids: (s) => 20 + s.stats.vision * 0.45 + s.stats.mental * 0.27,
            txt: "Douze temps de jeu, pas un ballon lâché, la sirène qui sonne pendant un ruck. Tu tapes en tribunes. Maîtrise totale.",
            effet: (s) => {
              s.moral += 10;
              s.reput += 7;
              s.relationCoach += 9;
            },
          },
          {
            poids: (s) => 48 - s.stats.mental * 0.24,
            txt: "Neuvième temps de jeu, ballon gratté à vingt mètres de ta ligne. Pénalité, égalisation, match nul. Le vestiaire est glacial.",
            effet: (s) => {
              s.moral -= 9;
              s.relationCoach -= 7;
            },
          },
        ],
      },
    ],
  },

  {
    id: "bagarre_generale",
    poids: 7,
    cond: (s) => s.age >= 20,
    titre: "Ça part en vrille",
    texte: (s) =>
      `Ton pilier est au sol, un adversaire vient de lui marcher dessus délibérément. Tout le monde se lève. L'arbitre est de dos, à trente mètres. Le banc de ${s.club.nom} est déjà debout.`,
    choix: [
      {
        label: "Y aller, on ne laisse pas un coéquipier",
        issues: [
          {
            poids: (s) => 34 + s.stats.mental * 0.27,
            txt: "Tu arrives le premier, tu repousses sans frapper. L'arbitre ne siffle rien. Le vestiaire, lui, a tout vu.",
            effet: (s) => {
              s.reput += 5;
              s.moral += 7;
              s.relationCoach += 6;
            },
          },
          {
            poids: (s) => 40 - s.stats.mental * 0.21,
            txt: "Un coup de poing dans la mêlée. La vidéo le retrouve. Rouge, citation, commission.",
            effet: (s) => {
              s.suspension += 4;
              s.moral -= 6;
              s.reput -= 3;
              s.relationCoach -= 4;
            },
          },
        ],
      },
      {
        label: "Rester à distance",
        issues: [
          {
            poids: (s) => 24 + s.stats.mental * 0.27,
            txt: "Tu restes en dehors et tu vas parler à l'arbitre au calme. Carton jaune pour eux, pénalité pour vous. La tête froide a payé.",
            effet: (s) => {
              s.reput += 4;
              s.relationCoach += 5;
              s.moral += 3;
            },
          },
          {
            poids: () => 55,
            txt: "Tu recules de trois pas, mains en évidence. L'arbitre l'apprécie. Ton pilier, beaucoup moins.",
            effet: (s) => {
              s.moral -= 4;
              s.relationCoach -= 3;
              s.reput -= 3;
            },
          },
        ],
      },
    ],
  },

  {
    id: "arbitre_capitaine",
    poids: 6,
    cond: (s) => s.capitaine,
    titre: "Sous le poteau",
    texte: () =>
      `L'arbitre vient de siffler une pénalité contre vous sur un ruck. C'est la quatrième dans le même sens en dix minutes. Il t'appelle, toi, le capitaine. Tu as trente secondes et tout le stade écoute.`,
    choix: [
      {
        label: "Contester fermement",
        issues: [
          {
            poids: (s) => 16 + s.stats.mental * 0.42 + s.stats.vision * 0.18,
            txt: "Tu poses les faits, calmement, sans hausser le ton. Il te répond, il t'écoute. Les trois décisions suivantes tournent en votre faveur.",
            effet: (s) => {
              s.reput += 7;
              s.moral += 6;
              s.relationCoach += 6;
            },
          },
          {
            poids: (s) => 44 - s.stats.mental * 0.27,
            txt: "Il recule de dix mètres et te met un jaune pour contestation. Le capitanat, c'est aussi savoir se taire.",
            effet: (s) => {
              s.reput -= 5;
              s.moral -= 7;
              s.relationCoach -= 6;
            },
          },
        ],
      },
      {
        label: "Encaisser et rassembler l'équipe",
        issues: [
          {
            poids: (s) => 38 + s.stats.mental * 0.24,
            txt: "« Oui monsieur. » Tu rassembles les avants derrière les poteaux et tu remets tout le monde en ordre. Vous ne concédez plus rien.",
            effet: (s) => {
              s.moral += 5;
              s.relationCoach += 5;
              s.reput += 3;
            },
          },
          {
            poids: (s) => 32 - s.stats.mental * 0.12,
            txt: "Tu encaisses sans rien dire. Deux pénalités plus tard, même faute, même silence. Le groupe attendait autre chose de toi.",
            effet: (s) => {
              s.moral -= 6;
              s.reput -= 4;
            },
          },
        ],
      },
    ],
  },
];

/** Marquées `kind: "action"` pour l'affichage et le journal. */
export const ACTIONS = LISTE.map((a) => ({ ...a, kind: "action" }));
