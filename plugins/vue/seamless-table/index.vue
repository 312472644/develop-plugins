<template>
  <div class="seamless-scroll-table" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <div class="table-header" ref="headerRef">
      <table>
        <thead>
          <tr>
            <th
              v-for="(col, index) in columns"
              class="th-cell"
              :key="col.key || index"
              :style="{
                width: col.width || 'auto',
                textAlign: col.align || 'left',
              }"
            >
              {{ col.title }}
            </th>
          </tr>
        </thead>
      </table>
    </div>
    <div v-if="data.length > 0" class="scroll-content" ref="scrollContentRef">
      <div
        ref="contentRef"
        class="content-wrapper"
        :class="{ animate: shouldScroll }"
        :style="shouldScroll ? { animationDuration: duration + 's' } : {}"
      >
        <table>
          <tbody>
            <tr v-for="(row, index) in data" :key="index" @click="$emit('row-click', row, index)">
              <td
                v-for="col in columns"
                :key="col.key || index"
                :style="{
                  width: col.width || 'auto',
                  textAlign: col.align || 'left',
                }"
              >
                <!-- 默认插槽：支持自定义内容 -->
                <slot :name="col.key" :row="row" :index="index" :column="col">
                  <span :title="row[col.key]">{{ row[col.key] }}</span>
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- 第二份数据（实现无缝） -->
        <table v-if="shouldScroll" class="copy-table">
          <tbody>
            <tr v-for="(row, index) in data" :key="index + data.length" @click="$emit('row-click', row, index)">
              <td
                v-for="col in columns"
                :key="col.key"
                :style="{
                  width: col.width || 'auto',
                  textAlign: col.align || 'left',
                }"
              >
                <slot :name="col.key" :row="row" :index="index" :column="col">
                  <span :title="row[col.key]">{{ row[col.key] }}</span>
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else class="empty-container">
      <div v-if="!$slots.empty" class="empty">
        <span class="empty-text">暂无数据</span>
      </div>

      <slot v-else name="empty"></slot>
    </div>
  </div>
</template>

<script setup name="SeamlessTable">
import { ref, onMounted, nextTick, computed, shallowRef, onUnmounted, watch } from "vue";

defineEmits(["row-click"]);

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  // 奇数行背景色
  oddBackground: {
    type: String,
    default: "#021736",
  },
  // 偶数行背景色
  evenBackground: {
    type: String,
    default: "#042d4c",
  },
  // 悬停行背景色
  hoverBackground: {
    type: String,
    default: "#0a526e",
  },
  /**
   * 列配置
   * - key: 列字段名（对应 data 中的字段）
   * - title: 列标题
   * - align: 对齐方式（left/center/right）
   * - width: 列宽（可选，支持 px/% 等单位）
   */
  columns: {
    type: Array,
    required: true,
    validator: (cols) => cols.every((col) => col.key && col.title),
  },
  // 容器高度（px）
  height: {
    type: [Number, String],
    default: "100%",
  },
  // 滚动速度（px/秒）
  speed: {
    type: Number,
    default: 60,
  },
});

const resizeObserver = shallowRef(null);
const contentRef = ref(null);
const scrollContentRef = ref(null);

const contentHeight = ref(0);
const containerHeight = ref(0);

const shouldScroll = computed(() => {
  return props.data.length > 0 && contentHeight.value > 0 && contentHeight.value > containerHeight.value;
});

const duration = computed(() => {
  if (!shouldScroll.value) return 0;
  return (contentHeight.value * 2) / props.speed;
});

// 测量内容高度（表格实际高度）
const measureContentHeight = async () => {
  await nextTick();
  const tableEl = contentRef.value?.querySelector("table");
  if (tableEl) {
    contentHeight.value = tableEl.offsetHeight;
  }
};

// 测量容器高度（可视区域）
const measureContainerHeight = async () => {
  await nextTick();
  if (scrollContentRef.value) {
    containerHeight.value = scrollContentRef.value.clientHeight;
  }
};

const handleMouseEnter = () => {
  if (shouldScroll.value && contentRef.value) {
    contentRef.value.style.animationPlayState = "paused";
  }
};

const handleMouseLeave = () => {
  if (shouldScroll.value && contentRef.value) {
    contentRef.value.style.animationPlayState = "running";
  }
};

onMounted(() => {
  measureContentHeight();
  measureContainerHeight();

  resizeObserver.value = new ResizeObserver(() => {
    measureContainerHeight();
    measureContentHeight();
  });

  if (scrollContentRef.value) {
    resizeObserver.value.observe(scrollContentRef.value);
  }
});

onUnmounted(() => {
  if (resizeObserver.value) {
    resizeObserver.value.disconnect();
  }
});

watch(() => props.data, measureContentHeight, { deep: true });

watch(
  () => props.speed,
  () => {
    // 速度变化时重新计算动画时长
    if (shouldScroll.value) {
      duration.value = (contentHeight.value * 2) / props.speed;
    }
  }
);

watch(
  () => props.data,
  () => {
    // 数据变化时重新计算内容高度
    measureContentHeight();
    measureContainerHeight();
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
.seamless-scroll-table {
  font-size: 14px;
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .table-header {
    background: #021633;
    .th-cell {
      color: #14c3f0;
      box-sizing: border-box;
      line-height: 40px;
      overflow: hidden;
      overflow-wrap: break-word;
      padding: 4px 0;
      text-overflow: ellipsis;
      white-space: normal;
    }
  }

  .table-header table,
  .content-wrapper table {
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
  }

  .table-header th {
    padding: 10px;
    font-weight: normal;
    font-size: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* 滚动内容区 */
  .scroll-content {
    height: 100%;
    overflow: hidden;
    flex: 1 0 0;
    min-height: 0;

    tr {
      background-color: v-bind(evenBackground);
      &:nth-last-of-type(odd) {
        background-color: v-bind(oddBackground);
      }
      &:hover {
        cursor: pointer;
        background-color: v-bind(hoverBackground);
      }
    }

    .copy-table {
      tr {
        background-color: v-bind(oddBackground);
        &:nth-last-of-type(even) {
          background-color: v-bind(evenBackground);
        }
      }
    }

    td {
      font-size: 13px;
    }

    /* 滚动内容 */
    .content-wrapper {
      will-change: transform;
      display: flex;
      flex-direction: column;
    }

    .content-wrapper.animate {
      animation: scrollUp linear infinite;
      animation-play-state: running;
    }

    /* 单元格样式 */
    .content-wrapper td {
      padding: 10px;
      color: #fff;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* 悬停暂停 */
    .seamless-scroll-table:hover .content-wrapper.animate {
      animation-play-state: paused;
    }
  }

  .empty-container {
    flex: 1 0 0;
    .empty {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(2, 22, 51, 0.95);
      .empty-text {
        font-size: 14px;
        color: #f1f1f1;
      }
    }
  }

  @keyframes scrollUp {
    0% {
      transform: translate3d(0, 0, 0);
    }
    99.9999% {
      transform: translate3d(0, -50%, 0);
    }
    100% {
      transform: translate3d(0, 0, 0);
    }
  }
}
</style>
