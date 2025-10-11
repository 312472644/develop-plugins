---
title: Excel预览 ExcelPreview
---

# Excel 预览 ExcelPreview

在线预览 Excel 文件的组件，支持多工作表切换、数据导出等功能。

### 安装

```bash
npm install @develop-plugins/excel-preview
```

### 引用

```javascript
import ExcelPreview from "@develop-plugins/excel-preview";
import "@develop-plugins/excel-preview/style.css";
```

### 基础用法

<script setup>
import { ref } from 'vue'
import ExcelPreview from "@develop-plugins/excel-preview";
import '@develop-plugins/excel-preview/style.css'

const excelData = ref();

const excelCode = `<template>
  <ExcelPreview 
    :data="excelData"
    :showToolbar="true"
    :showSheetTabs="true"
  />
</template>

<script setup>
import ExcelPreview from '@develop-plugins/excel-preview'
import '@develop-plugins/excel-preview/style.css'
<\/script>`

const uploadCode = `<template>
  <div class="upload-area">
    <n-upload :default-upload="false" accept=".xlsx,.xls" :max="1" @update:file-list="onFileListUpdate">
      <n-button type="primary">选择 Excel 文件</n-button>
    </n-upload>
    <span class="upload-name">{{ uploadFileName || '未选择文件' }}</span>
    <div style="height: 500px; border: 1px solid #e4e7ed; border-radius: 4px; margin-top: 12px;">
      <ExcelPreview :data="excelData" :showToolbar="true" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ExcelPreview from '@develop-plugins/excel-preview'
import '@develop-plugins/excel-preview/style.css'

const excelData = ref(null)
const uploadFileName = ref('')
const onFileListUpdate = async (fileList) => {
  const file = fileList?.[0]?.file
  if (!file) return
  const buf = await file.arrayBuffer()
  uploadFileName.value = file.name
  excelData.value = buf
}
<\/script>`

// BaseTable 列与数据
const propsColumns = [
  { title: '属性', key: 'prop' },
  { title: '说明', key: 'desc' },
  { title: '类型', key: 'type' },
  { title: '默认值', key: 'default' },
]
const propsData = [
  { prop: 'data', desc: '数据源，支持ArrayBuffer、Uint8Array、Array、Blob', type: 'Uint8Array/ArrayBuffer/Array/Blob', default: '{}' },
  { prop: 'dropdownMenu', desc: '表头下拉菜单', type: 'Boolean/Array/Object', default: 'true' },
  { prop: 'contextMenu', desc: '表格右键菜单', type: 'Boolean/Array/Object', default: 'true' },
  { prop: 'readOnly', desc: '是否只读', type: 'Boolean', default: 'false' },
  { prop: 'rowHeaders', desc: '是否显示行标题', type: 'Boolean', default: 'true' },
  { prop: 'colHeaders', desc: '是否显示列标题', type: 'Boolean', default: 'true' },
  { prop: 'manualRowResize', desc: '是否手动调整行高', type: 'Boolean', default: 'true' },
  { prop: 'manualColumnResize', desc: '是否手动调整列宽', type: 'Boolean', default: 'true' },
  { prop: 'width', desc: '表格宽度', type: 'String/Number', default: "'100%'" },
  { prop: 'height', desc: '表格高度', type: 'String/Number', default: "'400px'" },
  { prop: 'colWidths', desc: '表格列宽度', type: 'Number/Array/Function', default: '100' },
  { prop: 'minSpareRows', desc: '导入excel时保留的最小行数', type: 'Number', default: '0' },
  { prop: 'minSpareCols', desc: '导入excel时保留的最小列数', type: 'Number', default: '0' },
  { prop: 'downloadFileName', desc: '导出excel文件名', type: 'String', default: "'export.xlsx'" },
  { prop: 'showToolbar', desc: '是否显示工具栏', type: 'Boolean', default: 'true' },
]

const eventsColumns = [
  { title: '事件名', key: 'name' },
  { title: '说明', key: 'desc' },
  { title: '回调参数', key: 'args' },
]
const eventsData = [
  { name: 'export', desc: '导出事件', args: '(data)' },
  { name: 'save', desc: '保存事件', args: '(data)' },
]
// 上传处理（文档内示例使用）
const uploadFileName = ref('')
const onFileListUpdate = async (fileList) => {
  const file = fileList?.[0]?.file
  if (!file) return
  const buf = await file.arrayBuffer()
  uploadFileName.value = file.name
  excelData.value = buf
}

// 数据回显（模拟接口）示例代码与逻辑
const echoCode = `<template>
  <div>
    <n-button type="primary" :loading="loadingEcho" @click="onFetchEcho">加载远程数据</n-button>
    <div style="height: 500px; border: 1px solid #e4e7ed; border-radius: 4px; margin-top: 12px;">
      <ExcelPreview :data="echoData" :showToolbar="true" @save="onEchoSave" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ExcelPreview from '@develop-plugins/excel-preview'
import '@develop-plugins/excel-preview/style.css'

const echoData = ref(null)
const loadingEcho = ref(false)

const fetchEchoData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return [
    {
      sheetName: '用户列表',
      data: [
        ['ID', '姓名', '城市', '积分'],
        ['1', '张三', '北京', '120'],
        ['2', '李四', '上海', '98'],
        ['3', '王五', '深圳', '78']
      ],
      styles: [],
      mergeList: []
    },
    {
      sheetName: '统计',
      data: [
        ['日期', '新增', '活跃'],
        ['2025-10-01', '24', '80'],
        ['2025-10-02', '18', '76']
      ],
      styles: [],
      mergeList: []
    }
  ]
}

const onFetchEcho = async () => {
  loadingEcho.value = true
  echoData.value = await fetchEchoData()
  loadingEcho.value = false
}
const onEchoSave = (data) => {
  console.log('数据回显保存', data)
}
<\/script>`

const echoData = ref(null)
const loadingEcho = ref(false)
const fetchEchoData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return [
    {
      sheetName: '用户列表',
      data: [
        ['ID', '姓名', '城市', '积分'],
        ['1', '张三', '北京', '120'],
        ['2', '李四', '上海', '98'],
        ['3', '王五', '深圳', '78']
      ],
      styles: [],
      mergeList: []
    },
    {
      sheetName: '统计',
      data: [
        ['日期', '新增', '活跃'],
        ['2025-10-01', '24', '80'],
        ['2025-10-02', '18', '76']
      ],
      styles: [],
      mergeList: []
    }
  ]
}
const onFetchEcho = async () => {
  loadingEcho.value = true
  echoData.value = await fetchEchoData()
  loadingEcho.value = false
}
const onEchoSave = (data) => {
  console.log('数据回显保存', data)
}
</script>

<CodeCard :code="excelCode">
  <template #demo>
    <div>
      <ExcelPreview
        :data="excelData"
        :showToolbar="true"
        downloadFileName="示例表格.xlsx"
      />
    </div>
  </template>
</CodeCard>

### 上传预览

<CodeCard :code="uploadCode">
  <template #demo>
    <div class="upload-area">
      <n-upload :default-upload="false" accept=".xlsx,.xls" :max="1" @update:file-list="onFileListUpdate">
        <n-button type="primary" ghost>选择 Excel 文件</n-button>
      </n-upload>
      <div>
        <ExcelPreview
          :data="excelData"
          :showToolbar="true"
          downloadFileName="示例表格.xlsx"
        />
      </div>
    </div>
  </template>
</CodeCard>

### 数据回显

<CodeCard :code="echoCode">
  <template #demo>
    <div>
      <n-button type="primary" ghost :loading="loadingEcho" @click="onFetchEcho">加载远程数据</n-button>
      <div style="height: 500px; border: 1px solid #e4e7ed; border-radius: 4px; margin-top: 12px;">
        <ExcelPreview
          :data="echoData"
          :showToolbar="true"
          @save="onEchoSave"
          downloadFileName="接口回显.xlsx"
        />
      </div>
    </div>
  </template>
</CodeCard>

### API

#### 属性

<BaseTable :columns="propsColumns" :data="propsData" />

#### 事件

<BaseTable :columns="eventsColumns" :data="eventsData" />

<style>
/* 取消 VitePress 文档样式对 ExcelPreview 内部表格的影响 */
.vp-doc .excel-preview table {
  display: table;          /* 恢复为标准表格布局，避免被设为 block */
  overflow: visible;       /* 取消文档为表格设置的滚动容器 */
  width: 100%;             /* 不强制整行宽度，交由组件自身控制 */
  max-width: none;         /* 取消最大宽度限制，避免被压缩 */
  margin: 0;               /* 清除文档默认的上下间距 */
  background: transparent; /* 取消背景色，交由组件主题控制 */
  border: none;            /* 移除文档为表格设置的边框 */
}
.vp-doc .excel-preview table thead,
.vp-doc .excel-preview table tbody,
.vp-doc .excel-preview table tr,
.vp-doc .excel-preview table th,
.vp-doc .excel-preview table td {
  background: transparent; /* 取消斑马纹与头部背景 */
}
.vp-doc .excel-preview table th,
.vp-doc .excel-preview table td {
  padding: 0;              /* 清除文档默认单元格内边距 */
  border: none;            /* 清除文档为表格设置的边框 */
  vertical-align: middle;  /* 恢复为常规对齐，避免被文档样式改动 */
  text-align: inherit;     /* 文本对齐交由组件或父级控制 */
  white-space: normal;     /* 取消可能的 nowrap 等影响 */
  box-shadow: none;        /* 去除文档可能添加的阴影 */
}
.vp-doc .excel-preview table tbody tr:nth-child(2n) {
  background: transparent; /* 移除偶数行背景 */
}

/* 进一步收紧影响范围到 Handsontable 内部表格 */
.vp-doc .excel-preview .handsontable table {
  display: table;
  width: 100%;
   margin: 0;
  background: transparent;
  border: none;
}
.vp-doc .excel-preview .handsontable .htCore {
  width: 100%;
  border-collapse: collapse;            /* 保持紧凑网格 */
  border-left: 1px solid #e6e8eb;      /* 左边框与参考图一致 */
  border-top: 1px solid #e6e8eb;       /* 顶部边框与参考图一致 */
}
.vp-doc .excel-preview .handsontable .htCore th,
.vp-doc .excel-preview .handsontable .htCore td {
  padding: 0;                          /* 单元格无额外内边距 */
  border-right: 1px solid #e6e8eb;     /* 右侧网格线 */
  border-bottom: 1px solid #e6e8eb;    /* 底部网格线 */
  background: #fff;                    /* 网格背景为白色 */
  vertical-align: middle;              /* 内容垂直居中 */
}
.vp-doc .excel-preview .handsontable .htCore th {
  background: #f5f6f8;                 /* 表头浅灰背景 */
  color: #333;                         /* 文本颜色适中 */
  font-weight: 500;                    /* 表头半粗 */
}
.vp-doc .excel-preview .htFocusCatcher {
 display: none;
}
</style>
