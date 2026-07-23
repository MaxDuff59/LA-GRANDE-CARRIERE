import { useCallback, useEffect, useState } from "react";

const CLE = "theme";

/** Lit le thème stocké, sinon suit la préférence système. */
function themeInitial() {
  const stocke = localStorage.getItem(CLE);
  if (stocke === "light" || stocke === "dark") return stocke;
  const clair =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  return clair ? "light" : "dark";
}

/** Applique le thème à <html> — les variables CSS font le reste. */
function appliquer(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

/**
 * À appeler une fois au démarrage, avant le rendu, pour éviter le flash
 * (le thème sombre étant la valeur par défaut de :root).
 */
export function initTheme() {
  appliquer(themeInitial());
}

/** État du thème + bascule, persistés dans localStorage. */
export function useTheme() {
  const [theme, setTheme] = useState(themeInitial);

  useEffect(() => {
    appliquer(theme);
    localStorage.setItem(CLE, theme);
  }, [theme]);

  const basculer = useCallback(
    () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    []
  );

  return { theme, basculer };
}
