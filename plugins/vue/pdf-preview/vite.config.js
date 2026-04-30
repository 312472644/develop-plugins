import { defineConfig } from "vite";
import viteBaseConfig from "../vite-dep-config";

const config = {
  external: ["pdfjs-dist"],
};

export default defineConfig(viteBaseConfig({}, config));
