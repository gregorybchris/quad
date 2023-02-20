import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "",
  build: {
    outDir: "demo",
  },
  plugins: [react()],
  server: {
    port: 3001,
  },
  preview: {
    port: 3001,
  },
});
