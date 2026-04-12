import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeAdMob } from "./lib/admob";

// Initialize AdMob as early as possible
initializeAdMob();

createRoot(document.getElementById("root")!).render(<App />);
