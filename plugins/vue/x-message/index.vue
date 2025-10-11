<template>
  <transition
    ref="transitionRef"
    class="x-message-container"
    name="message-fade"
    appear
    @after-enter="$emit('transitionEnd')"
    @after-leave="$emit('transitionEnd')"
  >
    <div v-if="visible" class="x-message" :class="[type, size]">
      <div class="x-message-content">
        <span v-if="type === 'success'" class="icon success" v-html="successIcon"></span>
        <span v-else-if="type === 'error'" class="icon error" v-html="errorIcon"></span>
        <span v-else-if="type === 'warning'" class="icon warning" v-html="warningIcon"></span>
        <span v-else-if="type === 'loading'" class="icon loading" v-html="loadingIcon"></span>
        <span v-else class="icon info" v-html="infoIcon"></span>
        <span>{{ message }}</span>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { successIcon, errorIcon, warningIcon, infoIcon, loadingIcon } from './icons.js';
import { defineProps, defineEmits, onMounted, ref, watch, nextTick } from 'vue';

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'warning', 'error', 'info', 'loading'].includes(value)
  },
  size: {
    type: String,
    default: 'small',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  duration: {
    type: Number,
    default: 3 * 1000
  },
  visible: {
    type: Boolean,
    default: true
  },
  offset: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['close', 'transitionEnd']);
const transitionRef = ref(null);
// 根元素动进入画过渡时间
const rootEnterDelay = `${props.offset / 800 + 0.2}s`;
// 根元素动离开画过渡时间
const rootLeaveDelay = `${props.offset / 1000 + 0.1}s`;

function updateRootDOMTop() {
  nextTick(() => {
    const rootDOM = transitionRef.value;
    rootDOM.style.top = `${props.offset}px`;
  });
}

function init() {
  const rootDOM = transitionRef.value;
  updateRootDOMTop();
  // 持续时间为0时，不显示动画，直接关闭toast
  if (props.duration <= 0) return;
  setTimeout(() => {
    rootDOM.classList.add('message-fade-leave-active');
    rootDOM.classList.add('message-fade-leave-to');
    rootDOM.addEventListener(
      'transitionend',
      () => {
        emit('close');
      },
      { once: true }
    );
  }, props.duration);
}

onMounted(() => {
  init();
});

watch(
  () => props.offset,
  () => {
    nextTick(() => {
      updateRootDOMTop();
    });
  }
);
</script>

<style scoped>
.x-message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: transparent;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  z-index: 2000;
  transition: all v-bind(rootEnterDelay) cubic-bezier(0.55, 0, 0.1, 1);
  max-width: calc(100vw - 32px);
  pointer-events: all;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  background-color: #f4f4f5;
  overflow: hidden;
}

.x-message.small {
  padding: 8px 16px;
  font-size: 13px;
}

.x-message.medium {
  padding: 10px 18px;
  font-size: 14px;
}

.x-message.large {
  padding: 12px 20px;
  font-size: 15px;
}

.x-message-content {
  display: flex;
  align-items: center;
  line-height: 1.4;
}

.icon {
  margin-right: 8px;
  font-style: normal;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.small .icon {
  width: 24px;
  height: 24px;
  font-size: 12px;
}

.medium .icon {
  width: 28px;
  height: 28px;
  font-size: 14px;
}

.large .icon {
  width: 32px;
  height: 32px;
  font-size: 16px;
}

.icon:hover {
  transform: scale(1.1);
}

.success {
  color: #67c23a;
  background-color: #f0f9eb;
  box-shadow: 0 2px 4px 0 rgba(103, 194, 58, 0.3);
}

.warning {
  color: #e6a23c;
  background-color: #fdf6ec;
  box-shadow: 0 2px 4px 0 rgba(230, 162, 60, 0.3);
}

.error {
  color: #f56c6c;
  background-color: #fef0f0;
  box-shadow: 0 2px 4px 0 rgba(245, 108, 108, 0.3);
}

.info {
  color: #909399;
  background-color: #f4f4f5;
  box-shadow: 0 2px 4px 0 rgba(144, 147, 153, 0.3);
}

.loading {
  color: #409eff;
  background-color: #ecf5ff;
  box-shadow: 0 2px 12px 0 rgba(64, 158, 255, 0.3);
}

.message-fade-enter-active {
  transition: all v-bind(rootEnterDelay) cubic-bezier(0.4, 0, 0.2, 1);
}

.message-fade-leave-active {
  transition: all v-bind(rootLeaveDelay) cubic-bezier(0.4, 0, 0.2, 1);
}

.message-fade-enter-from,
.message-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px) scale(0.95);
}

.message-fade-enter-to,
.message-fade-leave-from {
  opacity: 1;
  transform: translate(-50%, 0) scale(1);
}
</style>
