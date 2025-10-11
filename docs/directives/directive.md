---
title: 指令集合 Directive
---

<script setup>
import { ref } from 'vue'

// v-debounce 防抖指令相关
const count = ref(0)
const handleClick = () => {
  count.value++
}

const debounceCode = `<template>
  <div>
    <p>点击次数: {{ count }}</p>
    <button v-debounce="handleClick">防抖按钮 (500ms)</button>
    <button v-debounce:1000="handleClick">防抖按钮 (1000ms)</button>
    <button @click="handleClick">普通按钮</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)
const handleClick = () => {
  count.value++
}
<\/script>`

// v-copy 复制指令相关
const copyText = '这是要复制的文本内容'
const copied = ref('')
const handleCopySuccess = (text) => {
  copied.value = text
}

const copyCode = `<template>
  <div>
    <button v-copy="copyText">复制文本</button>
    <button v-copy="{ value: copyText, onSuccess: handleCopySuccess }">复制并回调</button>
    <p>要复制的内容: {{ copyText }}</p>
    <p>复制结果: {{ copied }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const copyText = '这是要复制的文本内容'
const copied = ref('')
const handleCopySuccess = (text) => {
  copied.value = text
}
<\/script>`

// v-draggable 拖拽指令相关
const draggableCode = `<template>
  <div style="position: relative; height: 300px; border: 1px solid #eee; background: #f9f9f9;">
    <div v-draggable>
      拖拽我
    </div>
  </div>
</template>`

// v-draggable 容器限制示例：使用 parent 作为容器
const draggableContainerCode = `<template>
  <div style="position: relative; height: 240px; border: 1px dashed #bbb; background: #fafafa; padding: 8px;">
    <div v-draggable="{ container: 'parent' }">
      仅在父容器拖动
    </div>
  </div>
</template>`

// v-draggable 容器限制示例：使用选择器作为容器
const draggableSelectorCode = `<template>
  <div id="drag-container" style="position: relative; height: 240px; border: 1px dashed #bbb; background: #fafafa; padding: 8px;">
    <div v-draggable="{ container: '#drag-container' }">
      仅在指定容器拖动
    </div>
  </div>
</template>`

// v-ob-resize 尺寸监听指令相关
const resizeInfo = ref({ width: 0, height: 0 })
const handleResize = (entries) => {
  resizeInfo.value = { width: Math.round(entries.width), height: Math.round(entries.height) }
}

const resizeCode = `<template>
  <div>
    <div v-ob-resize="handleResize" style="resize: both; overflow: auto; border: 2px solid #409eff; padding: 20px; min-width: 200px; min-height: 100px;">
      <p>拖拽右下角调整大小</p>
      <p>宽度: {{ resizeInfo.width }}px</p>
      <p>高度: {{ resizeInfo.height }}px</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const resizeInfo = ref({ width: 0, height: 0 })
const handleResize = (entries) => {
  resizeInfo.value = { width: Math.round(entries.width), height: Math.round(entries.height) }
}
<\/script>`

// v-scroll 滚动指令相关
const scrollInfo = ref({ scrollTop: 0, scrollLeft: 0 })
const handleScroll = (e) => {
  scrollInfo.value = {
    scrollTop: Math.round(e.target.scrollTop),
    scrollLeft: Math.round(e.target.scrollLeft)
  }
}

const scrollCode = `<template>
  <div>
    <div v-scroll="handleScroll" style="height: 200px; width: 300px; overflow: auto; border: 1px solid #eee; padding: 10px;">
      <div style="height: 500px; width: 600px; background: linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%); background-size: 20px 20px;">
        <p>滚动查看效果</p>
        <p>ScrollTop: {{ scrollInfo.scrollTop }}</p>
        <p>ScrollLeft: {{ scrollInfo.scrollLeft }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const scrollInfo = ref({ scrollTop: 0, scrollLeft: 0 })
const handleScroll = (e) => {
  scrollInfo.value = {
    scrollTop: Math.round(e.target.scrollTop),
    scrollLeft: Math.round(e.target.scrollLeft)
  }
}
<\/script>`

// v-slide 滑动指令相关：元素进入视口时的滑入动画
const slideRepeat = ref(false)
const slideUpCode = `<template>
  <div>
    <div v-slide="{ direction: 'up', offset: 100, duration: 1000 }">
      上滑进入的卡片
    </div>
  </div>
</template>`

const slideLeftCode = `<template>
  <div>
    <div v-slide="{ direction: 'left', offset: 120, duration: 800 }">
      向左滑入的卡片
    </div>
  </div>
</template>`

const slideRightCode = `<template>
  <div>
    <div v-slide="{ direction: 'right', offset: 120, duration: 800 }">
      向右滑入的卡片
    </div>
  </div>
</template>`

// BaseTable 列与数据：v-slide 配置
const slideColumns = [
  { title: '参数', key: 'prop' },
  { title: '说明', key: 'desc' },
  { title: '类型', key: 'type' },
  { title: '默认值', key: 'default' },
]
const slideData = [
  { prop: 'direction', desc: '滑动方向', type: "'left' | 'right' | 'up'", default: "'up'" },
  { prop: 'offset', desc: '滑动距离（px）', type: 'Number', default: '100' },
  { prop: 'duration', desc: '动画时长（ms）', type: 'Number', default: '1000' },
  { prop: 'easing', desc: '动画缓动函数', type: 'String', default: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
  { prop: 'repeat', desc: '是否重复播放（再次进入视口重播）', type: 'Boolean', default: 'false' },
]

// BaseTable 列与数据：v-draggable 配置
const draggableColumns = [
  { title: '参数', key: 'prop' },
  { title: '说明', key: 'desc' },
  { title: '类型', key: 'type' },
  { title: '默认值', key: 'default' },
]
const draggableData = [
  { prop: 'container', desc: '拖拽限制容器，支持选择器/HTMLElement/"parent"', type: 'String | HTMLElement', default: 'document.body' },
]

// BaseTable 列与数据：v-scroll 配置
const scrollColumns = [
  { title: '参数', key: 'prop' },
  { title: '说明', key: 'desc' },
  { title: '类型', key: 'type' },
  { title: '默认值', key: 'default' },
]
const scrollData = [
  { prop: 'handler', desc: '滚动时的回调函数', type: 'Function', default: '-' },
  { prop: 'self', desc: '使用 .self 修饰符绑定到元素自身', type: 'Boolean (Modifier)', default: 'false' },
]

// v-line-clamp 文本省略指令相关
const clampCode = `<template>
  <div style="display: grid; gap: 12px;">
    <p style="width: 280px;">默认两行：<span style="font-weight: normal;" v-line-clamp>这是一个很长的段落文本，用于演示多行省略效果。默认两行后出现省略号。换行测试，换行测试，换行测试，换行测试。</span></p>
    <p style="width: 280px;">通过 arg 指定 3 行：<span style="font-weight: normal;" v-line-clamp:3>这是一个很长的段落文本，用于演示 3 行省略效果（通过 arg 指定）。换行测试，换行测试，换行测试，换行测试。</span></p>
    <p style="width: 280px;">对象配置 4 行：<span style="font-weight: normal;" v-line-clamp="{ lines: 4 }">这是一个很长的段落文本，用于演示 4 行省略效果（通过对象指定）。换行测试，换行测试，换行测试，换行测试。</span></p>
  </div>
</template>`

const clampColumns = [
  { title: '参数', key: 'prop' },
  { title: '说明', key: 'desc' },
  { title: '类型', key: 'type' },
  { title: '默认值', key: 'default' },
]
const clampData = [
  { prop: 'value', desc: '行数或配置对象', type: 'Number | Object', default: '-' },
  { prop: 'value.lines', desc: '当传对象时的行数', type: 'Number', default: '2' },
  { prop: 'arg', desc: '行数（如 v-line-clamp:3）', type: 'Number', default: '2' },
]

// BaseTable 列与数据：v-debounce 配置
const debounceColumns = [
  { title: '参数', key: 'prop' },
  { title: '说明', key: 'desc' },
  { title: '类型', key: 'type' },
  { title: '默认值', key: 'default' },
]
const debounceData = [
  { prop: 'value', desc: '点击处理函数', type: 'Function', default: '-' },
  { prop: 'arg', desc: '等待时间（ms），如 v-debounce:1000', type: 'Number', default: '500' },
]

// BaseTable 列与数据：v-copy 配置
const copyColumns = [
  { title: '参数', key: 'prop' },
  { title: '说明', key: 'desc' },
  { title: '类型', key: 'type' },
  { title: '默认值', key: 'default' },
]
const copyData = [
  { prop: 'value', desc: '复制内容（字符串或对象）', type: 'String | Object', default: '-' },
  { prop: 'value.value', desc: '当传对象时的复制文本', type: 'String', default: '-' },
  { prop: 'value.onSuccess', desc: '复制成功回调，入参为复制文本', type: 'Function', default: '-' },
]

// v-is-visible 可见性指令相关
const visible = ref(false)
const visibleHalf = ref(false)
const onVisibleChange = (v) => { visible.value = v }
const onVisibleHalfChange = (v) => { visibleHalf.value = v }
const visibleRoot = ref(null)
const visibleWindowRoot = ref(null)

const isVisibleCode = `<template>
  <div style="display: grid; gap: 16px;">
    <div style="display:flex; gap: 12px; align-items:center; color:#666;">
      <span>容器一：</span>
      <n-tag :type="visible ? 'success' : 'error'">{{ visible ? '可见' : '不可见' }}</n-tag>
      <span>容器二(阈值0.5)：</span>
      <n-tag :type="visibleHalf ? 'success' : 'error'">{{ visibleHalf ? '可见' : '不可见' }}</n-tag>
    </div>

    <!-- 容器一：指定 root 为容器，初始不可见 -->
    <div ref="visibleWindowRoot" style="height: 200px; overflow: auto; border: 1px solid #eee; padding: 12px;">
      <div style="height: 500px; padding-top: 280px;">
        <div v-is-visible="{ callback: onVisibleChange, options: { root: visibleWindowRoot, threshold: 0 } }" style="height: 80px; background: #f5f7ff; border: 1px dashed #9aa4ff; display: flex; align-items: center; justify-content: center;">
          我是目标元素（容器一）
        </div>
      </div>
    </div>

    <!-- 容器二：指定 root 为容器，并配置阈值为 0.5，初始不可见 -->
    <div ref="visibleRoot" style="height: 200px; overflow: auto; border: 1px solid #eee; padding: 12px;">
      <div style="height: 500px; padding-top: 280px;">
        <div v-is-visible="{ callback: onVisibleHalfChange, options: { root: visibleRoot, threshold: [0, 0.5, 1], rootMargin: '0px' } }" style="height: 80px; background: #e6fffb; border: 1px dashed #5ad4c1; display: flex; align-items: center; justify-content: center;">
          我是目标元素（容器二）
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const visibleWindowRoot = ref(null)
const visibleRoot = ref(null)
const visible = ref(false)
const visibleHalf = ref(false)
const onVisibleChange = (v) => { visible.value = v }
const onVisibleHalfChange = (v) => { visibleHalf.value = v }
<\/script>`

const isVisibleColumns = [
  { title: '参数', key: 'prop' },
  { title: '说明', key: 'desc' },
  { title: '类型', key: 'type' },
  { title: '默认值', key: 'default' },
]
const isVisibleData = [
  { prop: 'value', desc: '函数或对象配置', type: 'Function | Object', default: '-' },
  { prop: 'value.callback', desc: '可见性变化回调：callback(intersecting:boolean)', type: 'Function', default: '-' },
  { prop: 'value.options', desc: 'IntersectionObserver 配置', type: 'IntersectionObserverInit', default: '{}' },
  { prop: 'value.options.root', desc: '根元素（视口元素）', type: 'Element | null', default: 'null' },
  { prop: 'value.options.rootMargin', desc: '根边距（CSS margin 字符串）', type: 'String', default: '"0px"' },
  { prop: 'value.options.threshold', desc: '阈值（触发比例）', type: 'Number | Number[]', default: '0' },
]
</script>

<style scoped>
.draggable-item {
  box-sizing: border-box;
  width: 100px;
  height: 60px;
  padding: 8px 12px;
  font-size: 13px;
  line-height: 1.5;
  color: #fff;
  background: #18a058;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: move;
  border-radius: 6px;
  user-select: none;
  touch-action: none;
  will-change: transform;
  -webkit-tap-highlight-color: transparent;
}
.scroll-content {
  height: 500px; 
  width: 1000%;
  background: linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%); background-size: 20px 20px; 
  padding: 20px;
}
</style>

# 指令集合 Directive

实用的 Vue 3 指令集合，提供防抖、复制、拖拽、尺寸监听、滚动和滑动等功能。

### 安装

```bash
npm install @develop-plugins/directive
```

### 使用方法

```javascript
import { createApp } from "vue";
import directive from "@develop-plugins/directive";

const app = createApp({});
app.use(directive);
```

### v-debounce 防抖指令

为点击事件添加防抖功能，避免频繁触发。支持通过数值参数配置等待时间，例如 `v-debounce:1000`。

<CodeCard :code="debounceCode">
  <template #demo>
    <n-space vertical>
      <p>点击次数: {{ count }}</p>
      <n-space>
        <n-button v-debounce="handleClick" type="primary">
          防抖按钮 (500ms)
        </n-button>
        <n-button v-debounce:1000="handleClick" type="warning">
          防抖按钮 (1000ms)
        </n-button>
        <n-button @click="handleClick" type="success">
          普通按钮
        </n-button>
      </n-space>
    </n-space>
  </template>
</CodeCard>

#### 配置选项

<BaseTable :columns="debounceColumns" :data="debounceData" />

### v-copy 复制指令

点击元素时复制指定内容到剪贴板。

<CodeCard :code="copyCode">
  <template #demo>
    <n-space vertical>
      <n-button v-copy="copyText">
        复制文本
      </n-button>
      <n-button v-copy="{ value: copyText, onSuccess: handleCopySuccess }" type="success">
        复制并回调
      </n-button>
      <p>要复制的内容: {{ copyText }}</p>
      <p>复制结果: {{ copied }}</p>
    </n-space>
  </template>
</CodeCard>

#### 配置选项

<BaseTable :columns="copyColumns" :data="copyData" />

### v-draggable 拖拽指令

使元素可以拖拽移动。

<CodeCard :code="draggableCode">
  <template #demo>
    <div v-draggable class="draggable-item">
        拖拽我
    </div>
  </template>
</CodeCard>

#### 容器限制示例

当传入 `container` 参数后，拖拽将被限制在该容器内：

<CodeCard :code="draggableContainerCode">
  <template #demo>
    <div style="position: relative; height: 180px; border: 1px dashed #bbb; background: #fafafa; padding: 8px;">
      <div v-draggable="{ container: 'parent' }" class="draggable-item">
        仅在父容器拖动
      </div>
    </div>
  </template>
</CodeCard>

<CodeCard :code="draggableSelectorCode">
  <template #demo>
    <div id="drag-container-demo" style="height: 180px; border: 1px dashed #bbb; background: #fafafa; padding: 8px;">
      <div v-draggable="{ container: '#drag-container-demo' }" class="draggable-item">
        仅在指定容器拖动
      </div>
    </div>
  </template>
</CodeCard>

#### 配置选项

<BaseTable :columns="draggableColumns" :data="draggableData" />

### v-ob-resize 尺寸监听指令

监听 DOM 元素尺寸变化。

<CodeCard :code="resizeCode">
  <template #demo>
    <n-card v-ob-resize="handleResize" style="resize: both; overflow: auto; min-width: 200px; min-height: 100px;">
      <n-space vertical>
        <div>拖拽右下角调整大小</div>
        <div>宽度: {{ resizeInfo.width }}px</div>
        <div>高度: {{ resizeInfo.height }}px</div>
      </n-space>
    </n-card>
  </template>
</CodeCard>

### v-scroll 滚动指令

监听元素滚动事件。

<CodeCard :code="scrollCode">
  <template #demo>
    <n-card v-scroll.self="handleScroll" style="height: 200px; width: 50%; overflow: auto;">
      <div class="scroll-content">
        <n-space vertical>
          <p>滚动查看效果</p>
          <p>ScrollTop: {{ scrollInfo.scrollTop }}</p>
          <p>ScrollLeft: {{ scrollInfo.scrollLeft }}</p>
        </n-space>
      </div>
    </n-card>
  </template>
</CodeCard>

#### 配置选项

<BaseTable :columns="scrollColumns" :data="scrollData" />

### v-is-visible 可见性指令

监听元素是否进入视口，并在变化时触发回调。支持传入 `IntersectionObserver` 的 `options` 配置项（`root`, `rootMargin`, `threshold`）。

<CodeCard :code="isVisibleCode">
  <template #demo>
    <n-space vertical>
      <div style="display:flex; gap: 12px; align-items:center; color:#666;">
        <span>容器一：</span>
        <n-tag :type="visible ? 'success' : 'error'">{{ visible ? '可见' : '不可见' }}</n-tag>
        <span>容器二(阈值0.5)：</span>
        <n-tag :type="visibleHalf ? 'success' : 'error'">{{ visibleHalf ? '可见' : '不可见' }}</n-tag>
      </div>
      <n-card style="padding: 0;">
        <div ref="visibleWindowRoot" style="height: 200px; overflow: auto; padding: 12px;">
          <div style="height: 500px; padding-top: 280px;">
            <div v-is-visible="{ callback: onVisibleChange, options: { root: visibleWindowRoot, threshold: 0 } }" style="height: 80px; background: #f5f7ff; border: 1px dashed #9aa4ff; display: flex; align-items: center; justify-content: center;">
              我是目标元素（容器一）
            </div>
          </div>
        </div>
      </n-card>
      <n-card style="padding: 0;">
        <div ref="visibleRoot" style="height: 200px; overflow: auto; padding: 12px;">
          <div style="height: 500px; padding-top: 280px;">
            <div v-is-visible="{ callback: onVisibleHalfChange, options: { root: visibleRoot, threshold: [0, 0.5, 1], rootMargin: '0px' } }" style="height: 80px; background: #e6fffb; border: 1px dashed #5ad4c1; display: flex; align-items: center; justify-content: center;">
              我是目标元素（容器二）
            </div>
          </div>
        </div>
      </n-card>
    </n-space>
  </template>
</CodeCard>

#### 配置选项

<BaseTable :columns="isVisibleColumns" :data="isVisibleData" />

### v-slide 滑动指令

元素进入视口时触发滑入动画，支持 up/left/right 三种方向。

<n-space align="center" style="margin: 8px 0;">
  <n-checkbox v-model:checked="slideRepeat">重复播放</n-checkbox>
  <span style="color:#888; font-size: 14px;">勾选后元素再次进入视口会重播动画</span>
</n-space>

<CodeCard :code="slideUpCode">
  <template #demo>
    <n-card v-slide="{ direction: 'up', offset: 100, duration: 1000, repeat: slideRepeat }" style="width: 300px; height: 200px; border: 2px dashed #409eff; display: flex; align-items: center; justify-content: center; user-select: none;">
      上滑进入的卡片
    </n-card>
  </template>
</CodeCard>

<CodeCard :code="slideLeftCode">
  <template #demo>
    <n-card v-slide="{ direction: 'left', offset: 120, duration: 800, repeat: slideRepeat }" style="width: 300px; height: 200px; border: 2px dashed #409eff; display: flex; align-items: center; justify-content: center; user-select: none;">
      向左滑入的卡片
    </n-card>
  </template>
</CodeCard>

<CodeCard :code="slideRightCode">
  <template #demo>
    <n-card v-slide="{ direction: 'right', offset: 120, duration: 800, repeat: slideRepeat }" style="width: 300px; height: 200px; border: 2px dashed #409eff; display: flex; align-items: center; justify-content: center; user-select: none;">
      向右滑入的卡片
    </n-card>
  </template>
</CodeCard>

#### 配置选项

<BaseTable :columns="slideColumns" :data="slideData" />

### v-line-clamp 文本省略

多行文本省略，默认超过两行显示省略号。若浏览器不支持 `-webkit-line-clamp`，内部会使用 JS 回退方案（通过 max-height 截断并在末尾叠加省略号），尽可能保证一致的视觉效果。

<CodeCard :code="clampCode">
  <template #demo>
    <div style="display: grid; gap: 12px;">
      <p style="width: 280px;">默认两行：<span style="font-weight: normal;" v-line-clamp>这是一个很长的段落文本，用于演示多行省略效果。默认两行后出现省略号。换行测试，换行测试，换行测试，换行测试。</span></p>
      <p style="width: 280px;">通过 arg 指定 3 行：<span style="font-weight: normal;" v-line-clamp:3>这是一个很长的段落文本，用于演示 3 行省略效果（通过 arg 指定）。换行测试，换行测试，换行测试，换行测试。</span></p>
      <p style="width: 280px;">对象配置 4 行：<span style="font-weight: normal;" v-line-clamp="{ lines: 4 }">这是一个很长的段落文本，用于演示 4 行省略效果（通过对象指定）。换行测试，换行测试，换行测试，换行测试。这是一个很长的段落文本，用于演示 4 行省略效果（通过对象指定）。换行测试，换行测试，换行测试，换行测试。</span></p>
    </div>
  </template>
</CodeCard>

#### 配置选项

<BaseTable :columns="clampColumns" :data="clampData" />
