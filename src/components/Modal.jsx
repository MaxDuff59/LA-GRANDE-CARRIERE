import React, { useEffect } from "react";

/**
 * Calque plein écran pour les décisions qui suspendent le jeu.
 * Volontairement sans bouton de fermeture : on ne sort d'un modal
 * qu'en tranchant. Le fond reste visible pour garder le contexte
 * (note, jauges, dernière saison) sous les yeux au moment du choix.
 */
export function Modal({ children }) {
  // Empêche la page de défiler derrière le calque.
  useEffect(() => {
    const avant = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = avant;
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(9, 12, 15, 0.74)",
        backdropFilter: "blur(3px)",
        WebkitBackdropFilter: "blur(3px)",
        animation: "voile .16s ease-out",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 540,
          maxHeight: "88vh",
          overflowY: "auto",
          animation: "monte .2s cubic-bezier(.2, .8, .3, 1)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
