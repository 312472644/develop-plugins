## Directive

### 描述

提供一些常用的`vue`指令。

### 安装

```
 # npm
 npm i @develop-plugins/directive
 
 # yarn
 yarn add @develop-plugins/directive
 
 # pnpm
 pnpm add @develop-plugins/directive
```

### 引用

```javascript
import directive from '@develop-plugins/directive';
app.use(directive);
```

#### v-debounce
防抖指令。

```vue
<template>
    <button v-debounce="handleClick">测试</button>
    <button v-debounce:1000="handleClick">测试(1000ms)</button>
</template>
```

参数说明

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `value` | 点击处理函数 | `Function` | `-` |
| `arg` | 等待时间（ms），如 `v-debounce:1000` | `Number` | `500` |


#### v-copy
复制指令。
    
```vue
<template>
    <!-- 字符串用法 -->
    <button v-copy="复制信息">测试</button>

    <!-- 带复制成功回调 -->
    <button v-copy="{ value: 复制信息, onSuccess: (text) => console.log('copied:', text) }">测试回调</button>
</template>
```

参数说明

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `value` | 复制内容（字符串或对象） | `String \| Object` | `-` |
| `value.value` | 当传对象时的复制文本 | `String` | `-` |
| `value.onSuccess` | 复制成功回调，入参为复制文本 | `Function` | `-` |


#### v-draggable
可拖拽指令。
```vue
<template>
    <div v-draggable>拖拽</div>
</template>
```

参数说明

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `container` | 拖拽限制容器：CSS 选择器、`'parent'` 或 `HTMLElement` | `String \| HTMLElement` | `document.body` |


#### v-ob-resize
观察DOM元素大小变化指令。
```vue
<template>
    <div v-ob-resize="handleResize">观察属性大小变化</div>
</template>
<script lang="ts" setup>
    function handleResize(rect) {
        // 返回的dom getBoundingClientRect()位置信息
        console.log('rect', rect);
    }
</script>
```

参数说明

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `value` | 尺寸变化回调，入参为 `getBoundingClientRect()` 结果 | `Function` | `-` |

### v-scroll
v-scroll 指令允许您在窗口、指定目标或元素本身( 使用.self 修饰符)滚动时提供回调。

```vue
<template>
    <div v-scroll>观察属性大小变化</div>
</template>
```

参数说明

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `value` | 滚动回调函数 | `Function` | `-` |
| `.self` | 修饰符：绑定到元素自身而不是窗口 | `Boolean(Modifier)` | `false` |

### v-slide
v-slide 指令提供了一个进入视口时的滑入动画，可配置方向、距离、时长和缓动。

参数配置说明

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `direction` | 滑动方向 | `'left' \| 'right' \| 'up'` | `'up'` |
| `offset` | 滑动距离（px） | `Number` | `100` |
| `duration` | 动画时长（ms） | `Number` | `1000` |
| `easing` | 动画缓动函数 | `String` | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| `repeat` | 是否重复播放（再次进入视口重播） | `Boolean` | `false` |

使用示例：
```vue
<template>
  <div style="display: grid; gap: 12px;">
    <div v-slide="{ direction: 'up', offset: 100, duration: 1000 }">上滑进入</div>
    <div v-slide="{ direction: 'left', offset: 120, duration: 800 }">左滑进入</div>
    <div v-slide="{ direction: 'right', offset: 120, duration: 800, repeat: true }">右滑进入（重复播放）</div>
  </div>
</template>
```

### v-line-clamp
多行文本省略，默认超过 2 行显示省略号。

```vue
<template>
  <p style="width: 240px;" v-line-clamp>
    这是一个很长的段落文本，用于演示多行省略效果。默认两行后出现省略号。
  </p>
  <p style="width: 240px;" v-line-clamp:3>
    这是一个很长的段落文本，用于演示 3 行省略效果（通过 arg 指定）。
  </p>
  <p style="width: 240px;" v-line-clamp="{ lines: 4 }">
    这是一个很长的段落文本，用于演示 4 行省略效果（通过对象指定）。
  </p>
  <p style="width: 240px; white-space: normal;">
    注意：指令内部使用 -webkit-line-clamp 实现，需在支持该属性的现代浏览器中使用。
  </p>
  <!-- 提示：指令会设置 display:-webkit-box, -webkit-box-orient:vertical, overflow:hidden -->
</template>
```

参数说明

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `value` | 行数或配置对象 | `Number \| Object` | `-` |
| `value.lines` | 当传对象时的行数 | `Number` | `2` |
| `arg` | 行数（如 `v-line-clamp:3`） | `Number` | `2` |

### v-is-visible
元素可见性观察指令：当目标元素与根容器发生交叉（进入可视区域）时触发回调，传入 `true`；离开可视区域时传入 `false`。

基本用法（以窗口为根）：

```vue
<template>
  <div v-is-visible="onVisibleChange">观察目标</div>
</template>
<script setup>
const visible = ref(false)
const onVisibleChange = (v) => { visible.value = v }
</script>
```

对象用法（指定 root 和配置项）：

```vue
<template>
  <div ref="scrollRoot" style="height: 200px; overflow: auto;">
    <div style="height: 500px; padding-top: 280px;">
      <div v-is-visible="{ callback: onVisibleChange, options: { root: scrollRoot, threshold: [0, 0.5, 1], rootMargin: '0px' } }">
        容器根下的观察目标
      </div>
    </div>
  </div>
</template>
<script setup>
const scrollRoot = ref(null)
const visible = ref(false)
const onVisibleChange = (v) => { visible.value = v }
</script>
```

参数说明

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `value` | 观察回调或对象配置 | `Function \| Object` | `-` |
| `value.callback` | 目标可见性变化回调，入参为 `Boolean` | `Function` | `-` |
| `value.options.root` | 观察根元素，`null` 表示窗口 | `HTMLElement \| null` | `null` |
| `value.options.rootMargin` | 根元素的外边距偏移 | `String` | `'0px'` |
| `value.options.threshold` | 交叉阈值（比例或数组） | `Number \| Number[]` | `0` |

注意事项
- 初始是否可见取决于布局与 `root` 设置；若需初始不可见，请确保目标不在根容器可视区内（例如增加顶部间距）。
- 当以容器为根时，请通过 `ref` 传递容器元素作为 `options.root`。
- 若希望“至少 50% 可见才判定为可见”，可将 `threshold` 设为 `0.5` 或数组 `[0, 0.5, 1]`。