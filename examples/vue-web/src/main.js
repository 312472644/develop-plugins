import { createApp } from "vue";
import App from "./App.vue";
import { OrgChartInstall } from "@develop-plugins/org-chart";
import "@develop-plugins/org-chart/style.css";

import { WaterMarkInstall } from "@develop-plugins/water-mark";
import { TextEllipsisInstall } from "@develop-plugins/text-ellipsis";
import "@develop-plugins/text-ellipsis/style.css";

import directive from "@develop-plugins/directive";

import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import "virtual:uno.css";

const app = createApp(App);

app.use(OrgChartInstall);
app.use(WaterMarkInstall);
app.use(TextEllipsisInstall);
app.use(directive);
app.use(Antd);

app.mount("#app");
