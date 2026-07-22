import React from "react";
import { S } from "../styles/theme.js";

/** Bouton principal ou secondaire. */
export function Bouton({ children, onClick, disabled, variante = "principal", style = {} }) {
  const base = variante === "principal" ? S.btn : S.btnSecondaire;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...base,
        ...(disabled ? { opacity: 0.35, cursor: "not-allowed" } : {}),
        ...style,
      }}
    >
      {children}
    </button>
  );
}
