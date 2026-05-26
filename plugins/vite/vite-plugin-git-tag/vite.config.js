import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "./index.js",
      name: "GitTag",
      fileName: "index",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["vite", "picocolors", "@clack/prompts", "child_process"],
    },
  },
});
