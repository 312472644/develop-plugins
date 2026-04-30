import { defineConfig } from "vite";
import viteBaseConfig from "../vite-dep-config";

const config = {
  external: ["exceljs", "@develop-plugins/x-message", "handsontable", "@handsontable/vue3"],
};

export default defineConfig(viteBaseConfig({ worker: { format: "es" } }, config));
