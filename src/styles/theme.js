/** Palette et styles partagés. Change les couleurs ici, partout à la fois. */

export const C = {
  fond: "#101418",
  panneau: "#171C22",
  panneauHaut: "#1E2831",
  bord: "#242B33",
  txt: "#E4E7EA",
  txt2: "#8A939E",
  accent: "#C2410C",
  accent2: "#0F7B6C",
  or: "#E8C547",
  rouge: "#B4342A",
  ambre: "#D4A03C",
  nuit: "#8B7BC4", // événements « hygiène de vie » (hors du terrain)
};

export const S = {
  app: {
    minHeight: "100vh",
    background: C.fond,
    color: C.txt,
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    padding: "20px 16px",
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
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
  },

  btn: {
    background: C.accent,
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "13px 22px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    width: "100%",
    fontFamily: "inherit",
  },
  btnSecondaire: {
    background: "transparent",
    color: C.txt2,
    border: `1px solid ${C.bord}`,
    borderRadius: 8,
    padding: "11px 18px",
    fontSize: 14,
    cursor: "pointer",
    width: "100%",
    marginTop: 8,
    fontFamily: "inherit",
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
    borderRadius: 8,
    padding: 14,
    color: C.txt,
    fontSize: 16,
    marginBottom: 14,
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
};

/** Style d'une option sélectionnable. */
export const optionStyle = (selectionnee) => ({
  background: selectionnee ? C.panneauHaut : C.panneau,
  border: `1px solid ${selectionnee ? C.accent : C.bord}`,
  borderRadius: 8,
  padding: "12px 14px",
  marginBottom: 8,
  cursor: "pointer",
  transition: "border-color .12s, background .12s",
});

/**
 * Rend une carte de décision saillante sans calque : fond légèrement teinté,
 * bordure et halo colorés. Elle ressort du reste de la page tout en restant
 * dans le flux, sous les autres éléments.
 */
export const carteSaillante = (teinte) => ({
  borderColor: teinte,
  background: `linear-gradient(0deg, ${teinte}14, ${teinte}14), ${C.panneau}`,
  boxShadow: `inset 0 1px 0 ${teinte}33, 0 16px 40px -16px ${teinte}99, 0 10px 30px -14px rgba(0,0,0,0.55)`,
});

/** Couleur d'une jauge selon son niveau (usure inversée). */
export const couleurJauge = (valeur, inverse = false) => {
  const v = inverse ? 100 - valeur : valeur;
  if (v < 30) return C.rouge;
  if (v < 55) return C.ambre;
  return C.accent2;
};
