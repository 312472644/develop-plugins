<template>
  <XDialog :visible="visible" title="文档属性" :width="width" @update:visible="$emit('update:visible', $event)">
    <div class="info-item">
      <span class="info-label">页数：</span>
      <span>{{ info.totalPages || 0 }}页</span>
    </div>
    <div class="info-item">
      <span class="info-label">文件大小：</span>
      <span>{{ info.docSize }}</span>
    </div>
    <div class="info-item">
      <span class="info-label">应用：</span>
      <span>{{ info.creator }}</span>
    </div>
    <div class="info-item">
      <span class="info-label">PDF 制作工具：</span>
      <span>{{ info.producer }}</span>
    </div>
    <div class="info-item">
      <span class="info-label">PDF 版本：</span>
      <span>{{ info.pdfFormatVersion }}</span>
    </div>
    <div class="info-item">
      <span class="info-label">创建时间：</span>
      <span>{{ info.creationDate }}</span>
    </div>
    <div class="info-item">
      <span class="info-label">修改时间：</span>
      <span>{{ info.modificationDate }}</span>
    </div>
  </XDialog>
</template>

<script setup>
import { defineProps } from "vue";
import XDialog from "../x-dialog/index.vue";

defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  info: {
    type: Object,
    default: () => ({}),
  },
  width: {
    type: String,
    default: "350px",
  },
});
</script>

<style scoped>
.info-item {
  margin: 10px 0;
  display: flex;
  align-items: center;
}

.info-label {
  font-weight: bold;
  margin-right: 15px;
  min-width: 100px;
  text-align: right;
}
</style>
