declare module "@develop-plugins/directive" {
  import type { Directive, App } from "vue";
  export default {
    install: (app: App) => {
      app.directive("ob-resize", Directive<any, any>);
      app.directive("copy", Directive<any, any>);
      app.directive("debounce", Directive<any, any>);
      app.directive("draggable", Directive<any, any>);
      app.directive("click-outside", Directive<any, any>);
      app.directive("scroll", Directive<any, any>);
      app.directive("line-clamp", Directive<any, any>);
      app.directive("is-visible", Directive<any, any>);
    },
  };
}