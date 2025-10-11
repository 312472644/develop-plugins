import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  // 确保 worker 构建为 ES，并在需要时与主包兼容
  worker: {
    format: "es",
  },
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
      ],
    },
  },
  esbuild: {
    drop: ["console", "debugger"],
  },
});
