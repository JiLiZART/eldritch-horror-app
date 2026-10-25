import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./table/App";
import "./table/table.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={<p>Loading…</p>}>
      <App />
    </Suspense>
  </StrictMode>,
);
