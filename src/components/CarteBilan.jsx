import React from "react";
import { C, S, carteSaillante } from "../styles/theme.js";
import { Bouton } from "./Bouton.jsx";

/** Formate un montant en k€ vers « 0,8 M€ » ou « 640 k€ ». */
function argent(kEuros) {
  if (kEuros >= 1000) return `${(kEuros / 1000).toFixed(1).replace(".", ",")} M€`;
  return `${Math.round(kEuros)} k€`;
}

/** Une tuile de statistique du récap. */
function Tuile({ valeur, label }) {
  return (
    <div
      style={{
        background: C.panneauHaut,
        border: `1px solid ${C.bord}`,
        borderRadius: 10,
        padding: "14px 8px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 24, fontWeight: 800, color: C.accent2, lineHeight: 1 }}>
        {valeur}
      </div>
      <div
        style={{
          fontSize: 10,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: C.txt2,
          marginTop: 7,
        }}
      >
        {label}
      </div>
    </div>
  );
}

/** Petite ligne d'info avec une icône. */
function Ligne({ icone, children }) {
  return (
    <div style={{ display: "flex", gap: 10, fontSize: 14, lineHeight: 1.5 }}>
      <span style={{ flexShrink: 0 }}>{icone}</span>
      <span>{children}</span>
    </div>
  );
}

/**
 * Récapitulatif de fin de saison, présenté dans le modal avant les offres
 * de contrat. Une respiration entre deux saisons : ce que tu as fait, ce
 * que le club en pense, et un fait marquant pour l'ambiance.
 */
export function CarteBilan({ bilan, onContinuer }) {
  const b = bilan;
  return (
    <div style={{ ...S.card, ...carteSaillante(C.accent2), marginBottom: 0, padding: 20 }}>
      <div
        style={{
          ...S.label,
          color: C.accent2,
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span>📊</span>
        <span>
          Saison {b.saison} · {b.club} · {b.div}
        </span>
      </div>

      {/* Manchette de presse */}
      <div
        style={{
          borderLeft: `3px solid ${C.accent2}`,
          background: C.panneauHaut,
          borderRadius: "0 8px 8px 0",
          padding: "12px 14px",
          fontStyle: "italic",
          fontSize: 15,
          fontWeight: 600,
          lineHeight: 1.5,
          marginBottom: 20,
        }}
      >
        {b.manchette}
      </div>

      {/* Stats de la saison */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <Tuile valeur={b.matchs} label="Matchs" />
        <Tuile valeur={b.essais} label="Essais" />
        <Tuile valeur={b.points} label="Points" />
        <Tuile valeur={b.note} label="Note" />
      </div>

      {/* Détails */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
        <Ligne icone="🏆">
          Championnat : <strong>{b.classement}ᵉ</strong>{" "}
          <span style={{ color: C.txt2 }}>/ {b.equipes}</span>
        </Ligne>
        <Ligne icone={b.atteint ? "✅" : "❌"}>
          Objectif du club : {b.objectif}
        </Ligne>
        <Ligne icone="💰">
          <strong style={{ color: C.or }}>+{argent(b.revenus)}</strong>{" "}
          <span style={{ color: C.txt2 }}>(salaire &amp; sponsors)</span>
        </Ligne>
        <Ligne icone="💬">
          <span style={{ color: C.txt2 }}>{b.verdict}</span>
        </Ligne>
      </div>

      {b.faitMarquant && (
        <div
          style={{
            borderTop: `1px dashed ${C.bord}`,
            paddingTop: 16,
            marginBottom: 20,
            fontSize: 13.5,
            color: C.txt2,
            display: "flex",
            gap: 10,
          }}
        >
          <span style={{ flexShrink: 0 }}>🗞️</span>
          <span>{b.faitMarquant}</span>
        </div>
      )}

      <Bouton onClick={onContinuer}>Continuer</Bouton>
    </div>
  );
}
