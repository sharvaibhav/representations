import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="min-h-screen bg-gray-100 p-8">
      <App />
    </div>
  </StrictMode>
);
