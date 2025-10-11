<template>
  <div class="text-ellipsis" ref="domRef" v-ob-resize="onResize">
    <span>{{ text }}</span>
    <span v-if="hasAction" class="text-ellipsis__action" @click="handleToggle">
      <slot v-if="slots.action" name="action" :expanded="expanded"></slot>
      <span v-else class="ellipsis__span">{{ expanded ? collapseText : expandText }}</span>
    </span>
  </div>
</template>
<script setup name="TextEllipsis">
import { onMounted, ref, useSlots, watch } from "vue";
import { debounce } from "../../utils";
import ObResize from "../directive/ob-resize";

// 局部注册指令：在 <script setup> 中使用 v-ob-resize
const vObResize = ObResize;

const props = defineProps({
  content: {
    type: String,
    default: "",
    required: true,
  },
  collapseText: {
    type: String,
    default: "收起",
  },
  expandText: {
    type: String,
    default: "展开",
  },
  rows: {
    type: Number,
    default: 3,
  },
  dots: {
    type: String,
    default: "...",
  },
});

const slots = useSlots();
const domRef = ref(null);
const expanded = ref(false);
const hasAction = ref(false);
const text = ref(props.content);
const ellipsisText = ref(null);

const onResize = debounce(() => calcEllipsised(), 200);

function pxToNum(value) {
  if (!value) return 0;
  const match = value.match(/^\d*(\.\d*)?/);
  return match ? Number(match[0]) : 0;
}

function cloneContainer() {
  if (!domRef.value) return;

  const originStyle = window.getComputedStyle(domRef.value);
  const container = document.createElement("div");
  const styleNames = Array.prototype.slice.apply(originStyle);

  styleNames.forEach((name) => {
    container.style.setProperty(name, originStyle.getPropertyValue(name));
  });

  container.style.position = "fixed";
  container.style.zIndex = "-9999";
  container.style.top = "-9999px";
  container.style.height = "auto";
  container.style.marginTop = "20px";
  container.style.minHeight = "auto";
  container.style.maxHeight = "auto";

  container.innerText = props.content;
  document.body.appendChild(container);

  return container;
}

function calcEllipsised() {
  const content = props.content;
  const dots = props.dots;
  const actionText = expanded.value ? props.collapseText : props.expandText;

  // 截取行数显示最大内容
  const calcEllipsisText = (container, maxHeight) => {
    const end = content.length;

    function calcEllipse() {
      const tail = (left, right) => {
        if (right - left <= 1) {
          return content.slice(0, left) + dots;
        }

        const middle = Math.round((left + right) / 2);
        container.innerText = content.slice(0, middle) + dots + actionText;

        if (container.offsetHeight > maxHeight) {
          return tail(left, middle);
        }
        return tail(middle, right);
      };

      container.innerText = tail(0, end);
    }

    calcEllipse();

    ellipsisText.value = container.innerText;
    return container.innerText;
  };

  const container = cloneContainer();
  const { paddingBottom, paddingTop, lineHeight } = container.style;

  // 计算最大高度
  const maxHeight = Math.ceil(
    (Number(props.rows) + 0.5) * pxToNum(lineHeight) + pxToNum(paddingTop) + pxToNum(paddingBottom)
  );

  if (maxHeight < container.offsetHeight) {
    hasAction.value = true;
    const truncated = calcEllipsisText(container, maxHeight);
    // 保持展开状态时显示完整文本
    text.value = expanded.value ? props.content : truncated;
  } else {
    hasAction.value = false;
    text.value = props.content;
  }
  document.body.removeChild(container);
}

function handleToggle() {
  text.value = expanded.value ? ellipsisText.value : props.content;
  expanded.value = !expanded.value;
}

onMounted(() => calcEllipsised());

watch(
  () => props.content,
  () => calcEllipsised()
);
</script>

<style lang="scss">
.text-ellipsis {
  .ellipsis__span {
    color: #1890ff;
    cursor: pointer;
  }
}
</style>
