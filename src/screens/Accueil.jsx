import React from "react";
import { C, S } from "../styles/theme.js";
import { Bouton } from "../components/Bouton.jsx";

export function Accueil({ onCommencer, onDefi, onBoutique, jetons, equipes, histo }) {
  return (
    <div style={S.app}>
      <div style={S.wrap}>
        <div style={{ padding: "44px 0 32px" }}>
          <div style={{ ...S.label, color: C.accent }}>Jeu de carrière · Rugby</div>
          <h1 style={S.h1}>
            DESTINY <span style={{ color: C.accent }}>XV</span>
          </h1>
          <p style={S.sub}>
            De 18 à 37 ans, écris une carrière de rugbyman professionnel, saison après saison.
            Le poste que tu choisis décide de ton corps. Les choix que tu fais décident du reste.
            Personne ne connaît sa fin de carrière à l'avance.
          </p>
        </div>

        <Bouton onClick={onCommencer}>Commencer ma carrière</Bouton>

        <Bouton variante="secondaire" onClick={onDefi}>
          🎯 Défi du jour — profil imposé, sans avantages
        </Bouton>

        <Bouton variante="secondaire" onClick={onBoutique}>
          🪙 Avantages ({jetons} jetons · {equipes.length}/2 équipés)
        </Bouton>

        {histo.length > 0 && (
          <div style={{ marginTop: 28 }}>
            <div style={S.label}>Tes carrières</div>
            {histo.map((h, i) => (
              <div
                key={i}
                style={{
                  ...S.card,
                  padding: "11px 14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>
                    {h.nom} · {h.poste}
                  </div>
                  <div style={{ fontSize: 11, color: C.txt2 }}>
                    {h.rang} — {h.date}
                  </div>
                </div>
                <div style={{ fontWeight: 800, color: C.or, flexShrink: 0 }}>{h.score}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
