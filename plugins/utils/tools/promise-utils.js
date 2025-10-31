// cacheRequestMap 缓存请求
const cacheRequestMap = new Map();

/**
 * 判断是否符合PromiseA+规范
 * @param {*} fn
 */
export function isPromiseLike(fn) {
  return (typeof fn === "function" || typeof fn === "object") && typeof fn.then === "function";
}

/**
 * 取消上一个异步任务
 * @param {Promise} asyncTask 异步任务
 * @returns {() => Promise}
 * @example createCancelPromise(() => Promise.resolve(1))
 */
export function createCancelPromise(asyncTask) {
  if (!isPromiseLike(asyncTask)) {
    throw new Error("asyncTask must be a promise");
  }
  const NOOP = () => {};
  let cancel = NOOP;
  return (...args) => {
    return new Promise((resolve, reject) => {
      // 取消上一个异步任务, 重置 resolve 和 reject 为空函数，防止上一个异步任务的 resolve 和 reject 被调用
      cancel();
      cancel = () => {
        resolve = reject = NOOP;
      };
      asyncTask(...args)
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  };
}

/**
 * fetch 请求封装。连续发起多次请求会取消上一次请求，取消之前的请求并发起一个新的
 * @param {(signal) => Promise} fetchTask
 * @returns {() => Promise}
 * @example
 * const cancelableFetch = createCancelableFetch(fetchTask);
 * let promise = cancelableFetch('https://api.example.com/data'); // 发起一个请求
 * promise = cancelableFetch('https://api.example.com/other-data'); // 取消之前的请求并发起一个新的
 */
export function createCancelableFetch(fetchTask) {
  let controller = null;
  return (...args) => {
    if (controller) controller.abort();
    controller = new AbortController();
    return fetchTask(...args, { signal: controller.signal }).catch((err) => {
      if (err.name === "AbortError") {
        return Promise.reject(new Error("请求已取消"));
      }
      return Promise.reject(err);
    });
  };
}

/**
 * 控制并发请求
 * @param {[() => {}]} promises promise请求列表
 * @param {Number} [max=3] - 最大并发数
 * @returns {Promise<[]>}
 * @example
 * const promises = [() => Promise.resolve(1), () => Promise.resolve(2), () => Promise.resolve(3)];
 * concurRequest(promises, 2).then(res => console.log(res)); // [1, 2, 3]
 */
export function concurRequest(promises = [], max = 3) {
  if (!promises.length) return Promise.resolve([]);
  return new Promise((resolve, reject) => {
    const result = []; // 记录请求结果
    let nextIndex = 0; // 记录当前请求的下标
    let finishCount = 0; // 记录请求完成的数量
    async function request() {
      // 当前请求的下标大于promises的长度，说明请求已经结束
      if (nextIndex >= promises.length) return;
      const i = nextIndex;
      const p = promises[nextIndex++];
      try {
        const res = await p();
        result[i] = res;
      } catch (err) {
        result[i] = err;
      } finally {
        finishCount++;
        if (finishCount === promises.length) {
          resolve(result);
        }
        request();
      }
    }
    // 取最小值，因为如果请求的数量大于promises的长度，就会造成请求越界
    const times = Math.min(max, promises.length);
    for (let i = 0; i < times; i++) {
      request();
    }
  });
}

/**
 * 相同Key的请求只执行一次
 * @param {String | Number} key 请求唯一标识
 * @param {() => Promise<any>} asyncTask 异步任务
 * @returns {Promise}
 * @example
 * requestCache('key', () => fetch('url')).then((res) => {})
 */
export function requestCache(key, asyncTask) {
  if (!key) return;
  if (!typeof asyncTask === "function") return;
  if (cacheRequestMap.get(key)) {
    return cacheRequestMap.get(key);
  }
  const p = new Promise((resolve, reject) => {
    asyncTask()
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
  cacheRequestMap.set(key, p);
  p.finally(() => {
    cacheRequestMap.delete(key);
  });
  return p;
}
