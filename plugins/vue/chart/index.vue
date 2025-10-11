<template>
  <div class="chart-wrapper" :style="{ width: width, height: height }">
    <div ref="chartRef" class="chart-container" />
    <!-- Loading 遮罩层 -->
    <div v-if="loading" class="chart-loading-overlay">
      <slot name="loading">
        <div class="default-loading">
          <div class="loading-spinner"></div>
          <div class="loading-text">{{ loadingText }}</div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, onActivated, watch, nextTick } from "vue";
import * as echarts from "echarts";

// Props定义
const props = defineProps({
  // 图表配置选项
  option: {
    type: Object,
    required: true,
  },
  // 图表宽度
  width: {
    type: String,
    default: "100%",
  },
  // 图表高度
  height: {
    type: String,
    default: "100%",
  },
  // 主题
  theme: {
    type: String,
    default: "default",
  },
  // 是否自动resize
  autoResize: {
    type: Boolean,
    default: true,
  },
  // 是否显示loading
  loading: {
    type: Boolean,
    default: false,
  },
  // loading文本
  loadingText: {
    type: String,
    default: "加载中...",
  },
});

// Emits定义
const emit = defineEmits([
  "chart-ready",
  "click",
  "dblclick",
  "mousedown",
  "mousemove",
  "mouseup",
  "mouseover",
  "mouseout",
]);

// 响应式数据
const chartRef = ref(null);
let chartInstance = null;

// 初始化图表
const initChart = async () => {
  if (!chartRef.value) return;

  try {
    // 创建图表实例
    chartInstance = echarts.init(chartRef.value, props.theme);

    // 设置配置选项
    chartInstance.setOption(props.option);

    // 绑定事件
    bindEvents();

    // 触发图表准备就绪事件
    emit("chart-ready", chartInstance);

    // 自适应resize
    if (props.autoResize) {
      window.addEventListener("resize", handleResize);
    }
  } catch (error) {
    console.error("Chart initialization failed:", error);
  }
};

// 绑定图表事件
const bindEvents = () => {
  if (!chartInstance) return;

  const events = ["click", "dblclick", "mousedown", "mousemove", "mouseup", "mouseover", "mouseout"];

  events.forEach((event) => {
    chartInstance.on(event, (params) => {
      emit(event, params);
    });
  });
};

// 防抖函数
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// 处理窗口resize
const handleResize = debounce(() => {
  if (chartInstance) {
    chartInstance.resize();
  }
}, 300);

// 更新图表配置
const updateChart = (newOption) => {
  if (chartInstance && newOption) {
    chartInstance.setOption(newOption, true);
  }
};

// 清空图表
const clearChart = () => {
  if (chartInstance) {
    chartInstance.clear();
  }
};

// 销毁图表
const disposeChart = () => {
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
  if (props.autoResize) {
    window.removeEventListener("resize", handleResize);
  }
};

// 暴露方法给父组件
defineExpose({
  chartInstance,
  updateChart,
  clearChart,
  disposeChart,
});

// 监听配置变化
watch(
  () => props.option,
  (newOption) => {
    updateChart(newOption);
  },
  { deep: true }
);

// 监听主题变化
watch(
  () => props.theme,
  () => {
    disposeChart();
    nextTick(() => {
      initChart();
    });
  }
);

// 生命周期
onMounted(() => {
  nextTick(() => {
    initChart();
  });
});

onActivated(() => {
  // 组件被激活时重新调整图表大小
  if (chartInstance) {
    nextTick(() => {
      chartInstance.resize();
    });
  }
});

onUnmounted(() => {
  disposeChart();
});
</script>

<style scoped>
.chart-wrapper {
  position: relative;
  overflow: hidden;
}

.chart-container {
  width: 100%;
  height: 100%;
}

.chart-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.default-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 8px;
}

.loading-text {
  color: #666;
  font-size: 14px;
  user-select: none;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
