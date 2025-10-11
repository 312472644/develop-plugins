# PDF-Preview

## 简介
PDF预览组件，支持在线预览PDF文件。

## 安装
```bash
npm install @develop-plugins/pdf-preview
```

## 引用

```javascript
import { PDFPreviewInstall } from '@develop-plugins/pdf-preview';
import '@develop-plugins/pdf-preview/style.css';

app.use(PDFPreviewInstall);
```

## 属性

| 参数       | 说明         | 类型     | 默认值 |
| ---------- | ------------ | -------- | ------ |
| fileUrl    | PDF文件地址  | 见下表    |        |
| showPageNumber | 是否显示页码 | `boolean` | `true` |
| showToolbar| 显示工具栏   | `boolean`| `true` |
| downloadFileName | 下载文件名 | `string` | 'document.pdf' |
| watermark | 水印设置     | `Object` | 见下表 |

#### Watermark 配置

| 参数       | 说明         | 类型     | 默认值               |
| ---------- | ------------ | -------- | -------------------- |
| enable     | 是否启用水印 | `boolean` | `false`              |
| text       | 水印文字     | `string` | '水印' |
| fontSize   | 字体大小     | `number` | 16                   |
| color      | 字体颜色     | `string` | 'rgba(0, 0, 0, 0.1)' |
| rotate     | 旋转角度     | `number` | -30                  |
| size       | 水印间距     | `number` | 250                  |


## 示例

1、属性`fileUrl`为`string`类型

```vue
<template>
  <PDFPreview :fileUrl="url"/>
</template>

<script setup>
import { ref } from 'vue';

// 在线地址或本地地址
const url = ref('/example.pdf');
// base64地址
const url = ref('data:application/pdf;base64,...');
</script>
```

2、属性`fileUrl`为`Uint8Array|Blob`类型

```vue
<template>
  <PDFPreview :fileUrl="base64FileURL"/>
</template>

<script setup>
import { ref } from 'vue';
    
const base64FileURL = ref('');

fetch('/api/file/')
  .then((res) => res.arrayBuffer())
  // .then((res) => res.blob())
  // .then((res) => res.bytes())
  .then((arrayBuffer) => {
    base64FileURL.value = arrayBuffer;
  })
  .catch((err) => {
    console.log(err);
  });
</script>
```

3、属性`fileUrl`为`Object`类型

```vue
<template>
  <PDFPreview :fileUrl="fileUrl"/>
</template>

<script setup>
import { ref } from 'vue';

const fileUrl = ref({
    url: '', // 请求地址
    data: '', // 渲染的数据，如果url和data都有值，以data数据为准
    httpHeaders: {}, // 发送请求头配置
    withCredentials: false // 是否发送认证信息
});
</script>
```

## 事件

| 事件名称 | 说明 | 回调参数 |
|---------|------|---------|
| load-success | PDF加载成功时触发 | - |
| load-error | PDF加载失败时触发 | error: 错误信息 |