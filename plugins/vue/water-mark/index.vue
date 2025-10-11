<template>
  <div ref="WaterMarkRef" style="position: relative;">
    <slot></slot>
  </div>
</template>
<script setup name="WaterMark">
import { onMounted, onUnmounted, ref, watch } from 'vue';

const props = defineProps({
  // 水印宽度
  width: {
    type: Number,
  },
  // 水印高度
  height: {
    type: Number,
  },
  // 水印文本
  text: {
    type: [String, Array],
    default: 'watermark',
  },
  // 水印旋转角度
  rotate: {
    type: Number,
    default: -20,
  },
  // 水印间距
  gap: {
    type: Number,
    default: 100,
  },
  // 水印层级
  zIndex: {
    type: Number,
    default: 9999,
  },
  // 水印字体
  font: {
    type: Object,
    default: () => ({}),
  },
  // 水印图片
  image: {
    type: String,
    default: '',
  },
});

let ob = null;
let waterMarkDiv = null;
const WaterMarkRef = ref(null);

const fontConfig = Object.assign(
  {
    fontSize: 16,
    fontFamily: 'serif',
    color: 'rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
  },
  props.font
);

const drawImage = () => {
  const image = new Image();
  image.src = props.image;
  image.crossOrigin = 'anonymous';
  return new Promise((resolve, reject) => {
    image.onload = () => {
      resolve({ image, naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight });
    };
    image.onerror = function () {
      reject(new Error('图片加载失败'));
    };
  });
};

const useWatermarkBg = async () => {
  const canvas = document.createElement('canvas');
  const devicePixelRatio = window.devicePixelRatio || 1;
  const { fontSize, fontFamily, color, textAlign } = fontConfig;
  // 设置字体大小
  const font = fontSize * devicePixelRatio + 'px ' + fontFamily;
  const ctx = canvas.getContext('2d');
  // 获取文字宽度
  const { width, fontBoundingBoxAscent, fontBoundingBoxDescent } = ctx.measureText(props.text);
  // 获取文字高度
  const textContentHeight = fontBoundingBoxAscent + fontBoundingBoxDescent + 6;
  const canvasSize = Math.max(100, width) + props.gap * devicePixelRatio;
  // 设置画布大小，默认为content宽高
  canvas.width = props.width ? props.width + props.gap : canvasSize;
  canvas.height = props.height ? props.height + props.gap : canvasSize;
  // 文字居中
  ctx.translate(props.image ? 0 : canvas.width / 2, canvas.height / 2);
  // 旋转让文字变倾斜
  ctx.rotate((Math.PI / 180) * props.rotate);

  // 绘制图片
  if (props.image) {
    const { image, naturalWidth, naturalHeight } = await drawImage();
    ctx.drawImage(image, 0, 0, naturalWidth / 2, naturalHeight / 2);
  }
  // 绘制文字
  else {
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.textAlign = textAlign;
    ctx.textBaseline = 'middle';
    // 多行文字
    if (Array.isArray(props.text)) {
      props.text.forEach((item, index) => {
        ctx.fillText(item, 0, index * textContentHeight);
      });
    } else {
      ctx.fillText(props.text, 0, 0);
    }
  }

  return {
    base64: canvas.toDataURL(),
    styleXSize: canvas.width / devicePixelRatio,
    styleYSize: canvas.height / devicePixelRatio,
  };
};

const createWaterMarkContainer = async () => {
  if (!WaterMarkRef.value) return;
  if (waterMarkDiv) {
    waterMarkDiv.remove();
  }
  waterMarkDiv = document.createElement('div');
  const { base64, styleXSize, styleYSize } = await useWatermarkBg();
  waterMarkDiv.style.backgroundImage = `url(${base64})`;
  waterMarkDiv.style.backgroundSize = `${styleXSize}px ${styleYSize}px`;
  waterMarkDiv.style.backgroundRepeat = 'repeat';
  waterMarkDiv.style.inset = 0;
  waterMarkDiv.style.zIndex = props.zIndex;
  waterMarkDiv.style.position = 'absolute';
  waterMarkDiv.style.pointerEvents = 'none';
  WaterMarkRef.value.append(waterMarkDiv);
};

const observer = () => {
  ob = new MutationObserver(records => {
    for (const record of records) {
      for (const dom of record.removedNodes) {
        // 删除节点
        if (dom === waterMarkDiv) {
          createWaterMarkContainer();
          return;
        }
      }
      // 修改节点
      if (record.target === waterMarkDiv) {
        createWaterMarkContainer();
        return;
      }
    }
  });
  ob.observe(WaterMarkRef.value, {
    childList: true,
    attributes: true,
    subtree: true,
  });
};

watch(() => props.text, vl => {
  createWaterMarkContainer();
})

onMounted(() => {
  createWaterMarkContainer();
  observer();
});

onUnmounted(() => {
  ob && ob.disconnect();
  waterMarkDiv.remove();
  WaterMarkRef.value = null;
});
</script>
