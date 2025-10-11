<template>
  <transition name="dialog-fade" appear>
    <div v-if="visible" class="x-dialog">
      <transition name="dialog-zoom" appear>
        <div class="x-dialog-content" :style="contentStyle">
          <div class="x-dialog-header">
            <slot v-if="$slots.header" name="header">
              <h3>{{ title }}</h3>
            </slot>
            <div v-else>
              <h3>{{ title }}</h3>
            </div>
          </div>
          <div class="x-dialog-body">
            <slot></slot>
          </div>
          <div class="x-dialog-footer">
            <slot v-if="$slots.footer" name="footer"></slot>
            <div v-else>
              <button v-if="showClose" class="close-button" @click="handleClose">{{ closeText }}</button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  width: {
    type: [String, Number],
    default: '300px'
  },
  showClose: {
    type: Boolean,
    default: true
  },
  closeText: {
    type: String,
    default: '关闭'
  }
});

const emit = defineEmits(['update:visible', 'close']);

const contentStyle = {
  width: typeof props.width === 'number' ? `${props.width}px` : props.width
};

const handleClose = () => {
  const dialog = document.querySelector('.x-dialog-content');
  dialog.classList.add('dialog-zoom-leave-active');
  dialog.classList.add('dialog-zoom-leave-to');

  setTimeout(() => {
    emit('update:visible', false);
    emit('close');
  }, 100);
};
</script>

<style scoped>
.x-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.x-dialog-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
}

.x-dialog-header {
  margin-bottom: 15px;
}

.x-dialog-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.x-dialog-body {
  margin: 10px 0;
}

.x-dialog-footer {
  margin-top: 15px;
  text-align: right;
}

.close-button {
  padding: 8px 16px;
  background-color: #4a9eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.close-button:hover {
  background-color: #357abd;
}

/* 淡入淡出动画 */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: all 0.3s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

/* 缩放和位移动画 */
.dialog-zoom-enter-active,
.dialog-zoom-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.dialog-zoom-enter-from,
.dialog-zoom-leave-to {
  transform: scale(0.5);
  opacity: 0;
}
</style>
