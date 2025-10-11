<template>
  <div :class="[customClass]">
    <div v-if="loading" class="x-loading-container" :style="{ height: height }">
      <div class="spinner"></div>
      <div v-if="text" class="loading-text">{{ text }}</div>
    </div>
    <slot v-else />
  </div>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
  text: {
    type: String,
    default: "",
  },
  height: {
    type: String,
    default: "100px",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  customClass: {
    type: String,
    default: "",
  },
});
</script>

<style scoped>
.x-loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  opacity: 0;
  animation: fade-in 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85));
  backdrop-filter: blur(4px);
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid transparent;
  border-top-color: #0958d9;
  border-radius: 50%;
  position: relative;
  animation: spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite, pulse 2s ease-in-out infinite;
}

.spinner::before {
  content: "";
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border-radius: 50%;
  border: 3px solid rgba(9, 88, 217, 0.1);
  border-top-color: rgba(9, 88, 217, 0.3);
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(9, 88, 217, 0.3);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(9, 88, 217, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(9, 88, 217, 0);
  }
}

.loading-text {
  margin-top: 16px;
  color: transparent;
  background: linear-gradient(45deg, #0958d9, #1890ff);
  background-clip: text;
  -webkit-background-clip: text;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.3px;
  opacity: 0;
  animation: fade-in 0.4s ease 0.1s forwards, text-pulse 3s ease-in-out infinite;
}

@keyframes fade-in {
  from {
    opacity: 0;
    /* transform: translateY(-8px); */
  }
  to {
    opacity: 1;
    /* transform: translateY(0); */
  }
}

@keyframes text-pulse {
  0% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.8;
  }
}
</style>
