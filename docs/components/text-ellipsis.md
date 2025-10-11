---
title: 文本省略 TextEllipsis
---

# 文本省略 TextEllipsis

文本省略组件，支持单行和多行文本省略，带有展开/收起功能。

### 安装

```bash
npm install @develop-plugins/text-ellipsis
```

### 基础用法

<script setup>
import { ref } from 'vue'
import TextEllipsis from '@develop-plugins/text-ellipsis'

const longText = '这是一段很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的文本内容。为了更好地展示省略效果，我们继续增加文本长度，这是一段用于演示的超长文本，内容仍在继续延伸，模拟真实场景中的段落描述，以确保在不同宽度和行数下均能触发省略与展开。'

const basicCode = `<template>
  <TextEllipsis 
    :content="longText" 
    :rows="2"
    style="width: 100%; border: 1px solid #eee; padding: 10px;"
  />
</template>

<script setup>
import TextEllipsis from '@develop-plugins/text-ellipsis'

const longText = '这是一段很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的文本内容。'
<\/script>`

// 单行、省略、展开等示例代码字符串（用于 CodeCard 展示）
const singleLineCode = `<template>
  <TextEllipsis 
    :content="longText" 
    :rows="1"
    style="width: 100%; border: 1px solid #eee; padding: 10px;"
  />
</template>

<script setup>
import TextEllipsis from '@develop-plugins/text-ellipsis'

const longText = '这是一段很长很长很长很长很长很长很长很长很长很长很长的文本内容。我们继续补充更多内容来确保长度足够长，以便在单行场景下能明显触发省略效果，模拟真实产品描述或新闻摘要的情况。'
<\/script>`

const customEllipsisCode = `<template>
  <TextEllipsis 
    :content="longText" 
    :rows="2"
    dots="✅✅✅"
    style="width: 100%; border: 1px solid #eee; padding: 10px;"
  />
</template>

<script setup>
import TextEllipsis from '@develop-plugins/text-ellipsis'

const longText = '这是一段很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的文本内容。'
<\/script>`
const actionSlotCode = `<template>
  <TextEllipsis :content="longText" :rows="2" style="width: 100%; border: 1px solid #eee; padding: 10px;">
    <template #action="{ expanded }">
      <span style="color: #1890ff; cursor: pointer;">
        {{ expanded ? '收起' : '展开' }}
      </span>
    </template>
  </TextEllipsis>
</template>

<script setup>
import TextEllipsis from '@develop-plugins/text-ellipsis'

const longText = '这是一段演示插槽的超长文本，通过自定义 action 插槽，我们可以替换默认的蓝色链接文字为自定义内容，同时点击该区域仍会触发展开/收起逻辑。为了更好地演示，这段文本会继续延长，确保在两行显示的限制下触发省略效果，并在用户点击后展开显示完整文本。'
<\/script>`
// BaseTable 列与数据
const propsColumns = [
  { title: '属性', key: 'prop' },
  { title: '说明', key: 'desc' },
  { title: '类型', key: 'type' },
  { title: '默认值', key: 'default' },
]
const propsData = [
  { prop: 'content', desc: '文本内容', type: 'String', default: "''" },
  { prop: 'rows', desc: '最大显示行数', type: 'Number', default: '3' },
  { prop: 'dots', desc: '省略符号', type: 'String', default: "'...'" },
  { prop: 'expandText', desc: '展开按钮文本', type: 'String', default: "'展开'" },
  { prop: 'collapseText', desc: '收起按钮文本', type: 'String', default: "'收起'" },
]

const slotsColumns = [
  { title: '插槽名', key: 'name' },
  { title: '说明', key: 'desc' },
  { title: '参数', key: 'scope' },
]
const slotsData = [
  { name: 'action', desc: '自定义展开/收起按钮', scope: '{ expanded: boolean }' },
]
</script>

<CodeCard :code="basicCode">
  <template #demo>
    <div style="width: 100%;">
      <TextEllipsis :content="longText" />
    </div>
  </template>
</CodeCard>

### 单行省略

<CodeCard :code="singleLineCode">
  <template #demo>
    <div style="width: 100%;">
      <TextEllipsis :content="longText" :rows="1" />
    </div>
  </template>
</CodeCard>


### 自定义省略符号

<CodeCard :code="customEllipsisCode">
  <template #demo>
    <div style="width: 100%;">
      <TextEllipsis 
        :content="longText" 
        :rows="2" 
        dots="✅✅✅"
      />
    </div>
  </template>
</CodeCard>

### 自定义操作插槽

<CodeCard :code="actionSlotCode">
  <template #demo>
    <div style="width: 100%;">
      <TextEllipsis :content="longText" :rows="2">
        <template #action="{ expanded }">
          <span style="color: #1890ff; cursor: pointer;">
            {{ expanded ? '收起' : '展开' }}
          </span>
        </template>
      </TextEllipsis>
    </div>
  </template>
</CodeCard>

### API

#### 属性
<BaseTable :columns="propsColumns" :data="propsData" />

#### 插槽
<BaseTable :columns="slotsColumns" :data="slotsData" />