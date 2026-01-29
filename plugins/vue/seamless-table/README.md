## SeamlessTable

一个支持无缝循环滚动的 Vue 3 表格组件，适用于大屏数据展示场景。内容超过容器高度时自动启动无缝滚动，鼠标悬停时暂停，移开后继续。

### 安装

```
 # npm
 npm i @develop-plugins/seamless-table

 # yarn
 yarn add @develop-plugins/seamless-table

 # pnpm
 pnpm add @develop-plugins/seamless-table
```

### 引用

```
import { SeamlessTableInstall } from '@develop-plugins/seamless-table';

app.use(SeamlessTableInstall);
```

### 示例

#### 示例1：基础使用

```vue
<template>
  <div style="height: 400px">
    <SeamlessTable :columns="columns" :data="tableData" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import SeamlessTable from "./SeamlessTable.vue";

const columns = ref([
  { key: "name", title: "姓名", align: "center", width: "150px" },
  { key: "age", title: "年龄", align: "center", width: "100px" },
  { key: "address", title: "地址", align: "left" },
]);

const tableData = ref([
  { name: "张三", age: 28, address: "北京市朝阳区" },
  { name: "李四", age: 35, address: "上海市浦东新区" },
  { name: "王五", age: 42, address: "深圳市南山区" },
]);
</script>
```

#### 示例2：自定义样式和滚动速度

```vue
<template>
  <div style="height: 500px">
    <SeamlessTable
      :columns="columns"
      :data="tableData"
      :speed="100"
      odd-background="#001a33"
      even-background="#003d66"
      hover-background="#0066cc"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import SeamlessTable from "./SeamlessTable.vue";

const columns = ref([
  { key: "name", title: "姓名", width: "150px" },
  { key: "value", title: "数值", width: "100px" },
]);

const tableData = ref([
  { name: "项目1", value: 5000 },
  { name: "项目2", value: 3200 },
  { name: "项目3", value: 8500 },
]);
</script>
```

#### 示例3：使用插槽自定义单元格内容

```vue
<template>
  <div style="height: 400px">
    <SeamlessTable :columns="columns" :data="tableData">
      <template #name="{ row, index }">
        <span style="color: #ffeb3b; font-weight: bold"> {{ index + 1 }}. {{ row.name }} </span>
      </template>

      <template #status="{ row }">
        <span
          :style="{
            color: row.status === '活跃' ? '#66bb6a' : '#ef5350',
            fontWeight: 'bold',
          }"
        >
          {{ row.status }}
        </span>
      </template>

      <template #empty>
        <div style="padding: 40px; text-align: center; color: #999;">
          <p>暂无数据</p>
        </div>
      </template>
    </SeamlessTable>
  </div>
</template>

<script setup>
import { ref } from "vue";
import SeamlessTable from "./SeamlessTable.vue";

const columns = ref([
  { key: "name", title: "姓名", width: "150px" },
  { key: "status", title: "状态", width: "100px" },
]);

const tableData = ref([
  { name: "用户1", status: "活跃" },
  { name: "用户2", status: "离线" },
]);
</script>
```

#### 示例4：处理行点击事件

```vue
<template>
  <div style="height: 400px">
    <SeamlessTable :columns="columns" :data="tableData" @row-click="handleRowClick" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import SeamlessTable from "./SeamlessTable.vue";

const columns = ref([
  { key: "id", title: "ID", width: "80px" },
  { key: "name", title: "姓名", width: "150px" },
  { key: "department", title: "部门", width: "150px" },
]);

const tableData = ref([
  { id: 1, name: "张三", department: "技术部" },
  { id: 2, name: "李四", department: "销售部" },
  { id: 3, name: "王五", department: "人力部" },
]);

const handleRowClick = (row, index) => {
  console.log(`点击了第 ${index + 1} 行:`, row);
};
</script>
```

### 属性

| 参数            | 说明                                               | 类型               | 可选值 | 默认值    |
| :-------------- | :------------------------------------------------- | :----------------- | :----- | :-------- |
| data            | 表格数据数组，每项代表一行                         | `Array`            | -      | -         |
| columns         | 列配置数组，每项包含 key、title、align、width 字段 | `Array`            | -      | -         |
| height          | 容器高度                                           | `Number \| String` | -      | `100%`    |
| speed           | 滚动速度，单位为像素/秒                            | `Number`           | -      | `60`      |
| oddBackground   | 奇数行背景色                                       | `String`           | -      | `#021736` |
| evenBackground  | 偶数行背景色                                       | `String`           | -      | `#042d4c` |
| hoverBackground | 行悬停时的背景色                                   | `String`           | -      | `#0a526e` |

**columns 字段说明：**

- `key` (必需) - 列字段名，对应 data 中的属性名
- `title` (必需) - 列标题显示文本
- `align` (可选) - 对齐方式，可选值：left、center、right，默认 left
- `width` (可选) - 列宽，支持 px、% 等单位

### 插槽

| 名称           | 说明                                                                 |
| :------------- | :------------------------------------------------------------------- |
| `#[columnKey]` | 按列的 key 值自定义单元格内容，作用域参数为 `{ row, index, column }` |
| `#empty`       | 表格数据为空时显示的内容                                             |

### 事件

| 事件名称  | 说明             | 回调参数                                          |
| :-------- | :--------------- | :------------------------------------------------ |
| row-click | 点击表格行时触发 | `(row, index)` - row 为行数据对象，index 为行索引 |
