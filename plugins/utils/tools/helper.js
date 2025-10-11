/**
 * 禁用浏览器调试功能
 */
export function disableBrowserDebugger() {
  setInterval(function () {
    const startTime = performance.now();
    debugger;
    const endTime = performance.now();
    // 设置一个阈值，例如100毫秒
    if (endTime - startTime > 100) {
      window.location.href = "about:blank";
    }
  }, 100);
}

/**
 * 函数防抖
 * @param {Function} fn 防抖函数
 * @param {Number} [delay=500] 时间间隔(ms)
 * @returns {(function(): void)|*}
 */
export function debounce(fn, delay = 500) {
  let timer = null;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments);
      clearTimeout(timer);
    }, delay);
  };
}

/**
 * 函数节流
 * @param {Function} fn 节流函数
 * @param {Number} [delay=500] 时间间隔(ms)
 * @param {Boolean} immediate 首次是否执行
 * @returns {(function(): (*|undefined))|*}
 */
export function throttle(fn, delay = 500, immediate = true) {
  let preTime = Date.now();
  let hasCalled = false;
  return function () {
    const context = this,
      nowTime = Date.now();
    if (immediate && !hasCalled) {
      // 如果立即执行，且函数第一次调用
      hasCalled = true;
      preTime = nowTime;
      return fn.apply(context, [...arguments]);
    } else {
      // 如果两次时间间隔超过了指定时间，则执行函数。
      if (nowTime - preTime >= delay) {
        preTime = Date.now();
        return fn.apply(context, [...arguments]);
      }
    }
  };
}

/**
 * 深拷贝对象
 * @param {Object} obj 待拷贝对象
 * @param {WeakMap} weakMap map 存储循环引用对象
 * @returns {Object}
 */
export function deepClone(obj, weakMap = new WeakMap()) {
  if (obj === null || typeof obj !== "object") return obj;
  // 处理 Date 类型
  if (obj instanceof Date) return new Date(obj);
  // 处理 RegExp 类型
  if (obj instanceof RegExp) return new RegExp(obj);
  // 解决循环依赖问题
  if (weakMap.has(obj)) return weakMap.get(obj);
  // 处理Map
  if (obj instanceof Map) {
    const cloneMap = new Map();
    for (const [key, value] of obj) {
      cloneMap.set(key, deepClone(value));
    }
    return cloneMap;
  }
  // 处理Set
  if (obj instanceof Set) {
    const cloneSet = new Set();
    for (const value of obj) {
      cloneSet.add(deepClone(value));
    }
    return cloneSet;
  }

  // 对象或数组处理
  const cloneObject = Array.isArray(obj) ? [] : {};
  weakMap.set(obj, cloneObject);

  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      cloneObject[key] = deepClone(obj[key], weakMap);
    }
  }
  return cloneObject;
}

/**
 * 函数重载实现
 * @returns {Function}
 * @example
 * const overload = createOverload()
 * overload.addImpl("string", (a) => {});
 * overload.addImpl("number", "number", (a, b) => {});
 * overload("1");
 * overload(1, 2);
 */
export function createOverload() {
  const fnMap = new Map();
  function overload(...args) {
    // 获取参数类型
    const key = args.map((it) => typeof it).join(",");
    console.log("key", key);
    const fn = fnMap.get(key);
    if (!fn) {
      throw new Error("没有匹配的函数");
    }
    return fn.apply(this, args);
  }
  overload.addImpl = function (...args) {
    // 最后一个参数必为函数
    const fn = args.pop();
    if (typeof fn !== "function") {
      throw new TypeError("最后一个参数必须为函数");
    }
    const key = args.join(",");
    fnMap.set(key, fn);
  };
  return overload;
}

/**
 * 获取url参数
 * @param {String} url url
 * @param {String} key 参数
 * @returns {Object}
 */
export function getUrlParams(url = location.href, key = "") {
  const params = {};
  const search = url.split("?")[1];
  if (!search) {
    return params;
  }
  const searchParams = new URLSearchParams(search);
  for (const [prop, value] of searchParams) {
    params[prop] = value;
  }
  return key ? params[key] : params;
}

/**
 * 获取随机数
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 * @returns
 */
export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 获取唯一id
 * @returns {String}
 */
export function getUniqueId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * DOM元素全屏，兼容所有浏览器
 * @param {HTMLElement} element DOM元素
 */
export function fullScreen(element) {
  if (!element) return;

  // 初始化时确定浏览器支持的API版本
  const requestMethod = element.requestFullscreen || 
    element.mozRequestFullScreen || 
    element.webkitRequestFullscreen || 
    element.msRequestFullscreen;

  const exitMethod = document.exitFullscreen || 
    document.mozCancelFullScreen || 
    document.webkitExitFullscreen || 
    document.msExitFullscreen;

  const fullscreenElement = document.fullscreenElement || 
    document.mozFullScreenElement || 
    document.webkitFullscreenElement || 
    document.msFullscreenElement;

  // 重写函数，后续调用将直接使用确定的API
  fullScreen = function(element) {
    if (!element) return;
    if (!fullscreenElement) {
      requestMethod.call(element);
    } else {
      exitMethod.call(document);
    }
  };

  // 执行重写后的函数
  return fullScreen(element);
}
