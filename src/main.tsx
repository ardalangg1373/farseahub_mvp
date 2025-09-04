// src/main.tsx
import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// i18n باید قبل از رندر لود شود
import "./i18n";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense fallback={<div style={{ padding: 24, color: "#bbb" }}>Loading…</div>}>
      <App />
    </Suspense>
  </React.StrictMode>
);
