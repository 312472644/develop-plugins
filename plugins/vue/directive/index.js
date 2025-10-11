import ObResize from "./ob-resize";
import Copy from "./copy";
import Debounce from "./debounce";
import Draggable from "./draggable";
import ClickOutside from "./click-outside";
import Scroll from "./scroll";
import Slide from "./slide";
import LineClamp from "./line-clamp";
import IsVisible from "./is-visible";

const directives = {
  ObResize,
  Copy,
  Debounce,
  Draggable,
  ClickOutside,
  Scroll,
  Slide,
  LineClamp,
  IsVisible,
};

export { directives };

export default {
  install(app) {
    Object.keys(directives).forEach((key) => {
      app.directive(key, directives[key]);
    });
  },
};
