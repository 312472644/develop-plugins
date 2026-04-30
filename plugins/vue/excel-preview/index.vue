<template>
  <div class="excel-preview">
    <Toolbar
      v-if="showToolbar"
      :export-btn-disabled="exportBtnDisabled"
      :save-btn-disabled="saveBtnDisabled"
      :show-sheet-tabs="Object.keys(sheetData).length > 0"
      :readonly="readOnly"
      @export="handleExportExcel"
      @save="saveData"
    />
    <Loading
      custom-class="excel-preview-loading"
      :style="{ zIndex: loading ? 9999 : -1, top: showToolbar ? '58px' : '0px' }"
      :loading="loading"
    />
    <SheetTabs
      ref="SheetTabsRef"
      :readonly="readOnly"
      :sheet-tab-list="sheetTabList"
      :active-sheet="activeSheet"
      @delete-sheet="handleDelete"
      @add-sheet="handleAddSheet"
      @sheet-change="handleSheetChange"
    />
    <div :style="{ height: height }" class="ht-theme-main-dark-auto border">
      <hot-table
        v-if="tableData.length > 0"
        ref="hot"
        :data="tableData"
        license-key="non-commercial-and-evaluation"
        :row-headers="rowHeaders"
        :col-headers="colHeaders"
        :manual-row-resize="manualRowResize"
        :manual-column-resize="manualColumnResize"
        :min-spare-rows="minSpareRows"
        :dropdown-menu="dropdownMenu"
        :min-spare-cols="minSpareCols"
        :context-menu="contextMenu"
        :drag-to-scroll="true"
        :read-only="readOnly"
        :height="height"
        :width="width"
        language="zh-CN"
        :col-widths="colWidths"
        :render-all-rows="false"
        :init="hotTableInit"
        :renderer="renderer"
        :settings="hotSettings"
        :after-merge-cells="afterMergeCells"
        v-bind="$attrs"
      ></hot-table>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  effectScope,
  computed,
  onMounted,
  watch,
  shallowRef,
  onBeforeUnmount,
  nextTick,
  provide,
  toRaw,
} from "vue";
import ExcelJS from "exceljs";
import { HotTable } from "@handsontable/vue3";
import { registerAllModules } from "handsontable/registry";
import { registerLanguageDictionary, zhCN } from "handsontable/i18n";
import {
  delay,
  runMicrotask,
  processExcelSheetData,
  downloadExcel,
  getSheetData,
  interceptContextMenu,
  updateStyles,
  getMergeListByWorksheet,
  getMergeListByTable,
  blobToArrayBuffer,
} from "./excel-sheet-utils";
import { afterCreateRow, afterRemoveRow, afterCreateCol, afterRemoveCol } from "./hot-hook";
import { EXCEL_MESSAGE_TYPES } from "./types";
import Loading from "../x-loading/index.vue";
import Toolbar from "./Toolbar.vue";
import SheetTabs from "./SheetTabs.vue";
import XMessage from "@develop-plugins/x-message";
import ExcelExportWorker from './excel-export.worker.js?worker&inline';

// 样式导入
import "handsontable/styles/handsontable.min.css";
import "handsontable/styles/ht-theme-main.min.css";

provide("XMessage", XMessage);

// 组件注册
registerLanguageDictionary(zhCN);
registerAllModules();
defineOptions({ name: "ExcelPreview" });

// 组件定义
const emits = defineEmits(["export", "save"]);

// Props定义
const props = defineProps({
  /**
   * 数据分为两种：
   * 1. 直接传入表格数据（Array）
   * 2. 传入excel文件（ArrayBuffer、Uint8Array）
   */
  data: {
    type: [Uint8Array, ArrayBuffer, Array, Blob],
    default: () => {},
  },
  // 表头下拉菜单
  dropdownMenu: {
    type: [Boolean, Array, Object],
    default: true,
  },
  // 表格右键菜单
  contextMenu: {
    type: [Boolean, Array, Object],
    default: true,
  },
  // 是否只读
  readOnly: {
    type: Boolean,
    default: false,
  },
  // 是否显示标题行
  rowHeaders: {
    type: Boolean,
    default: true,
  },
  // 是否显示标题列
  colHeaders: {
    type: Boolean,
    default: true,
  },
  // 是否手动调整行高
  manualRowResize: {
    type: Boolean,
    default: true,
  },
  // 手动手动调整列宽
  manualColumnResize: {
    type: Boolean,
    default: true,
  },
  // 表格高度
  width: {
    type: [String, Number],
    default: "100%",
  },
  // 表格高度
  height: {
    type: [String, Number],
    default: "400px",
  },
  // 表格列宽度
  colWidths: {
    type: [Number, Array, Function],
    default: 100,
  },
  // 导入excel时保留的最小行数
  minSpareRows: {
    type: Number,
    default: 0,
  },
  // 导入excel时保留的最小列数
  minSpareCols: {
    type: Number,
    default: 0,
  },
  // 导出excel文件名
  downloadFileName: {
    type: String,
    default: "export.xlsx",
  },
  // 是否显示工具栏
  showToolbar: {
    type: Boolean,
    default: true,
  },
});

// 常量定义
const DEFAULT_SHEET_NAME = "Sheet1";

// 表格核心对象实例
let hotCoreInstance = null;
const SheetTabsRef = ref(null);
const hot = ref(null);
const tableData = ref([]);
const sheetData = shallowRef({});
const activeSheet = ref(DEFAULT_SHEET_NAME);
const loading = ref(false);
const saveBtnDisabled = ref(false);
const exportBtnDisabled = ref(false);
const sheetTabList = ref([]);

const currentScope = effectScope();
// const worker = new Worker(new URL("./excel-export.worker.js", import.meta.url), { type: "module" });
const worker = new ExcelExportWorker();

const loadingHeight = computed(() => {
  const tabHeight = SheetTabsRef.value.$el.offsetHeight;
  if (props.height.toString().includes("px")) {
    return Number.parseInt(props.height) + tabHeight + "px";
  }
  return props.height + tabHeight + "px";
});

const hotSettings = {
  // 拦截右键菜单
  afterContextMenuDefaultOptions(menuItems) {
    interceptContextMenu(menuItems, "alignment", (key) => {
      const alignment = key.split(":").pop();
      const selected = hotCoreInstance.getSelected();
      updateStyles(sheetData.value, activeSheet.value, alignment, selected);
    });
  },
};

function afterMergeCells() {
  const mergeCells = getMergeListByTable(hotCoreInstance);
  sheetData.value[activeSheet.value].mergeList = mergeCells || [];
}

function handleAddSheet(name) {
  if (sheetData.value[name]) return;
  const data = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => ""));
  sheetData.value = { ...sheetData.value, [name]: { data, styles: [], mergeList: [] } };
  activeSheet.value = name;
  sheetTabList.value.push(name);
  updateTableData(data);
}

function handleDelete(name) {
  if (sheetTabList.value.length <= 1) return;

  // 更新sheet列表和当前活动sheet
  const filteredSheetList = sheetTabList.value.filter((t) => t !== name);
  if (name === activeSheet.value) {
    const currentIndex = sheetTabList.value.findIndex((t) => t === name);
    const newActiveIndex = Math.max(0, currentIndex - 1);
    activeSheet.value = filteredSheetList[newActiveIndex];
  }

  // 更新sheet数据
  const { ...remainingSheets } = sheetData.value;
  sheetTabList.value = filteredSheetList;
  sheetData.value = remainingSheets;
  delete sheetData.value[name];
  updateTableData(sheetData.value[activeSheet.value].data);
}

/**
 * 保存数据
 */
function saveData() {
  if (!hotCoreInstance) return;
  saveBtnDisabled.value = true;
  runMicrotask(() => {
    const mergeCells = getMergeListByTable(hotCoreInstance);
    // 更新合并单元格
    sheetData.value[activeSheet.value].mergeList = mergeCells || [];
    const cloneData = JSON.parse(JSON.stringify(sheetData.value));
    const dataToSave = getSheetData(cloneData, sheetTabList.value);
    saveBtnDisabled.value = false;
    emits("save", dataToSave);
  });
}

// 渲染单元格
function renderer(instance, td, row, col, prop, value, cellProperties) {
  if (cellProperties.className) {
    td.classList = cellProperties.className;
  }

  if (sheetData.value[activeSheet.value]?.styles?.[row]?.[col]) {
    const cellStyle = sheetData.value[activeSheet.value].styles[row][col];

    if (cellStyle.font?.bold) td.style.fontWeight = "bold";
    if (cellStyle.font?.italic) td.style.fontStyle = "italic";
    if (cellStyle.font?.underline) td.style.textDecoration = "underline";
    if (cellStyle.font?.color?.rgb) td.style.color = `#${cellStyle.font.color.rgb}`;
    if (cellStyle.fgColor?.rgb) td.style.backgroundColor = `#${cellStyle.fgColor.rgb}`;
    // 设置单元格对齐方式
    if (cellStyle.alignment) {
      // 水平对齐
      td.style.textAlign = cellStyle.alignment?.horizontal || "left";
      // 垂直对齐
      td.style.verticalAlign = cellStyle.alignment?.vertical || "top";
    }
  }

  td.innerHTML = value === null ? "" : value;
  return td;
}

function updateTableData(data = []) {
  tableData.value = data?.length > 0 ? data : Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => ""));
  nextTick(() => {
    if (hotCoreInstance) {
      hotCoreInstance?.loadData?.(tableData.value);
      const mergeCells = sheetData.value[activeSheet.value].mergeList;
      hotCoreInstance.updateSettings({ mergeCells });
      hotCoreInstance.render();
    }
  });
}

/**
 * 渲染excel数据到表格
 */
async function renderExcelToTable(data) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(data);
  const sheets = {};

  workbook.eachSheet((worksheet) => {
    // 将excel数据转换为表格数据以及样式
    const { data, styles } = processExcelSheetData(worksheet);
    if (data.length === 0) return;
    const mergeList = getMergeListByWorksheet(worksheet);
    sheets[worksheet.name] = { data, styles, mergeList };
    sheetTabList.value.push(worksheet.name);
  });

  const firstSheet = workbook.worksheets[0].name;
  sheetData.value = sheets;
  activeSheet.value = firstSheet;
  updateTableData(sheets[firstSheet].data);
}

/**
 * 导出excel
 */
async function handleExportExcel() {
  loading.value = true;
  exportBtnDisabled.value = true;
  try {
    const cloneData = JSON.parse(JSON.stringify(sheetData.value));
    const cloneSheetList = structuredClone(toRaw(sheetTabList.value));
    worker.postMessage({
      type: EXCEL_MESSAGE_TYPES.EXPORT,
      data: { sheetData: cloneData, sheetTabList: cloneSheetList },
    });
  } catch (error) {
    throw new Error("导出excel失败：" + error);
  }
}

function handleSheetChange(name) {
  if (name === activeSheet.value) return;
  activeSheet.value = name;
  const currentSheet = sheetData.value[name];
  if (!currentSheet) return;
  updateTableData(currentSheet.data);
}

/**
 * 初始化表格数据10*10
 */
function initTableData() {
  const data = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => ""));
  sheetData.value = { [DEFAULT_SHEET_NAME]: { data, styles: [] } };
  activeSheet.value = DEFAULT_SHEET_NAME;
  sheetTabList.value = [DEFAULT_SHEET_NAME];
  updateTableData(data);
}

/**
 * 处理web worker消息
 */
function handleWebWorkerMessage() {
  worker.onmessage = async (e) => {
    const { type, data, error, originType } = e.data;
    delay().then(() => {
      // 处理导入excel事件
      if (type === EXCEL_MESSAGE_TYPES.SUCCESS && originType === EXCEL_MESSAGE_TYPES.EXPORT) {
        const fileName = props.downloadFileName.endsWith(".xlsx")
          ? props.downloadFileName
          : `${props.downloadFileName}.xlsx`;
        downloadExcel(data, fileName).then(emits("export"));
      } else {
        console.error(error);
      }
      exportBtnDisabled.value = false;
      loading.value = false;
    });
  };
}

function reset() {
  sheetData.value = {};
  activeSheet.value = DEFAULT_SHEET_NAME;
  sheetTabList.value = [];
  tableData.value = [];
}

/**
 * 渲染数据到表格
 */
async function renderDataToTable(val) {
  reset();
  loading.value = true;
  // Blob数据
  if (val instanceof Blob) {
    const blob = await blobToArrayBuffer(val);
    renderExcelToTable(blob);
  }
  // 从excel导入的数据
  else if (val instanceof Uint8Array || val instanceof ArrayBuffer) {
    renderExcelToTable(val);
  }
  // 接口渲染数据
  else if (val instanceof Object && Array.isArray(val)) {
    sheetTabList.value = val?.map((t) => t.sheetName);
    sheetData.value = val.reduce((acc, cur) => {
      acc[cur.sheetName] = { data: cur.data, styles: cur.styles, mergeList: cur.mergeList };
      return acc;
    }, {});
    activeSheet.value = sheetTabList.value?.[0];
    updateTableData(sheetData.value[activeSheet.value]?.data);
  }
  delay().then(() => {
    loading.value = false;
    if (tableData.value.length === 0) {
      initTableData();
    }
  });
}

// 表格操作hooks监听
function bindHotHook() {
  afterCreateRow(hotCoreInstance, sheetData.value[activeSheet.value]);
  afterRemoveRow(hotCoreInstance, sheetData.value[activeSheet.value]);
  afterCreateCol(hotCoreInstance, sheetData.value[activeSheet.value]);
  afterRemoveCol(hotCoreInstance, sheetData.value[activeSheet.value]);
}

// 表格初始化
function hotTableInit() {
  const instance = hot.value?.hotInstance;
  if (!instance) return;
  hotCoreInstance = instance;
  bindHotHook();
}

onMounted(() => {
  handleWebWorkerMessage();
});

onBeforeUnmount(() => {
  worker.terminate();
  currentScope.stop();
});

currentScope.run(() => {
  watch(
    () => props.data,
    (val) => {
      renderDataToTable(val);
    },
    { immediate: true }
  );
});
</script>

<style scoped>
.excel-preview {
  position: relative;
}
.excel-preview .border {
  border: 1px solid #e7e7e9;
  border-top: none;
}

.sheet-tabs {
  display: flex;
  gap: 0;
  margin: 0;
  background: #ebedf0;
  padding: 4px 16px 0 16px;
  border-top: 1px solid #dedede;
  border-left: 1px solid #e4e7ed;
  border-right: 1px solid #e4e7ed;
}

.sheet-tabs div {
  padding: 4px 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #606266;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  margin: 0 0 0 24px;
}

.sheet-tabs div:first-child {
  margin-left: 0;
}

.sheet-tabs div:hover {
  color: #1a42e8;
}

.sheet-tabs div.active {
  color: #1a42e8;
  font-weight: 500;
}

.sheet-tabs div.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #1a42e8;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
<style>
.excel-preview-loading {
  position: absolute;
  top: 58px;
  left: 0;
  right: 0;
  height: v-bind(loadingHeight);
  z-index: 9999;
  background: #fff;
  bottom: 0;
}

.excel-preview-loading .x-loading-container {
  height: 100% !important;
}
</style>
