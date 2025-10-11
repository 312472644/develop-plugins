<template>
  <div class="x-scroll" :class="{ 'x-scroll--horizontal': horizontal }" @wheel="handleWheel">
    <div ref="wrapperRef" class="x-scroll__wrapper">
      <div ref="contentRef" class="x-scroll__content">
        <slot></slot>
      </div>
      <div
        v-show="showVerticalBar"
        class="x-scroll__bar x-scroll__bar--vertical"
        @mousedown="handleVerticalBarMouseDown"
      >
        <div
          class="x-scroll__thumb x-scroll__thumb--vertical"
          :style="verticalThumbStyle"
          @mousedown.stop="handleVerticalThumbMouseDown"
        ></div>
      </div>
      <div
        v-show="showHorizontalBar"
        class="x-scroll__bar x-scroll__bar--horizontal"
        @mousedown="handleHorizontalBarMouseDown"
      >
        <div
          class="x-scroll__thumb x-scroll__thumb--horizontal"
          :style="horizontalThumbStyle"
          @mousedown.stop="handleHorizontalThumbMouseDown"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";

/**
 * XScroll 组件
 * 一个自定义滚动条组件，支持垂直和水平滚动，可自定义滚动条样式
 */
const emit = defineEmits(["scroll"]);

defineOptions({
  name: "XScroll",
});

/**
 * 组件属性定义
 * @property {boolean} horizontal - 是否启用水平滚动模式，默认为false
 * @property {string} thumbWidth - 滚动条宽度，默认为'6px'
 * @property {string} thumbColor - 滚动条颜色，默认为'#909399'
 * @property {string} thumbHoverColor - 滚动条悬停颜色，默认为'#606266'
 */
const props = defineProps({
  horizontal: {
    type: Boolean,
    default: false,
  },
  maxHeight: {
    type: Number,
    default: 0,
  },
  thumbWidth: {
    type: String,
    default: "6px",
  },
  thumbColor: {
    type: String,
    default: "#909399",
  },
  thumbHoverColor: {
    type: String,
    default: "#606266",
  },
});

// 组件内部状态
const wrapperRef = ref(null); // 外层容器引用
const contentRef = ref(null); // 内容容器引用
const showVerticalBar = ref(false); // 是否显示垂直滚动条
const showHorizontalBar = ref(false); // 是否显示水平滚动条
const verticalThumbHeight = ref(0); // 垂直滚动条高度
const verticalThumbTop = ref(0); // 垂直滚动条位置
const horizontalThumbWidth = ref(0); // 水平滚动条宽度
const horizontalThumbLeft = ref(0); // 水平滚动条位置
const isDragging = ref(false);
const startY = ref(0);
const startX = ref(0);
const startScrollTop = ref(0);
const startScrollLeft = ref(0);
const hasReachBottom = ref(false);

/**
 * 垂直滚动条样式计算属性
 */
const verticalThumbStyle = computed(() => ({
  height: `${verticalThumbHeight.value}px`,
  transform: `translateY(${verticalThumbTop.value}px)`,
  width: props.thumbWidth,
  backgroundColor: props.thumbColor,
}));

/**
 * 水平滚动条样式计算属性
 */
const maxHeightStyle = computed(() => (props.maxHeight ? `${props.maxHeight}px` : "none"));

/**
 * 判断是否滚动到底部
 */
const isScrollBottom = (wrapper) => {
  return {
    horizontal: showHorizontalBar.value
      ? Math.abs(wrapper.scrollLeft + wrapper.clientWidth - wrapper.scrollWidth) < 2
      : false,
    vertical: Math.abs(wrapper.scrollTop + wrapper.clientHeight - wrapper.scrollHeight) < 2,
  };
};

const horizontalThumbStyle = computed(() => {
  return {
    width: `${horizontalThumbWidth.value}px`,
    transform: `translateX(${horizontalThumbLeft.value}px)`,
    height: props.thumbWidth,
    backgroundColor: props.thumbColor,
  };
});

/**
 * 更新滚动条位置和尺寸
 * 根据内容和容器的尺寸计算滚动条的显示状态、大小和位置
 */
const updateThumbPosition = () => {
  if (!wrapperRef.value || !contentRef.value) return;

  const wrapper = wrapperRef.value;
  const content = contentRef.value;

  // 垂直滚动条
  const contentHeight = content.scrollHeight;
  const wrapperHeight = props.maxHeight || wrapper.clientHeight;
  showVerticalBar.value = contentHeight > wrapperHeight;

  if (showVerticalBar.value) {
    const ratio = wrapperHeight / contentHeight;
    // 垂直滚动条高度
    verticalThumbHeight.value = Math.max(ratio * wrapperHeight, 20);
    // 垂直滚动条可以移动的最大距离
    const maxTop = wrapperHeight - verticalThumbHeight.value - 2;
    // 垂直滚动条位置
    verticalThumbTop.value = Math.min((wrapper.scrollTop / (contentHeight - wrapperHeight)) * maxTop, maxTop);
  }

  // 水平滚动条
  const contentWidth = content.scrollWidth;
  const wrapperWidth = wrapper.clientWidth;
  showHorizontalBar.value = contentWidth > wrapperWidth;

  if (showHorizontalBar.value) {
    const ratio = wrapperWidth / contentWidth;
    horizontalThumbWidth.value = Math.max(ratio * wrapperWidth, 20);
    horizontalThumbLeft.value = (wrapper.scrollLeft / contentWidth) * wrapperWidth - 2;
  }
};

const emitScroll = (wrapper) => {
  const scrollTop = wrapper.scrollTop;
  // 滚动条处于顶部或最左侧时，不触发滚动事件
  if (scrollTop === 0) return;

  emit("scroll", isScrollBottom(wrapper));
};
/**
 * 处理鼠标滚轮事件
 * 根据horizontal属性决定是垂直滚动还是水平滚动
 */
const handleWheel = (e) => {
  if (!wrapperRef.value) return;
  const wrapper = wrapperRef.value;
  // 在水平模式下，阻止默认滚动与事件冒泡，避免父/祖先容器滚动
  if (props.horizontal) {
    e.preventDefault();
    e.stopPropagation();
  }
  // 判断是否触底
  const isBottom = isScrollBottom(wrapper);
  if (props.horizontal) {
    if (!isBottom.horizontal || e.deltaY < 0) {
      wrapper.scrollLeft += e.deltaY;
    }
  } else {
    wrapper.scrollTop += e.deltaY;
  }

  if (isBottom.vertical) {
    if (!hasReachBottom.value) {
      emitScroll(wrapper);
    }
    hasReachBottom.value = true;
  } else {
    hasReachBottom.value = false;
    emitScroll(wrapper);
  }
  updateThumbPosition();
};

/**
 * 处理垂直滚动条点击事件
 * 点击滚动条空白区域时，内容会滚动到对应位置
 */
const handleVerticalBarMouseDown = (e) => {
  e.preventDefault();
  if (!wrapperRef.value) return;

  const wrapper = wrapperRef.value;
  const clickPosition = e.offsetY;
  const thumbTop = verticalThumbTop.value;
  const thumbHeight = verticalThumbHeight.value;

  if (clickPosition < thumbTop || clickPosition > thumbTop + thumbHeight) {
    const ratio = clickPosition / wrapper.clientHeight;
    wrapper.scrollTop = ratio * wrapper.scrollHeight;
    updateThumbPosition();
    emitScroll(wrapper);
  }
};

/**
 * 处理水平滚动条点击事件
 * 点击滚动条空白区域时，内容会滚动到对应位置
 */
const handleHorizontalBarMouseDown = (e) => {
  e.preventDefault();
  if (!wrapperRef.value) return;

  const wrapper = wrapperRef.value;
  const clickPosition = e.offsetX;
  const thumbLeft = horizontalThumbLeft.value;
  const thumbWidth = horizontalThumbWidth.value;

  if (clickPosition < thumbLeft || clickPosition > thumbLeft + thumbWidth) {
    const ratio = clickPosition / wrapper.clientWidth;
    wrapper.scrollLeft = ratio * wrapper.scrollWidth;
    updateThumbPosition();
    emitScroll(wrapper);
  }
};

const handleVerticalThumbMouseDown = (e) => {
  e.preventDefault();
  if (!wrapperRef.value) return;

  isDragging.value = true;
  startY.value = e.clientY;
  startScrollTop.value = wrapperRef.value.scrollTop;

  document.addEventListener("mousemove", handleVerticalDrag);
  document.addEventListener("mouseup", handleDragEnd);
};

const handleHorizontalThumbMouseDown = (e) => {
  e.preventDefault();
  if (!wrapperRef.value) return;

  isDragging.value = true;
  startX.value = e.clientX;
  startScrollLeft.value = wrapperRef.value.scrollLeft;

  document.addEventListener("mousemove", handleHorizontalDrag);
  document.addEventListener("mouseup", handleDragEnd);
};

const handleVerticalDrag = (e) => {
  if (!isDragging.value || !wrapperRef.value) return;

  const isBottom = isScrollBottom(wrapperRef.value);
  const deltaY = e.clientY - startY.value;

  // 如果已经触底且继续向底部拖动，则不再触发
  if (!isBottom.vertical || deltaY < 0) {
    const scrollRatio = wrapperRef.value.clientHeight / wrapperRef.value.scrollHeight;
    const scrollDelta = deltaY / scrollRatio;

    wrapperRef.value.scrollTop = startScrollTop.value + scrollDelta;
    updateThumbPosition();

    if (!isBottom.vertical) {
      emitScroll(wrapperRef.value);
    }
  }
};

const handleHorizontalDrag = (e) => {
  if (!isDragging.value || !wrapperRef.value) return;

  const isBottom = isScrollBottom(wrapperRef.value);
  const deltaX = e.clientX - startX.value;

  // 如果已经触底且继续向右侧拖动，则不再触发
  if (!isBottom.horizontal || deltaX < 0) {
    const scrollRatio = wrapperRef.value.clientWidth / wrapperRef.value.scrollWidth;
    const scrollDelta = deltaX / scrollRatio;

    wrapperRef.value.scrollLeft = startScrollLeft.value + scrollDelta;
    updateThumbPosition();

    if (!isBottom.horizontal) {
      emitScroll(wrapperRef.value);
    }
  }
};

const handleDragEnd = () => {
  isDragging.value = false;
  document.removeEventListener("mousemove", handleVerticalDrag);
  document.removeEventListener("mousemove", handleHorizontalDrag);
  document.removeEventListener("mouseup", handleDragEnd);
};

// 创建MutationObserver实例
const observer = ref(null);

// 组件生命周期钩子
onMounted(() => {
  if (!wrapperRef.value || !contentRef.value) return;
  updateThumbPosition();
  window.addEventListener("resize", updateThumbPosition);

  // 创建并启动MutationObserver
  observer.value = new MutationObserver(() => {
    updateThumbPosition();
  });

  // 监听内容区域的子节点变化和属性变化
  observer.value.observe(contentRef.value, {
    childList: true,
    subtree: true,
    attributes: true,
  });
});

onUnmounted(() => {
  handleDragEnd();
  window.removeEventListener("resize", updateThumbPosition);
  // 断开MutationObserver连接
  if (observer.value) {
    observer.value.disconnect();
  }
});
</script>

<style scoped>
.x-scroll {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.x-scroll__wrapper {
  width: 100%;
  height: 100%;
  max-height: v-bind(maxHeightStyle);
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.x-scroll__wrapper::-webkit-scrollbar {
  display: none;
}

.x-scroll__content {
  min-width: 100%;
  min-height: 100%;
}

.x-scroll__bar {
  position: absolute;
  background-color: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.3s, background-color 0.3s;
  opacity: 0;
}

.x-scroll:hover .x-scroll__bar {
  opacity: 1;
}

.x-scroll:hover .x-scroll__bar {
  background-color: #e4e4e4;
}

.x-scroll__bar--vertical {
  width: v-bind("props.thumbWidth");
  top: 2px;
  right: 0;
  bottom: 2px;
}

.x-scroll__bar--horizontal {
  height: 6px;
  left: 2px;
  right: 2px;
  bottom: 0;
}

.x-scroll__thumb {
  position: absolute;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.x-scroll__thumb:hover {
  background-color: v-bind("props.thumbHoverColor") !important;
}

.x-scroll__thumb--vertical {
  width: 100%;
}

.x-scroll__thumb--horizontal {
  height: 100%;
}
/* 避免在水平滚动模式下发生滚动串联（scroll chaining）到父/祖先容器 */
.x-scroll--horizontal .x-scroll__wrapper {
  overscroll-behavior-x: contain;
}
</style>
