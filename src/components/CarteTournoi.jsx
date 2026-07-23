import React from "react";
import { C, S, carteSaillante } from "../styles/theme.js";
import { Bouton } from "./Bouton.jsx";
import { SELECTIONS } from "../data/international.js";

/** Pastille Victoire / Défaite. */
function Issue({ gagne }) {
  return (
    <span
      style={{
        fontSize: 10.5,
        fontWeight: 800,
        color: gagne ? C.accent2 : C.rouge,
        letterSpacing: "0.06em",
      }}
    >
      {gagne ? "V" : "D"}
    </span>
  );
}

/** Une ligne de match du parcours de la nation. */
function LigneMatch({ m }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        padding: "6px 0",
        fontSize: 13.5,
        borderBottom: `1px solid ${C.bord}`,
      }}
    >
      <span style={{ color: C.txt2 }}>
        {m.tour ? <span style={{ color: C.txt2 }}>{m.tour} · </span> : null}
        {m.advFlag} {m.advNom}
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>
          {m.score[0]}–{m.score[1]}
        </span>
        <Issue gagne={m.gagne} />
      </span>
    </div>
  );
}

/** En-tête de section. */
function Titre({ children }) {
  return (
    <div style={{ ...S.label, color: C.azur, marginTop: 18, marginBottom: 10 }}>{children}</div>
  );
}

/** Tableau de classement d'un tournoi, la nation du joueur surlignée. */
function Classement({ standings, nation }) {
  return (
    <div style={{ fontSize: 13 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "22px 1fr 34px 34px",
          gap: 6,
          color: C.txt2,
          fontSize: 10.5,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          padding: "0 8px 6px",
        }}
      >
        <span>#</span>
        <span>Équipe</span>
        <span style={{ textAlign: "center" }}>V-D</span>
        <span style={{ textAlign: "right" }}>Pts</span>
      </div>
      {standings.map((e, i) => {
        const moi = e.code === nation;
        return (
          <div
            key={e.code}
            style={{
              display: "grid",
              gridTemplateColumns: "22px 1fr 34px 34px",
              gap: 6,
              alignItems: "center",
              padding: "7px 8px",
              borderRadius: 7,
              background: moi ? `${C.azur}22` : "transparent",
              color: moi ? C.txt : C.txt2,
              fontWeight: moi ? 700 : 400,
            }}
          >
            <span>{i + 1}</span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {e.flag} {e.nom}
            </span>
            <span style={{ textAlign: "center", fontVariantNumeric: "tabular-nums" }}>
              {e.v}-{e.d}
            </span>
            <span style={{ textAlign: "right", fontWeight: 700, color: moi ? C.azur : C.txt }}>
              {e.pts}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** Bandeau de résultat (titre, place, élimination). */
function Bandeau({ texte, gagnant }) {
  return (
    <div
      style={{
        marginTop: 14,
        padding: "12px 14px",
        borderRadius: 8,
        textAlign: "center",
        fontWeight: 800,
        fontSize: 15,
        color: gagnant ? "#1a1005" : C.txt,
        background: gagnant ? C.or : C.panneauHaut,
        border: gagnant ? "none" : `1px solid ${C.bord}`,
      }}
    >
      {texte}
    </div>
  );
}

/**
 * Récapitulatif de la saison internationale : parcours de la nation en
 * Coupe du Monde et/ou dans son grand tournoi, avec le classement.
 */
export function CarteTournoi({ campagne, onContinuer }) {
  const c = campagne;
  const nat = SELECTIONS[c.nation];
  const t = c.tournoi;

  return (
    <div style={{ ...S.card, ...carteSaillante(C.azur), marginBottom: 0, padding: 22 }}>
      <div style={{ ...S.label, color: C.azur, marginBottom: 4 }}>🌍 Saison internationale {c.annee}</div>
      <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>
        {nat.flag} {nat.nom}
      </div>

      {/* Coupe du Monde */}
      {c.cdm && (
        <>
          <Titre>🏆 Coupe du Monde {c.annee}</Titre>
          {c.cdm.parcours.map((m, i) =>
            m.resume ? (
              <div key={i} style={{ fontSize: 13.5, color: C.txt2, padding: "6px 0" }}>
                {m.tour} · {m.resume}
              </div>
            ) : (
              <LigneMatch key={i} m={m} />
            )
          )}
          <Bandeau
            texte={
              c.cdm.resultat === "Champion du monde"
                ? "🏆 CHAMPIONS DU MONDE"
                : c.cdm.resultat
            }
            gagnant={c.cdm.resultat === "Champion du monde"}
          />
        </>
      )}

      {/* Grand tournoi */}
      {t && t.standings && (
        <>
          <Titre>{t.nom}</Titre>
          {t.parcours.map((m, i) => (
            <LigneMatch key={i} m={m} />
          ))}
          <div style={{ marginTop: 14 }}>
            <Classement standings={t.standings} nation={c.nation} />
          </div>
          <Bandeau
            texte={t.champion ? `🏆 Vainqueur du ${t.court}` : `${t.rang}ᵉ place`}
            gagnant={t.champion}
          />
        </>
      )}

      {/* Tournées */}
      {c.tournees.map((f, i) => (
        <React.Fragment key={i}>
          <Titre>{f.nom}</Titre>
          {f.matchs.map((m, j) => (
            <LigneMatch key={j} m={m} />
          ))}
        </React.Fragment>
      ))}

      <div style={{ marginTop: 20 }}>
        <Bouton onClick={onContinuer}>Continuer</Bouton>
      </div>
    </div>
  );
}
