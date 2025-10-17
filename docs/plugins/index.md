# Vite 插件

本项目提供了一系列实用的 Vite 插件，帮助提升开发和构建体验。

## 插件列表

### 构建相关

- [vite-build-git-info](./vite-build-git-info.md) - 在浏览器控制台显示 Git 提交信息
- [vite-generate-zip](./vite-generate-zip.md) - 构建完成后自动生成压缩包

## 快速开始

### 安装

```bash
# 安装 Git 信息插件
npm install @develop-plugins/vite-build-git-info

# 安装压缩包生成插件
npm install @develop-plugins/vite-generate-zip
```

### 基本使用

在 `vite.config.js` 中配置插件：

```javascript
import { defineConfig } from 'vite'
import viteBuildGitInfo from '@develop-plugins/vite-build-git-info'
import viteGenerateZip from '@develop-plugins/vite-generate-zip'

export default defineConfig({
  plugins: [
    // Git 信息插件
    viteBuildGitInfo({
      defaultShowLog: true,
      showFieldList: ['commit', 'branch', 'author', 'date']
    }),
    
    // 压缩包生成插件
    viteGenerateZip({
      targetPath: 'dist',
      filename: 'my-app',
      deleteSourceFiles: true
    })
  ]
})
```

## 特性

- 🚀 **开箱即用** - 简单配置即可使用
- 🔧 **高度可配置** - 支持丰富的配置选项
- 📦 **轻量级** - 最小化依赖，不影响构建性能
- 🛠️ **TypeScript 支持** - 完整的类型定义