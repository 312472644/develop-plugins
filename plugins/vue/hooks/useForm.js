import { isRef, computed } from 'vue';
import { deepClone, setObjectValue, clearObjectValue, isObjectEqual } from './utils.js';

/**
 * 表单 hook
 * @description 表单 hook 提供了验证、设置、重置、提交和检查表单是否被修改过的方法
 * @param {Object} props - 组件 props
 * @param {Ref} props.formRef - 表单 ref
 * @param {Object} props.form - 表单数据
 * @returns {Object} 表单 hook 提供的方法
 * @property {Function} validate - 验证表单
 * @property {Function} formSet - 设置表单
 * @property {Function} formReset - 重置表单
 * @property {Function} submit - 验证表单并执行回调
 * @property {Function} isDirty - 检查表单是否被修改过
 */
const useForm = props => {
  const { formRef, form } = props || {};

  const getForm = computed(() => (isRef(form) ? form.value : form));
  const formClone = deepClone(getForm.value);

  /**
   * 验证表单
   * @returns {Promise} 验证成功时 resolve，验证失败时 reject
   */
  function validate() {
    return () => formRef.value.validate().catch(() => false);
  }

  /**
   * 设置表单
   * @param {Object} obj
   */
  function formSet(obj) {
    setObjectValue(getForm.value, obj);
  }

  /**
   * 重置表单
   */
  function formReset() {
    formRef.value.clearValidate();
    // 清除对象值，将对象值设置为默认值
    const emptyForm = clearObjectValue(getForm.value, formClone);
    form.value = emptyForm;
  }

  /**
   * 验证表单并执行回调
   * @returns {Promise} 验证成功时 resolve，验证失败时 reject
   */
  async function submit() {
    const isValid = await validate();
    if (!isValid) return Promise.reject({ message: '表单验证失败' });
    const formIsModified = isDirty();
    if (!formIsModified) {
      return Promise.reject({ message: '表单数据未修改', formIsModified: false });
    }

    return Promise.resolve();
  }

  /**
   * 检查表单是否被修改过
   * @returns {Boolean} 如果表单数据与初始数据不同，返回 true
   */
  function isDirty() {
    return !isObjectEqual(getForm.value, formClone);
  }

  /**
   * 验证表单字段
   * @param {Object} props - 验证字段的配置对象
   * @param {Function} callback - 验证回调函数
   * @returns {Promise} 验证成功时 resolve，验证失败时 reject
   */
  function validateField(props, callback) {
    return formRef.value.validateField(props, callback);
  }

  return {
    validate,
    formSet,
    formReset,
    submit,
    isDirty,
    validateField,
  };
};

export default useForm;
