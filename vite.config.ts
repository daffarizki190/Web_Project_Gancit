import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // ─── Vitest Configuration ─────────────────────────────────────────
  test: {
    environment: "jsdom",
    setupFiles: ["./src/tests/setup.ts"],
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/security/**", "src/lib/**"],
      exclude: ["src/tests/**"],
    },
  },
});
