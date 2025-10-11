/**
 * 组件注册
 * @param {import("vue").Component} components
 */
export const makeInstaller = component => {
  component.install = app => {
    app.component(component.name, component);
  };
  return component;
};
