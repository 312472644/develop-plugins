---
title: 水印 WaterMark
---

# 水印 WaterMark

为页面或内容区域添加水印效果，支持文字与图片水印，提供字体、旋转、间距、层级等配置。

## 安装

```bash
npm install @develop-plugins/water-mark
```

### 引用

```javascript
import WaterMark from '@develop-plugins/water-mark'
```

### 基础用法

<script setup>
import WaterMark from '@develop-plugins/water-mark'

const basicCode = `<template>
  <WaterMark text="hello world">
    <div style="width: 100%; height: 240px; border: 1px dashed #ddd; border-radius: 6px;"></div>
  </WaterMark>
</template>

<script setup>
import WaterMark from '@develop-plugins/water-mark'
<\/script>`

const imageCode = `<template>
  <WaterMark image="/orange.png" rotate="-20" gap="120">
    <div style="width: 100%; height: 240px; border: 1px dashed #ddd; border-radius: 6px;"></div>
  </WaterMark>
</template>

<script setup>
import WaterMark from '@develop-plugins/water-mark'
<\/script>`

const multilineCode = `<template>
  <WaterMark :text="['Confidential', 'Do Not Copy']" :font="{ fontSize: 18, color: 'rgba(0,0,0,0.25)' }">
    <div style="width: 100%; height: 240px; border: 1px dashed #ddd; border-radius: 6px;"></div>
  </WaterMark>
</template>

<script setup>
import WaterMark from '@develop-plugins/water-mark'
<\/script>`

// Props 表
const propsColumns = [
  { title: '属性', key: 'prop' },
  { title: '说明', key: 'desc' },
  { title: '类型', key: 'type' },
  { title: '默认值', key: 'default' },
]
const propsData = [
  { prop: 'width', desc: '水印的宽度，默认随内容区宽度', type: 'Number', default: '-' },
  { prop: 'height', desc: '水印的高度，默认随内容区高度', type: 'Number', default: '-' },
  { prop: 'text', desc: '水印文字内容，设置了 image 时不显示 text', type: 'String | String[]', default: '"watermark"' },
  { prop: 'rotate', desc: '水印旋转角度（°）', type: 'Number', default: '-20' },
  { prop: 'gap', desc: '水印之间的间距（px）', type: 'Number', default: '100' },
  { prop: 'zIndex', desc: '水印层级（z-index）', type: 'Number', default: '9999' },
  { prop: 'font', desc: '文字样式配置', type: 'Object(Font)', default: '{}' },
  { prop: 'image', desc: '图片源（建议 2x/3x）', type: 'String', default: "''" },
]

// Font 表
const fontColumns = [
  { title: '属性', key: 'prop' },
  { title: '说明', key: 'desc' },
  { title: '类型', key: 'type' },
  { title: '默认值', key: 'default' },
]
const fontData = [
  { prop: 'fontSize', desc: '字体大小', type: 'Number', default: '16' },
  { prop: 'fontFamily', desc: '字体类型', type: 'String', default: '"serif"' },
  { prop: 'color', desc: '字体颜色', type: 'String', default: '"rgba(0, 0, 0, 0.3)"' },
  { prop: 'textAlign', desc: '对齐方式', type: 'String (left|center|right|start|end)', default: '"center"' },
]

// Slots 表
const slotsColumns = [
  { title: '插槽名', key: 'name' },
  { title: '说明', key: 'desc' },
]
const slotsData = [
  { name: 'default', desc: '内容区域（覆盖水印的区域）' },
]
</script>

<CodeCard :code="basicCode">
  <template #demo>
    <div>
      <WaterMark text="hello world">
        <div style="width: 100%; height: 240px; border: 1px dashed #ddd; border-radius: 6px;"></div>
      </WaterMark>
    </div>
  </template>
</CodeCard>

### 图片水印

<CodeCard :code="imageCode">
  <template #demo>
    <div>
      <WaterMark image="/orange.png" rotate="-20" gap="120">
        <div style="width: 100%; height: 240px; border: 1px dashed #ddd; border-radius: 6px;"></div>
      </WaterMark>
    </div>
  </template>
</CodeCard>

### 多行文字水印

<CodeCard :code="multilineCode">
  <template #demo>
    <div>
      <WaterMark :text="['Confidential', 'Do Not Copy']" :font="{ fontSize: 18, color: 'rgba(0,0,0,0.25)' }">
        <div style="width: 100%; height: 240px; border: 1px dashed #ddd; border-radius: 6px;"></div>
      </WaterMark>
    </div>
  </template>
</CodeCard>

### API

#### 属性
<BaseTable :columns="propsColumns" :data="propsData" />

#### 字体配置（Font）
<BaseTable :columns="fontColumns" :data="fontData" />

#### 插槽
<BaseTable :columns="slotsColumns" :data="slotsData" />