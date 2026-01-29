---
name: component-doc
description: 读取相应的组件代码，根据代码生成组件使用文档，并在组件目录中创建相应的 README.md 文件。当用户询问需要生成组件使用文档时，可以使用此技能。
---

## 功能说明

该技能用于生成组件的使用文档，帮助用户了解如何安装和使用特定的组件。

## 使用场景

- 用户问：“根据该组件代码，生成使用文档？”

## 文档输出目录

- 组件名称
- 安装
- 示例
- 引用
- 属性
- 插槽（可选）
- 事件（可选）

> 输出内容不需要包含最上面的元数据(name与description)。

## 组件名称

组件描述。

### 安装

```bash
 # npm
 npm i @develop-plugins/pdf-export

 # yarn
 yarn add @develop-plugins/pdf-export

 # pnpm
 pnpm add @develop-plugins/pdf-export
```

### 引用

```js
import { OrgChartInstall } from "@develop-plugins/org-chart";

app.use(OrgChartInstall);
```

### 示例

##### 示例1

```vue

```

### 属性

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| :--- | :--- | :--- | :----- | :----- |
|      |      |      |        |        |

### 插槽

| 名称 | 说明 |
| :--- | :--- |
|      |      |

### 事件

| 事件名称 | 说明 | 回调参数 |
| :------- | :--- | :------- |
|          |      |          |
