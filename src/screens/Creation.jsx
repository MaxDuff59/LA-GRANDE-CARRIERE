import React, { useState } from "react";
import { POSTES } from "../data/postes.js";
import { NATIONS, ORIGINES, HYGIENES, AGENTS } from "../data/profil.js";
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
];

const SETUP_VIDE = {
  nom: "",
  poste: null,
  nation: null,
  origine: null,
  hygiene: null,
  agent: null,
};

export function Creation({ onValider, onRetour }) {
  const [setup, setSetup] = useState(SETUP_VIDE);
  const [index, setIndex] = useState(0);

  const etape = ETAPES[index];
  const estDerniere = index === ETAPES.length - 1;
  const valide = etape.type === "texte" ? true : Boolean(setup[etape.cle]);

  const suivant = () => {
    if (estDerniere) onValider(setup);
    else setIndex(index + 1);
  };

  const precedent = () => {
    if (index > 0) setIndex(index - 1);
    else onRetour();
  };

  return (
    <div style={S.app}>
      <div style={S.wrap}>
        <div style={{ ...S.label, color: C.accent }}>
          Étape {index + 1} / {ETAPES.length}
        </div>
        <h2 style={S.h2}>{etape.titre}</h2>
        {etape.sous && <p style={{ ...S.sub, marginTop: 4, marginBottom: 18 }}>{etape.sous}</p>}

        {etape.type === "texte" ? (
          <input
            value={setup.nom}
            onChange={(e) => setSetup({ ...setup, nom: e.target.value })}
            placeholder="Nom du joueur"
            maxLength={22}
            style={S.input}
          />
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
