/**
 * 指令允许您在窗口、指定目标或元素本身( 使用.self 修饰符)滚动时提供回调。
 */
export default {
  name: "Scroll",
  mounted(el, binding) {
    const { value, modifiers } = binding;
    const mountedDOM = modifiers.self ? el : window;
    if (!value || (value && typeof value !== "function")) return;
    mountedDOM._handler = value;
    mountedDOM.addEventListener("scroll", mountedDOM._handler);
  },
  unmounted(el) {
    const mountedDOM = modifiers.self ? el : window;
    mountedDOM.removeEventListener("scroll", mountedDOM._handler);
  },
};
