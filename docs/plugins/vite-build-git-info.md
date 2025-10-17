# vite-build-git-info

在浏览器控制台中查看最新一次 Git 提交记录信息的 Vite 插件。

## 功能特性

- 🔍 **自动获取 Git 信息** - 自动读取最新的 Git 提交记录
- 🎨 **美观的控制台输出** - 支持自定义样式的控制台日志
- ⚙️ **高度可配置** - 支持自定义显示字段和样式
- 🚀 **零配置使用** - 开箱即用，无需复杂配置
- 📱 **版本检测** - 自动检测是否为最新版本

### 安装

```bash
npm install @develop-plugins/vite-build-git-info
# 或
yarn add @develop-plugins/vite-build-git-info
# 或
pnpm add @develop-plugins/vite-build-git-info
```

### 基本使用

在 `vite.config.js` 中配置插件：

```javascript
import { defineConfig } from 'vite'
import viteBuildGitInfo from '@develop-plugins/vite-build-git-info'

export default defineConfig({
  plugins: [
    viteBuildGitInfo()
  ]
})
```

构建完成后，在浏览器控制台中会自动显示 Git 提交信息。

<script setup>
// BaseTable 列与数据
const configColumns = [
  { title: '参数', key: 'param' },
  { title: '说明', key: 'desc' },
  { title: '类型', key: 'type' },
  { title: '默认值', key: 'default' },
]
const configData = [
  { param: 'gitOriginName', desc: 'Git 仓库地址名称', type: 'string', default: "'origin'" },
  { param: 'defaultShowLog', desc: '是否默认显示 Git 信息', type: 'boolean', default: 'true' },
  { param: 'showLogFunName', desc: '手动显示日志的函数名', type: 'string', default: "'showGitLog'" },
  { param: 'showFieldList', desc: '控制台显示的字段列表', type: 'Field[]', default: "['commit', 'branch', 'author', 'date', 'isNewVersion']" },
  { param: 'labelStyle', desc: '标签样式', type: 'string', default: '默认样式' },
  { param: 'valueStyle', desc: '值样式', type: 'string', default: '默认样式' },
]

const fieldColumns = [
  { title: '字段名', key: 'field' },
  { title: '说明', key: 'desc' },
]
const fieldData = [
  { field: 'commit', desc: '提交 commit ID' },
  { field: 'branch', desc: '分支名称' },
  { field: 'author', desc: '提交作者' },
  { field: 'date', desc: '提交时间' },
  { field: 'message', desc: '提交消息' },
  { field: 'isNewVersion', desc: '是否为最新版本' },
]
</script>

### 使用示例

#### 默认配置

```javascript
import viteBuildGitInfo from '@develop-plugins/vite-build-git-info'

export default defineConfig({
  plugins: [
    viteBuildGitInfo()
  ]
})
```

#### 自定义显示字段

```javascript
import viteBuildGitInfo from '@develop-plugins/vite-build-git-info'

export default defineConfig({
  plugins: [
    viteBuildGitInfo({
      showFieldList: ['commit', 'author', 'date', 'message']
    })
  ]
})
```

#### 禁用自动显示

```javascript
import viteBuildGitInfo from '@develop-plugins/vite-build-git-info'

export default defineConfig({
  plugins: [
    viteBuildGitInfo({
      defaultShowLog: false,
      showLogFunName: 'showMyGitInfo'
    })
  ]
})
```

然后在浏览器控制台中手动调用：

```javascript
// 在浏览器控制台中执行
showMyGitInfo()
```

#### 自定义样式

```javascript
import viteBuildGitInfo from '@develop-plugins/vite-build-git-info'

export default defineConfig({
  plugins: [
    viteBuildGitInfo({
      labelStyle: 'font-size:12px;background:#ff6b6b;color:#fff;padding:4px 8px;border-radius:4px;',
      valueStyle: 'font-size:12px;background:#4ecdc4;color:#fff;padding:4px 8px;border-radius:4px;'
    })
  ]
})
```

#### 完整配置示例

```javascript
import viteBuildGitInfo from '@develop-plugins/vite-build-git-info'

export default defineConfig({
  plugins: [
    viteBuildGitInfo({
      gitOriginName: 'origin',
      defaultShowLog: true,
      showLogFunName: 'showGitLog',
      showFieldList: ['commit', 'branch', 'author', 'date', 'message', 'isNewVersion'],
      labelStyle: 'font-size:11px;font-family:Microsoft YaHei, Arial;background:#35495e;padding:3px 0 3px 10px;border-radius:3px 0 0 3px;color:#fff;',
      valueStyle: 'font-size:11px;font-family:Microsoft YaHei, Arial;background:#41b883;padding:3px 10px 3px 10px;border-radius:0 3px 3px 0;color:#fff;'
    })
  ]
})
```

## 控制台输出效果

插件会在浏览器控制台中以美观的格式显示 Git 信息，例如：

```
提交commitId: abc1234567890def
分支名称: main
提交作者: developer@example.com
提交时间: 2024-01-15 10:30:25
是否为最新版本: true
```

### 配置选项

#### 基本配置

<BaseTable :columns="configColumns" :data="configData" />

#### 字段说明

<BaseTable :columns="fieldColumns" :data="fieldData" />