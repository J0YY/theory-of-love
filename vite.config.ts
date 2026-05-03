import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.GITHUB_PAGES === "true" ? "/theory-of-love/" : "/",
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 650,
  },
});
