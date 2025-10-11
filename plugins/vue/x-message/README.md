## XMessage

### 描述

一个轻量级的消息提示组件，支持不同类型和大小的消息展示。

### 安装

```
 # npm
 npm i @develop-plugins/x-message
 
 # yarn
 yarn add @develop-plugins/x-message
 
 # pnpm
 pnpm add @develop-plugins/x-message
```

### 引用

```javascript
import Message from '@develop-plugins/x-message';
import '@develop-plugins/x-message/style.css';

const app = createApp(App);
app.config.globalProperties.XMessage = XMessage;
```

### 示例

```vue
<template>
	<button @click="showMessage">显示消息</button>
	<button @click="closeLoading">关闭Loading</button>
	<button @click="closeMessage">关闭所有消息</button>
</template>
<script setup>
import { getCurrentInstance } from 'vue';
    
const { appContext } = getCurrentInstance();
const { XMessage } = appContext.config.globalProperties;
    
let message = null;

function showMessage() {
  XMessage({
    message: '加载成功',
    onClose() {
      console.log('关闭');
    }
  });
  XMessage({
    message: '加载失败',
    type: 'error'
  });
  XMessage({
    message: '加载信息',
    type: 'info',
    duration: 2000
  });
  message = XMessage({
    message: '加载中...',
    type: 'loading'
  });
}

function closeMessage() {
    XMessage.closeAll();
}
    
function closeLoading() {
    message.close();
}
</script>
```

### Message 配置项属性

| 参数     | 说明               | 类型       | 可选值                             | 默认值  |
| -------- | ------------------ | ---------- | ---------------------------------- | ------- |
| message  | 消息文本           | `string`   |                                    |         |
| type     | 消息类型           | `string`   | success/warning/error/info/loading | `info`  |
| size     | 消息大小           | `string`   | small/medium/large                 | `small` |
| duration | 显示时间，单位毫秒 | `number`   |                                    | `3000`  |
| onClose  | 关闭时触发回调     | `Function` |                                    |         |

### Message 方法

调用 `Message` 会返回当前 Message 的实例。 如果需要手动关闭实例，可以调用它的 `close` 方法。

| 方法名称 | 说明               | 回调参数 |
| -------- | ------------------ | -------- |
| close    | 关闭当前的 Message | -        |
| closeAll | 关闭所有 Message   | -        |