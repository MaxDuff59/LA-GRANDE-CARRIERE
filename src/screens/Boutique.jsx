import React from "react";
import { MAX_PERKS_EQUIPES } from "../data/perks.js";
import { C, S } from "../styles/theme.js";
import { Bouton } from "../components/Bouton.jsx";

export function Boutique({ perks, jetons, debloques, equipes, onAcheter, onBasculer, onRetour }) {
  return (
    <div style={S.app}>
      <div style={S.wrap}>
        <div style={S.label}>Avantages · {jetons} jetons</div>
        <p style={{ ...S.sub, marginBottom: 20 }}>
          Gagne des jetons en terminant des carrières. Débloque des avantages, puis
          équipes-en {MAX_PERKS_EQUIPES} au maximum. Le Défi du jour les ignore : il reste
          identique pour tout le monde.
        </p>

        {perks.map((p) => {
          const estDebloque = debloques.includes(p.id);
          const estEquipe = equipes.includes(p.id);
          const trop = !estEquipe && equipes.length >= MAX_PERKS_EQUIPES;

          return (
            <div key={p.id} style={{ ...S.card, borderColor: estEquipe ? C.accent2 : C.bord }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{p.nom}</div>
                  <div style={{ fontSize: 12.5, color: C.txt2, marginTop: 3 }}>{p.desc}</div>
                </div>

                <div style={{ flexShrink: 0 }}>
                  {!estDebloque ? (
                    <Bouton
                      onClick={() => onAcheter(p)}
                      disabled={jetons < p.cout}
                      style={{ width: "auto", padding: "8px 14px", fontSize: 13 }}
                    >
                      🪙 {p.cout}
                    </Bouton>
                  ) : (
                    <Bouton
                      onClick={() => onBasculer(p.id)}
                      disabled={trop}
                      style={{
                        width: "auto",
                        padding: "8px 14px",
                        fontSize: 13,
                        background: estEquipe ? C.accent2 : "transparent",
                        border: `1px solid ${estEquipe ? C.accent2 : C.bord}`,
                        color: estEquipe ? "#fff" : C.txt2,
                      }}
                    >
                      {estEquipe ? "Équipé" : "Équiper"}
                    </Bouton>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <Bouton variante="secondaire" onClick={onRetour}>
          Retour
        </Bouton>
      </div>
    </div>
  );
}
