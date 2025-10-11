import { debounce } from "../../utils";

let copyValue = null;
const debounceHandleCopy = debounce(handleCopy, 500);
/**
 * 复制,点击触发
 * @example v-copy="'text'"
 * @example v-copy="{ value: 'text', onSuccess: (text) => {} }"
 */
export default {
  name: 'Copy',
  mounted(el, binding) {
    copyValue = binding.value;
    el.addEventListener('click', handleCopy);
  },
  beforeUpdate(el, binding) {
    copyValue = binding.value;
    debounceHandleCopy();
  },
  unmounted(el) {
    el.removeEventListener('click', handleCopy);
  }
}

function handleCopy() {
  if (!copyValue) return;
  const isObj = typeof copyValue === 'object' && copyValue !== null;
  const text = isObj ? (copyValue.value ?? '') : copyValue;
  const onSuccess = isObj && typeof copyValue.onSuccess === 'function' ? copyValue.onSuccess : null;
  if (!text) return;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      try { onSuccess && onSuccess(text); } catch (e) {}
    }).catch((err) => {
      throw new Error(err);
    });
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    try { onSuccess && onSuccess(text); } catch (e) {}
  }
}