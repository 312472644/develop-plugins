import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "./index.js",
      formats: ["es", "cjs", "umd"],
      name: "utils",
      fileName: "index",
    },
  },
});
