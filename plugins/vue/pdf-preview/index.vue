<template>
  <div ref="PdfViewerRef" class="pdf-viewer" :class="{ 'is-loading': isLoading }" v-ob-resize="handleResize">
    <!--工具栏-->
    <div v-if="showToolbar" ref="ToolbarRef" class="toolbar">
      <div class="tool-left">
        <div class="tool-group">
          <button :disabled="currentPage <= 1 || !isLoaded" title="上一页" @click="prevPage">←</button>
          <span>{{ currentPage }} / {{ totalPages }}</span>
          <button :disabled="currentPage >= totalPages || !isLoaded" title="下一页" @click="nextPage">→</button>
        </div>
        <div class="tool-group">
          <div v-if="zoomMode === ZoomModeEnum.Custom" style="display: flex; align-items: center">
            <button title="放大" @click="zoomIn">+</button>
            <span style="margin: 0 8px">{{ (scale * 100).toFixed(0) }}%</span>
            <button title="缩小" @click="zoomOut">-</button>
          </div>
          <select v-model="zoomMode" :disabled="!isLoaded" class="zoom-select" @change="handleZoomModeChange">
            <option v-for="item in zoomModeOptions" :key="item.value" :value="item.value">
              {{ item.text }}
            </option>
          </select>
        </div>
        <div class="tool-group">
          <button :disabled="!isLoaded" title="逆时针旋转" @click="rotate(-90)">↺</button>
          <button :disabled="!isLoaded" title="顺时针旋转" @click="rotate(90)">↻</button>
        </div>
      </div>
      <div class="tool-right">
        <div class="tool-group">
          <button title="下载" :disabled="isDownloading || !isLoaded" @click="downloadPDF">
            <span v-if="isDownloading" class="loading-dot"></span>
            <span v-else>⭳</span>
          </button>
          <button :disabled="!isLoaded" title="打印" @click="printPDF">⎙</button>
        </div>
        <div class="tool-group">
          <button :disabled="!isLoaded" title="文档属性" @click="showDocumentInfo">ℹ</button>
          <button :disabled="!isLoaded" title="全屏" @click="toggleFullscreen">⛶</button>
        </div>
      </div>
    </div>
    <div style="position: relative; flex: 1; min-height: 0">
      <!--加载动画-->
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-content">
          <div class="loading-spinner"></div>
          <span class="loading-text">正在加载文档...</span>
        </div>
      </div>
      <div v-if="!isLoading && !isLoaded" class="empty-state">
        <svg width="64" height="41" viewBox="0 0 64 41" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(0 1)" fill="none" fill-rule="evenodd">
            <ellipse fill="#f5f5f5" cx="32" cy="33" rx="32" ry="7"></ellipse>
            <g fill-rule="nonzero" stroke="#d9d9d9">
              <path
                d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"
              ></path>
              <path
                d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
                fill="#fafafa"
              ></path>
            </g>
          </g>
        </svg>
        <p class="empty-text">暂无数据</p>
      </div>
      <!--pdf渲染区域-->
      <div ref="RenderContainer" class="pdf-container" :class="{ fullscreen: isFullscreen }"></div>
    </div>
    <DocumentInfoDialog :width="400" v-model:visible="showInfoDialog" :info="docInfo" />
  </div>
</template>

<script setup name="PDFPreview">
import { ref, onMounted, onUnmounted, defineProps, reactive, watch, shallowRef, nextTick } from "vue";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.mjs";
import DocumentInfoDialog from "./DocumentInfoDialog.vue";
import { getDocumentParams, createWatermarkDOM } from "./utils";
import { debounce } from "../../utils";
import ObResize from "../directive/ob-resize";

const props = defineProps({
  /**
   * PDF文件的URL
   */
  fileUrl: {
    type: [String, Object, Uint8Array],
    required: false,
  },
  /**
   * 是否显示页码
   */
  showPageNumber: {
    type: Boolean,
    default: true,
  },
  /**
   * 是否显示工具栏
   */
  showToolbar: {
    type: Boolean,
    default: true,
  },
  /**
   * 下载PDF文件的文件名
   */
  downloadFileName: {
    type: String,
    default: "document.pdf",
  },
  /**
   * 水印配置
   */
  watermark: {
    type: Object,
    default: () => ({}),
  },
});

const vObResize = ObResize;

const emit = defineEmits(["load-success", "load-error"]);

const currentPDF = shallowRef(null);
const containerOriginRect = { width: 0, height: 0 };
const RenderContainer = ref(null);
const PdfViewerRef = ref(null);
const ToolbarRef = ref(null);

const isLoaded = ref(false);
const scale = ref(1);
const currentPage = ref(1);
const totalPages = ref(0);
const isFullscreen = ref(false);
const rotation = ref(0);
const ZoomModeEnum = reactive({
  Custom: "custom",
  Auto: "auto",
});
const zoomMode = ref(ZoomModeEnum.Auto);
const zoomModeOptions = ref([
  { text: "自定义缩放", value: ZoomModeEnum.Custom },
  { text: "自适应页面", value: ZoomModeEnum.Auto },
]);
const isLoading = ref(false);
const triggerObserver = ref(true);
const isDownloading = ref(false);
const showInfoDialog = ref(false);
const watermarkConfig = {
  ...{ text: "水印", fontSize: 16, color: "rgba(0, 0, 0, 0.1)", rotate: -30, size: 250 },
  ...props.watermark,
};
const viewportMap = new Map();
const docInfo = reactive({
  docSize: "",
  totalPages: 0,
  pdfFormatVersion: "",
  producer: "",
  creator: "",
  creationDate: "",
  modificationDate: "",
  author: "",
  title: "",
  subject: "",
});

/**
 * 加载PDF文件
 * @param {string} fileURL - PDF文件的URL
 */
async function loadPDF(fileURL) {
  if (!fileURL) return;
  isLoading.value = true;
  const config = await getDocumentParams(fileURL);
  try {
    currentPDF.value = await pdfjsLib.getDocument(config).promise;
    totalPages.value = currentPDF.value.numPages;
    docInfo.totalPages = totalPages.value;
    currentPage.value = 1;
    await renderAllPages();
    isLoaded.value = true;
    emit("load-success");
  } catch (error) {
    console.error("加载PDF文件失败");
    emit("load-error", error);
  } finally {
    setTimeout(() => {
      isLoading.value = false;
    }, 1000);
  }
}

/**
 * 获取pdf原始尺寸
 */
function getPDFOriginalSize(page) {
  const viewport = page.getViewport({ scale: 1 });
  return { width: viewport.width, height: viewport.height };
}

/**
 * 渲染所有PDF页面
 */
async function renderAllPages() {
  if (!currentPDF.value) return;

  RenderContainer.value.innerHTML = "";
  for (let pageNum = 1; pageNum <= totalPages.value; pageNum++) {
    const page = await currentPDF.value.getPage(pageNum);
    // 自适应页面才需要自动缩放
    if (zoomMode.value === ZoomModeEnum.Auto) {
      scale.value = await calculateAutoScale(page);
    }

    const viewport = page.getViewport({ scale: scale.value, rotation: rotation.value });
    const pageContainer = document.createElement("div");
    pageContainer.className = "page-container";
    pageContainer.dataset.pageNum = pageNum;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { alpha: false });
    // 设置canvas的物理像素分辨率
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.height = viewport.height * pixelRatio;
    canvas.width = viewport.width * pixelRatio;
    // 禁用图像平滑
    context.imageSmoothingEnabled = false;
    context.scale(pixelRatio, pixelRatio);

    // 是否显示页码
    if (props.showPageNumber) {
      const pageNumber = document.createElement("div");
      pageNumber.className = "page-number";
      pageNumber.textContent = `${pageNum} / ${totalPages.value}`;
      pageContainer.appendChild(pageNumber);
    }

    // 是否显示水印
    if (props.watermark.enable) {
      pageContainer.appendChild(createWatermarkDOM(viewport, pageNum, watermarkConfig));
      viewportMap.set(pageNum, viewport);
    }
    // 添加canvas
    pageContainer.appendChild(canvas);
    RenderContainer.value.appendChild(pageContainer);
    await page.render({ canvasContext: context, viewport: viewport });
  }
  if (props.showToolbar) {
    setupPageVisibilityListeners();
  }
  if (props.watermark.enable) {
    setupWatermarkObserver();
  }
}

async function handleZoomModeChange() {
  switch (zoomMode.value) {
    case ZoomModeEnum.Auto:
      scale.value = await calculateAutoScale();
      break;
    default:
      break;
  }
  renderAllPages();
}

/**
 * 计算自动缩放比例
 */
async function calculateAutoScale(page) {
  if (!page) {
    page = await currentPDF.value.getPage(currentPage.value);
  }
  const { width } = getPDFOriginalSize(page);
  const renderWidth = containerOriginRect.width;
  const scale = parseFloat(renderWidth / width);
  // 当缩放比例大于2倍时，增加15%的缩放比例
  if (scale > 2) {
    return 1 + scale * 0.15;
  }
  return scale;
}

/**
 * 放大PDF页面
 * 每次增加0.25的缩放比例，最大不超过3倍
 */
function zoomIn() {
  scale.value = Math.min(scale.value + 0.1, 3);
  renderAllPages();
}

/**
 * 缩小PDF页面
 * 每次减少0.25的缩放比例，最小不低于0.5倍
 */
function zoomOut() {
  scale.value = Math.max(scale.value - 0.1, 0.3);
  renderAllPages();
}

/**
 * 旋转PDF页面
 * @param {number} angle - 旋转角度
 */
function rotate(angle) {
  rotation.value = (rotation.value + angle) % 360;
  renderAllPages();
}

/**
 * 滚动到指定页码
 * @param {number} pageNumber - 目标页码
 */
function scrollToPage(pageNumber) {
  const pageElement = RenderContainer.value.querySelector(`[data-page-num="${pageNumber}"]`);
  pageElement?.scrollIntoView();
}

/**
 * 跳转到上一页
 */
function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    scrollToPage(currentPage.value);
  }
}

/**
 * 跳转到下一页
 */
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    scrollToPage(currentPage.value);
  }
}

/**
 * 页码可见性：交叉观察（IntersectionObserver）
 */
function setupPageIntersectionObserver() {
  const rootEl = RenderContainer.value || null;
  try {
    rootEl.__pageObserver && rootEl.__pageObserver.disconnect();
  } catch (e) {}

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!triggerObserver.value) return;
        if (entry.isIntersecting && entry.intersectionRatio > 0) {
          const pageNum = parseInt(entry.target.dataset.pageNum);
          if (pageNum !== currentPage.value) {
            currentPage.value = pageNum;
          }
        }
      });
    },
    { root: rootEl, threshold: [0, 0.01, 0.1], rootMargin: "0px" }
  );

  const pageContainers = RenderContainer.value.querySelectorAll(".page-container");
  pageContainers.forEach((container) => observer.observe(container));
  rootEl.__pageObserver = observer;
}

/**
 * 页码可见性兜底：以容器顶部线进入某页就切页
 */
function setupTopLineScrollListener() {
  const rootEl = RenderContainer.value || null;
  try {
    if (rootEl.__onScroll) {
      rootEl.removeEventListener("scroll", rootEl.__onScroll);
    }
  } catch (e) {}

  const pageContainers = RenderContainer.value.querySelectorAll(".page-container");
  const updateByTopLine = () => {
    if (!triggerObserver.value) return;
    const containerRect = rootEl.getBoundingClientRect();
    const topY = containerRect.top;
    // 优先选择“顶部线”落入的页面
    let targetPage = null;
    for (const el of pageContainers) {
      const rect = el.getBoundingClientRect();
      if (topY >= rect.top && topY < rect.bottom) {
        targetPage = parseInt(el.dataset.pageNum);
        break;
      }
    }
    // 若没有落入（例如顶部线位于页间隙），选取顶部线最近的下一页或最近页
    if (targetPage == null) {
      let nearest = { page: currentPage.value, dist: Number.POSITIVE_INFINITY };
      pageContainers.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const d = Math.min(Math.abs(topY - rect.top), Math.abs(topY - rect.bottom));
        if (d < nearest.dist) {
          nearest = { page: parseInt(el.dataset.pageNum), dist: d };
        }
      });
      targetPage = nearest.page;
    }
    if (targetPage !== currentPage.value) {
      currentPage.value = targetPage;
    }
  };
  const onScroll = () => requestAnimationFrame(updateByTopLine);
  rootEl.addEventListener("scroll", onScroll);
  rootEl.__onScroll = onScroll;
  requestAnimationFrame(updateByTopLine);
}

/**
 * 统一入口：绑定页码可见性监听
 */
function setupPageVisibilityListeners() {
  setupPageIntersectionObserver();
  setupTopLineScrollListener();
}

/**
 * 重新生成水印
 * @param {Element} target - 目标元素
 */
function regenerateWatermark(target) {
  const parentElement = target.parentElement;
  if (!parentElement) return;
  // 移除水印元素
  parentElement.removeChild(target);
  // 重新添加水印
  const pageNum = parseInt(target.dataset.pageNum);
  const viewport = viewportMap.get(pageNum);
  parentElement.appendChild(createWatermarkDOM(viewport, pageNum, watermarkConfig));
}

/**
 * 监听水印元素是否变化
 */
function setupWatermarkObserver() {
  const mutationObserver = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      const target = mutation.target;
      // 删除元素
      for (const node of mutation.removedNodes) {
        if (node.dataset.watermark) {
          const pageNum = parseInt(node.dataset.pageNum);
          const viewport = viewportMap.get(pageNum);
          const pageContainer = RenderContainer.value.querySelector(`[data-page-num="${pageNum}"]`);
          if (pageContainer) {
            pageContainer.appendChild(createWatermarkDOM(viewport, pageNum, watermarkConfig));
          }
        }
      }
      // 如果是水印元素
      if (target.dataset.watermark) {
        regenerateWatermark(target);
      }
    }
  });
  const watermarkElements = RenderContainer.value.querySelectorAll(".page-container");
  watermarkElements.forEach((element) => {
    mutationObserver.observe(element, {
      childList: true,
      subtree: true,
      attributes: true,
    });
  });
}

/**
 * 更新容器样式和CSS变量
 */
function updateContainerStyles() {
  const toolbar = ToolbarRef.value || {};
  const pdfViewer = PdfViewerRef.value || {};
  const pdfContainer = RenderContainer.value || {};
  if (toolbar || pdfViewer || pdfContainer) {
    const viewerRect = pdfViewer.getBoundingClientRect();
    const { containerPaddingTB, containerGap } = getDOMContainerRect();
    document.documentElement.style.setProperty("--toolbar-height", `${toolbar.offsetHeight || 0}px`);
    document.documentElement.style.setProperty("--viewer-top", `${viewerRect.top}px`);
    document.documentElement.style.setProperty("--container-padding", `${containerPaddingTB}px`);
    document.documentElement.style.setProperty("--container-gap", `${containerGap}px`);
  }
}

function getDOMContainerRect() {
  const containerStyle = getComputedStyle(RenderContainer.value);
  // 获取容器的内边距
  const containerPaddingTB = parseInt(containerStyle.paddingTop) + parseInt(containerStyle.paddingBottom);
  // 获取容器的外边距
  const containerPaddingLR = parseInt(containerStyle.paddingLeft) + parseInt(containerStyle.paddingRight);
  const containerGap = parseInt(containerStyle.gap);
  const containerHeight = RenderContainer.value.clientHeight - containerPaddingLR - containerGap;
  return { containerPaddingLR, containerPaddingTB, containerGap, containerHeight };
}

function getDocSize() {
  return currentPDF.value.getDownloadInfo().then((info) => {
    const docSize = info.length;
    const kb = docSize / 1024;
    const mb = kb / 1024;
    const gb = mb / 1024;
    if (kb < 1024) {
      docInfo.docSize = `${kb.toFixed(2)}KB`;
    } else if (mb < 1024) {
      docInfo.docSize = `${mb.toFixed(2)}MB`;
    } else {
      docInfo.docSize = `${gb.toFixed(2)}GB`;
    }
  });
}

function getDocMetadata() {
  return currentPDF.value.getMetadata().then((metadata) => {
    docInfo.pdfFormatVersion = metadata.info.PDFFormatVersion;
    docInfo.producer = metadata.info.Producer;
    docInfo.creator = metadata.info.Creator;
    docInfo.creationDate = metadata.info.CreationDate;
    docInfo.modificationDate = metadata.info.ModDate;
    docInfo.author = metadata.info.Author;
    docInfo.title = metadata.info.Title;
    docInfo.subject = metadata.info.Subject;
  });
}

/**
 * 切换全屏模式
 */
function showDocumentInfo() {
  if (!docInfo.pdfFormatVersion) {
    Promise.all([getDocSize(), getDocMetadata()]).then(() => {
      showInfoDialog.value = true;
    });
  } else {
    showInfoDialog.value = true;
  }
}

function toggleFullscreen() {
  const pdfViewer = PdfViewerRef.value;
  isFullscreen.value = !isFullscreen.value;

  triggerObserver.value = false;
  if (isFullscreen.value) {
    if (pdfViewer.requestFullscreen) {
      pdfViewer.requestFullscreen();
    } else if (pdfViewer.webkitRequestFullscreen) {
      pdfViewer.webkitRequestFullscreen();
    } else if (pdfViewer.msRequestFullscreen) {
      pdfViewer.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }

  // 全屏/非全屏默认滚动到当前页
  requestAnimationFrame(() => {
    setTimeout(() => {
      scrollToPage(currentPage.value);
      triggerObserver.value = true;
    }, 50);
  });
}

function handleFullscreenChange() {
  isFullscreen.value =
    !!document.fullscreenElement || !!document.webkitFullscreenElement || !!document.msFullscreenElement;
}

/**
 * 打印PDF文件（使用隐藏 iframe 更稳健地触发打印）
 */
async function printPDF() {
  try {
    if (!currentPDF.value) return;
    const pdfData = await currentPDF.value.getData();
    const blob = new Blob([pdfData], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    // 创建隐藏 iframe 用于打印
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.src = url;
    document.body.appendChild(iframe);

    const cleanup = () => {
      try {
        document.body.removeChild(iframe);
      } catch (_) {}
      URL.revokeObjectURL(url);
    };

    iframe.onload = () => {
      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (e) {
          console.error("打印调用失败:", e);
          alert("打印调用失败，请重试或检查浏览器设置");
        } finally {
          // 延迟清理，避免立即释放导致打印中断
          setTimeout(cleanup, 1000);
        }
      }, 100);
    };
  } catch (error) {
    alert("打印失败，请检查浏览器设置或文件内容");
  }
}

/**
 * 下载PDF文件
 */
async function downloadPDF() {
  if (!currentPDF.value || isDownloading.value) return;
  try {
    isDownloading.value = true;
    // 获取PDF数据
    const pdfData = await currentPDF.value.getData();
    // 创建Blob对象
    const blob = new Blob([pdfData], { type: "application/pdf" });
    // 创建下载链接
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = props.downloadFileName.endsWith(".pdf")
      ? props.downloadFileName
      : props.downloadFileName.concat(".pdf");
    document.body.appendChild(link);
    link.click();
    // 清理
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("下载PDF文件失败:", error);
  } finally {
    setTimeout(() => (isDownloading.value = false), 1000);
  }
}

onMounted(() => {
  nextTick().then(() => {
    if (props.showToolbar) {
      document.addEventListener("fullscreenchange", handleFullscreenChange);
      document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.addEventListener("MSFullscreenChange", handleFullscreenChange);
    }

    // 初始化时设置容器原始宽度
    const { containerPaddingLR } = getDOMContainerRect();
    containerOriginRect.width = RenderContainer.value.clientWidth - containerPaddingLR - 8;

    // 初始化时设置工具栏高度
    updateContainerStyles();
  });
});

onUnmounted(() => {
  document.removeEventListener("fullscreenchange", handleFullscreenChange);
  document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
  document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
});

function release() {
  viewportMap.clear();
  currentPDF.value = null;
  totalPages.value = 0;
  currentPage.value = 1;
  if (RenderContainer.value) {
    RenderContainer.value.innerHTML = "";
  }

  for (const prop of Object.keys(docInfo)) {
    docInfo[prop] = "";
  }
}

// 使用防抖避免频繁重绘
const debouncedRerender = debounce(async () => {
  updateContainerStyles();
  const { containerPaddingLR, containerHeight } = getDOMContainerRect();
  const newWidth = RenderContainer.value.clientWidth - containerPaddingLR - 8;
  const newHeight = containerHeight;

  // 容器尺寸变化才触发重渲染
  const widthChanged = newWidth !== containerOriginRect.width;
  const heightChanged = newHeight !== containerOriginRect.height;
  if (!widthChanged && !heightChanged) return;

  containerOriginRect.width = newWidth;
  containerOriginRect.height = newHeight;

  if (isLoaded.value && currentPDF.value) {
    await renderAllPages();
    // 保持当前页视图
    requestAnimationFrame(() => scrollToPage(currentPage.value));
  }
}, 200);

function handleResize() {
  debouncedRerender();
}

watch(
  () => props.fileUrl,
  async (newValue) => {
    if (newValue) {
      release();
      await loadPDF(newValue);
    }
  },
  { immediate: true, flush: "post" }
);

defineExpose({ pdf: currentPDF });
</script>

<style scoped>
@import "./style.css";
</style>
