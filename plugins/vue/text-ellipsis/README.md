## TextEllipsis

### 描述

文本自动省略号。

### 安装

```
 # npm
 npm i @develop-plugins/text-ellipsis
 
 # yarn
 yarn add @develop-plugins/text-ellipsis
 
 # pnpm
 pnpm add @develop-plugins/text-ellipsis
```

### 引用

```javascript
import { TextEllipsisInstall } from '@develop-plugins/text-ellipsis';

app.use(TextEllipsisInstall);
```

### 示例
```vue
<template>
    <text-ellipsis :content="text" :rows="1"></text-ellipsis>
</template>
<script setup>
    import { ref } from 'vue'
    const text = ref('超长数据测试')
</script>
```

### 插槽示例：自定义操作按钮

```vue
<template>
  <text-ellipsis :content="text" :rows="2">
    <!-- 自定义操作插槽：expanded 表示当前是否展开 -->
    <template #action="{ expanded }">
      <span style="color:#1890ff; cursor:pointer;">
        {{ expanded ? '收起内容' : '展开更多' }}
      </span>
    </template>
  </text-ellipsis>
</template>
<script setup>
import { ref } from 'vue'
const text = ref(
  '这是一段很长很长很长很长很长很长的文本内容，用于演示 TextEllipsis 组件的插槽用法。通过自定义 action 插槽，可以替换默认的“展开/收起”文本，实现更符合产品风格的交互。'
)
</script>
```

### 属性

| 参数         | 说明         | 类型     | 可选值 | 默认值 |
| ------------ | ------------ | -------- | ------ | ------ |
| content      | 文本         | `string` |        |        |
| collapseText | 收起文本     | `string` |        | 收起   |
| expandText   | 展开文本     | `string` |        | 展开   |
| rows         | 截取文本行数 | `number` |        | `1`    |
| dots         | 省略文本     | `string` |        | `...`  |

### 插槽

| 名称   | 说明       | 插槽                    |
| ------ | ---------- | ----------------------- |
| action | 自定义操作 | *{ expanded: boolean }* |


