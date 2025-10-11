/**
 * 将文件转换为base64
 * @param {Blob} file 
 * @returns 
 */
export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * 获取文档参数
 * @param {*} src 
 * @returns 
 */
export async function getDocumentParams(src = {}) {
  // 字符串类型
  if (typeof src === "string") {
    src = { url: src };
  }
  // ArrayBuffer | Uint8Array 类型
  else if (src instanceof ArrayBuffer || src instanceof Uint8Array) {
    src = { data: src };
  }
  // Blob 类型
  else if (src instanceof Blob) {
    src = { url: await getBase64(src) };
  }
  // Object 类型 { url: '', data: '', httpHeaders: {}, withCredentials: false }
  else if (typeof src === "object") {
    src = { ...src };
  }
  return src;
}

/**
 * 生成水印图片的DataURL
 * @param {Object} watermarkConfig
 * @param {String} watermarkConfig.text 水印文本
 * @param {String} watermarkConfig.color 水印颜色
 * @param {Number} watermarkConfig.fontSize 水印字体大小
 * @param {Number} watermarkConfig.rotate 水印旋转角度
 * @param {Number} watermarkConfig.size 水印大小
 * @returns
 */
export function generateImageDataURL(watermarkConfig) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const size = watermarkConfig.size;
  canvas.width = size * window.devicePixelRatio;
  canvas.height = size * window.devicePixelRatio;
  // 移动坐标系原点到canvas中心
  context.translate(canvas.width / 2, canvas.height / 2);
  // 旋转坐标系
  context.rotate((watermarkConfig.rotate * Math.PI) / 180);
  // 设置文字样式
  context.fillStyle = watermarkConfig.color;
  context.font = `${parseInt(watermarkConfig.fontSize) * 1}px Arial`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(watermarkConfig.text, 0, 0);
  const url = canvas.toDataURL("image/png", 1);
  return url;
}

/**
 * 创建水印DOM
 * @param {Object} viewport
 * @param {Number} viewport.width
 * @param {Number} viewport.height
 * @param {Number} pageNum
 * @returns {HTMLElement} watermarkDOM
 */
export function createWatermarkDOM(viewport, pageNum, watermarkConfig = {}) {
  const url = generateImageDataURL(watermarkConfig);
  // 创建水印层
  const watermark = document.createElement("div");
  watermark.dataset.watermark = true;
  watermark.dataset.pageNum = pageNum;
  watermark.style.position = "absolute";
  watermark.style.top = "0";
  watermark.style.left = "0";
  watermark.style.width = `${viewport.width}px`;
  watermark.style.height = `${viewport.height}px`;
  watermark.style.pointerEvents = "none";
  watermark.style.backgroundImage = `url(${url})`;
  watermark.style.backgroundRepeat = "repeat";
  watermark.style.backgroundSize = `${watermarkConfig.size}px ${watermarkConfig.size}px`;
  watermark.style.backgroundPosition = "center";
  return watermark;
}
