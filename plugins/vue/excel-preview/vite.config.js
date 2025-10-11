import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(process.cwd(), "index.js"),
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: [
        "vue",
        "pdfjs-dist",
        "handsontable/i18n",
        "handsontable/registry",
        "@develop-plugins/x-message",
        "handsontable",
        "@handsontable/vue3",
        "exceljs",
      ],
    },
  },
  esbuild: {
    drop: ["console", "debugger"],
  },
});
