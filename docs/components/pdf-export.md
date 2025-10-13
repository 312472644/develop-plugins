---
title: PDF 导出 PdfExport
---

# PDF 导出 PdfExport

基于 `jsPDF` 与 `jspdf-autotable` 的导出工具，封装了文本、表格、图片的常用导出能力，并内置中文字体，支持页边距与页码。

<script setup>
const optionsColumns = [
  { title: '参数', key: 'name' },
  { title: '说明', key: 'desc' },
  { title: '类型', key: 'type' },
  { title: '默认值', key: 'default' },
]
const optionsData = [
  { name: 'padding', desc: '页面边距', type: 'Number', default: '10' },
  { name: 'showPageNumbers', desc: '是否显示页码', type: 'Boolean', default: 'false' },
  { name: 'orientation', desc: '页面方向（jsPDF 原生）', type: 'String', default: "'p'" },
  { name: 'unit', desc: '单位（jsPDF 原生）', type: 'String', default: "'mm'" },
  { name: 'format', desc: '纸张规格（jsPDF 原生）', type: 'String', default: "'a4'" },
  { name: 'putOnlyUsedFonts', desc: '仅打包使用到的字体（jsPDF 原生）', type: 'Boolean', default: 'true' },
]

const methodsColumns = [
  { title: '方法', key: 'name' },
  { title: '说明', key: 'desc' },
  { title: '参数', key: 'args' },
]
const methodsData = [
  { name: 'generateTextList(list)', desc: '按行生成文本，自动换行', args: "Array<{ text: string, position?: 'left'|'center'|'right' }>" },
  { name: 'generateTable(config)', desc: '生成表格（基于 jspdf-autotable）', args: '{ body, columns, columnStyles?, ... }' },
  { name: 'generateImage(url, compression?)', desc: '生成图片，自动按内容区等比缩放', args: "url: string, compression?: 'NONE'|'FAST'|'MEDIUM'|'SLOW'" },
  { name: 'save(fileName?)', desc: '保存 PDF 文件', args: 'fileName?: string' },
  { name: 'jspdf(getter)', desc: '获取 jsPDF 实例', args: '-' },
]

import { withBase } from 'vitepress'
import { ref } from 'vue'

const textCode = `<script setup>
import PdfExport from '@develop-plugins/pdf-export'

function exportText() {
  const pdf = new PdfExport({ padding: 20, showPageNumbers: true })
  pdf.generateTextList([
    { position: 'center', text: '居中文本' },
    { position: 'left', text: '默认居左文本' },
    { position: 'right', text: '居右文本' },
    { text: '超长文本会按内容区宽度自动换行' },
  ])
  pdf.save('文本示例')
}
<\/script>`

function exportText() {
  // 动态按需加载，避免 SSR 报错
  import('@develop-plugins/pdf-export').then(({ default: PdfExport }) => {
    const pdf = new PdfExport({ padding: 20, showPageNumbers: true })
    pdf.generateTextList([
      { position: 'center', text: '居中文本' },
      { position: 'left', text: '默认居左文本' },
      { position: 'right', text: '居右文本' },
      { text: '超长文本会按内容区宽度自动换行' },
    ])
    pdf.save('文本示例')
  })
}

const tableCode = `<script setup>
import PdfExport from '@develop-plugins/pdf-export'

const columns = [
  { header: '姓名', dataKey: 'name' },
  { header: '备注', dataKey: 'remark' },
]
const body = [
  { name: '小李', remark: '表格行配置示例' },
  { name: '小张', remark: '表格行配置示例' },
]

function exportTable() {
  const pdf = new PdfExport({ padding: 20, showPageNumbers: true })
  pdf.generateTable({ body, columns, columnStyles: { remark: { cellWidth: 100 } } })
  pdf.save('表格示例')
}
<\/script>`

const columns = [
  { header: '姓名', dataKey: 'name' },
  { header: '备注', dataKey: 'remark' },
]
const body = [
  { name: '小李', remark: '表格行配置示例' },
  { name: '小张', remark: '表格行配置示例' },
]
function exportTable() {
  import('@develop-plugins/pdf-export').then(({ default: PdfExport }) => {
    const pdf = new PdfExport({ padding: 20, showPageNumbers: true })
    pdf.generateTable({ body, columns, columnStyles: { remark: { cellWidth: 100 } } })
    pdf.save('表格示例')
  })
}

const imageCode = `<script setup>
import PdfExport from '@develop-plugins/pdf-export'

async function toDataUrl(url) {
  const res = await fetch(url)
  const blob = await res.blob()
  return new Promise((resolve) => {
    const fr = new FileReader()
    fr.onloadend = () => resolve(fr.result)
    fr.readAsDataURL(blob)
  })
}

async function exportImage() {
  const pdf = new PdfExport({ padding: 20, showPageNumbers: true })
  const dataUrl = await toDataUrl('/orange.png')
  pdf.generateImage(dataUrl, 'MEDIUM')
  pdf.save('图片示例')
}
<\/script>`

async function toDataUrl(url) {
  const res = await fetch(url)
  const blob = await res.blob()
  return new Promise((resolve) => {
    const fr = new FileReader()
    fr.onloadend = () => resolve(fr.result)
    fr.readAsDataURL(blob)
  })
}

async function exportImage() {
  const { default: PdfExport } = await import('@develop-plugins/pdf-export')
  const pdf = new PdfExport({ padding: 20, showPageNumbers: true })
  const dataUrl = await toDataUrl(withBase('/orange.png'))
  pdf.generateImage(dataUrl, 'MEDIUM')
  pdf.save('图片示例')
}

const complexCode = `<script setup>
import PdfExport from '@develop-plugins/pdf-export'

function toDataUrl(url) {
  return fetch(url)
    .then((res) => res.blob())
    .then(
      (blob) =>
        new Promise((resolve) => {
          const fr = new FileReader()
          fr.onloadend = () => resolve(fr.result)
          fr.readAsDataURL(blob)
        })
    )
}

function exportComplex() {
  const pdf = new PdfExport({ padding: 20, showPageNumbers: true })

  // 长文本：30 段，触发自动分页
  const textList = Array.from({ length: 30 }, (_, i) => ({
    text: \`第 \${i + 1} 段：这是较长的示例文本，用于演示自动分页与换行效果。内容会根据内容区宽度自动换行，超过页面高度时自动新建页面。\`
  }))
  pdf.generateTextList([
    { position: 'center', text: '综合示例：文本 + 表格 + 图片' },
    ...textList,
  ])

  // 长表格：80 行，结合列宽控制
  const columns = [
    { header: '序号', dataKey: 'idx' },
    { header: '姓名', dataKey: 'name' },
    { header: '备注', dataKey: 'remark' },
  ]
  const body = Array.from({ length: 80 }, (_, i) => ({
    idx: i + 1,
    name: \`用户\${i + 1}\`,
    remark:
      '这是一条较长的备注信息，用于测试列宽与自动分页。备注内容会在多页中持续展示，确保表格分页表现正常。',
  }))
  pdf.generateTable({
    body,
    columns,
    columnStyles: { remark: { cellWidth: 120 } },
  })

  // 多图片：本地与网络图片结合，进一步触发分页
  Promise.all([
    toDataUrl('/orange.png'),
    toDataUrl('https://images.pexels.com/photos/2049422/pexels-photo-2049422.jpeg?auto=compress&cs=tinysrgb&w=1200'),
  ]).then(([localImg, remoteImg]) => {
    pdf.generateImage(localImg, 'MEDIUM')
    pdf.generateImage(remoteImg, 'SLOW')
    pdf.save('综合示例（分页演示）')
  })
}
<\/script>`

async function exportComplex() {
  const { default: PdfExport } = await import('@develop-plugins/pdf-export')
  const pdf = new PdfExport({ padding: 20, showPageNumbers: true })

  const textList = Array.from({ length: 30 }, (_, i) => ({
    text: `第 ${i + 1} 段：这是较长的示例文本，用于演示自动分页与换行效果。内容会根据内容区宽度自动换行，超过页面高度时自动新建页面。`
  }))
  pdf.generateTextList([
    { position: 'center', text: '综合示例：文本 + 表格 + 图片' },
    ...textList,
  ])

  const columnsComplex = [
    { header: '序号', dataKey: 'idx' },
    { header: '姓名', dataKey: 'name' },
    { header: '备注', dataKey: 'remark' },
  ]
  const bodyComplex = Array.from({ length: 80 }, (_, i) => ({
    idx: i + 1,
    name: `用户${i + 1}`,
    remark:
      '这是一条较长的备注信息，用于测试列宽与自动分页。备注内容会在多页中持续展示，确保表格分页表现正常。',
  }))
  pdf.generateTable({
    body: bodyComplex,
    columns: columnsComplex,
    columnStyles: { remark: { cellWidth: 120 } },
  })

  const localImg = await toDataUrl(withBase('/orange.png'))
  pdf.generateImage(localImg, 'MEDIUM')
  pdf.generateImage('https://images.pexels.com/photos/2049422/pexels-photo-2049422.jpeg?auto=compress&cs=tinysrgb&w=1200', 'SLOW')

  pdf.save('综合示例（分页演示）')
}
</script>

## 安装

```bash
# npm
npm i @develop-plugins/pdf-export

# yarn
yarn add @develop-plugins/pdf-export

# pnpm
pnpm add @develop-plugins/pdf-export
```

### 示例


#### 文本导出

<CodeCard :code="textCode">
  <template #demo>
    <n-button type="primary" @click="exportText">导出文本 PDF</n-button>
  </template>
  <template #tips>支持居左、居中、居右与自动换行</template>
  <template #desc>点击按钮将生成示例文本 PDF</template>
  <template #link></template>
</CodeCard>

#### 表格导出

<CodeCard :code="tableCode">
  <template #demo>
    <n-button type="primary" @click="exportTable">导出表格 PDF</n-button>
  </template>
  <template #tips>可通过 columnStyles 控制列宽等样式</template>
  <template #desc>点击按钮将生成示例表格 PDF</template>
</CodeCard>

#### 图片导出

<CodeCard :code="imageCode">
  <template #demo>
    <n-button type="primary" @click="exportImage">导出图片 PDF</n-button>
  </template>
  <template #tips>将图片转为 dataURL 后导出，支持压缩等级</template>
  <template #desc>点击按钮将生成示例图片 PDF</template>
</CodeCard>

#### 综合导出（分页演示）

<CodeCard :code="complexCode">
  <template #demo>
    <n-button type="primary" @click="exportComplex">导出综合示例 PDF</n-button>
  </template>
  <template #tips>包含长文本、长表格与多图片，自动分页与页码演示</template>
  <template #desc>点击按钮生成综合示例 PDF，内容较长以体现分页</template>
</CodeCard>

### API

#### 构造参数（new PdfExport(options)）

<BaseTable :columns="optionsColumns" :data="optionsData" />

更多 `jsPDF` 构造参数参考：`https://artskydj.github.io/jsPDF/docs/jsPDF.html`

#### 方法

<BaseTable :columns="methodsColumns" :data="methodsData" />

### 说明与限制

- 多行文本不支持设置 `position`（位置），单行文本支持 `left | center | right`。
- 当内容超过一页时自动分页，并按需生成页码。
- 表格样式可通过 `columnStyles` 等进行精细化控制。