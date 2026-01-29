---
title: 无缝表格 SeamlessTable
---

# 无缝表格 SeamlessTable

无缝循环滚动的 Vue 3 表格组件，适用于大屏或仪表盘类场景。当表格内容超过容器高度时会自动启动无缝滚动，鼠标悬停时暂停，移开后继续滚动。

### 安装

```bash
npm install @develop-plugins/seamless-table
```

### 引用

```javascript
import { SeamlessTableInstall } from "@develop-plugins/seamless-table";
app.use(SeamlessTableInstall);
```

### 基础用法

<script setup>
import SeamlessTable from '@develop-plugins/seamless-table'
import XMessage from '@develop-plugins/x-message'
import { ref } from 'vue'

// 属性表
const propsColumns = [ 
  { title: '属性', key: 'prop' },
  { title: '说明', key: 'desc' },
  { title: '类型', key: 'type' },
  { title: '默认值', key: 'default' }
]

const propsData = [
  { prop: 'data', desc: '表格数据数组，每项代表一行', type: 'Array', default: '-' },
  { prop: 'columns', desc: '列配置数组，每项包含 key、title、align、width 字段', type: 'Array', default: '-' },
  { prop: 'height', desc: '容器高度，Number 或 String，支持 px 或 %', type: 'Number | String', default: "'100%'" },
  { prop: 'speed', desc: '滚动速度，单位为像素/秒', type: 'Number', default: '60' },
  { prop: 'oddBackground', desc: '奇数行背景色', type: 'String', default: '#021736' },
  { prop: 'evenBackground', desc: '偶数行背景色', type: 'String', default: '#042d4c' },
  { prop: 'hoverBackground', desc: '行悬停时的背景色', type: 'String', default: '#0a526e' },
]

// 插槽表
const slotsColumns = [
  { title: '插槽名', key: 'name' },
  { title: '说明', key: 'desc' },
  { title: '参数', key: 'scope' },
]

const slotsData = [
  { name: '[columnKey]', desc: '按列的 key 值自定义单元格内容', scope: '{ row, index, column }' },
  { name: 'empty', desc: '表格数据为空时显示的内容', scope: '-' },
]

// Events 表
const eventsColumns = [
  { title: '事件名称', key: 'name' },
  { title: '说明', key: 'desc' },
  { title: '回调参数', key: 'args' },
]

const eventsData = [
  { name: 'row-click', desc: '点击表格行时触发', args: '(row, index) — row 为行数据对象，index 为行索引' },
]

const columns = ref([
  { key: "name", title: "姓名", align: "center", width: "150px" },
  { key: "age", title: "年龄", align: "center", width: "100px" },
  { key: "address", title: "地址", align: "left" },
]);

const tableData = ref([
  { name: "张三", age: 28, address: "北京市朝阳区" },
  { name: "李四", age: 35, address: "上海市浦东新区" },
  { name: "王五", age: 42, address: "深圳市南山区" },
  { name: "赵六", age: 30, address: "广州市天河区" },
  { name: "孙七", age: 25, address: "杭州市西湖区" },
  { name: "周八", age: 38, address: "成都市武侯区" },
  { name: "吴九", age: 29, address: "武汉市洪山区" },
  { name: "郑十", age: 33, address: "西安市雁塔区" },
]);

const basicCode = `<template>
  <SeamlessTable :columns="columns" :data="tableData" :scrollSpeed="50" style="height: 300px" />
</template>
<script setup>
  import SeamlessTable from '@develop-plugins/seamless-table'
  import { ref } from 'vue'

  const columns = ref([
    { key: "name", title: "姓名", align: "center", width: "150px" },
    { key: "age", title: "年龄", align: "center", width: "100px" },
    { key: "address", title: "地址", align: "left" },
  ]);
  const tableData = ref([
    { name: "张三", age: 28, address: "北京市朝阳区" },
    { name: "李四", age: 35, address: "上海市浦东新区" },
    { name: "王五", age: 42, address: "深圳市南山区" },
  ]);
<\/script>
`

const slotCode = `<template>
  <SeamlessTable :columns="columns" :data="tableData" :scrollSpeed="50" style="height: 300px">
    <template #cell-age="{ row }">
      <span :style="{ color: row.age > 30 ? 'red' : 'green' }">{{ row.age }}</span>
    </template>
  </SeamlessTable>
</template>
<script setup>
  import SeamlessTable from '@develop-plugins/seamless-table'
  import { ref } from 'vue'

  const columns = ref([
    { key: "name", title: "姓名", align: "center", width: "150px" },
    { key: "age", title: "年龄", align: "center", width: "100px" },
    { key: "address", title: "地址", align: "left" },
  ]);
  const tableData = ref([
    { name: "张三", age: 28, address: "北京市朝阳区" },
    { name: "李四", age: 35, address: "上海市浦东新区" },
    { name: "王五", age: 42, address: "深圳市南山区" },
  ]);
<\/script>`

function handleRowClick(row, index) {
  XMessage({ message: `点击了 ${row.name} 的行，索引：${index}`, type: 'success' })
}
</script>

<CodeCard :code="slotCode">
  <template #demo>
    <SeamlessTable :columns="columns" :data="tableData" :scrollSpeed="50" style="height: 300px" @row-click="handleRowClick" />
  </template>
</CodeCard>

### 使用插槽自定义单元格内容

<CodeCard :code="basicCode">
  <template #demo>
    <SeamlessTable :columns="columns" :data="tableData" :scrollSpeed="50" style="height: 300px">
       <template #age="{ row }">
        <span :style="{ color: row.age > 30 ? 'red' : 'green' }">{{ row.age }}</span>
      </template>
    </SeamlessTable>
  </template>
</CodeCard>

### API

#### 属性

<BaseTable :columns="propsColumns" :data="propsData" />

**columns 字段说明：**

- `key` (必需) - 列字段名，对应 data 中的属性名
- `title` (必需) - 列标题显示文本
- `align` (可选) - 对齐方式，可选值：left、center、right，默认 left
- `width` (可选) - 列宽，支持 px、% 等单位

#### 插槽

<BaseTable :columns="slotsColumns" :data="slotsData" />

#### 事件

<BaseTable :columns="eventsColumns" :data="eventsData" />

<style>
  .vp-doc table {
    display: table;
    margin: 0;
    overflow-x: auto;
  }
  .vp-doc td,
  .vp-doc tr {
    border: none;
  }
  .vp-doc th,
  .vp-doc tr {
    border: none;
    background: unset;
  }
</style>
