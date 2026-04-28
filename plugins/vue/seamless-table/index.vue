<template>
  <div
    class="seamless-scroll-table"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    :style="{ height: height }"
  >
    <!-- 表头 -->
    <div class="table-header">
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

    <!-- 内容 -->
    <div v-if="displayData.length" class="scroll-content" ref="scrollContentRef">
      <div
        ref="contentRef"
        class="content-wrapper"
        :class="{ animate: shouldScroll && !step }"
        :style="!step && shouldScroll ? { animationDuration: duration + 's' } : {}"
      >
        <!-- 步进模式：只渲染一份 -->
        <table>
          <tbody>
            <tr v-for="(row, index) in displayData" :key="index" @click="$emit('row-click', row, index)">
              <td
                v-for="col in columns"
                class="th-cell"
                :key="col.key"
                :style="{
                  width: col.width || 'auto',
                  textAlign: col.align || 'left',
                  backgroundColor: row.backgroundColor,
                }"
              >
                <slot :name="col.key" :row="row" :index="index">
                  {{ row[col.key] }}
                </slot>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- 平滑滚动：复制一份 -->
        <table v-if="shouldScroll && !step">
          <tbody>
            <tr v-for="(row, index) in displayData" :key="index + data.length" @click="$emit('row-click', row, index)">
              <td
                v-for="col in columns"
                class="th-cell"
                :key="col.key"
                :style="{
                  width: col.width || 'auto',
                  textAlign: col.align || 'left',
                  backgroundColor: row.backgroundColor,
                }"
              >
                <slot :name="col.key" :row="row" :index="index">
                  {{ row[col.key] }}
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else class="empty-container">
      <div v-if="!$slots.empty" class="empty"><span class="empty-text">暂无数据</span></div>
      <slot v-else name="empty"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, onUnmounted, watch } from "vue";

defineOptions({ name: "SeamlessTable" });

const props = defineProps({
  data: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] },
  speed: { type: Number, default: 60 },
  // 表头背景颜色
  headerBackground: { type: String, default: "#021736" },
  // 奇数行背景颜色
  oddBackground: { type: String, default: "#021736" },
  // 偶数行背景颜色
  evenBackground: { type: String, default: "#042d4c" },
  hoverBackground: {
    type: String,
    default: "#0a526e",
  },
  height: {
    type: [Number, String],
    default: "100%",
  },
  // ✅ 步进配置
  step: { type: Boolean, default: false },
  stepDelay: { type: Number, default: 1000 },
});

defineEmits(["row-click"]);

const contentRef = ref(null);
const scrollContentRef = ref(null);

// ✅ 真正渲染的数据（可变）
const displayData = ref([]);

const contentHeight = ref(0);
const containerHeight = ref(0);

let timer = null;
let rowHeight = 0;

// 是否需要滚动
const shouldScroll = computed(() => {
  return contentHeight.value > containerHeight.value;
});

// 平滑滚动时长
const duration = computed(() => {
  if (!shouldScroll.value) return 0;
  return (contentHeight.value * 2) / props.speed;
});

// 初始化数据
const initData = () => {
  displayData.value = [...props.data].map((row, index) => {
    return {
      ...row,
      backgroundColor: index % 2 === 0 ? props.oddBackground : props.evenBackground,
    };
  });
};

// 测量
const measure = async () => {
  await nextTick();

  const table = contentRef.value?.querySelector("table");
  const tr = contentRef.value?.querySelector("tr");

  if (table) contentHeight.value = table.offsetHeight;
  if (scrollContentRef.value) containerHeight.value = scrollContentRef.value.clientHeight;

  if (tr) rowHeight = tr.offsetHeight;
};

const startStepScroll = () => {
  if (!props.step || !shouldScroll.value) return;

  stopStepScroll();

  timer = setInterval(() => {
    if (!contentRef.value || displayData.value.length === 0) return;

    // 1️⃣ 向上滚动一行
    contentRef.value.style.transition = "transform 0.3s ease";
    contentRef.value.style.transform = `translateY(-${rowHeight}px)`;

    // 2️⃣ 动画结束后重排
    setTimeout(() => {
      const first = displayData.value.shift();
      displayData.value.push(first);

      contentRef.value.style.transition = "none";
      contentRef.value.style.transform = `translateY(0)`;
    }, 300);
  }, props.stepDelay);
};

const stopStepScroll = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

const handleMouseEnter = () => {
  if (props.step) stopStepScroll();
  else contentRef.value.style.animationPlayState = "paused";
};

const handleMouseLeave = () => {
  if (props.step) startStepScroll();
  else contentRef.value.style.animationPlayState = "running";
};

onMounted(async () => {
  initData();
  await measure();

  if (props.step) startStepScroll();
});

onUnmounted(() => {
  stopStepScroll();
});
watch(
  () => props.data,
  async () => {
    initData();
    await measure();

    if (props.step) startStepScroll();
  },
  { deep: true }
);

watch(
  () => props.step,
  (val) => {
    if (val) startStepScroll();
    else stopStepScroll();
  }
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
    background: v-bind(headerBackground);
    .th-cell {
      color: #14c3f0;
      box-sizing: border-box;
      line-height: 40px;
      overflow: hidden;
      overflow-wrap: break-word;
      padding: 4px 10px;
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
    td {
      font-size: 13px;
    } /* 滚动内容 */
    .content-wrapper {
      will-change: transform;
      display: flex;
      flex-direction: column;
    }
    .content-wrapper.animate {
      animation: scrollUp linear infinite;
      animation-play-state: running;
    } /* 单元格样式 */
    .content-wrapper td {
      padding: 10px;
      color: #fff;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    } /* 悬停暂停 */
    .seamless-scroll-table:hover .content-wrapper.animate {
      animation-play-state: paused;
    }
  }
  table tbody tr {
    &:hover {
      .th-cell {
        transition: all 0.3s ease;
        cursor: pointer;
        background: v-bind(hoverBackground) !important;
      }
    }
  }
  .empty-container {
    flex: 1 0 0;
    .empty {
      height: 100%;
      min-height: 40px;
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
