import CodeCard from "./CodeCard.vue";
import BaseTable from "./BaseTable.vue";
import NaiveUI from "naive-ui";

const components = [CodeCard, BaseTable];

const install = (app) => {
  components.forEach((component) => {
    app.component(component.name, component);
  });
  app.use(NaiveUI);
};

export default install;
