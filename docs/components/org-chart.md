---
title: 组织架构图 OrgChart
---

# 组织架构图 OrgChart

用于展示组织结构的树形图表组件，支持节点拖拽、缩放等交互功能。

### 安装

```bash
npm install @develop-plugins/org-chart
```

### 引用

```javascript
import OrgChart from "@develop-plugins/org-chart";
import "@develop-plugins/org-chart/style.css";
```

### 基础用法

<script setup>
import { ref } from 'vue'
import OrgChart from '@develop-plugins/org-chart'
import '@develop-plugins/org-chart/style.css';
import { createDiscreteApi } from 'naive-ui'

const data = ref({
  label: '科技有限公司',
  children: [
    {
      label: '产品研发部',
      children: [
        {
          label: '研发-前端',
          children: [{ label: '前端-1' }, { label: '前端-2' }],
        },
        { label: '研发-后端' },
        { label: 'UI设计' },
        { label: '产品经理' },
      ],
    },
    {
      label: '销售部',
      children: [
        { label: '销售-1', children: [{ label: '销售-1-1' }, { label: '销售-1-2' }] },
        { label: '销售-2' },
        { label: '销售-3' },
        { label: '销售-4' },
      ],
    },
    {
      label: '财务部',
      children: [
        { label: '财务-1' },
        { label: '财务-2' },
        { label: '财务-3' },
        { label: '财务-4' },
      ],
    },
    {
      label: 'HR人事',
    },
  ],
});

// 方向与事件示例
const direction = ref('horizontal')
const { message } = createDiscreteApi(['message'])

function onCellClick(node) {
  message.info('节点：' + (node?.label ?? ''))
}
function onExpand(node) {
  message.info('节点：' + (node?.label ?? ''))
}

const orgCode = ref(`<template>
  <div>
    <div style="margin-bottom: 12px; display: flex; gap: 12px; align-items: center;">
      <span>方向：</span>
      <n-radio-group v-model:value="direction" name="direction">
        <n-radio-button value="vertical">纵向</n-radio-button>
        <n-radio-button value="horizontal">横向</n-radio-button>
      </n-radio-group>
      <span style="margin-left: 12px; color: #666; font-size: 12px;">当前：{{ direction }}</span>
    </div>
    <OrgChart 
      :data="data"
      :direction="direction"
      @cell-click="onCellClick"
      @expand="onExpand"
    >
      <template #label="{ data }">
        <span style="color: #409eff; font-weight: 500;">{{ data.label }}</span>
      </template>
    </OrgChart>
    
  </div>
</template>
<script setup>
import { ref } from 'vue';

const data = ref({
  label: '科技有限公司',
  children: [
    {
      label: '产品研发部',
      children: [
        {
          label: '研发-前端',
          children: [{ label: '前端-1' }, { label: '前端-2' }],
        },
        { label: '研发-后端' },
        { label: 'UI设计' },
        { label: '产品经理' },
      ],
    },
    {
      label: '销售部',
      children: [
        { label: '销售-1', children: [{ label: '销售-1-1' }, { label: '销售-1-2' }] },
        { label: '销售-2' },
        { label: '销售-3' },
        { label: '销售-4' },
      ],
    },
    {
      label: '财务部',
      children: [
        { label: '财务-1' },
        { label: '财务-2' },
        { label: '财务-3' },
        { label: '财务-4' },
      ],
    },
    {
      label: 'HR人事',
    },
  ],
});

const direction = ref('vertical')
<\/script>`)

// BaseTable 列与数据
const propsColumns = [
  { title: '属性', key: 'prop' },
  { title: '说明', key: 'desc' },
  { title: '类型', key: 'type' },
  { title: '默认值', key: 'default' },
]
const propsData = [
  { prop: 'data', desc: '组织架构数据', type: 'Object', default: '{}' },
  { prop: 'direction', desc: "布局方向，支持 'vertical' 和 'horizontal'", type: 'String', default: "horizontal" }
]

const eventsColumns = [
  { title: '事件名', key: 'name' },
  { title: '说明', key: 'desc' },
  { title: '回调参数', key: 'args' },
]
const eventsData = [
  { name: 'cell-click', desc: '节点点击事件', args: '(data)' },
  { name: 'expand', desc: '节点展开/折叠事件', args: '(data)' },
]

const slotsColumns = [
  { title: '插槽名', key: 'name' },
  { title: '说明', key: 'desc' },
  { title: '参数', key: 'scope' },
]
const slotsData = [
  { name: 'label', desc: '自定义节点标签内容', scope: '{ data }' },
]
</script>

<style>
/* 取消 VitePress 文档样式对 OrgChart 内部表格的影响 */
.vp-doc .organization-chart-table {
  display: table;           /* 恢复为标准表格布局 */
  overflow: visible;        /* 允许内容正常展示 */
  width: auto;              /* 不强制整行宽度 */
  max-width: none;          /* 取消最大宽度限制 */
  margin: 0;                /* 清除文档默认的上下间距 */
  background: transparent;  /* 取消背景色 */
  border: none;             /* 取消边框以避免双重边框 */
}
.vp-doc .organization-chart-table thead,
.vp-doc .organization-chart-table tbody,
.vp-doc .organization-chart-table tr,
.vp-doc .organization-chart-table th,
.vp-doc .organization-chart-table td {
  background: transparent;  /* 取消斑马纹与头部背景 */
}
.vp-doc .organization-chart-table th,
.vp-doc .organization-chart-table td {
  padding: 0;               /* 清除文档默认单元格内边距 */
  border: none;             /* 清除文档为表格设置的边框 */
}
.vp-doc .organization-chart-table tbody tr:nth-child(2n) {
  background: transparent;  /* 移除偶数行背景 */
}
</style>

<CodeCard :code="orgCode">
  <template #demo>
    <div>
      <div style="margin-bottom: 12px; display: flex; gap: 12px; align-items: center;">
        <span>方向：</span>
        <n-radio-group v-model:value="direction" name="direction">
          <n-radio value="horizontal">横向</n-radio>
          <n-radio value="vertical">纵向</n-radio>
        </n-radio-group>
        <span style="margin-left: 12px; color: #666; font-size: 12px;">当前：{{ direction }}</span>
      </div>
      <div style="border: 1px solid #e4e7ed; border-radius: 4px; padding: 20px; overflow: auto;">
        <OrgChart 
          :data="data"
          :collapsible="true"
          :direction="direction"
          @cell-click="onCellClick"
          @expand="onExpand"
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

#### 插槽

<BaseTable :columns="slotsColumns" :data="slotsData" />
