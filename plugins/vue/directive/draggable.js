export default {
  name: "Draggable",
  mounted(el, binding) {
    const resolveContainer = () => {
      const val = binding?.value?.container ?? binding?.value;
      if (!val) return document.body;
      if (typeof val === "string") {
        if (val === "parent") return el.parentElement || document.body;
        return document.querySelector(val) || document.body;
      }
      if (val instanceof HTMLElement) return val;
      return document.body;
    };

    el.onmousedown = function (e) {
      const container = resolveContainer();
      const elRect = el.getBoundingClientRect();

      const startMouseX = e.clientX;
      const startMouseY = e.clientY;
      const startLeftViewport = elRect.left;
      const startTopViewport = elRect.top;

      // 使用元素的私有状态保存累计位移，避免解析矩阵
      const state = (el._drag ||= { baseX: 0, baseY: 0 });
      let dx = 0, dy = 0;

      el.style.cursor = "move";

      const onMove = function (evt) {
        const containerRect = container.getBoundingClientRect();
        const minX = containerRect.left + container.clientLeft;
        const minY = containerRect.top + container.clientTop;
        const maxX = minX + container.clientWidth - elRect.width;
        const maxY = minY + container.clientHeight - elRect.height;

        let newLeft = startLeftViewport + (evt.clientX - startMouseX);
        let newTop = startTopViewport + (evt.clientY - startMouseY);

        if (newLeft < minX) newLeft = minX; else if (newLeft > maxX) newLeft = maxX;
        if (newTop < minY) newTop = minY; else if (newTop > maxY) newTop = maxY;

        dx = newLeft - startLeftViewport;
        dy = newTop - startTopViewport;
        el.style.transform = `translate(${state.baseX + dx}px, ${state.baseY + dy}px)`;
      };
      const onUp = function () {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        el.style.cursor = "default";
        // 累计位移到元素状态，确保下一次拖动连续
        state.baseX += dx;
        state.baseY += dy;
      };

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    };
  },
};
