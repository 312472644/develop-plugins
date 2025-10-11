# Excel Preview 组件

一个基于 Vue3 的 Excel 预览和编辑组件，支持导入导出 Excel 文件，以及在线编辑表格数据。

## 特性

- 支持导入导出 Excel 文件
- 支持在线编辑表格数据
- 支持多 Sheet 页切换
- 支持单元格合并
- 支持行列拖拽调整大小
- 支持右键菜单操作
- 支持表头下拉菜单

## 安装

```bash
npm install @develop-plugins/excel-preview
```
## 引用

```javascript
import { XExcelPreviewInstall } from '@develop-plugins/excel-preview';
import '@develop-plugins/excel-preview/style.css';

app.use(XExcelPreviewInstall);
```

## 使用

```vue
<template>
  <ExcelPreview
    :data="excelData"
    :read-only="false"
    :show-toolbar="true"
    @export="handleExport"
    @save="handleSave"
  />
</template>

<script setup>
import { ExcelPreview } from '@develop-plugins/excel-preview';
import '@develop-plugins/excel-preview/style.css';

const excelData = ref(null);

// 处理导出事件
const handleExport = () => {
  console.log('导出成功');
};

// 处理保存事件
const handleSave = (data) => {
  console.log('保存数据', data);
};
</script>
```

## 属性

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 表格数据，支持 Excel 文件（ArrayBuffer、Uint8Array）或表格数据（Array） | Array \| ArrayBuffer \| Uint8Array \| Blob | {} |
| dropdownMenu | 是否显示表头下拉菜单 | Boolean \| Array \| Object | true |
| contextMenu | 是否显示右键菜单 | Boolean \| Array \| Object | true |
| readOnly | 是否只读 | Boolean | false |
| rowHeaders | 是否显示行标题 | Boolean | true |
| colHeaders | 是否显示列标题 | Boolean | true |
| manualRowResize | 是否允许手动调整行高 | Boolean | true |
| manualColumnResize | 是否允许手动调整列宽 | Boolean | true |
| width | 表格宽度 | String \| Number | '100%' |
| height | 表格高度 | String \| Number | '400px' |
| colWidths | 列宽度 | Number \| Array \| Function | 100 |
| minSpareRows | 导入 Excel 时保留的最小行数 | Number | 0 |
| minSpareCols | 导入 Excel 时保留的最小列数 | Number | 0 |
| downloadFileName | 导出文件名 | String | 'export.xlsx' |
| showToolbar | 是否显示工具栏 | Boolean | true |

## 事件

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| export | 导出 Excel 文件成功时触发 | - |
| save | 保存数据时触发 | (data: Array) 当前表格数据 |

## 注意事项

1. 导入 Excel 文件时，支持的格式为 `.xlsx`。
2. 在只读模式下，所有编辑功能将被禁用。
3. 使用时需要同时引入组件的样式文件。