let handleClick = null;

/**
 * v-click-outside 指令允许您提供一个处理函数并且在用户点击目标元素之外时被调用。
 * @param {Object | Function} binding.value
 * @param {Function} binding.value.handler 为点击事件回调
 * @param {Function} binding.value.closeConditional 为关闭条件，函数决定是否调用外部点击功能
 * @param {Array<HTMLElement>} binding.value.include 要包含的元素
 */
export default {
  name: "ClickOutside",
  mounted(el, binding) {
    const { value } = binding;
    const { handler, closeConditional, include } = value;

    handleClick = function (e) {
      // 包含的元素
      if (typeof include === "function") {
        const includeDOMList = include();
        if (includeDOMList.includes(e.target)) return;
      }
      // 自身元素
      if (el.contains(e.target)) return;
      if (typeof closeConditional === "function") {
        if (!closeConditional()) return;
      }
      // 函数回调
      if (typeof value === "function") {
        value(e);
      } else if (typeof value === "object") {
        // 返回值为真时，触发点击事件
        if (typeof handler === "function") {
          handler();
        }
      } else {
        throw new Error("value must be a function or an object");
      }
    };
    window.addEventListener("click", handleClick);
  },
  unmounted() {
    window.removeEventListener("click", handleClick);
  },
};
