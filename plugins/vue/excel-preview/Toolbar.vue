<template>
  <div class="toolbar">
    <div class="toolbar-buttons">
      <button :disabled="exportBtnDisabled" class="button" @click="$emit('export')">
        <span>导出Excel</span>
      </button>
      <button v-if="!readonly" :disabled="saveBtnDisabled" class="button" @click="$emit('save')">
        <span>保存数据</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  // 是否显示sheet
  showSheetTabs: {
    type: Boolean,
    default: false,
  },
  // 保存按钮是否禁用
  saveBtnDisabled: {
    type: Boolean,
    default: false,
  },
  // 导出按钮是否禁用
  exportBtnDisabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["export", "save", "sheet-change"]);
</script>

<style scoped>
.toolbar {
  background: #ebedf0;
  border: 1px solid #e4e7ed;
  border-bottom: none;
  width: 100%;
  padding: 12px 16px 0 16px;
  border-radius: 4px 4px 0 0;
}

.toolbar-buttons {
  display: flex;
  padding-bottom: 12px;
}

.toolbar .button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 8px;
  min-width: 80px;
  transition: all 0.2s ease;
}

.toolbar .button:first-child {
  background-color: #1a42e8;
  border: 1px solid #1a42e8;
  color: #fff;
}

.toolbar .button:first-child:not(:disabled):hover {
  background-color: #4066ff;
  border-color: #4066ff;
}

.toolbar .button:last-child {
  background-color: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
}

.toolbar .button:last-child:not(:disabled):hover {
  color: #1a42e8;
  border-color: #1a42e8;
  background-color: #e6effd;
}

.toolbar .button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.toolbar .button:first-child:disabled {
  background-color: #a0aec0;
  border-color: #a0aec0;
  color: #fff;
}

.toolbar .button:last-child:disabled {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #c0c4cc;
}
</style>
