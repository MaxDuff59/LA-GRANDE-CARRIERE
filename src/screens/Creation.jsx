import React, { useState, useMemo, useEffect } from "react";
import { POSTES } from "../data/postes.js";
import { NATIONS, ORIGINES, HYGIENES, AGENTS } from "../data/profil.js";
import { clubsDeDepart } from "../data/clubs.js";
import { nomAleatoire } from "../data/noms.js";
import { C, S, optionStyle } from "../styles/theme.js";
import { Bouton } from "../components/Bouton.jsx";

/** Les étapes du tunnel de création, dans l'ordre. */
const ETAPES = [
  { cle: "nom", titre: "Ton nom", type: "texte" },
  {
    cle: "poste",
    titre: "Ton poste",
    sous: "Il décide de ton corps, de tes essais et de ta longévité.",
    options: POSTES,
  },
  {
    cle: "nation",
    titre: "Le pays qui te forme",
    sous: "Il façonne tes qualités et la difficulté de la sélection.",
    options: NATIONS,
  },
  {
    cle: "origine",
    titre: "D'où tu viens",
    sous: "Le rugby ne prend pas tout le monde au même endroit.",
    options: ORIGINES,
  },
  {
    cle: "hygiene",
    titre: "Ton hygiène de vie",
    sous: "Le corps encaisse pendant vingt ans. Ou pas.",
    options: HYGIENES,
  },
  {
    cle: "agent",
    titre: "Qui te représente",
    sous: "L'argent, les transferts, et les portes qui s'ouvrent.",
    options: AGENTS,
  },
  {
    cle: "club",
    titre: "Ton premier contrat",
    sous: "Trois clubs veulent te faire signer. Jouer beaucoup en bas, ou te battre pour ta place plus haut ?",
    type: "club",
  },
];

/** Ce que chaque club de départ dit du choix, selon son rang de prestige. */
const HINTS_CLUB = [
  "Tu joueras d'entrée. Vitrine modeste, mais du temps de jeu garanti.",
  "Un bon compromis entre exposition et temps de jeu.",
  "Plus de lumière et un meilleur effectif — il faudra gagner sa place.",
];

const SETUP_VIDE = {
  nom: "",
  poste: null,
  nation: null,
  origine: null,
  hygiene: null,
  agent: null,
  club: null,
};

export function Creation({ onValider, onRetour }) {
  const [setup, setSetup] = useState(SETUP_VIDE);
  const [index, setIndex] = useState(0);

  // Éventail de clubs, stable tant que la nation ne change pas.
  const clubs = useMemo(
    () => (setup.nation ? clubsDeDepart(setup.nation, 3) : []),
    [setup.nation]
  );

  const etape = ETAPES[index];
  const estDerniere = index === ETAPES.length - 1;
  // À l'étape du nom, on exige un nom non vide ; sinon, une option choisie.
  const valide =
    etape.type === "texte" ? Boolean(setup.nom.trim()) : Boolean(setup[etape.cle]);

  const suivant = () => {
    if (estDerniere) onValider(setup);
    else setIndex(index + 1);
  };

  const precedent = () => {
    if (index > 0) setIndex(index - 1);
    else onRetour();
  };

  // Sur ordinateur, Entrée valide l'étape (le bouton orange), y compris depuis
  // le champ « nom ». On laisse le clic natif agir si un bouton a le focus.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Enter" || !valide) return;
      if (document.activeElement?.tagName === "BUTTON") return;
      e.preventDefault();
      if (estDerniere) onValider(setup);
      else setIndex((i) => i + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [valide, estDerniere, setup, onValider]);

  return (
    <div style={S.app}>
      <div style={S.wrap}>
        <div style={{ ...S.label, color: C.accent }}>
          Étape {index + 1} / {ETAPES.length}
        </div>
        <h2 style={S.h2}>{etape.titre}</h2>
        {etape.sous && <p style={{ ...S.sub, marginTop: 4, marginBottom: 18 }}>{etape.sous}</p>}

        {etape.type === "texte" ? (
          <div style={{ position: "relative", marginBottom: 14 }}>
            <input
              value={setup.nom}
              onChange={(e) => setSetup({ ...setup, nom: e.target.value })}
              placeholder="Nom du joueur"
              maxLength={22}
              autoFocus
              style={{ ...S.input, marginBottom: 0, paddingRight: 52 }}
            />
            <button
              type="button"
              onClick={(e) => {
                setSetup({ ...setup, nom: nomAleatoire() });
                e.currentTarget.blur(); // Entrée enchaîne alors sur « Continuer »
              }}
              aria-label="Nom au hasard"
              title="Nom au hasard"
              style={{
                position: "absolute",
                right: 7,
                top: "50%",
                transform: "translateY(-50%)",
                width: 38,
                height: 38,
                display: "grid",
                placeItems: "center",
                borderRadius: 9,
                border: `1px solid ${C.bord}`,
                background: C.panneauHaut,
                cursor: "pointer",
                fontSize: 18,
                lineHeight: 1,
              }}
            >
              🎲
            </button>
          </div>
        ) : etape.type === "club" ? (
          <div style={{ marginBottom: 14 }}>
            {clubs.map((c, i) => (
              <div
                key={c.nom}
                onClick={() => setSetup({ ...setup, club: c.nom })}
                style={optionStyle(setup.club === c.nom)}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    gap: 10,
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{c.nom}</div>
                  <div style={{ fontSize: 12, color: C.txt2 }}>
                    {c.div} · prestige {c.prestige}
                  </div>
                </div>
                <div style={{ fontSize: 12.5, color: C.txt2, marginTop: 3 }}>
                  {HINTS_CLUB[i] || ""}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ marginBottom: 14 }}>
            {etape.options.map((o) => (
              <div
                key={o.id}
                onClick={() => setSetup({ ...setup, [etape.cle]: o.id })}
                style={optionStyle(setup[etape.cle] === o.id)}
              >
                <div style={{ fontWeight: 700, fontSize: 15 }}>
                  {o.flag ? `${o.flag} ` : ""}
                  {o.nom}
                  {o.num && (
                    <span style={{ color: C.accent, fontWeight: 600, marginLeft: 7, fontSize: 13 }}>
                      {o.num}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12.5, color: C.txt2, marginTop: 3 }}>{o.desc}</div>
              </div>
            ))}
          </div>
        )}

        <Bouton onClick={suivant} disabled={!valide}>
          {estDerniere ? "Signer mon premier contrat" : "Continuer"}
        </Bouton>
        <Bouton variante="secondaire" onClick={precedent}>
          Retour
        </Bouton>
      </div>
    </div>
  );
}
