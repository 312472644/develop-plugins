/**
 * 解析URL中的查询参数
 * @param {string} url
 * @returns {object} 查询参数对象
 * @example
 * useUrlSearchParams('https://vueuse.org/core/useUrlSearchParams/?foo=bar&vueuse=awesome&biz=biz333');
 * // { foo: 'bar', vueuse: 'awesome', biz: 'biz333' }
 */
export default function useUrlSearchParams(url = location) {
  if (!url || typeof url !== 'string') {
    return {};
  }
  if (url.indexOf('?') === -1) {
    return {};
  }
  const params = {};
  const searchParams = new URLSearchParams(url.split('?')?.[1] || {});
  for (const key of searchParams.keys()) {
    const value = searchParams.get(key);
    params[key] = value;
  }
  return params;
}
