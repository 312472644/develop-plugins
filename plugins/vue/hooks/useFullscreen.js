import { nextTick, onMounted, onUnmounted, ref, shallowRef, computed } from 'vue';

/**
 * 全屏 Hook
 * @param {String|HTMLElement} el 要操作的元素，默认是 document.documentElement
 * @returns 包含全屏状态、进入全屏、退出全屏、切换全屏的方法
 * @example
 * useFullscreen();
 * // { isFullscreen: false, enter: Function, exit: Function, toggle: Function }
 */
export default function useFullscreen(target = document.documentElement) {
  const el = shallowRef(target);
  const isFullscreen = ref(false);

  const isActiveFullscreen = () => {
    return (
      document.fullscreenElement ||
      document.webkitIsFullScreen ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
  };

  const enterFullscreen = () => {
    return (
      el.value.requestFullscreen?.() ||
      el.value.webkitRequestFullscreen?.() ||
      el.value.mozRequestFullScreen?.() ||
      el.value.msRequestFullscreen?.()
    );
  };

  const exitFullscreen = () => {
    return (
      document.exitFullscreen?.() ||
      document.webkitExitFullscreen?.() ||
      document.mozCancelFullScreen?.() ||
      document.msExitFullscreen?.()
    );
  };

  const toggleFullscreen = () => {
    isActiveFullscreen() ? exitFullscreen() : enterFullscreen();
  };

  const preventF11 = e => {
    if (e.key === 'F11') {
      e.preventDefault();
      toggleFullscreen();
    }
  };

  const handleFullscreenChange = () => {
    isFullscreen.value = Boolean(isActiveFullscreen());
  };

  const bindEvent = () => {
    document.addEventListener('keydown', preventF11);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
  };

  const getTargetElement = () => {
    if (typeof target === 'string') {
      el.value = document.querySelector(target);
    }
  };

  onMounted(() => {
    nextTick().then(getTargetElement);
    bindEvent();
  });

  onUnmounted(() => {
    document.removeEventListener('keydown', preventF11);
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
  });

  return {
    isFullscreen,
    enter: enterFullscreen,
    exit: exitFullscreen,
    toggle: toggleFullscreen,
  };
}
