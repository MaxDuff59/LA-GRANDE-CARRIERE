import React, { useEffect } from "react";
import { C, S, couleurJauge } from "../styles/theme.js";
import { Bouton } from "../components/Bouton.jsx";
import { Jauge, LigneAttribut } from "../components/Jauge.jsx";
import { Journal } from "../components/Journal.jsx";
import { CarteEvenement } from "../components/CarteEvenement.jsx";
import { CarteBilan } from "../components/CarteBilan.jsx";
import { CarteTournoi } from "../components/CarteTournoi.jsx";
import { CarteOffres } from "../components/CarteOffres.jsx";

export function Jeu({
  s,
  journal,
  evenement,
  resultat,
  offres,
  onJouerSaison,
  onChoixEvenement,
  onContinuer,
  onSigner,
  onTerminer,
  onRetraite,
}) {
  // « Continuer » est actif sur le bilan, un tournoi, ou une carte dont
  // l'issue a déjà été tirée — mais jamais quand des choix sont proposés
  // ou sur l'écran d'offres.
  const continuerActif = Boolean(
    s && evenement && (evenement.kind === "recap" || evenement.kind === "intl" || resultat)
  );

  // Sur ordinateur, Entrée équivaut à cliquer sur « Continuer ». On laisse le
  // clic natif agir si un bouton a déjà le focus (évite un double déclenchement).
  useEffect(() => {
    if (!continuerActif) return;
    const onKey = (e) => {
      if (e.key !== "Enter") return;
      if (document.activeElement?.tagName === "BUTTON") return;
      e.preventDefault();
      onContinuer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [continuerActif, onContinuer]);

  if (!s) return null;

  const bloque = Boolean(evenement || offres);

  return (
    <div style={S.app}>
      <div style={S.wrap}>
        {/* En-tête joueur */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 14,
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: "-0.02em" }}>
              {s.nom}
              {s.capitaine && <span style={{ color: C.or, fontSize: 13 }}> (cap.)</span>}
            </div>
            <div style={{ fontSize: 12.5, color: C.txt2 }}>
              {s.poste.nom} · {s.nation.flag} {s.club.nom} · {s.club.div}
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 30, fontWeight: 800, color: C.accent, lineHeight: 1 }}>
              {s.note}
            </div>
            <div style={{ fontSize: 11, color: C.txt2 }}>
              {s.age} ans · {s.saison}
            </div>
          </div>
        </div>

        {/* Jauges principales */}
        <div style={{ ...S.grid, marginBottom: 12 }}>
          <Jauge label="Temps de jeu" valeur={s.tempsJeu} couleur={C.accent} suffixe="%" />
          <Jauge label="Usure" valeur={s.usure} couleur={couleurJauge(s.usure, true)} />
          <Jauge label="Moral" valeur={s.moral} couleur={couleurJauge(s.moral)} />
          <Jauge label="Réputation" valeur={s.reput} couleur={C.or} />
        </div>

        {/* Attributs */}
        <div style={{ ...S.card, padding: "12px 14px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(88px, 1fr))",
              gap: "10px 14px",
            }}
          >
            {Object.entries(s.stats).map(([nom, valeur]) => (
              <LigneAttribut key={nom} nom={nom} valeur={valeur} />
            ))}
          </div>
        </div>

        <Journal lignes={journal} />

        {/* Carte de décision active : dans le flux, sous les autres éléments,
            mise en valeur par sa teinte (voir carteSaillante). La clé relance
            l'animation d'entrée quand une carte succède à une autre. */}
        {evenement && (
          <div
            key={evenement.id}
            style={{ animation: "carteEnter .42s cubic-bezier(.2, .7, .3, 1)" }}
          >
            {evenement.kind === "recap" ? (
              <CarteBilan bilan={evenement.bilan} onContinuer={onContinuer} />
            ) : evenement.kind === "intl" ? (
              <CarteTournoi campagne={evenement.campagne} onContinuer={onContinuer} />
            ) : (
              <CarteEvenement
                evenement={evenement}
                etat={s}
                resultat={resultat}
                onChoix={onChoixEvenement}
                onContinuer={onContinuer}
              />
            )}
          </div>
        )}

        {!evenement && offres && (
          <div key="offres" style={{ animation: "carteEnter .42s cubic-bezier(.2, .7, .3, 1)" }}>
            <CarteOffres offres={offres} onSigner={onSigner} />
          </div>
        )}

        {!bloque &&
          (s.fini ? (
            <Bouton onClick={onTerminer}>Voir le bilan de carrière</Bouton>
          ) : (
            <>
              <Bouton onClick={onJouerSaison}>Jouer la saison {s.saison}</Bouton>
              <Bouton variante="secondaire" onClick={onRetraite}>
                Prendre ma retraite maintenant
              </Bouton>
            </>
          ))}
      </div>
    </div>
  );
}
