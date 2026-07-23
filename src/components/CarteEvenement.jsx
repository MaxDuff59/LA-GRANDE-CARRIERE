import React from "react";
import { C, S } from "../styles/theme.js";
import { Bouton } from "./Bouton.jsx";

/**
 * Carte de décision, en deux temps : la situation et ses options, puis
 * l'issue tirée au sort. Les actions de match ont une teinte distincte
 * des événements narratifs — ce ne sont pas les mêmes enjeux.
 */
export function CarteEvenement({ evenement, etat, resultat, onChoix, onContinuer }) {
  const estAction = evenement.kind === "action";
  const teinte = estAction ? C.accent : C.or;

  return (
    <div style={{ ...S.card, borderColor: teinte, marginBottom: 0 }}>
      {estAction && (
        <div
          style={{
            ...S.label,
            color: teinte,
            fontSize: 10.5,
            marginBottom: 8,
            fontWeight: 700,
          }}
        >
          ⚡ Action de match
        </div>
      )}

      <div style={{ ...S.label, color: teinte, marginBottom: 6 }}>{evenement.titre}</div>

      <p
        style={{
          fontSize: 14,
          lineHeight: 1.6,
          margin: "0 0 14px",
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
              paddingTop: 13,
              marginBottom: 13,
            }}
          >
            <div style={{ fontSize: 12.5, color: C.or, marginBottom: 8, fontWeight: 600 }}>
              ▸ {resultat.label}
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
              {resultat.txt}
            </p>
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
              marginBottom: 7,
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
