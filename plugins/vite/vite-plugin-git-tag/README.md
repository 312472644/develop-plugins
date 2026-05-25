# vite-plugin-git-tag

一个 Vite 插件，用于在构建过程中自动创建 Git Tag 标签。

## 功能特性

- 🎯 **自动创建 Tag**：在 Vite 构建完成后自动触发 Tag 创建流程
- 🔄 **交互式操作**：支持选择分支、提交记录，输入 Tag 名称和说明
- 📤 **自动同步**：创建成功后自动同步到远程仓库
- ⚡ **智能检测**：自动检测 Tag 是否已存在，避免重复创建

## 安装

```bash
npm install @develop-plugins/vite-plugin-git-tag --save-dev

# 或使用 pnpm
pnpm add @develop-plugins/vite-plugin-git-tag -D
```

## 使用方法

### 基础使用

在 `vite.config.js` 中配置插件：

```js
import { defineConfig } from "vite";
import vitePluginGitTag from "@develop-plugins/vite-plugin-git-tag";

export default defineConfig({
  plugins: [vitePluginGitTag()],
});
```

### 自定义配置

```js
import { defineConfig } from "vite";
import vitePluginGitTag from "@develop-plugins/vite-plugin-git-tag";

export default defineConfig({
  plugins: [
    vitePluginGitTag({
      isCreatedTag: true, // 是否创建 Tag
      commitCount: 10, // 显示的提交记录数量
      isSyncTag: true, // 是否同步到远程仓库
    }),
  ],
});
```

## 配置选项

| 选项           | 类型      | 默认值 | 说明                         |
| -------------- | --------- | ------ | ---------------------------- |
| `isCreatedTag` | `boolean` | `true` | 是否在构建后创建 Tag         |
| `commitCount`  | `number`  | `10`   | 显示的提交记录数量           |
| `isSyncTag`    | `boolean` | `true` | 创建成功后是否同步到远程仓库 |

## 工作流程

1. **构建完成**：Vite 构建结束后自动触发插件
2. **选择分支**：从本地分支列表中选择目标分支
3. **选择提交**：从指定分支的最近提交记录中选择目标提交
4. **输入信息**：输入 Tag 名称（默认当前日期）和说明信息
5. **创建验证**：检查 Tag 是否已存在，若存在则重新输入
6. **创建推送**：创建本地 Tag 并推送到远程仓库
7. **同步更新**：从远程仓库同步 Tag 列表到本地

## 使用示例

### 示例 1：禁用自动创建

```js
vitePluginGitTag({
  isCreatedTag: false, // 禁用自动创建 Tag
});
```

### 示例 2：自定义提交记录数量

```js
vitePluginGitTag({
  commitCount: 20, // 显示最近 20 条提交记录
});
```

### 示例 3：禁用远程同步

```js
vitePluginGitTag({
  isSyncTag: false, // 仅创建本地 Tag，不推送到远程
});
```
