# Chart 组件使用说明

## 基础用法

```vue
<template>
  <div>
    <Chart 
      :option="chartOption" 
      :loading="isLoading"
      loading-text="数据加载中..."
      width="800px" 
      height="400px"
      @chart-ready="onChartReady"
      @click="onChartClick"
    />
    
    <!-- 自定义Loading -->
    <Chart :option="chartOption" :loading="isLoading">
      <template #loading>
        <div style="color: #1890ff; font-size: 16px;">
          <i class="loading-icon">⏳</i>
          自定义加载中...
        </div>
      </template>
    </Chart>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Chart from './components/Chart.vue'

// Loading状态
const isLoading = ref(false)

// 图表配置
const chartOption = ref({
  title: {
    text: '基础柱状图示例'
  },
  tooltip: {},
  xAxis: {
    data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
  },
  yAxis: {},
  series: [{
    name: '销量',
    type: 'bar',
    data: [5, 20, 36, 10, 10, 20]
  }]
})

// 图表准备就绪回调
const onChartReady = (chartInstance) => {
  console.log('图表初始化完成', chartInstance)
}

// 图表点击事件
const onChartClick = (params) => {
  console.log('图表点击事件', params)
}
</script>
```

## Props 参数

| 参数名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| option | Object | - | ECharts配置对象（必填） |
| width | String | '100%' | 图表宽度 |
| height | String | '400px' | 图表高度 |
| theme | String | 'default' | 图表主题 |
| autoResize | Boolean | true | 是否自动resize |
| loading | Boolean | false | 是否显示loading |
| loadingText | String | '加载中...' | loading文本 |
| loadingOption | Object | {} | ECharts内置loading配置 |

## Events 事件

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| chart-ready | 图表初始化完成 | chartInstance |
| click | 鼠标点击事件 | event params |
| dblclick | 鼠标双击事件 | event params |
| mousedown | 鼠标按下事件 | event params |
| mousemove | 鼠标移动事件 | event params |
| mouseup | 鼠标抬起事件 | event params |
| mouseover | 鼠标进入事件 | event params |
| mouseout | 鼠标离开事件 | event params |

## 暴露的方法

| 方法名 | 说明 | 参数 |
|--------|------|------|
| updateChart | 更新图表配置 | newOption |
| clearChart | 清空图表 | - |
| disposeChart | 销毁图表 | - |
| showLoading | 显示loading | option(可选) |
| hideLoading | 隐藏loading | - |

## 插槽 Slots

| 插槽名 | 说明 |
|--------|------|
| loading | 自定义loading内容 |

## 使用示例

### 1. 折线图

```javascript
const lineOption = {
  title: {
    text: '折线图示例'
  },
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    data: [820, 932, 901, 934, 1290, 1330, 1320],
    type: 'line'
  }]
}
```

### 2. 饼图

```javascript
const pieOption = {
  title: {
    text: '饼图示例',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  series: [{
    name: '访问来源',
    type: 'pie',
    radius: '50%',
    data: [
      { value: 1048, name: '搜索引擎' },
      { value: 735, name: '直接访问' },
      { value: 580, name: '邮件营销' },
      { value: 484, name: '联盟广告' },
      { value: 300, name: '视频广告' }
    ]
  }]
}
```

### 3. 散点图

```javascript
const scatterOption = {
  title: {
    text: '散点图示例'
  },
  xAxis: {},
  yAxis: {},
  series: [{
    type: 'scatter',
    data: [
      [10.0, 8.04],
      [8.07, 6.95],
      [13.0, 7.58],
      [9.05, 8.81],
      [11.0, 8.33]
    ]
  }]
}
```

### 4. Loading 使用示例

```vue
<template>
  <div>
    <!-- 基础Loading -->
    <Chart 
      :option="chartOption" 
      :loading="isLoading"
      loading-text="数据加载中..."
    />

    <!-- 自定义Loading -->
    <Chart :option="chartOption" :loading="isLoading">
      <template #loading>
        <div class="custom-loading">
          <div class="spinner"></div>
          <p>正在加载图表数据...</p>
        </div>
      </template>
    </Chart>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Chart from './components/Chart.vue'

const isLoading = ref(false)
</script>

<style>
.custom-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #1890ff;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #f0f0f0;
  border-top: 2px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 8px;
}
</style>
```

## 特性

- ✅ 基于 ECharts 5.x
- ✅ Vue 3 Composition API
- ✅ TypeScript 支持
- ✅ 响应式配置更新
- ✅ 自动窗口resize
- ✅ 完整的事件支持
- ✅ 方法暴露给父组件
- ✅ 主题切换支持
- ✅ 内存泄漏防护
- ✅ Loading状态支持
- ✅ 自定义Loading内容
- ✅ KeepAlive支持