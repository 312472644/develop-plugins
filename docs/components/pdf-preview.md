---
title: PDF预览 PDFPreview
---

# PDF 预览 PDFPreview

在线预览 PDF 文件的组件，支持缩放、翻页、全屏、下载等功能。

## 安装

```bash
npm install @develop-plugins/pdf-preview
```

<script setup>
import { ref } from 'vue'
import { defineClientComponent } from 'vitepress'

const PDFPreview = defineClientComponent(() => {
  return import('@develop-plugins/pdf-preview')
})

const pdfUrl = ref('')

const watermarkConfig = ref({
  enable: true,
  text: '机密文档',
  fontSize: 16,
  color: 'rgba(255, 0, 0, 0.3)',
  rotate: -30,
})

// BaseTable 列与数据
const propsColumns = [
  { title: '属性', key: 'prop' },
  { title: '说明', key: 'desc' },
  { title: '类型', key: 'type' },
  { title: '默认值', key: 'default' },
]
const propsData = [
  { prop: 'fileUrl', desc: 'PDF文件URL(支持网络URL、本地文件路径、Uint8Array、Blob)', type: 'String/Object/Uint8Array/Blob', default: '-' },
  { prop: 'showToolbar', desc: '是否显示工具栏', type: 'Boolean', default: 'true' },
  { prop: 'showPageNumber', desc: '是否显示页码', type: 'Boolean', default: 'true' },
  { prop: 'downloadFileName', desc: '下载文件名', type: 'String', default: "'document.pdf'" },
  { prop: 'watermark', desc: '水印配置', type: 'Object', default: '{}' },
]

const watermarkColumns = [
  { title: '属性', key: 'prop' },
  { title: '说明', key: 'desc' },
  { title: '类型', key: 'type' },
  { title: '默认值', key: 'default' },
]
const watermarkData = [
  { prop: 'enable', desc: '是否启用水印', type: 'Boolean', default: 'false' },
  { prop: 'text', desc: '水印文本', type: 'String', default: "'水印'" },
  { prop: 'fontSize', desc: '字体大小', type: 'Number', default: '16' },
  { prop: 'color', desc: '字体颜色', type: 'String', default: "'rgba(0, 0, 0, 0.1)'" },
  { prop: 'rotate', desc: '旋转角度', type: 'Number', default: '-30' },
  { prop: 'size', desc: '水印大小', type: 'Number', default: '250' },
]

const eventsColumns = [
  { title: '事件名', key: 'name' },
  { title: '说明', key: 'desc' },
  { title: '回调参数', key: 'args' },
]
const eventsData = [
  { name: 'load-success', desc: 'PDF加载成功', args: '(pdf)' },
  { name: 'load-error', desc: 'PDF加载失败', args: '(error)' },
]

// 上传示例：本地选择PDF并预览
const uploadUrl = ref(pdfUrl.value)
const onUploadFileListUpdate = async (fileList) => {
  const file = fileList?.[0]?.file
  if (!file) {
    uploadUrl.value = ''
    return
  }
  uploadUrl.value = file
}

const uploadCode = `<template>
  <div style=\"display: flex; align-items: center; gap: 12px;\">
    <n-upload :default-upload=\"false\" accept=\"application/pdf\" :max=\"1\" @update:file-list=\"onUploadFileListUpdate\">
      <n-button type=\"primary\">选择 PDF 文件</n-button>
    </n-upload>
  </div>
  <div style=\"height: 400px; border: 1px solid #e4e7ed; border-radius: 4px; margin-top: 12px;\">
    <PDFPreview :fileUrl=\"uploadUrl\" :showToolbar=\"true\" :watermark=\"watermarkConfig\" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PDFPreview from '@develop-plugins/pdf-preview'

const uploadUrl = ref('')
const watermarkConfig = ref({
  enable: true,
  text: '机密文档',
  fontSize: 16,
  color: 'rgba(255, 0, 0, 0.3)',
  rotate: -30,
})

const onUploadFileListUpdate = async (fileList) => {
  const file = fileList?.[0]?.file
  if (!file) {
    uploadUrl.value = ''
    return
  }
  uploadUrl.value = file // 直接传入 Blob(File)
}
<\/script>`

// fileUrl 类型示例代码
const stringCode = `<template>
  <div style=\"height: 400px; border: 1px solid #e4e7ed; border-radius: 4px;\">
    <PDFPreview :fileUrl=\"url\" :showToolbar=\"true\" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PDFPreview from '@develop-plugins/pdf-preview'

// 在线地址或本地地址
const url = ref('https://example.com/demo.pdf')
// 或使用 base64：const url = ref('data:application/pdf;base64,...')
<\/script>`

const binaryCode = `<template>
  <PDFPreview :fileUrl=\"data\" :showToolbar=\"true\" />
</template>

<script setup>
import { ref } from 'vue'
import PDFPreview from '@develop-plugins/pdf-preview'

const data = ref(null)

fetch('/api/file.pdf')
  .then((res) => res.arrayBuffer())
  .then((buf) => {
    // 方式一：直接传 ArrayBuffer
    data.value = buf
    // 方式二：转为 Uint8Array
    // data.value = new Uint8Array(buf)
  })
  .catch(console.error)
<\/script>`

const objectCode = `<template>
  <PDFPreview :fileUrl="fileUrl" :showToolbar="true" />
</template>

<script setup>
import { ref } from 'vue'
import PDFPreview from '@develop-plugins/pdf-preview'

const fileUrl = ref({
  url: '/api/file.pdf',             // 请求地址
  data: '',                         // 渲染数据（若同时有 url 与 data，以 data 为准）
  httpHeaders: { Authorization: 'Bearer token' },
  withCredentials: false            // 是否携带认证信息
})
<\/script>`
</script>

### 文件上传预览

通过本地选择 PDF 文件并直接传入 `Blob(File)` 进行预览。

<div style="margin: 4px 0 8px; font-size: 12px; color: #666;">类型：<n-tag type="info">Blob(File)</n-tag></div>
<CodeCard :code="uploadCode">
  <template #demo>
    <div style="height: 600px; border: 1px solid #e4e7ed; border-radius: 4px; padding: 12px; display: flex; flex-direction: column; gap: 12px;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <n-upload :default-upload="false" accept="application/pdf" :max="1" @update:file-list="onUploadFileListUpdate">
          <n-button type="primary">选择 PDF 文件</n-button>
        </n-upload>
      </div>
      <div style="flex: 1; min-height: 0;">
        <PDFPreview :fileUrl="uploadUrl" :showToolbar="true" :watermark="watermarkConfig" />
      </div>
    </div>
  </template>
</CodeCard>

### fileUrl 类型示例

不同来源的 PDF 数据均可通过 `fileUrl` 传入，下面列举常用场景：

<div style="margin: 4px 0; font-size: 12px; color: #666;">类型：<n-tag type="info">String</n-tag></div>
<CodeCard title="string：URL 或 base64" defaultExpanded :code="stringCode" />

<div style="margin: 4px 0; font-size: 12px; color: #666;">类型：<n-tag type="info">ArrayBuffer/Uint8Array</n-tag></div>
<CodeCard title="二进制：ArrayBuffer 或 Uint8Array" defaultExpanded :code="binaryCode" />

<div style="margin: 4px 0; font-size: 12px; color: #666;">类型：<n-tag type="info">Object</n-tag></div>
<CodeCard title="对象：自定义请求与数据优先级" defaultExpanded :code="objectCode" />

### API

#### 属性

<BaseTable :columns="propsColumns" :data="propsData" />

#### 水印配置

<BaseTable :columns="watermarkColumns" :data="watermarkData" />

#### 事件

<BaseTable :columns="eventsColumns" :data="eventsData" />
