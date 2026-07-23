import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { initTheme } from "./styles/useTheme.js";
import "./styles/global.css";

// Appliqué avant le rendu pour éviter tout flash de thème.
initTheme();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
