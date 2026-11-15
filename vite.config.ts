/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // three.js is ~250 KB gzipped but only loads lazily, after first paint.
  build: { chunkSizeWarningLimit: 1000 },
  test: { environment: "node" },
});
