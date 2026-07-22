import React, { useRef, useEffect } from "react";
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
  event: C.txt,
  info: C.txt,
};

/** Journal déroulant de la carrière, scrollé automatiquement en bas. */
export function Journal({ lignes }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [lignes]);

  return (
    <div
      ref={ref}
      style={{ ...S.card, maxHeight: 300, overflowY: "auto", fontSize: 13.5, lineHeight: 1.65 }}
    >
      {lignes.map((l, i) => (
        <div
          key={i}
          style={{
            marginBottom: 5,
            marginTop: l.type === "titre" ? 12 : 0,
            color: COULEURS[l.type] || C.txt,
            fontWeight: l.type === "titre" || l.type === "fin" ? 700 : 400,
          }}
        >
          {l.txt}
        </div>
      ))}
    </div>
  );
}
