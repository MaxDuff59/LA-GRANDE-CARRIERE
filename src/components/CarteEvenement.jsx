import React from "react";
import { C, S, carteSaillante, teinte } from "../styles/theme.js";
import { Bouton } from "./Bouton.jsx";

/** Petites pastilles montrant l'impact chiffré du choix sur les jauges/stats. */
function Effets({ effets }) {
  if (!effets || !effets.length) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14 }}>
      {effets.map((e, i) => {
        const positif = e.delta > 0 === e.bon;
        return (
          <span
            key={i}
            style={{
              fontSize: 11.5,
              fontWeight: 600,
              padding: "4px 9px",
              borderRadius: 6,
              color: positif ? C.accent2 : C.rouge,
              background: teinte(positif ? C.accent2 : C.rouge, 13),
            }}
          >
            {e.label} {e.delta > 0 ? "+" : ""}
            {e.delta}
            {e.suffixe || ""}
          </span>
        );
      })}
    </div>
  );
}

/** Habillage par type de carte : couleur de bordure et badge d'en-tête. */
const KINDS = {
  action: { teinte: C.accent, badge: "⚡ Action de match" },
  hygiene: { teinte: C.nuit, badge: "🌙 Hygiène de vie" },
  intlFinal: { teinte: C.azur, badge: "🏆 Titre en jeu" },
};

/**
 * Carte de décision, en deux temps : la situation et ses options, puis
 * l'issue tirée au sort. Chaque type (action de match, hygiène de vie,
 * événement narratif) a sa teinte — ce ne sont pas les mêmes enjeux.
 */
export function CarteEvenement({ evenement, etat, resultat, onChoix, onContinuer }) {
  const conf = KINDS[evenement.kind];
  const teinte = conf ? conf.teinte : C.or;

  return (
    <div style={{ ...S.card, ...carteSaillante(teinte), marginBottom: 0, padding: 22 }}>
      {conf && (
        <div
          style={{
            ...S.label,
            color: teinte,
            fontSize: 10.5,
            marginBottom: 16,
            fontWeight: 700,
          }}
        >
          {conf.badge}
        </div>
      )}

      <div
        style={{
          fontSize: 18,
          fontWeight: 800,
          letterSpacing: "-0.01em",
          lineHeight: 1.3,
          color: teinte,
          marginBottom: 16,
        }}
      >
        {evenement.titre}
      </div>

      <p
        style={{
          fontSize: 14.5,
          lineHeight: 1.7,
          margin: "0 0 24px",
          color: resultat ? C.txt2 : C.txt,
        }}
      >
        {evenement.texte(etat)}
      </p>

      {resultat ? (
        <>
          <div
            style={{
              borderTop: `1px solid ${C.bord}`,
              paddingTop: 18,
              marginBottom: 20,
            }}
          >
            <div style={{ fontSize: 12.5, color: C.or, marginBottom: 12, fontWeight: 600 }}>
              ▸ {resultat.label}
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.65, margin: 0, fontWeight: 500 }}>
              {resultat.txt}
            </p>
            <Effets effets={resultat.effets} />
          </div>
          <Bouton onClick={onContinuer}>Continuer</Bouton>
        </>
      ) : (
        evenement.choix.map((c, i) => (
          <Bouton
            key={i}
            onClick={() => onChoix(c)}
            style={{
              background: "transparent",
              border: `1px solid ${C.bord}`,
              color: C.txt,
              textAlign: "left",
              marginBottom: 10,
              padding: "15px 18px",
              fontWeight: 600,
            }}
          >
            {c.label}
          </Bouton>
        ))
      )}
    </div>
  );
}
