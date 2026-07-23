import React from "react";
import { useJeu } from "./engine/useJeu.js";
import { Accueil } from "./screens/Accueil.jsx";
import { Creation } from "./screens/Creation.jsx";
import { Jeu } from "./screens/Jeu.jsx";
import { Bilan } from "./screens/Bilan.jsx";
import { Boutique } from "./screens/Boutique.jsx";

/**
 * Racine de l'application. Se contente d'aiguiller vers le bon écran :
 * tout l'état et la logique sont dans useJeu().
 */
export default function App() {
  const jeu = useJeu();

  switch (jeu.ecran) {
    case "creation":
      return (
        <Creation
          onValider={(setup) => jeu.lancerCarriere(setup, false)}
          onRetour={() => jeu.setEcran("accueil")}
        />
      );

    case "boutique":
      return (
        <Boutique
          perks={jeu.perks}
          jetons={jeu.jetons}
          debloques={jeu.debloques}
          equipes={jeu.equipes}
          onAcheter={jeu.acheterPerk}
          onBasculer={jeu.basculerPerk}
          onRetour={() => jeu.setEcran("accueil")}
        />
      );

    case "jeu":
      return (
        <Jeu
          s={jeu.s}
          journal={jeu.journal}
          evenement={jeu.evenement}
          resultat={jeu.resultat}
          offres={jeu.offres}
          onJouerSaison={jeu.jouerSaison}
          onChoixEvenement={jeu.repondreEvenement}
          onContinuer={jeu.continuer}
          onSigner={jeu.signer}
          onTerminer={jeu.terminerCarriere}
          onRetraite={jeu.prendreRetraite}
        />
      );

    case "bilan":
      return <Bilan s={jeu.s} onRejouer={() => jeu.setEcran("accueil")} />;

    default:
      return (
        <Accueil
          jetons={jeu.jetons}
          equipes={jeu.equipes}
          histo={jeu.histo}
          onCommencer={() => jeu.setEcran("creation")}
          onDefi={() => jeu.lancerCarriere(jeu.configDefi, true)}
          onBoutique={() => jeu.setEcran("boutique")}
        />
      );
  }
}
