import React from "react";
import { C, S } from "../styles/theme.js";
import { Bouton } from "./Bouton.jsx";

/** Affiche un événement narratif ou une action de match, et ses choix. */
export function CarteEvenement({ evenement, etat, onChoix }) {
  const estAction = evenement.kind === "action";
  const teinte = estAction ? C.accent : C.or;

  return (
    <div style={{ ...S.card, borderColor: teinte }}>
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
      <p style={{ fontSize: 14, lineHeight: 1.6, margin: "0 0 14px" }}>
        {evenement.texte(etat)}
      </p>
      {evenement.choix.map((c, i) => (
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
      ))}
    </div>
  );
}
