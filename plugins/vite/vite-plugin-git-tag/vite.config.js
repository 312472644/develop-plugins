import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "./index.js",
      name: "GitTag",
      fileName: "index",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["vite", "chalk", "@clack/prompts", "child_process"],
    },
  },
});
