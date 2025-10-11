---
title: 滚动 XScroll
---

# 滚动 XScroll

自定义滚动条组件，支持垂直和水平滚动，可自定义滚动条样式。

### 安装

```bash
npm install @develop-plugins/x-scroll
```

### 基础用法

<script setup>
import { ref } from 'vue'
import XScroll from '@develop-plugins/x-scroll'

const scrollCode = `<template>
  <XScroll style="height: 200px; border: 1px solid #eee;">
    <div style="height: 500px; padding: 20px;">
      <h3>可滚动内容</h3>
      <p v-for="i in 20" :key="i">
        这是第 {{ i }} 行内容，内容很长很长很长很长很长很长很长很长很长很长
      </p>
    </div>
  </XScroll>
</template>

<script setup>
import XScroll from '@develop-plugins/x-scroll'
<\/script>`
// BaseTable 列与数据：属性
const propsColumns = [
  { title: '属性名', key: 'prop' },
  { title: '说明', key: 'desc' },
  { title: '类型', key: 'type' },
  { title: '默认值', key: 'default' },
]
const propsData = [
  { prop: 'horizontal', desc: '是否启用水平滚动模式', type: 'Boolean', default: 'false' },
  { prop: 'maxHeight', desc: '最大高度限制', type: 'Number', default: '0' },
  { prop: 'thumbWidth', desc: '滚动条宽度', type: 'String', default: "'6px'" },
  { prop: 'thumbColor', desc: '滚动条颜色', type: 'String', default: "'#909399'" },
  { prop: 'thumbHoverColor', desc: '滚动条悬停颜色', type: 'String', default: "'#606266'" },
]

// BaseTable 列与数据：事件
const eventsColumns = [
  { title: '事件名', key: 'name' },
  { title: '说明', key: 'desc' },
  { title: '回调参数', key: 'args' },
]
const eventsData = [
  { name: 'scroll', desc: '滚动事件，滚动时触发；参数指示是否到底部', args: '(isBottom: { horizontal: boolean, vertical: boolean })' },
]

// BaseTable 列与数据：插槽
const slotsColumns = [
  { title: '插槽名', key: 'name' },
  { title: '说明', key: 'desc' },
]
const slotsData = [
  { name: 'default', desc: '滚动内容' },
]

// 水平滚动示例代码字符串
const horizontalCode = `<template>
  <XScroll 
    :horizontal="true" 
    style="height: 100px; border: 1px solid #eee;"
  >
    <div style="width: 1000px; height: 80px; padding: 20px; white-space: nowrap;">
      <span v-for="i in 10" :key="i" style="display: inline-block; width: 100px; margin-right: 10px; background: #f0f0f0; text-align: center; line-height: 40px;">
        项目 {{ i }}
      </span>
    </div>
  </XScroll>
</template>

<script setup>
import XScroll from '@develop-plugins/x-scroll'
<\/script>`

// 双向滚动示例代码字符串
const bothCode = `<template>
  <XScroll
    style="height: 200px; border: 1px solid #eee;"
  >
    <div style="width: 800px; height: 400px; padding: 20px;">
      <h3>双向滚动内容</h3>
      <div v-for="i in 15" :key="i" style="margin: 10px 0; white-space: nowrap;">
        第 {{ i }} 行：这是一行很长很长很长很长很长很长很长很长很长很长的内容
      </div>
    </div>
  </XScroll>
</template>

<script setup>
import XScroll from '@develop-plugins/x-scroll'
<\/script>`

// 事件示例代码字符串
const eventCode = `<template>
  <XScroll style=\"height: 200px; border: 1px solid #eee;\" @scroll=\"onScroll\">
    <div style=\"height: 500px; padding: 20px;\">
      <h3>事件演示</h3>
      <p v-for=\"i in 20\" :key=\"i\" style=\"margin: 10px 0;\">
        这是第 {{ i }} 行内容，滚动触发 @scroll 事件
      </p>
    </div>
  </XScroll>
  <div style=\"margin-top: 8px;\">
    <span>水平是否到底：</span>
    <n-tag :type=\"isBottom.horizontal ? 'success' : 'default'\" size=\"small\">
      {{ isBottom.horizontal ? '是' : '否' }}
    </n-tag>
    <span style=\"margin-left: 16px;\">垂直是否到底：</span>
    <n-tag :type=\"isBottom.vertical ? 'success' : 'default'\" size=\"small\">
      {{ isBottom.vertical ? '是' : '否' }}
    </n-tag>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import XScroll from '@develop-plugins/x-scroll'

const isBottom = ref({ horizontal: false, vertical: false })
const onScroll = (payload) => {
  isBottom.value = payload
}
<\/script>`

// 文档内事件演示逻辑
const demoBottom = ref({ horizontal: false, vertical: false })
const onDemoScroll = (payload) => {
  demoBottom.value = payload
}

// 自定义滚动条颜色示例代码字符串
const customThumbCode = `<template>
  <XScroll 
    style=\"height: 200px; border: 1px solid #eee;\"
    thumbColor=\"#409eff\" 
    thumbHoverColor=\"#ff4d4f\"
  >
    <div style=\"height: 500px; padding: 20px;\">
      <h3>自定义滚动条颜色</h3>
      <p v-for=\"i in 20\" :key=\"i\" style=\"margin: 10px 0;\">
        这是第 {{ i }} 行内容，滚动条颜色为蓝色，悬停为红色
      </p>
    </div>
  </XScroll>
</template>

<script setup>
import XScroll from '@develop-plugins/x-scroll'
<\/script>`
</script>

<CodeCard :code="scrollCode">
  <template #demo>
    <XScroll style="height: 200px; border: 1px solid #eee;">
      <div style="height: 500px; padding: 20px;">
        <h3>可滚动内容</h3>
        <p v-for="i in 20" :key="i" style="margin: 10px 0;">
          这是第 {{ i }} 行内容，内容很长很长很长很长很长很长很长很长很长很长
        </p>
      </div>
    </XScroll>
  </template>
</CodeCard>

### 水平滚动

<CodeCard :code="horizontalCode">
  <template #demo>
    <XScroll 
      :horizontal="true" 
      style="border: 1px solid #eee;"
    >
      <div style="height: 80px; padding: 20px; white-space: nowrap;">
        <span v-for="i in 20" :key="i" style="display: inline-block; width: 100px; margin-right: 10px; background: #f0f0f0; text-align: center; line-height: 40px; border-radius: 4px;">
          项目 {{ i }}
        </span>
      </div>
    </XScroll>
  </template>
</CodeCard>

### 双向滚动

<CodeCard :code="bothCode">
  <template #demo>
    <XScroll 
      :horizontal="true" 
      style="height: 200px; border: 1px solid #eee;"
    >
      <div style="height: 400px; padding: 20px;">
        <h3>双向滚动内容</h3>
        <div v-for="i in 15" :key="i" style="margin: 10px 0; white-space: nowrap;">
          第 {{ i }} 行：这是一行很长很长很长很长很长很长很长很长很长很长的内容这是一行很长很长很长很长很长很长很长很长很长很长的内容这是一行很长很长很长很长很长很长很长很长很长很长的内容这是一行很长很长很长很长很长很长很长很长很长很长的内容这是一行很长很长很长很长很长很长很长很长很长很长的内容
        </div>
      </div>
    </XScroll>
  </template>
</CodeCard>

### 事件示例

<CodeCard :code="eventCode">
  <template #demo>
    <XScroll style="height: 200px; border: 1px solid #eee;" @scroll="onDemoScroll">
      <div style="height: 500px; padding: 20px;">
        <h3>事件演示</h3>
        <p v-for="i in 20" :key="i" style="margin: 10px 0;">
          这是第 {{ i }} 行内容，滚动触发 @scroll 事件
        </p>
      </div>
    </XScroll>
    <div style="margin-top: 8px;">
      <span>水平是否到底：</span>
      <n-tag :type="demoBottom.horizontal ? 'success' : 'default'" size="small">
        {{ demoBottom.horizontal ? '是' : '否' }}
      </n-tag>
      <span style="margin-left: 16px;">垂直是否到底：</span>
      <n-tag :type="demoBottom.vertical ? 'success' : 'default'" size="small">
        {{ demoBottom.vertical ? '是' : '否' }}
      </n-tag>
    </div>
  </template>
</CodeCard>

### 自定义滚动条颜色

<CodeCard :code="customThumbCode">
  <template #demo>
    <XScroll 
      style="height: 200px; border: 1px solid #eee;" 
      thumbColor="#409eff" 
      thumbHoverColor="#ff4d4f"
    >
      <div style="height: 500px; padding: 20px;">
        <h3>自定义滚动条颜色</h3>
        <p v-for="i in 20" :key="i" style="margin: 10px 0;">
          这是第 {{ i }} 行内容，滚动条颜色为蓝色，悬停为红色
        </p>
      </div>
    </XScroll>
    <div style="margin-top: 8px; color: #909399;">
      提示：将鼠标移动到滚动区域以查看滚动条与悬停颜色
    </div>
  </template>
</CodeCard>

### API

#### 属性

<BaseTable :columns="propsColumns" :data="propsData" />

#### 事件

<BaseTable :columns="eventsColumns" :data="eventsData" />

#### 插槽

<BaseTable :columns="slotsColumns" :data="slotsData" />
