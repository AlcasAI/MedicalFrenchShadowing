import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Percorsi relativi: funziona sia in locale sia su GitHub Pages (sottocartella)
  base: "./",
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
});
