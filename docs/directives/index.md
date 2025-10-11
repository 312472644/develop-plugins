---
title: 指令总览
---

# 指令总览

Develop Plugins 提供了一系列实用的 Vue 3 指令，帮助您快速实现常见的交互功能。

## 指令列表

### 实用指令

- **[v-directive](/directives/directive)** - 通用指令功能集合

## 快速开始

### 安装

```bash
npm install @develop-plugins/directive
```

### 使用

```javascript
import { createApp } from 'vue'
import directive from '@develop-plugins/directive'

const app = createApp({})
app.use(directive)
```

或者按需引入：

```javascript
import { vDirective } from '@develop-plugins/directive'

// 在组件中使用
export default {
  directives: {
    directive: vDirective
  }
}
```

## 特性

- 🚀 **轻量级** - 体积小，性能优
- 🎯 **易使用** - 简单的 API 设计
- 🔧 **可配置** - 支持多种配置选项
- 📱 **响应式** - 支持响应式数据绑定
- 🎨 **无样式依赖** - 不依赖特定的 CSS 框架