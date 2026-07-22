# Destiny XV

Jeu de carrière de rugbyman professionnel. De 18 à 37 ans, saison après saison,
du Top 14 à la Coupe du Monde. Inspiré de Destiny Eleven, transposé au rugby.

## Démarrer

```bash
npm install
npm run dev          # serveur de dev sur localhost:5173
npm run build        # build de production dans dist/
npm run equilibrage  # banc d'essai du moteur (voir plus bas)
```

## Architecture

Séparation stricte entre **données** (ce que tu modifieras), **moteur**
(la simulation, sans React) et **interface** (React, sans logique métier).

```
src/
├── data/               ← LES FICHIERS À MODIFIER EN PRIORITÉ
│   ├── postes.js         10 postes : attributs, usure, taux d'essais, poids
│   ├── profil.js         nations, origines, hygiènes de vie, agents
│   ├── clubs.js          clubs, divisions, compétitions
│   ├── events.js         événements narratifs à choix ← le cœur du jeu
│   └── perks.js          avantages achetables
│
├── engine/             ← LA SIMULATION (JS pur, testable sans navigateur)
│   ├── utils.js          aléatoire, bornage, tirage pondéré, graine du jour
│   ├── joueur.js         création du joueur, note globale, rehydratation
│   ├── progression.js    évolution des attributs selon l'âge
│   ├── saison.js         simulation d'une saison complète
│   ├── marche.js         transferts, contrats, fin de carrière
│   ├── score.js          barème du score final et paliers de rangs
│   └── useJeu.js         hook React qui orchestre tout
│
├── components/         ← BRIQUES D'INTERFACE RÉUTILISABLES
│   ├── Bouton.jsx
│   ├── Jauge.jsx          jauges et lignes d'attributs
│   ├── Journal.jsx        journal déroulant auto-scrollé
│   ├── CarteEvenement.jsx
│   └── CarteOffres.jsx
│
├── screens/            ← LES 5 ÉCRANS
│   ├── Accueil.jsx
│   ├── Creation.jsx       tunnel de création en 6 étapes
│   ├── Jeu.jsx            écran principal
│   ├── Bilan.jsx          bilan de fin de carrière
│   └── Boutique.jsx       avantages et jetons
│
├── styles/
│   ├── theme.js           palette et styles partagés
│   └── global.css
│
├── App.jsx             ← routeur d'écrans, sans logique
└── main.jsx
```

**Règle à conserver :** `engine/` n'importe jamais React, et `screens/` ne
contient jamais de calcul de simulation. C'est ce qui permet de tester
l'équilibrage en ligne de commande.

## Ajouter du contenu

### Un événement (le plus utile)

Dans `src/data/events.js` :

```js
{
  id: "mon_evenement",       // unique, sert aussi à ne pas le rejouer
  poids: 8,                  // 10 = fréquent, 4 = rare
  unique: false,             // optionnel : true (défaut) = une fois par carrière
  cond: (s) => s.age >= 25 && s.club.niveau <= 2,
  titre: "Le titre affiché",
  texte: (s) => `Mise en situation, avec ${s.club.nom} interpolé.`,
  choix: [
    {
      label: "Premier choix",
      effet: (s) => {
        s.moral += 10;
        s.stats.mental += 2;
        s.flags.monFlag = true;     // conditionne d'autres événements
        return "La conséquence, affichée au joueur.";
      },
    },
    { label: "Second choix", effet: (s) => { s.reput -= 5; return "..."; } },
  ],
}
```

Champs modifiables dans `effet` : `stats.*`, `usure`, `moral`, `reput`,
`argent`, `tempsJeu`, `relationCoach`, `capitaine`, `selecEligible`,
`selecMalus`, `blessure = { nom, semaines }`, `suspension`, `flags.*`.
Les valeurs sont bornées automatiquement après application.

### Un club

Dans `src/data/clubs.js`. Garde la cohérence entre `budget`, `prestige` et
`niveau`, sinon le marché des transferts proposera des offres absurdes.

### Un poste

Dans `src/data/postes.js`. **Les `poids` doivent sommer exactement à 1.00** —
`npm run equilibrage` le vérifie.

### Un avantage

Dans `src/data/perks.js`, puis câble son effet dans le module concerné
(la liste des emplacements est en commentaire dans le fichier).

## Équilibrage

```bash
npm run equilibrage        # 500 carrières
npm run equilibrage 2000   # échantillon plus large
```

Le script simule des carrières entières et affiche la distribution des
scores, des rangs, des fins de carrière et des scores par poste.
Lance-le après **toute** modification de `score.js`, `saison.js` ou
`progression.js`.

Cibles actuelles, mesurées sur 3000 carrières :

| Indicateur | Valeur visée | Actuel |
|---|---|---|
| Médiane | International solide | ✓ 35 % |
| Légende absolue | < 3 % | 2,4 % |
| Écart meilleur/pire poste | < 30 % | 30 % (ailier 7592 → pilier 5832) |
| Fins de carrière | les 3 causes représentées | ✓ |

Note : sur 500 carrières, l'écart entre postes fluctue de ±10 points d'un
run à l'autre. Utilise un échantillon de 2000+ avant de conclure qu'un
changement a cassé quelque chose.

Si tu ajoutes un barème généreux, les paliers de `RANGS` dans `score.js`
devront être remontés : le script te dira de combien.

## Ce qui reste à faire

- **Persistance** : jetons, avantages débloqués et historique sont en
  mémoire et disparaissent au rechargement. Branche du stockage
  navigateur ou un backend selon ton hébergement.
- **Classement du Défi du jour** : la graine est déjà déterministe
  (`seedDuJour` dans `engine/utils.js`), il ne manque qu'un backend
  pour comparer les scores entre joueurs.
- **Plus d'événements** : il y en a 15. Vise 30-40 pour que deux
  carrières ne se ressemblent pas.
- **Contenu par poste** : les événements sont pour l'instant génériques.
  Des événements conditionnés par `s.poste.id` ajouteraient beaucoup.
