## WaterMark

### 描述

给页面的某个区域加上水印。

### 安装

```
 # npm
 npm i @develop-plugins/water-mark
 
 # yarn
 yarn add @develop-plugins/water-mark
 
 # pnpm
 pnpm add @develop-plugins/water-mark
```

### 引用

```javascript
import { WaterMarkInstall } from '@develop-plugins/water-mark';

app.use(WaterMarkInstall);
```

### 示例

```vue
<template>
  <WaterMark text="hello world">
    <div style="width: 100%; height: 100vh"></div>
  </WaterMark>
</template>
```

### 属性

| 参数   | 说明                                           | 类型               | 可选值 | 默认值      |
| ------ | ---------------------------------------------- | ------------------ | ------ | ----------- |
| width  | 水印的宽度，`content` 的默认值为自身的宽度     | `number`           |        | -           |
| height | 水印的高度，`content` 的默认值为自身的高度     | `number`           |        | -           |
| text   | 水印文字内容,如果设置了`image`则不会显示`text` | string \| string[] |        | `watermark` |
| rotate | 水印绘制时，旋转的角度，单位 `°`               | `number`           |        | `-20`       |
| gap    | 水印之间的间距                                 | `number`           |        | `100`       |
| zIndex | 追加的水印元素的 z-index                       | `number`           |        | `9999`      |
| font   | 文字样式                                       | `Font`             |        | `Font`      |
| image  | 图片源，建议导出 2 倍或 3 倍图，优先级高,      |                    |        |             |

#### Font

| 参数       | 说明         | 类型     | 可选值                                  | 默认值               |
| ---------- | ------------ | -------- | --------------------------------------- | -------------------- |
| fontSize   | 字体大小     | `number` |                                         | 16                   |
| fontFamily | 字体类型     | `string` |                                         | `serif`              |
| color      | 字体颜色     | `string` |                                         | `rgba(0, 0, 0, 0.3)` |
| textAlign  | 字体对齐方式 | `string` | left \| center \| right \| start \| end | `center`             |

### 插槽

| 名称 | 说明     |
| ---- | -------- |
| —    | 默认插槽 |

