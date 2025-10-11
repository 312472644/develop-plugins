/**
 * 元素可见性指令
 * 当元素进入视口时，触发回调函数并传递 true，否则传递 false
 *
 * 配置：支持传入 IntersectionObserver 的 options
 * - 基本用法：v-is-visible="handler"
 * - 对象用法：v-is-visible="{ callback: handler, options: { root, rootMargin, threshold } }"
 */
export default {
  name: "IsVisible",
  mounted(el, binding) {
    const { callback, options } = normalize(binding);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        callback(entry.isIntersecting);
      });
    }, options);
    el._isVisibleObserver = observer;
    el._isVisibleCallback = callback;
    el._isVisibleOptions = options;
    observer.observe(el);
  },
  beforeUpdate(el, binding) {
    const { callback, options } = normalize(binding);
    // 若配置或回调发生变化，重新绑定观察者
    const needRecreate = el._isVisibleCallback !== callback || !shallowEqual(el._isVisibleOptions, options);
    if (needRecreate) {
      try {
        el._isVisibleObserver && el._isVisibleObserver.disconnect();
      } catch (e) {}
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          callback(entry.isIntersecting);
        });
      }, options);
      el._isVisibleObserver = observer;
      el._isVisibleCallback = callback;
      el._isVisibleOptions = options;
      observer.observe(el);
    }
  },
  unmounted(el) {
    if (el._isVisibleObserver) {
      try {
        el._isVisibleObserver.disconnect();
      } catch (e) {}
    }
    delete el._isVisibleObserver;
    delete el._isVisibleCallback;
    delete el._isVisibleOptions;
  },
};

function normalize(binding) {
  const v = binding?.value;
  // 函数直接作为回调，默认 options 为空
  if (typeof v === "function") {
    return { callback: v, options: {} };
  }
  // 对象形式：{ callback, options }
  if (v && typeof v === "object") {
    const cb = typeof v.callback === "function" ? v.callback : (typeof v.handler === "function" ? v.handler : null);
    const opts = v.options && typeof v.options === "object" ? v.options : {};
    if (!cb) {
      throw new Error("v-is-visible: callback/handler must be a function");
    }
    return { callback: cb, options: opts };
  }
  throw new Error("v-is-visible: value must be a function or { callback, options }");
}

function shallowEqual(a = {}, b = {}) {
  if (a === b) return true;
  const ak = Object.keys(a);
  const bk = Object.keys(b);
  if (ak.length !== bk.length) return false;
  for (const k of ak) {
    if (a[k] !== b[k]) return false;
  }
  return true;
}
