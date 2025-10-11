## OrgChart

### 描述

组织图可视化分层组织数据。

### 安装

```
 # npm
 npm i @develop-plugins/org-chart
 
 # yarn
 yarn add @develop-plugins/org-chart
 
 # pnpm
 pnpm add @develop-plugins/org-char
```

### 引用

```javascript
import { OrgChartInstall } from '@develop-plugins/org-chart';
import '@develop-plugins/org-chart/style.css';

app.use(OrgChartInstall);
```

### 示例

```vue
<template>
  <OrgChart :data="data" @cell-click="handleCellClick"></OrgChart>
</template>
<script setup>
import { ref } from 'vue';

const data = ref({
  label: '科技有限公司',
  children: [
    {
      label: '产品研发部',
      children: [
        {
          label: '研发-前端',
          children: [{ label: '前端-1' }, { label: '前端-2' }],
        },
        { label: '研发-后端' },
        { label: 'UI设计' },
        { label: '产品经理' },
      ],
    },
    {
      label: '销售部',
      children: [
        { label: '销售-1', children: [{ label: '销售-1-1' }, { label: '销售-1-2' }] },
        { label: '销售-2' },
        { label: '销售-3' },
        { label: '销售-4' },
      ],
    },
    {
      label: '财务部',
      children: [
        { label: '财务-1' },
        { label: '财务-2' },
        { label: '财务-3' },
        { label: '财务-4' },
      ],
    },
    {
      label: 'HR人事',
    },
  ],
});
</script>
```

### 属性

| 参数        | 说明                             | 类型      | 可选值                      | 默认值     |
| ----------- | -------------------------------- | --------- | --------------------------- | ---------- |
| data        | 数据源                           | `object`  | —                           |            |
| collapsible | 是否可折叠                       | `boolean` | —                           | `false`    |
| direction   | 显示方向，分为垂直或水平两个方向 | `string`  | `'vertical' | 'horizontal'` | `vertical` |

### 插槽

| 名称  | 说明                        |
| ----- | --------------------------- |
| —     | 默认插槽                    |
| label | 显示内容,参数为当前节点数据 |

### 事件

| 事件名称   | 说明           | 回调参数         |
| ---------- | -------------- | ---------------- |
| cell-click | 点击节点时触发 | 当前点击节点数据 |
| expand     | 折叠节点时触发 | 当前点击节点数据 |

