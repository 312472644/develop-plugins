/**
 * @description: 滑动动画
 * @param {HTMLElement} el 指令绑定的元素
 * @return {void}
 */

const DIRECTION = {
  Left: "left",
  Right: "right",
  Up: "up",
};
// 存储每个元素的动画与配置
const map = new Map();
let playedCount = 0;

const ob = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const target = entry.target;
      const item = map.get(target);
      // 已经播放过的元素不需要再次播放（除非开启 repeat）
      if (item) {
        const { animation, repeat } = item;
        if (repeat) {
          try {
            animation.cancel();
          } catch (e) {}
          animation.play();
        } else {
          animation.play();
          playedCount++;
          ob.unobserve(target);
        }
      }
      // 如果所有元素都已经播放过，需要将父元素的overflow设置为visible
      if (playedCount === map.size) {
        requestAnimationFrame(() => {
          target.parentNode.style.overflow = "visible";
        });
      }
    }
  });
});

/**
 * 判断元素是否在视口下方
 * @param {HTMLElement} el
 * @returns {Boolean} 是否在视口下方
 */
function belowViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top > window.innerHeight;
}

/**
 * 合并配置
 * @param {Object} config
 * @param {'left'|'right'|'up'} [config.direction] 滑动方向
 * @param {Number} [config.offset=100]- 滑动距离
 * @param {Number} [config.duration=800] 动画时长
 * @param {String} [config.easing] 动画缓动函数
 * @returns {Object} 合并后的配置
 */
function mergeConfig(config = {}) {
  const defaultConfig = {
    direction: DIRECTION.Up,
    offset: 100,
    duration: 1000,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    repeat: false,
  };
  return { ...defaultConfig, ...config };
}

export default {
  name: "slide",
  /**
   *
   * @param {HTMLElement} el
   * @param {*} binding
   * @returns
   */
  mounted(el, binding) {
    // 如果元素已经在视口内，不需要动画
    if (!belowViewport(el)) return;
    const { offset, duration, direction, easing, repeat } = mergeConfig(binding.value);

    let transformProperty = "";
    // 如果不是向上滑动，需要将父元素设置overflow为hidden
    if (direction !== DIRECTION.Up) {
      el.parentNode.style.overflow = "hidden";
    }

    switch (direction) {
      case "left":
        transformProperty = "translateX(-";
        break;
      case "right":
        transformProperty = "translateX(";
        break;
      default:
        transformProperty = "translateY(";
    }

    const animate = el.animate(
      [
        { transform: `${transformProperty}${offset}px)`, opacity: 0 },
        { transform: `${transformProperty}${offset * 0.8}px)`, opacity: 0.1 },
        { transform: `${transformProperty}${offset * 0.6}px)`, opacity: 0.3 },
        { transform: `${transformProperty}${offset * 0.4}px)`, opacity: 0.5 },
        { transform: `${transformProperty}${offset * 0.2}px)`, opacity: 0.7 },
        {
          transform: direction === "up" ? "translateY(0)" : "translateX(0)",
          opacity: 1,
        },
      ],
      {
        duration,
        easing,
        fill: "forwards",
      }
    );
    animate.pause();
    map.set(el, { animation: animate, repeat });
    ob.observe(el);
  },
  /**
   * 在绑定值变化时更新 repeat，并确保观察状态与需求一致。
   * 当元素当前在视口内且开启 repeat 时，立即重播一次动画以提供直观反馈。
   */
  beforeUpdate(el, binding) {
    const { repeat } = mergeConfig(binding.value);
    const item = map.get(el);
    if (!item) return;
    item.repeat = repeat;
    if (repeat) {
      // 确保重新观察
      try {
        ob.observe(el);
      } catch (e) {}
      // 若当前在视口内，直接重播一次
      const rect = el.getBoundingClientRect();
      const visible = rect.top < window.innerHeight && rect.bottom > 0;
      if (visible) {
        try {
          item.animation.cancel();
        } catch (e) {}
        item.animation.play();
      }
    } else {
      // 关闭重复播放时，避免继续观察
      try {
        ob.unobserve(el);
      } catch (e) {}
    }
  },
  unmounted(el) {
    ob.unobserve(el);
    map.delete(el);
  },
};
