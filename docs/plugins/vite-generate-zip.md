# vite-generate-zip

Vite 构建完成后自动生成压缩包的插件，支持自定义压缩配置和文件管理。

## 功能特性

- 📦 **自动压缩** - 构建完成后自动将目标文件夹压缩成 ZIP 文件
- 🗂️ **灵活配置** - 支持自定义目标文件夹、压缩包名称等
- 🧹 **智能清理** - 可选择是否删除原始文件夹
- ⚡ **高性能** - 使用 archiver 库，支持高压缩比
- 🎯 **构建专用** - 仅在生产构建时执行，不影响开发体验

### 安装

```bash
npm install @develop-plugins/vite-generate-zip
# 或
yarn add @develop-plugins/vite-generate-zip
# 或
pnpm add @develop-plugins/vite-generate-zip
```

### 基本使用

在 `vite.config.js` 中配置插件：

```javascript
import { defineConfig } from "vite";
import viteGenerateZip from "@develop-plugins/vite-generate-zip";

export default defineConfig({
  plugins: [viteGenerateZip()],
});
```

构建完成后，会在项目根目录生成 `dist.zip` 压缩包。

<script setup>
// BaseTable 列与数据
const configColumns = [
  { title: '参数', key: 'param' },
  { title: '说明', key: 'desc' },
  { title: '类型', key: 'type' },
  { title: '默认值', key: 'default' },
]
const configData = [
  { param: 'targetPath', desc: '构建生成的目标文件夹', type: 'string', default: "'dist'" },
  { param: 'filename', desc: '生成的压缩包名称（不含扩展名）', type: 'string', default: "'dist'" },
  { param: 'deleteSourceFiles', desc: '是否删除原始文件夹', type: 'boolean', default: 'true' },
]
</script>

### 使用示例

#### 默认配置

```javascript
import viteGenerateZip from "@develop-plugins/vite-generate-zip";

export default defineConfig({
  plugins: [viteGenerateZip()],
});
```

这将：

- 压缩 `dist` 文件夹
- 生成 `dist.zip` 文件
- 删除原始 `dist` 文件夹

#### 自定义压缩包名称

```javascript
import viteGenerateZip from "@develop-plugins/vite-generate-zip";

export default defineConfig({
  plugins: [
    viteGenerateZip({
      filename: "my-app-v1.0.0",
    }),
  ],
});
```

生成 `my-app-v1.0.0.zip` 压缩包。

#### 保留原始文件夹

```javascript
import viteGenerateZip from "@develop-plugins/vite-generate-zip";

export default defineConfig({
  plugins: [
    viteGenerateZip({
      deleteSourceFiles: false,
    }),
  ],
});
```

压缩完成后保留原始 `dist` 文件夹。

#### 自定义目标文件夹

```javascript
import viteGenerateZip from "@develop-plugins/vite-generate-zip";

export default defineConfig({
  build: {
    outDir: "build",
  },
  plugins: [
    viteGenerateZip({
      targetPath: "build",
      filename: "production-build",
    }),
  ],
});
```

压缩 `build` 文件夹，生成 `production-build.zip`。

#### 完整配置示例

```javascript
import viteGenerateZip from "@develop-plugins/vite-generate-zip";

export default defineConfig({
  plugins: [
    viteGenerateZip({
      targetPath: "dist",
      filename: "my-project-release",
      deleteSourceFiles: true,
    }),
  ],
});
```

### 使用场景

#### 1. 生产部署

```javascript
// 生产环境配置
export default defineConfig({
  plugins: [
    viteGenerateZip({
      filename: `app-${process.env.npm_package_version}`,
      deleteSourceFiles: true,
    }),
  ],
});
```

#### 2. 多环境构建

```javascript
// 根据环境生成不同名称的压缩包
const envSuffix = process.env.NODE_ENV === "production" ? "prod" : "dev";

export default defineConfig({
  plugins: [
    viteGenerateZip({
      filename: `my-app-${envSuffix}`,
      deleteSourceFiles: process.env.NODE_ENV === "production",
    }),
  ],
});
```

#### 3. CI/CD 集成

```javascript
// 在 CI/CD 中使用时间戳
const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");

export default defineConfig({
  plugins: [
    viteGenerateZip({
      filename: `build-${timestamp}`,
      deleteSourceFiles: true,
    }),
  ],
});
```

### 配置选项

<BaseTable :columns="configColumns" :data="configData" />
