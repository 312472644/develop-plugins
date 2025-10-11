---
title: 图表 Chart
---

# 图表 Chart

基于图表库的数据可视化组件，支持多种图表类型。

### 安装

```bash
npm install @develop-plugins/chart
```

### 基础用法

<script setup>
import { ref } from 'vue'
import Chart from '@develop-plugins/chart'

// 基础折线图
const options = ref({
  xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  yAxis: { type: 'value' },
  series: [{ data: [150, 230, 224, 218, 135, 147, 260], type: 'line' }]
})

const chartCode = `<template>
  <Chart :data="chartData" />
</template>

<script setup>
import Chart from '@develop-plugins/chart'

const chartData = {
  type: 'line',
  data: {
    labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
    datasets: [{
      label: '销售额',
      data: [12, 19, 3, 5, 2, 3],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  },
  options: {
    responsive: true,
    plugins: { title: { display: true, text: '月度销售趋势' } }
  }
}
<\/script>`

// 柱状图示例
const barOptions = ref({
  tooltip: {},
  xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: [120, 200, 150, 80, 70, 110, 130] }]
})

const barCode = `<template>
  <Chart :option="barOptions" />
</template>

<script setup>
const barOptions = {
  xAxis: { type: 'category', data: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: [120,200,150,80,70,110,130] }]
}
<\/script>`

// 饼图示例
const pieOptions = ref({
  tooltip: { trigger: 'item' },
  legend: { top: '5%' },
  series: [{
    name: '访问来源',
    type: 'pie',
    radius: '55%',
    data: [
      { value: 1048, name: '搜索引擎' },
      { value: 735, name: '直接访问' },
      { value: 580, name: '邮件营销' },
      { value: 484, name: '联盟广告' },
      { value: 300, name: '视频广告' }
    ],
    emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.5)' } }
  }]
})

const pieCode = `<template>
  <Chart :option="pieOptions" />
</template>

<script setup>
const pieOptions = {
  tooltip: { trigger: 'item' },
  legend: { top: '5%' },
  series: [{ type: 'pie', radius: '55%', data: [
    { value: 1048, name: '搜索引擎' },
    { value: 735, name: '直接访问' },
    { value: 580, name: '邮件营销' },
    { value: 484, name: '联盟广告' },
    { value: 300, name: '视频广告' }
  ] }]
}
<\/script>`

// 面积折线图示例
const areaOptions = ref({
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', boundaryGap: false, data: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
  yAxis: { type: 'value' },
  series: [{ type: 'line', smooth: true, areaStyle: {}, data: [140, 232, 101, 264, 90, 340, 250] }]
})

const areaCode = `<template>
  <Chart :option="areaOptions" />
</template>

<script setup>
const areaOptions = {
  xAxis: { type: 'category', boundaryGap: false, data: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
  yAxis: { type: 'value' },
  series: [{ type: 'line', smooth: true, areaStyle: {}, data: [140,232,101,264,90,340,250] }]
}
<\/script>`

// 堆叠柱状图示例
const stackedBarOptions = ref({
  tooltip: { trigger: 'axis' },
  legend: {},
  xAxis: { type: 'category', data: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
  yAxis: { type: 'value' },
  series: [
    { name: '邮件营销', type: 'bar', stack: '总量', data: [120, 132, 101, 134, 90, 230, 210] },
    { name: '联盟广告', type: 'bar', stack: '总量', data: [220, 182, 191, 234, 290, 330, 310] },
    { name: '视频广告', type: 'bar', stack: '总量', data: [150, 232, 201, 154, 190, 330, 410] },
    { name: '直接访问', type: 'bar', stack: '总量', data: [320, 332, 301, 334, 390, 330, 320] },
    { name: '搜索引擎', type: 'bar', stack: '总量', data: [820, 932, 901, 934, 1290, 1330, 1320] }
  ]
})

const stackedBarCode = `<template>
  <Chart :option="stackedBarOptions" />
</template>

<script setup>
const stackedBarOptions = {
  tooltip: { trigger: 'axis' },
  legend: {},
  xAxis: { type: 'category', data: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
  yAxis: { type: 'value' },
  series: [
    { name: '邮件营销', type: 'bar', stack: '总量', data: [120,132,101,134,90,230,210] },
    { name: '联盟广告', type: 'bar', stack: '总量', data: [220,182,191,234,290,330,310] },
    { name: '视频广告', type: 'bar', stack: '总量', data: [150,232,201,154,190,330,410] },
    { name: '直接访问', type: 'bar', stack: '总量', data: [320,332,301,334,390,330,320] },
    { name: '搜索引擎', type: 'bar', stack: '总量', data: [820,932,901,934,1290,1330,1320] }
  ]
}
<\/script>`

// 散点图示例
const scatterOptions = ref({
  xAxis: {},
  yAxis: {},
  series: [{ type: 'scatter', symbolSize: 12, data: [
    [10, 8], [15, 12], [20, 20], [25, 33], [30, 28], [35, 40], [40, 38]
  ] }]
})

const scatterCode = `<template>
  <Chart :option="scatterOptions" />
</template>

<script setup>
const scatterOptions = {
  xAxis: {}, yAxis: {},
  series: [{ type: 'scatter', symbolSize: 12, data: [[10,8],[15,12],[20,20],[25,33],[30,28],[35,40],[40,38]] }]
}
<\/script>`

// 雷达图示例
const radarOptions = ref({
  legend: { data: ['预算分配', '实际支出'] },
  radar: {
    indicator: [
      { name: '销售', max: 650 },
      { name: '管理', max: 160 },
      { name: '信息技术', max: 300 },
      { name: '客服', max: 200 },
      { name: '研发', max: 500 },
      { name: '市场', max: 250 }
    ]
  },
  series: [{ type: 'radar', data: [
    { value: [420, 130, 300, 180, 320, 210], name: '预算分配' },
    { value: [500, 150, 280, 160, 300, 230], name: '实际支出' }
  ] }]
})

const radarCode = `<template>
  <Chart :option="radarOptions" />
</template>

<script setup>
const radarOptions = {
  legend: { data: ['预算分配','实际支出'] },
  radar: {
    indicator: [
      { name: '销售', max: 650 },
      { name: '管理', max: 160 },
      { name: '信息技术', max: 300 },
      { name: '客服', max: 200 },
      { name: '研发', max: 500 },
      { name: '市场', max: 250 }
    ]
  },
  series: [{ type: 'radar', data: [
    { value: [420,130,300,180,320,210], name: '预算分配' },
    { value: [500,150,280,160,300,230], name: '实际支出' }
  ] }]
}
<\/script>`

// BaseTable 列与数据
const propsColumns = [
  { title: '属性', key: 'prop' },
  { title: '说明', key: 'desc' },
  { title: '类型', key: 'type' },
  { title: '默认值', key: 'default' },
];
const propsData = [
  { prop: 'option', desc: '图表配置选项', type: 'Object', default: '-' },
  { prop: 'width', desc: '图表宽度', type: 'String', default: "'100%'" },
  { prop: 'height', desc: '图表高度', type: 'String', default: "'100%'" },
  { prop: 'theme', desc: '图表主题', type: 'String', default: "'default'" },
  { prop: 'autoResize', desc: '是否自动调整大小', type: 'Boolean', default: 'true' },
  { prop: 'loading', desc: '是否显示加载状态', type: 'Boolean', default: 'false' },
  { prop: 'loadingText', desc: '加载状态显示文本', type: 'String', default: "'加载中...'" },
];

const eventsColumns = [
  { title: '事件名', key: 'name' },
  { title: '说明', key: 'desc' },
  { title: '回调参数', key: 'args' },
];
const eventsData = [
  { name: 'chart-ready', desc: '图表准备就绪事件', args: '(chartInstance)' },
  { name: 'click', desc: '鼠标点击事件', args: '(params: ChartEventParams)' },
  { name: 'dblclick', desc: '鼠标双击事件', args: '(params: ChartEventParams)' },
  { name: 'mousedown', desc: '鼠标按下事件', args: '(params: ChartEventParams)' },
  { name: 'mousemove', desc: '鼠标移动事件', args: '(params: ChartEventParams)' },
  { name: 'mouseup', desc: '鼠标抬起事件', args: '(params: ChartEventParams)' },
  { name: 'mouseover', desc: '鼠标悬停事件', args: '(params: ChartEventParams)' },
  { name: 'mouseout', desc: '鼠标离开事件', args: '(params: ChartEventParams)' },
];

const methodsColumns = [
  { title: '方法名', key: 'name' },
  { title: '说明', key: 'desc' },
  { title: '参数', key: 'args' },
];
const methodsData = [
  { name: 'updateChart', desc: '更新图表配置', args: '(newOption: EChartsOption)' },
  { name: 'clearChart', desc: '清空图表', args: '-' },
  { name: 'disposeChart', desc: '销毁图表', args: '-' },
];

const slotsColumns = [
  { title: '插槽名', key: 'name' },
  { title: '说明', key: 'desc' },
  { title: '作用域参数', key: 'scope' },
];
const slotsData = [
  { name: 'loading', desc: '自定义加载状态', scope: '-' },
];
// 加载示例状态与代码
const loading = ref(false)
const loadingText = ref('加载中...')
const simulateLoading = () => {
  loading.value = true
  setTimeout(() => (loading.value = false), 1500)
}

const loadingCode = `<template>
  <div>
    <n-button @click="simulateLoading" style="padding: 6px 12px; margin-bottom: 12px; background: #409eff; color: #fff; border: none; border-radius: 4px;">模拟加载</n-button>
    <div style="width: 100%; height: 400px;">
      <Chart :option="barOptions" :loading="loading" :loadingText="loadingText" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Chart from '@develop-plugins/chart'

const loading = ref(false)
const loadingText = ref('加载中...')
const barOptions = {
  xAxis: { type: 'category', data: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: [120,200,150,80,70,110,130] }]
}
function simulateLoading() {
  loading.value = true
  setTimeout(() => (loading.value = false), 1500)
}
<\/script>`
</script>

<CodeCard :code="chartCode">
  <template #demo>
  <div style="width: 100%; height: 400px;">
    <Chart :option="options" />
  </div>
  </template>
</CodeCard>

### 柱状图示例

<CodeCard :code="barCode">
  <template #demo>
    <div style="width: 100%; height: 400px;">
      <Chart :option="barOptions" />
    </div>
  </template>
</CodeCard>

### 饼图示例

<CodeCard :code="pieCode">
  <template #demo>
    <div style="width: 100%; height: 400px;">
      <Chart :option="pieOptions" />
    </div>
  </template>
</CodeCard>

### 面积折线图示例

<CodeCard :code="areaCode">
  <template #demo>
    <div style="width: 100%; height: 400px;">
      <Chart :option="areaOptions" />
    </div>
  </template>
</CodeCard>

### 堆叠柱状图示例

<CodeCard :code="stackedBarCode">
  <template #demo>
    <div style="width: 100%; height: 400px;">
      <Chart :option="stackedBarOptions" />
    </div>
  </template>
</CodeCard>

### 散点图示例

<CodeCard :code="scatterCode">
  <template #demo>
    <div style="width: 100%; height: 400px;">
      <Chart :option="scatterOptions" />
    </div>
  </template>
</CodeCard>

### 雷达图示例

<CodeCard :code="radarCode">
  <template #demo>
    <div style="width: 100%; height: 400px;">
      <Chart :option="radarOptions" />
    </div>
  </template>
</CodeCard>

### 加载状态示例

<CodeCard :code="loadingCode">
  <template #demo>
    <div style="width: 100%; height: 400px;">
      <div style="margin-bottom: 12px;">
        <n-button @click="simulateLoading" type="primary">模拟加载</n-button>
      </div>
      <Chart :option="barOptions" :loading="loading" :loadingText="loadingText" />
    </div>
  </template>
</CodeCard>

### API

#### 属性

<BaseTable :columns="propsColumns" :data="propsData" />

#### 事件

<BaseTable :columns="eventsColumns" :data="eventsData" />

#### 方法

<BaseTable :columns="methodsColumns" :data="methodsData" />

#### 插槽

<BaseTable :columns="slotsColumns" :data="slotsData" />
