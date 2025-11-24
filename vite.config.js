import { fileURLToPath } from "url";
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@modules": path.resolve(__dirname, "src/modules"),
      "@forms": path.resolve(__dirname, "src/modules/forms"),
      "@features": path.resolve(__dirname, "src/features"),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});

