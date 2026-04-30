import { defineConfig } from "vite";
import viteBaseConfig from "../vite-dep-config";

const config = {
  external: ["jspdf", "jspdf-autotable"],
};

export default defineConfig(viteBaseConfig({}, config));
// export default defineConfig({
//   build: {
//     lib: {
//       entry: "./index.js",
//       formats: ["es"],
//       fileName: "index",
//     },
//     rollupOptions: {
//       external: ["jspdf", "jspdf-autotable"],
//     },
//   },
// });
