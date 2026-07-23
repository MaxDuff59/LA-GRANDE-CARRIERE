/**
 * Palette et styles partagés.
 *
 * Les couleurs ne sont pas des valeurs en dur : ce sont des références vers des
 * variables CSS définies dans `global.css` (thème sombre par défaut, thème clair
 * sous `:root[data-theme="light"]`). Basculer l'attribut `data-theme` sur
 * `<html>` change toute l'interface d'un coup, sans re-render React.
 * Voir `useTheme.js`.
 */

export const C = {
  fond: "var(--fond)",
  panneau: "var(--panneau)",
  panneauHaut: "var(--panneau-haut)",
  bord: "var(--bord)",
  track: "var(--track)",
  txt: "var(--txt)",
  txt2: "var(--txt2)",
  accent: "var(--accent)",
  accent2: "var(--accent2)",
  or: "var(--or)",
  rouge: "var(--rouge)",
  ambre: "var(--ambre)",
  nuit: "var(--nuit)", // événements « hygiène de vie » (hors du terrain)
  azur: "var(--azur)", // sélection nationale / compétitions internationales
};

/** Mélange une teinte avec un fond (ou la transparence) — tints theme-aware. */
export const teinte = (couleur, pct, base = "transparent") =>
  `color-mix(in srgb, ${couleur} ${pct}%, ${base})`;

export const S = {
  app: {
    minHeight: "100vh",
    background: C.fond,
    color: C.txt,
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    padding: "20px 16px",
    transition: "background .25s ease, color .25s ease",
  },
  wrap: { maxWidth: 780, margin: "0 auto" },

  h1: {
    fontSize: "clamp(30px, 7vw, 52px)",
    fontWeight: 800,
    letterSpacing: "-0.03em",
    margin: 0,
    lineHeight: 1,
  },
  h2: {
    fontSize: 26,
    fontWeight: 800,
    margin: "0 0 4px",
    letterSpacing: "-0.02em",
  },
  sub: { color: C.txt2, fontSize: 14, marginTop: 10, lineHeight: 1.6 },
  label: {
    fontSize: 11,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: C.txt2,
    marginBottom: 10,
    fontWeight: 600,
  },

  card: {
    background: C.panneau,
    border: `1px solid ${C.bord}`,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    boxShadow: "var(--ombre-carte)",
    transition: "background .25s ease, border-color .25s ease",
  },

  btn: {
    background: C.accent,
    color: "#fff",
    border: "none",
    borderRadius: 11,
    padding: "13px 22px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    width: "100%",
    fontFamily: "inherit",
    boxShadow: "0 6px 16px -8px color-mix(in srgb, var(--accent) 70%, transparent)",
    transition: "transform .12s ease, box-shadow .18s ease, filter .18s ease",
  },
  btnSecondaire: {
    background: "transparent",
    color: C.txt2,
    border: `1px solid ${C.bord}`,
    borderRadius: 11,
    padding: "11px 18px",
    fontSize: 14,
    cursor: "pointer",
    width: "100%",
    marginTop: 8,
    fontFamily: "inherit",
    transition: "background .15s ease, border-color .15s ease, color .15s ease",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
    gap: 8,
  },

  input: {
    width: "100%",
    background: C.panneau,
    border: `1px solid ${C.bord}`,
    borderRadius: 11,
    padding: 14,
    color: C.txt,
    fontSize: 16,
    marginBottom: 14,
    boxSizing: "border-box",
    fontFamily: "inherit",
    transition: "border-color .15s ease",
  },
};

/** Style d'une option sélectionnable. */
export const optionStyle = (selectionnee) => ({
  background: selectionnee ? C.panneauHaut : C.panneau,
  border: `1px solid ${selectionnee ? C.accent : C.bord}`,
  borderRadius: 11,
  padding: "12px 14px",
  marginBottom: 8,
  cursor: "pointer",
  transition: "border-color .12s, background .12s, box-shadow .12s",
  boxShadow: selectionnee
    ? `0 0 0 1px ${teinte(C.accent, 40)}, 0 8px 20px -14px ${teinte(C.accent, 90)}`
    : "none",
});

/**
 * Rend une carte de décision saillante sans calque : fond légèrement teinté,
 * bordure et halo colorés. Elle ressort du reste de la page tout en restant
 * dans le flux, sous les autres éléments.
 */
export const carteSaillante = (couleur) => ({
  borderColor: couleur,
  background: teinte(couleur, 9, C.panneau),
  boxShadow: `inset 0 1px 0 ${teinte(couleur, 32)}, 0 18px 44px -18px ${teinte(
    couleur,
    60
  )}, 0 10px 30px -14px var(--ombre)`,
});

/** Couleur d'une jauge selon son niveau (usure inversée). */
export const couleurJauge = (valeur, inverse = false) => {
  const v = inverse ? 100 - valeur : valeur;
  if (v < 30) return C.rouge;
  if (v < 55) return C.ambre;
  return C.accent2;
};
