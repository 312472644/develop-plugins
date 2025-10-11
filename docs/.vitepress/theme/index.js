import defaultTheme from "vitepress/theme";
import components from "./components";

import "./styles/index.scss";

export default {
  extends: defaultTheme,
  enhanceApp({ app }) {
    app.use(components);
    // 指令包在 SSR 环境下可能访问浏览器 API，改为仅在浏览器端动态导入
    if (typeof window !== "undefined") {
      import("@develop-plugins/directive").then((mod) => {
        const directives = mod.default ?? mod;
        app.use(directives);
      });
    }
  },
};
