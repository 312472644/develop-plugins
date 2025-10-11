import { throttle } from "../../utils/tools/helper";

let ob = null;

/**
 * 监听dom位置变化
 */
export default {
  name: 'ObResize',
  mounted(el, binding) {
    obResize(el, binding);
  },
  unmounted(el) {
    if (ResizeObserver) {
      obResize?.unobserve();
      obResize?.disconnect();
    } else {
      el.removeChild(el.querySelector('iframe'));
    }
  }
}

function obResize(el, binding) {
  if (binding.value && typeof binding.value !== 'function') {
    console.error('ObResize value must be a function');
    return;
  }
  // 浏览器支持ResizeObserver
  if (ResizeObserver) {
    ob = new ResizeObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        const rect = mutation.target.getBoundingClientRect();
        binding.value(rect);
      }
    });
    ob.observe(el, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    });
  } else {
    // 浏览器不支持,利用iframe的resize事件
    el.style.position = `relative`;
    const iframe = document.createElement('iframe');
    iframe.style.cssText = `position: absolute;top: 0;left: 0;width: 100%;height: 100%;border:none;z-index:-1;`;
    el.appendChild(iframe);

    const _resize = throttle(() => {
      const rect = el.getBoundingClientRect();
      binding.value(rect);
    });

    iframe.contentWindow.addEventListener('resize', _resize);
  }
}