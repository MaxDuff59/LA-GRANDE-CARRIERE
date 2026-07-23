import React from "react";
import { C } from "../styles/theme.js";
import { useTheme } from "../styles/useTheme.js";

/**
 * Bouton flottant de bascule sombre / clair, présent sur tous les écrans.
 * S'appuie sur les variables CSS : la bascule est instantanée.
 */
export function ThemeToggle() {
  const { theme, basculer } = useTheme();
  const sombre = theme === "dark";

  return (
    <button
      onClick={basculer}
      aria-label={sombre ? "Passer en mode clair" : "Passer en mode sombre"}
      title={sombre ? "Mode clair" : "Mode sombre"}
      style={{
        position: "fixed",
        top: 14,
        right: 14,
        zIndex: 50,
        width: 40,
        height: 40,
        display: "grid",
        placeItems: "center",
        borderRadius: 999,
        border: `1px solid ${C.bord}`,
        background: C.panneau,
        color: C.txt2,
        cursor: "pointer",
        fontSize: 17,
        lineHeight: 1,
        boxShadow: "var(--ombre-carte)",
        backdropFilter: "blur(6px)",
        transition: "transform .15s ease, border-color .15s ease, color .15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.08)";
        e.currentTarget.style.color = "var(--accent)";
        e.currentTarget.style.borderColor = "var(--accent)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.color = "var(--txt2)";
        e.currentTarget.style.borderColor = "var(--bord)";
      }}
    >
      {sombre ? "☀️" : "🌙"}
    </button>
  );
}
