import React from "react";
import { C, S, optionStyle } from "../styles/theme.js";

/** Liste des offres de contrat en fin de bail. */
export function CarteOffres({ offres, onSigner }) {
  return (
    <div style={{ ...S.card, borderColor: C.accent2, marginBottom: 0, padding: 22 }}>
      <div style={{ ...S.label, color: C.accent2, marginBottom: 6 }}>
        Fin de contrat
      </div>
      <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 18 }}>Choisis ton club</div>
      {offres.map((o, i) => (
        <div
          key={i}
          onClick={() => onSigner(o)}
          style={{
            ...optionStyle(false),
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            padding: "14px 16px",
            marginBottom: 10,
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: 14.5 }}>
              {o.club.nom}
              {o.prolongation && (
                <span style={{ color: C.txt2, fontWeight: 400, fontSize: 12 }}> · prolongation</span>
              )}
            </div>
            <div style={{ fontSize: 12, color: C.txt2 }}>
              {o.club.div} · prestige {o.club.prestige}
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{o.salaire} k€/m</div>
            <div style={{ fontSize: 11.5, color: C.txt2 }}>
              {o.duree} an{o.duree > 1 ? "s" : ""}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
