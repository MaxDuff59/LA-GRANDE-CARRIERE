import React from "react";
import { C, S } from "../styles/theme.js";
import { Bouton } from "./Bouton.jsx";

/** Affiche un événement narratif et ses choix. */
export function CarteEvenement({ evenement, etat, onChoix }) {
  return (
    <div style={{ ...S.card, borderColor: C.or }}>
      <div style={{ ...S.label, color: C.or, marginBottom: 6 }}>{evenement.titre}</div>
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
