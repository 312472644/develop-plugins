# x-dialog 对话框组件

一个简单的对话框组件，支持自定义标题、宽度、关闭按钮文本等功能，并提供了淡入淡出和缩放动画效果。

## 安装

```bash
npm install @develop-plugins/vue
```

## 属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|---------|------|
| visible | Boolean | false | 控制对话框的显示和隐藏 |
| title | String | '' | 对话框标题 |
| width | String/Number | '300px' | 对话框宽度，可以是数字（单位：px）或字符串 |
| showClose | Boolean | true | 是否显示关闭按钮 |
| closeText | String | '关闭' | 关闭按钮文本 |

## 事件

| 事件名 | 说明 |
|--------|------|
| update:visible | 在对话框显示状态改变时触发，用于支持 v-model |
| close | 对话框关闭时触发 |

## 插槽

| 插槽名 | 说明 |
|--------|------|
| default | 对话框的主要内容 |
| header | 自定义对话框头部内容，默认显示标题 |
| footer | 自定义对话框底部内容，默认显示关闭按钮 |

## 使用示例

### 基础用法

```vue
<template>
  <x-dialog v-model:visible="dialogVisible" title="提示">
    <p>这是一个基础的对话框示例</p>
  </x-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { XDialog } from '@develop-plugins/vue';

const dialogVisible = ref(false);
</script>
```

### 自定义宽度和关闭按钮

```vue
<template>
  <x-dialog
    v-model:visible="dialogVisible"
    title="自定义对话框"
    width="500px"
    closeText="确定"
  >
    <p>这是一个宽度为500px的对话框</p>
  </x-dialog>
</template>
```

### 使用插槽自定义内容

```vue
<template>
  <x-dialog v-model:visible="dialogVisible">
    <template #header>
      <h2>自定义标题</h2>
    </template>
    <p>这是对话框的主要内容</p>
    <template #footer>
      <button @click="dialogVisible = false">取消</button>
      <button @click="handleConfirm">确定</button>
    </template>
  </x-dialog>
</template>
```