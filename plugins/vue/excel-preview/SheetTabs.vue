<template>
  <div ref="tabsContainer" class="sheet-tabs">
    <div
      v-for="name in sheetTabList"
      :key="name"
      class="sheet-tab"
      :class="{ active: activeSheet === name }"
      @click="() => $emit('sheet-change', name)"
    >
      <span class="tab-name" :title="name">{{ name }}</span>
      <span v-if="sheetTabList.length !== 1 && !readonly" class="delete-icon" @click.stop="handleDelete(name)">×</span>
    </div>
    <div v-if="!showInput && !readonly" class="add-sheet" :class="{ 'scroll-bar': showScrollbar }" @click="handleAdd">
      +
    </div>
    <input
      v-if="showInput && !readonly"
      ref="InputRef"
      v-model="newSheetName"
      class="sheet-input"
      type="text"
      placeholder="请输入"
      @blur="handleBlur"
      @keyup.enter="handleBlur"
    />
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, watch, onUnmounted, inject } from "vue";

const props = defineProps({
  sheetTabList: {
    type: Array,
    required: true,
  },
  activeSheet: {
    type: String,
    required: true,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
});

const XMessage = inject("XMessage");

const tabsContainer = ref(null);
const showScrollbar = ref(false);
const debouncedCheckScroll = ref(null);

const InputRef = ref(null);
const emits = defineEmits(["sheet-change", "add-sheet", "delete-sheet", "edit-sheet"]);

function handleDelete(sheetName) {
  if (props.sheetTabList.length <= 1) return;
  emits("delete-sheet", sheetName);
}

const showInput = ref(false);
const newSheetName = ref("");

function handleAdd() {
  showInput.value = true;
  nextTick(() => {
    InputRef.value.focus();
  });
}

function checkSheetNameIsValid(sheetName) {
  // 只能输入中文、英文、数字、下划线、中划线
  const reg = /^[\u4e00-\u9fa5_a-zA-Z0-9-]+$/;
  return reg.test(sheetName);
}

function handleBlur() {
  const sheetName = newSheetName.value.trim();
  if (!sheetName) {
    showInput.value = false;
    newSheetName.value = "";
    return;
  }
  if (!checkSheetNameIsValid(sheetName)) {
    XMessage({
      type: "warning",
      message: "工作表名称只能包含中文、英文、数字、下划线、中划线",
    });
    showInput.value = false;
    newSheetName.value = "";
    return;
  }
  const isExist = props.sheetTabList.includes(sheetName);
  if (isExist) {
    XMessage({
      type: "warning",
      message: "工作表已存在",
    });
    showInput.value = false;
    newSheetName.value = "";
    return;
  }
  emits("add-sheet", newSheetName.value);
  showInput.value = false;
  newSheetName.value = "";
}

function checkScroll() {
  if (!tabsContainer.value) return;
  const { scrollWidth, clientWidth } = tabsContainer.value;
  showScrollbar.value = scrollWidth > clientWidth;
}

function bindEvent() {
  debouncedCheckScroll.value = debounce(checkScroll, 200);
  window.addEventListener("resize", debouncedCheckScroll.value);
}

function unbindEvent() {
  window.removeEventListener("resize", debouncedCheckScroll.value);
}

function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

onMounted(() => {
  bindEvent();
  checkScroll();
});

onUnmounted(() => {
  unbindEvent();
});

watch(
  () => props.sheetTabList,
  () => {
    nextTick(() => {
      checkScroll();
    });
  },
  { deep: true }
);
</script>

<style scoped>
.sheet-tabs {
  display: flex;
  gap: 8px;
  margin: 0;
  padding: 8px 16px;
  padding-right: 0;
  overflow-x: auto;
  position: relative;
  scrollbar-width: thin;
  scrollbar-color: #e4e7ed transparent;
  height: 41px;
}

.sheet-tabs::-webkit-scrollbar {
  height: 6px;
}

.sheet-tabs::-webkit-scrollbar-thumb {
  background-color: #e4e7ed;
  border-radius: 3px;
}

.sheet-tabs::-webkit-scrollbar-track {
  background-color: transparent;
}

.sheet-tab {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  background: #f0f2f5;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #606266;
  transition: all 0.2s;
  position: relative;
  white-space: nowrap;
}

.sheet-tab .tab-name {
  display: inline-block;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.sheet-tab + .sheet-tab {
  margin-left: 8px;
}

.sheet-tab:first-child {
  margin-left: 0;
}

.sheet-tab:hover {
  color: #1a42e8;
  border-color: #c2d4f8;
  background-color: #e6effd;
}

.sheet-tab.active {
  color: #1a42e8;
  font-weight: 500;
  border-color: #1a42e8;
  background-color: #e6effd;
}

.delete-icon {
  display: inline-flex;
  width: 16px;
  height: 16px;
  align-items: center;
  margin-left: 8px;
  cursor: pointer;
  font-size: 16px;
  color: #999;
  transition: all 0.2s;
  border-radius: 50%;
  padding: 2px;
}

.delete-icon:hover {
  color: #e6effd;
  background-color: #1a42e8;
}

.sheet-tab.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #1a42e8;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.add-sheet {
  padding: 4px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px dashed rgba(26, 66, 232, 0.3);
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  color: #1a42e8;
  margin-left: 8px;
  z-index: 2;
  min-width: 36px;
  min-height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.add-sheet.scroll-bar {
  position: sticky;
  right: 0;
  transform: translateX(16px);
  background: rgba(255, 255, 255, 0.95);
}

.add-sheet:hover {
  color: #fff;
  border-color: #1a42e8;
  background: #1a42e8;
  box-shadow: 0 4px 8px rgba(26, 66, 232, 0.15);
}

.sheet-input {
  padding: 6px 12px;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  font-size: 14px;
  color: #606266;
  outline: none;
  width: 100px;
  margin-left: 8px;
}

.sheet-input:focus {
  border-color: #1a42e8;
}
</style>
