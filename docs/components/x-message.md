---
title: 消息 XMessage
---

# 消息 XMessage

全局消息提示组件，支持多种类型和自定义样式。

## 安装

```bash
npm install @develop-plugins/x-message
```

### 基础用法

<script setup>
import { ref } from 'vue'
import XMessage from '@develop-plugins/x-message'

const showSuccess = () => {
  XMessage({ message: '操作成功！', type: 'success' })
}

const showError = () => {
  XMessage({ message: '操作失败！', type: 'error' })
}

const showWarning = () => {
  XMessage({ message: '警告信息！', type: 'warning' })
}

const showInfo = () => {
  XMessage({ message: '提示信息！', type: 'info' })
}

const messageCode = `<template>
  <button @click="showSuccess">成功消息</button>
  <button @click="showError">错误消息</button>
  <button @click="showWarning">警告消息</button>
  <button @click="showInfo">信息消息</button>
</template>

<script setup>
import XMessage from '@develop-plugins/x-message'

const showSuccess = () => {
  XMessage.success('操作成功！')
}

const showError = () => {
  XMessage.error('操作失败！')
}

const showWarning = () => {
  XMessage.warning('警告信息！')
}

const showInfo = () => {
  XMessage.info('提示信息！')
}
<\/script>`
// BaseTable 列与数据
const methodsColumns = [
  { title: '方法名', key: 'name' },
  { title: '说明', key: 'desc' },
  { title: '参数', key: 'args' },
]
const methodsData = [
  { name: 'XMessage(options)', desc: '显示消息（返回可关闭实例）', args: 'options: MessageOptions' },
  { name: 'close', desc: '关闭当前消息实例（实例方法）', args: '-' },
  { name: 'closeAll', desc: '关闭所有消息（静态方法）', args: '-' },
]

const optsColumns = [
  { title: '属性名', key: 'prop' },
  { title: '说明', key: 'desc' },
  { title: '类型', key: 'type' },
  { title: '可选值', key: 'options' },
  { title: '默认值', key: 'default' },
]
const optsData = [
  { prop: 'message', desc: '消息文本', type: 'String', options: '-', default: '-' },
  { prop: 'type', desc: '消息类型', type: 'String', options: 'success/warning/error/info/loading', default: "'info'" },
  { prop: 'size', desc: '消息大小', type: 'String', options: 'small/medium/large', default: "'small'" },
  { prop: 'duration', desc: '显示时长(ms)，为0时不自动关闭', type: 'Number', options: '-', default: '3000' },
  { prop: 'onClose', desc: '关闭时触发回调', type: 'Function', options: '-', default: '-' },
]

const eventsColumns = [
  { title: '事件名', key: 'name' },
  { title: '说明', key: 'desc' },
  { title: '回调参数', key: 'args' },
]
const eventsData = [
  { name: 'close', desc: '消息关闭时触发', args: '-' },
  { name: 'transitionEnd', desc: '过渡动画结束时触发', args: '-' },
]

// 自定义配置示例（合并到同一脚本块，避免多 <script setup>）
const showCustom = () => {
  XMessage({
    message: '这是一条自定义消息',
    type: 'success',
    duration: 5000,
    showClose: true,
    onClose: () => {
      console.log('消息已关闭')
    }
  })
}

const customCode = `<template>
  <button @click="showCustom">自定义消息</button>
</template>

<script setup>
import XMessage from '@develop-plugins/x-message'

const showCustom = () => {
  XMessage({
    message: '这是一条自定义消息',
    type: 'success',
    duration: 5000,
    showClose: true,
    onClose: () => {
      console.log('消息已关闭')
    }
  })
}
<\/script>`
</script>

<CodeCard :code="messageCode">
  <template #demo>
    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
      <button @click="showSuccess" style="padding: 8px 16px; background: #67c23a; color: white; border: none; border-radius: 4px;">
        成功消息
      </button>
      <button @click="showError" style="padding: 8px 16px; background: #f56c6c; color: white; border: none; border-radius: 4px;">
        错误消息
      </button>
      <button @click="showWarning" style="padding: 8px 16px; background: #e6a23c; color: white; border: none; border-radius: 4px;">
        警告消息
      </button>
      <button @click="showInfo" style="padding: 8px 16px; background: #409eff; color: white; border: none; border-radius: 4px;">
        信息消息
      </button>
    </div>
  </template>
</CodeCard>

### 自定义配置

<CodeCard :code="customCode">
  <template #demo>
    <button @click="showCustom" style="padding: 8px 16px; background: #909399; color: white; border: none; border-radius: 4px;">
      自定义消息
    </button>
  </template>
</CodeCard>

### API

#### 方法
<BaseTable :columns="methodsColumns" :data="methodsData" />

#### MessageOptions
<BaseTable :columns="optsColumns" :data="optsData" />

#### 事件
<BaseTable :columns="eventsColumns" :data="eventsData" />