import { debounce } from "../../utils/tools/helper";

function getWait(arg) {
  const n = Number(arg);
  return !Number.isNaN(n) && n > 0 ? n : 500;
}

export default {
  name: "Debounce",
  mounted(el, binding) {
    const handler = binding.value;
    if (typeof handler !== "function") return;
    const wait = getWait(binding.arg);
    el._debounceFn = debounce(handler, wait);
    el.addEventListener("click", el._debounceFn);
  },
  beforeUpdate(el, binding) {
    const handler = binding.value;
    if (typeof handler !== "function") return;
    const wait = getWait(binding.arg);
    if (el._debounceFn) el.removeEventListener("click", el._debounceFn);
    el._debounceFn = debounce(handler, wait);
    el.addEventListener("click", el._debounceFn);
  },
  unmounted(el) {
    if (el._debounceFn) {
      el.removeEventListener("click", el._debounceFn);
      el._debounceFn = null;
    }
  },
};