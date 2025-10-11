/**
 * v-line-clamp 指令：多行文本省略，默认超过 2 行显示省略号。
 * 支持：
 * - 数值绑定：`v-line-clamp="3"` 或 `v-line-clamp:3`
 * - 对象绑定：`v-line-clamp="{ lines: 3 }"`
 * 兼容性：优先使用 -webkit-line-clamp；若不支持，则使用 JS 回退方案。
 */

function resolveLines(binding) {
  // 优先使用 arg，其次使用 value（数字或对象的 lines）
  const candidate = binding?.arg ?? (typeof binding?.value === "number" ? binding.value : binding?.value?.lines);
  const n = Number(candidate);
  return n > 0 && Number.isFinite(n) ? n : 2; // 默认两行
}

function supportsWebkitLineClamp(el) {
  return "webkitLineClamp" in (el?.style ?? {});
}

function applyClampWebkit(el, lines) {
  // 使用 -webkit-line-clamp 方案，现代浏览器兼容性较好
  el.style.display = "-webkit-box";
  el.style.webkitBoxOrient = "vertical";
  el.style.overflow = "hidden";
  el.style.webkitLineClamp = String(lines);
}

function getLineHeight(el) {
  const cs = getComputedStyle(el);
  const lh = cs.lineHeight;
  if (lh === "normal" || !lh) {
    const fs = parseFloat(cs.fontSize) || 16;
    return fs * 1.2;
  }
  const n = parseFloat(lh);
  return Number.isNaN(n) ? 20 : n;
}

function applyClampFallback(el, lines) {
  // 基本样式（不使用遮挡覆盖），通过字符级截断实现省略
  el.style.display = "block";
  el.style.overflow = "hidden";
  // 移除 webkit 相关，避免冲突
  try {
    el.style.webkitLineClamp = null;
    el.style.webkitBoxOrient = null;
  } catch (e) {}

  const fullText = (el._lineClampFullText = el._lineClampFullText ?? el.textContent ?? "");
  const lh = getLineHeight(el);
  const allowed = Math.max(0, Math.floor(lh * lines));
  const ELLIPSIS = "…";

  // 若原文本已在限定高度内，无需省略
  el.textContent = fullText;
  const fits = el.scrollHeight <= allowed + 1;
  if (fits) return;

  // 二分查找最大可容纳的字符数（带省略号）
  let low = 0;
  let high = fullText.length;
  while (low < high) {
    const mid = Math.floor((low + high + 1) / 2);
    el.textContent = fullText.slice(0, mid) + ELLIPSIS;
    if (el.scrollHeight <= allowed + 1) {
      low = mid;
    } else {
      high = mid - 1;
    }
  }
  if (low < fullText.length) {
    el.textContent = fullText.slice(0, low) + ELLIPSIS;
  } else {
    el.textContent = fullText;
  }
}

export default {
  name: "LineClamp",
  mounted(el, binding) {
    const lines = resolveLines(binding);
    const useWebkit = supportsWebkitLineClamp(el);
    el._lineClampMode = useWebkit ? "webkit" : "fallback";
    if (useWebkit) {
      applyClampWebkit(el, lines);
    } else {
      applyClampFallback(el, lines);
      // 在尺寸变化时重新计算（仅回退方案需要）
      try {
        el._lineClampRO = new ResizeObserver(() => {
          applyClampFallback(el, el._lineClampLines || lines);
        });
        el._lineClampRO.observe(el);
      } catch (e) {}
    }
    // 记录当前行数，便于更新时对比
    el._lineClampLines = lines;
  },
  beforeUpdate(el, binding) {
    const lines = resolveLines(binding);
    if (el._lineClampLines !== lines) {
      if (el._lineClampMode === "webkit") {
        applyClampWebkit(el, lines);
      } else {
        applyClampFallback(el, lines);
      }
      el._lineClampLines = lines;
    }
  },
  unmounted(el) {
    // 清理痕迹（保守清理，仅移除与该指令强绑定的样式）
    try {
      el.style.webkitLineClamp = null;
      el.style.webkitBoxOrient = null;
    } catch (e) {}
    if (el._lineClampRO) {
      try {
        el._lineClampRO.disconnect();
      } catch (e) {}
      el._lineClampRO = null;
    }
    delete el._lineClampFullText;
    delete el._lineClampLines;
    delete el._lineClampMode;
  },
};
