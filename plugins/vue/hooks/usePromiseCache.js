const cache = new Map();
const timeouts = new Map();

/**
 * 创建一个带有缓存功能的异步函数
 * @param {Function} asyncFn - 原始的异步函数
 * @param {String} options.key - 如何从函数参数生成缓存 key
 * @param {Number} [options.ttl=60000] - 缓存过期时间（毫秒）
 * @returns {Function} - 带有缓存功能的异步函数
 * @example
 * const getTableDataCached = usePromiseCache(getTableData, 'getTableData');
 * getTableDataCached().then(data => console.log(data));
 */
export default function usePromiseCache(asyncFn, key, ttl = 5 * 1000) {
  if (key && typeof key !== 'string') {
    throw new Error('key must be a string');
  }

  return function (...args) {
    const cacheKey = `cache_${key}`;

    if (cache.has(cacheKey)) {
      console.log('🚀 ~ 命中缓存:', cacheKey);
      return cache.get(cacheKey);
    }

    const promise = asyncFn(...args).catch(error => {
      cache.delete(cacheKey);
      if (timeouts.has(cacheKey)) {
        clearTimeout(timeouts.get(cacheKey));
        timeouts.delete(cacheKey);
      }
      throw error;
    });

    // 缓存 Promise
    cache.set(cacheKey, promise);

    if (ttl > 0) {
      const timeoutId = setTimeout(() => {
        cache.delete(cacheKey);
        timeouts.delete(cacheKey);
      }, ttl);
      timeouts.set(cacheKey, timeoutId);
    }

    return promise;
  };
}
