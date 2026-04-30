import vue from "@vitejs/plugin-vue";
import path from "path";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import VueSetupExtend from "vite-plugin-vue-setup-extend";

/**
 * 基础 Vite 配置
 * @param {import('vite').UserConfig} config - 配置对象
 * @param {Object} config - 其他配置对象
 * @returns {Object} - Vite 配置对象
 */
export default (viteConfig = {}, config = {}) => {
  return {
    plugins: [vue(), cssInjectedByJsPlugin(), VueSetupExtend()],
    build: {
      lib: {
        entry: path.resolve(process.cwd(), "index.js"),
        formats: ["es"],
        fileName: "index",
      },
      rollupOptions: {
        // 构建文档时，不外部化依赖依赖
        external: process.argv.includes(`--is-build-doc`) ? ["vue"] : ["vue", ...(config?.external || [])],
      },
    },
    esbuild: {
      drop: ["console", "debugger"],
    },
    ...viteConfig,
  };
};
