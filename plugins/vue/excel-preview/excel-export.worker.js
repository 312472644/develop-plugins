import ExcelJS from 'exceljs';
import { filterEmptyRowsAndCols, applyCellStyle } from './excel-sheet-utils';
import { EXCEL_MESSAGE_TYPES } from './types';

/**
 * 导出Excel工作簿
 * @param {Object} sheetData - 工作表数据
 * @returns {Promise<Buffer>} Excel文件的二进制数据
 */
async function exportWorkbook(sheetData, sheetTabList) {
  const workbook = new ExcelJS.Workbook();
  for (const sheetTab of sheetTabList) {
    const { data: sheetContent, styles, mergeList } = sheetData[sheetTab];
    const worksheet = workbook.addWorksheet(sheetTab);

    // 过滤掉空行和空列
    const { validRowIndices, validColIndices, filteredData } = filterEmptyRowsAndCols(sheetContent);

    // 在添加数据前设置列宽
    // validColIndices.forEach((_, index) => {
    //   const column = worksheet.getColumn(index + 1);
    //   column.width = 20; // 设置更合适的默认列宽
    // });

    filteredData.forEach((row, rowIndex) => {
      const excelRow = worksheet.addRow(row);
      row.forEach((_, colIndex) => {
        const cell = excelRow.getCell(colIndex + 1);
        const originalRowIndex = validRowIndices[rowIndex];
        const originalColIndex = validColIndices[colIndex];
        const style = styles[originalRowIndex]?.[originalColIndex];
        // 设置行高度
        // excelRow.height = 22;
        // 将样式应用到单元格
        applyCellStyle(cell, style || {});
      });
    });

    // 处理合并单元格
    if (mergeList?.length) {
      mergeList.forEach((mergeInfo) => {
        mergeCells(mergeInfo, worksheet, validRowIndices, validColIndices);
      });
    }
  }
  return await workbook.xlsx.writeBuffer();
}

async function handleExport(data, type) {
  const { sheetData, sheetTabList } = data;
  const buffer = await exportWorkbook(sheetData, sheetTabList);
  self.postMessage({ type: EXCEL_MESSAGE_TYPES.SUCCESS, originType: type, data: buffer });
}

/**
 * 将数字索引转换为Excel列字母
 * @param {number} index - 列索引
 * @returns {string} Excel列字母
 */
function convertToExcelColumn(index) {
  return String.fromCharCode(64 + index);
}

/**
 * 处理Excel工作表的合并单元格
 * @param {Object} params - 合并单元格参数
 * @param {Object} worksheet - Excel工作表对象
 * @param {Array} validRowIndices - 有效行索引
 * @param {Array} validColIndices - 有效列索引
 */
function mergeCells({ row, col, rowspan, colspan }, worksheet, validRowIndices, validColIndices) {
  // 计算结束的行和列
  const endRow = row + rowspan - 1;
  const endCol = col + colspan - 1;

  // 将原始行列索引转换为过滤后的索引
  const filteredStartRow = validRowIndices.indexOf(row) + 1;
  const filteredEndRow = validRowIndices.indexOf(endRow) + 1;
  const filteredStartCol = validColIndices.indexOf(col) + 1;
  const filteredEndCol = validColIndices.indexOf(endCol) + 1;

  // 确保所有索引都有效
  if (filteredStartRow > 0 && filteredEndRow > 0 && filteredStartCol > 0 && filteredEndCol > 0) {
    // 将数字索引转换为Excel列字母
    const startCell = `${convertToExcelColumn(filteredStartCol)}${filteredStartRow}`;
    const endCell = `${convertToExcelColumn(filteredEndCol)}${filteredEndRow}`;
    worksheet.mergeCells(`${startCell}:${endCell}`);
  }
}

// 监听来自主线程的消息
self.onmessage = async (e) => {
  const { type, data } = e.data;
  try {
    switch (type) {
      case EXCEL_MESSAGE_TYPES.EXPORT:
        await handleExport(data, type);
        break;
      default:
        break;
    }
  } catch (error) {
    self.postMessage({ type: EXCEL_MESSAGE_TYPES.ERROR, error: error.message });
  }
};
