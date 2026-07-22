import React from "react";
import { C } from "../styles/theme.js";

const clamp = (v) => Math.max(0, Math.min(100, v));

const carte = {
  background: C.panneau,
  border: `1px solid ${C.bord}`,
  borderRadius: 8,
  padding: "10px 12px",
};

/** Petite jauge horizontale avec valeur et libellé. */
export function Jauge({ label, valeur, max = 100, couleur = C.accent, suffixe = "" }) {
  const pct = clamp((valeur / max) * 100);
  return (
    <div style={carte}>
      <div style={{ fontSize: 17, fontWeight: 800, lineHeight: 1, color: couleur }}>
        {Math.round(valeur)}{suffixe}
      </div>
      <div style={{ fontSize: 10, color: C.txt2, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>
        {label}
      </div>
      <div style={{ height: 4, background: "#232A32", borderRadius: 2, overflow: "hidden", marginTop: 6 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: couleur, borderRadius: 2 }} />
      </div>
    </div>
  );
}

/** Ligne d'attribut compacte, utilisée dans le panneau de stats. */
export function LigneAttribut({ nom, valeur, max = 30 }) {
  const pct = clamp((valeur / max) * 100);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5 }}>
        <span style={{ color: C.txt2, textTransform: "capitalize" }}>{nom}</span>
        <span style={{ fontWeight: 700 }}>{Math.round(valeur)}</span>
      </div>
      <div style={{ height: 4, background: "#232A32", borderRadius: 2, overflow: "hidden", marginTop: 6 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: C.accent2, borderRadius: 2 }} />
      </div>
    </div>
  );
}
