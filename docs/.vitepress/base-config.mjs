const config = (mode) => {
  return {
    title: "Develop Plugins",
    titleTemplate: "Sugar",
    lang: "zh-CN",
    description: "Develop Plugins使用文档说明",
    lastUpdated: true,
    head: [["link", { rel: "icon", href: mode === "production" ? "/develop-plugins/orange.png" : "/orange.svg" }]],
  };
};
export default config;
