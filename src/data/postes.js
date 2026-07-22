/**
 * Les 10 postes jouables.
 *
 * base       : attributs de départ (échelle 1-30)
 * usure      : multiplicateur d'usure physique par match
 * essaiRate  : essais moyens par match à note 70
 * buteur     : true si le poste tape les pénalités par défaut
 * poids      : pondération des attributs dans le calcul de la note globale
 *              (la somme doit faire 1.00)
 */
export const POSTES = [
  {
    id: "pilier",
    nom: "Pilier",
    num: "1/3",
    desc: "La mêlée passe par toi. Le corps encaisse.",
    base: { puissance: 16, vitesse: 6, technique: 8, vision: 7, mental: 11, endurance: 12 },
    usure: 1.55,
    essaiRate: 0.10,
    poids: { puissance: .40, endurance: .20, technique: .15, mental: .15, vitesse: .05, vision: .05 },
  },
  {
    id: "talonneur",
    nom: "Talonneur",
    num: "2",
    desc: "Lanceur en touche, moteur en mêlée. Précision sous pression.",
    base: { puissance: 14, vitesse: 8, technique: 12, vision: 9, mental: 11, endurance: 12 },
    usure: 1.45,
    essaiRate: 0.16,
    poids: { puissance: .28, technique: .25, endurance: .17, mental: .15, vision: .10, vitesse: .05 },
  },
  {
    id: "deuxieme",
    nom: "2ᵉ ligne",
    num: "4/5",
    desc: "Le ciel t'appartient en touche. Le sale boulot aussi.",
    base: { puissance: 15, vitesse: 7, technique: 9, vision: 8, mental: 10, endurance: 13 },
    usure: 1.40,
    essaiRate: 0.13,
    poids: { puissance: .35, endurance: .22, technique: .15, mental: .13, vision: .10, vitesse: .05 },
  },
  {
    id: "troisieme",
    nom: "3ᵉ ligne aile",
    num: "6/7",
    desc: "Premier sur le ballon, dernier à lâcher. Plaqueur en série.",
    base: { puissance: 13, vitesse: 11, technique: 10, vision: 10, mental: 12, endurance: 13 },
    usure: 1.35,
    essaiRate: 0.22,
    poids: { puissance: .24, endurance: .22, vitesse: .16, mental: .16, technique: .12, vision: .10 },
  },
  {
    id: "numero8",
    nom: "Numéro 8",
    num: "8",
    desc: "Le lien entre le combat et le jeu. Ballon porté, ballon donné.",
    base: { puissance: 14, vitesse: 10, technique: 11, vision: 12, mental: 12, endurance: 13 },
    usure: 1.30,
    essaiRate: 0.26,
    poids: { puissance: .24, vision: .18, endurance: .18, vitesse: .14, technique: .14, mental: .12 },
  },
  {
    id: "demi",
    nom: "Demi de mêlée",
    num: "9",
    desc: "Chef d'orchestre au ras. Tempo, gueule, vista.",
    base: { puissance: 7, vitesse: 13, technique: 14, vision: 15, mental: 13, endurance: 12 },
    usure: 1.10,
    essaiRate: 0.24,
    poids: { vision: .28, technique: .25, vitesse: .17, mental: .16, endurance: .10, puissance: .04 },
  },
  {
    id: "ouverture",
    nom: "Demi d'ouverture",
    num: "10",
    desc: "Le jeu se lit dans tes mains. Et le score dans ton pied.",
    base: { puissance: 7, vitesse: 11, technique: 15, vision: 16, mental: 12, endurance: 11 },
    usure: 1.05,
    essaiRate: 0.18,
    buteur: true,
    poids: { vision: .30, technique: .28, mental: .18, vitesse: .12, endurance: .08, puissance: .04 },
  },
  {
    id: "centre",
    nom: "Centre",
    num: "12/13",
    desc: "Casser la ligne ou la tenir. Souvent les deux.",
    base: { puissance: 12, vitesse: 12, technique: 11, vision: 12, mental: 11, endurance: 12 },
    usure: 1.25,
    essaiRate: 0.30,
    poids: { puissance: .22, vitesse: .22, technique: .18, vision: .18, mental: .12, endurance: .08 },
  },
  {
    id: "ailier",
    nom: "Ailier",
    num: "11/14",
    desc: "On te donne trois ballons par match. Tu dois en marquer un.",
    base: { puissance: 9, vitesse: 17, technique: 11, vision: 10, mental: 10, endurance: 11 },
    usure: 1.00,
    essaiRate: 0.52,
    poids: { vitesse: .42, technique: .18, puissance: .15, vision: .12, mental: .08, endurance: .05 },
  },
  {
    id: "arriere",
    nom: "Arrière",
    num: "15",
    desc: "Dernier rempart, premier relanceur. Le jeu au pied te juge.",
    base: { puissance: 9, vitesse: 14, technique: 13, vision: 14, mental: 12, endurance: 12 },
    usure: 1.05,
    essaiRate: 0.34,
    buteur: true,
    poids: { vision: .25, vitesse: .25, technique: .22, mental: .14, endurance: .09, puissance: .05 },
  },
];

export const getPoste = (id) => POSTES.find((p) => p.id === id);
