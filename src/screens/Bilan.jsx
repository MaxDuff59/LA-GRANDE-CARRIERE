import React from "react";
import { C, S } from "../styles/theme.js";
import { Bouton } from "../components/Bouton.jsx";
import { calculerScore, rang } from "../engine/score.js";

export function Bilan({ s, onRejouer }) {
  const score = calculerScore(s);
  const r = rang(score);

  const chiffres = [
    ["Matchs", s.carriere.matchs],
    ["Essais", s.carriere.essais],
    ["Points", s.carriere.points],
    ["Sélections", s.internationalCaps],
    ["Note finale", s.note],
    ["Gains", `${Math.round(s.argent / 1000)} M€`],
  ];

  return (
    <div style={S.app}>
      <div style={S.wrap}>
        <div style={S.label}>Fin de carrière · {s.saison}</div>
        <h2 style={{ ...S.h2, fontSize: 30, margin: "4px 0 2px" }}>{s.nom}</h2>
        <div style={{ color: C.txt2, fontSize: 14 }}>
          {s.poste.nom} · {s.nation.flag} {s.nation.nom} · {s.age} ans
        </div>

        <div style={{ ...S.card, marginTop: 18, textAlign: "center", borderColor: r.couleur }}>
          <div style={{ fontSize: 44, fontWeight: 800, color: r.couleur, lineHeight: 1 }}>
            {score}
          </div>
          <div style={{ ...S.label, marginTop: 8, marginBottom: 0, color: r.couleur }}>
            {r.titre}
          </div>
        </div>

        <p style={{ ...S.sub, fontStyle: "italic" }}>{s.finRaison}</p>

        <div style={{ ...S.grid, marginTop: 16 }}>
          {chiffres.map(([label, valeur]) => (
            <div
              key={label}
              style={{ background: C.panneau, border: `1px solid ${C.bord}`, borderRadius: 8, padding: "10px 12px" }}
            >
              <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1 }}>{valeur}</div>
              <div style={{ fontSize: 10, color: C.txt2, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {s.carriere.titres.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div style={S.label}>Palmarès</div>
            {s.carriere.titres.map((t, i) => (
              <div
                key={i}
                style={{ ...S.card, padding: "10px 14px", display: "flex", justifyContent: "space-between", gap: 10 }}
              >
                <span style={{ fontWeight: 600, fontSize: 14 }}>🏆 {t.nom}</span>
                <span style={{ color: C.txt2, fontSize: 13, flexShrink: 0 }}>
                  {t.club} · {t.annee}
                </span>
              </div>
            ))}
          </div>
        )}

        {s.carriere.distinctions.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={S.label}>Distinctions</div>
            {s.carriere.distinctions.map((d, i) => (
              <div key={i} style={{ ...S.card, padding: "9px 14px", fontSize: 13.5 }}>
                ⭐ {d}
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 20 }}>
          <div style={S.label}>Saison par saison</div>
          <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
            {s.carriere.saisons.map((x, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 8,
                  padding: "9px 14px",
                  fontSize: 13,
                  borderBottom: i < s.carriere.saisons.length - 1 ? `1px solid ${C.bord}` : "none",
                }}
              >
                <span style={{ color: C.txt2 }}>
                  {x.saison} · {x.age} ans
                </span>
                <span>{x.club}</span>
                <span style={{ color: C.txt2 }}>
                  {x.matchs}m · {x.essais}e · {x.note}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Bouton onClick={onRejouer} style={{ marginTop: 20 }}>
          Nouvelle carrière
        </Bouton>
      </div>
    </div>
  );
}
