<template>
  <ClientOnly>
    <div class="card-code" :class="{ active: category && category === hash }">
      <div class="card-header">
        <div class="header-extra">
          <div class="icon-item">
            <n-tooltip placement="top" trigger="hover">
              <template #trigger>
                <n-icon size="15" @click="handleCopy">
                  <CopyOutline />
                </n-icon>
              </template>
              <span>复制代码</span>
            </n-tooltip>
          </div>
          <div class="icon-item">
            <n-tooltip placement="top" trigger="hover">
              <template #trigger>
                <n-icon size="15" @click="handleToggle">
                  <CodeOutline />
                </n-icon>
              </template>
              <span>{{ showCode ? "收起代码" : "显示代码" }}</span>
            </n-tooltip>
          </div>
        </div>
      </div>
      <div class="card-content">
        <div class="desc">
          <slot name="desc"></slot>
        </div>
        <div class="demo-view">
          <slot name="demo"></slot>
        </div>
        <slot></slot>
      </div>
      <div v-if="showCode" class="card-footer">
        <div class="code-view" v-html="transformHtml"></div>
      </div>
    </div>
  </ClientOnly>
</template>
<script setup>
import { ref, nextTick, watch, onMounted, onUnmounted } from "vue";
import { codeToHtml } from "shiki";
import { CopyOutline, CodeOutline } from "@vicons/ionicons5";
import { message } from "../message";

defineOptions({
  name: "CodeCard",
});

const props = defineProps({
  code: {
    type: String,
    default: "",
  },
  category: {
    type: String,
    default: "",
  },
  defaultExpanded: {
    type: Boolean,
    default: false,
  },
  lang: {
    type: String,
    default: "vue",
  },
});

const transformHtml = ref(null);
const hash = ref("");
const showCode = ref(props.defaultExpanded);

const handleCopy = () => {
  if (!props.code) return;
  navigator.clipboard
    .writeText(props.code)
    .then(() => {
      message.success("复制成功");
    })
    .catch(() => {
      message.error("复制失败");
    });
};

const handleToggle = () => {
  showCode.value = !showCode.value;
};

const initHighlighter = async () => {
  const html = await codeToHtml(props.code, {
    lang: props.lang,
    theme: "houston",
  });
  transformHtml.value = html;
};

watch(
  () => props.code,
  () => {
    nextTick(async () => {
      await initHighlighter();
    });
  },
  {
    immediate: true,
  }
);

const handleHashChange = (e) => {
  hash.value = decodeURI(window.location.hash.replace("#", ""));
};

onMounted(() => {
  window.addEventListener("hashchange", handleHashChange);
});

onUnmounted(() => {
  window.removeEventListener("hashchange", handleHashChange);
});
</script>
<style lang="scss">
.card-code {
  border: 1px solid #efeff5;
  padding: 19px 24px 20px 24px;
  border-radius: 3px;
  margin: 20px 0 12px 0;
  &.active {
    border-color: var(--primary-color);
  }
  .card-header {
    position: absolute;
    right: 20px;
    .header-main {
      flex: 1;
      min-width: 0;
      > span {
        font-size: 18px;
      }
    }
    .header-extra {
      display: flex;
      align-items: center;
      .icon-item {
        cursor: pointer;
        margin-left: 8px;
        transition: color 0.3s;
        &:first-child {
          margin-left: 0;
        }
        &:hover {
          color: var(--primary-color);
        }
      }
    }
  }
  .card-content {
    .desc {
      font-size: 14px;
      padding-right: 100px;
    }
    code {
      margin: 0 5px;
    }
    .demo-view {
      margin-top: 30px;
    }
  }
  .card-footer {
    display: block;
    border-top: 1px solid #efeff5;
    padding: 20px 24px 0 24px;
    margin: 20px -24px 0 -24px;
    .code-view {
      pre {
        padding: 20px 16px;
        margin: 0;
        border-radius: 4px;
        code {
          font-family: "mononoki", "Noto Sans SC";
          font-size: 14px;
          white-space: pre-wrap;
          word-break: break-word;
        }
      }
    }
  }
}
</style>
