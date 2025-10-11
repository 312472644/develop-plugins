import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VueSetupExtend from "vite-plugin-vue-setup-extend";
import terser from "@rollup/plugin-terser";
import path from "path";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
  plugins: [
    vue(),
    VueSetupExtend(),
    cssInjectedByJsPlugin(),
    terser({
      compress: {
        defaults: true,
        dead_code: true,
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log"],
      },
      mangle: true,
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(process.cwd(), "index.js"),
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: ["vue", "pdfjs-dist", "echarts", "ant-design-vue"],
    },
  },
  esbuild: {
    drop: ["console", "debugger"],
  },
});
