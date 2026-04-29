import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
  plugins: [vue(), cssInjectedByJsPlugin()],
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
      external: ["vue", "handsontable/i18n", "@develop-plugins/x-message", "handsontable", "@handsontable/vue3"],
    },
  },
  esbuild: {
    drop: ["console", "debugger"],
  },
});
