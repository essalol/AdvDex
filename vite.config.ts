import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import ViteCompression from "vite-plugin-compression";

export default defineConfig({
  plugins: [react(), ViteCompression()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 5000,
  },
});
