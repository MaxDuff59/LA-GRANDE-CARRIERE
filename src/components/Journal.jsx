import React, { useRef, useEffect, useState, useMemo } from "react";
import { C, S } from "../styles/theme.js";

/** Couleur d'une ligne selon son type. */
const COULEURS = {
  titre: C.accent,
  fin: C.rouge,
  choix: C.or,
  transfert: C.accent2,
  stat: C.txt2,
  conseq: C.txt,
  action: C.ambre,
  hygiene: C.nuit,
  intl: C.azur,
  event: C.txt,
  info: C.txt,
};

/**
 * Journal de carrière. Par défaut il ne montre que la saison en cours :
 * au bout de quinze ans, la liste complète devient illisible et noie
 * l'information utile, qui est presque toujours la plus récente.
 * L'historique reste accessible d'un clic.
 */
export function Journal({ lignes }) {
  const [tout, setTout] = useState(false);
  const ref = useRef(null);

  // Début de la saison affichée = dernière ligne de type "titre".
  const debut = useMemo(() => {
    for (let i = lignes.length - 1; i >= 0; i--) {
      if (lignes[i].type === "titre") return i;
    }
    return 0;
  }, [lignes]);

  const saisonsCachees = useMemo(
    () => lignes.slice(0, debut).filter((l) => l.type === "titre").length,
    [lignes, debut]
  );

  const visibles = tout ? lignes : lignes.slice(debut);

  // En mode déplié seulement : on garde le bas de l'historique en vue.
  useEffect(() => {
    if (tout && ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [tout, lignes]);

  return (
    <div style={S.card}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 12,
          marginBottom: 10,
        }}
      >
        <div style={{ ...S.label, marginBottom: 0 }}>
          {tout ? "Toute la carrière" : "Saison en cours"}
        </div>
        {saisonsCachees > 0 && (
          <button
            onClick={() => setTout((v) => !v)}
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              color: C.txt2,
              fontSize: 11.5,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              flexShrink: 0,
            }}
          >
            {tout
              ? "Réduire ▴"
              : `${saisonsCachees} saison${saisonsCachees > 1 ? "s" : ""} avant ▾`}
          </button>
        )}
      </div>

      <div
        ref={ref}
        style={{
          maxHeight: tout ? 300 : "none",
          overflowY: tout ? "auto" : "visible",
          fontSize: 13.5,
          lineHeight: 1.65,
        }}
      >
        {visibles.map((l, i) => (
          <div
            key={i}
            style={{
              marginBottom: 5,
              marginTop: l.type === "titre" && i > 0 ? 12 : 0,
              color: COULEURS[l.type] || C.txt,
              fontWeight: l.type === "titre" || l.type === "fin" ? 700 : 400,
            }}
          >
            {l.txt}
          </div>
        ))}
      </div>
    </div>
  );
}
