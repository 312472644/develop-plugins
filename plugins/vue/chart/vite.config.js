import { defineConfig } from "vite";
import viteBaseConfig from "../vite-dep-config";

const config = {
  external: ["echarts"],
};

export default defineConfig(viteBaseConfig({}, config));
