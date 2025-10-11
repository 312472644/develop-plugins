## XScroll

### 描述

一个自定义滚动条组件，支持垂直和水平滚动，可自定义滚动条样式。

### 安装

```
 # npm
 npm i @develop-plugins/x-scroll
 
 # yarn
 yarn add @develop-plugins/x-scroll
 
 # pnpm
 pnpm add @develop-plugins/x-scroll
```

### 引用

```javascript
import { XScrollInstall } from '@develop-plugins/x-scroll';

app.use(XScrollInstall);
```

### 示例

```vue
<template>
  <x-scroll :max-height="300">
    <div style="padding: 20px">
      <p v-for="i in 20" :key="i">滚动内容 {{ i }}</p>
    </div>
  </x-scroll>
</template>
```

### 属性

| 参数           | 说明                 | 类型      | 可选值 | 默认值      |
| -------------- | -------------------- | --------- | ------ | ----------- |
| horizontal     | 是否启用水平滚动模式 | `boolean` |        | `false`     |
| maxHeight      | 最大高度             | `number`  |        | `0`         |
| thumbWidth     | 滚动条宽度           | `string`  |        | `6px`       |
| thumbColor     | 滚动条颜色           | `string`  |        | `#909399`   |
| thumbHoverColor| 滚动条悬停颜色       | `string`  |        | `#606266`   |

### 插槽

| 名称 | 说明     |
| ---- | -------- |
| —    | 默认插槽 |

### 事件

| 事件名称 | 说明 | 回调参数 |
| -------- | ---- | -------- |
| scroll | 滚动时触发 | { horizontal: boolean, vertical: boolean } |

**事件说明**

- 触发时机：当用户滚动内容时触发
- 参数说明：
  - `horizontal`: boolean，表示是否滚动到水平方向的底部
  - `vertical`: boolean，表示是否滚动到垂直方向的底部

**使用示例**

```vue
<template>
  <x-scroll @scroll="handleScroll">
    <!-- 内容 -->
  </x-scroll>
</template>

<script setup>
const handleScroll = (event) => {
  if (event.vertical) {
    console.log('已滚动到垂直底部');
  }
  if (event.horizontal) {
    console.log('已滚动到水平底部');
  }
};
</script>
```