/**
 * 检查单元格是否为空
 * @param {*} cell 单元格值
 * @returns {boolean} 是否为空
 * */
const isEmpty = (cell) => cell === '' || cell === undefined || (typeof cell === 'string' && cell.trim() === '');

/**
 * 检查行或列是否包含非空单元格
 * @param {Array} cells 行或列数据
 * @returns {boolean} 是否包含非空单元格
 * */
const hasNonEmptyCell = (cells) => cells.some((cell) => !isEmpty(cell));

/**
 * 获取最后一个非空行的索引
 * @param {Array} data 数据数组
 * @returns {number} 最后一个非空行的索引，如果全为空则返回-1
 */
const getLastNonEmptyRowIndex = (data) => {
  for (let i = data.length - 1; i >= 0; i--) {
    if (hasNonEmptyCell(data[i])) {
      return i;
    }
  }
  return -1;
};

/**
 * 获取有效列索引
 * @param {Array} processedData 处理后的数据
 * @returns {Array<number>} 有效列索引数组
 */
const getValidColumnIndices = (processedData) => {
  if (!processedData.length) return [];
  const maxColLength = processedData.reduce((max, row) => Math.max(max, row.length), 0);
  return Array.from({ length: maxColLength }, (_, colIndex) => colIndex).filter((colIndex) =>
    processedData.some((row) => !isEmpty(row[colIndex]))
  );
};

/**
 * 过滤Excel数据中的空行和空列
 * @param {Array} data 原始数据
 * @returns {{validRowIndices: number[], validColIndices: number[], filteredData: Array}}
 */
export function filterEmptyRowsAndCols(data) {
  const processedData = Array.isArray(data) ? data : [];
  if (!processedData.length) return { validRowIndices: [], validColIndices: [], filteredData: [] };

  const lastNonEmptyRowIndex = getLastNonEmptyRowIndex(processedData);

  // 获取有效行索引 - 只保留到最后一个非空行
  const validRowIndices = Array.from({ length: lastNonEmptyRowIndex + 1 }, (_, i) => i);

  // 获取有效列索引 - 只过滤完全空白的列
  const validColIndices = getValidColumnIndices(processedData);

  // 生成过滤后的数据 - 保留行和列之间的空值
  const filteredData = validRowIndices.map((rowIndex) =>
    validColIndices.map((colIndex) => processedData[rowIndex][colIndex])
  );

  return { validRowIndices, validColIndices, filteredData };
}

/**
 * 应用单元格样式
 * @param {Object} cell ExcelJS单元格对象
 * @param {Object} style 样式对象
 */
export function applyCellStyle(cell, style) {
  if (!style) return;

  // 应用字体样式
  cell.font = {
    name: style.font?.name || 'Arial',
    bold: style.font?.bold || false,
    italic: style.font?.italic || false,
    underline: style.font?.underline || false,
    color: { argb: style.font?.color?.rgb ? 'FF' + style.font.color.rgb : 'FF000000' }
  };

  // 应用背景色
  if (style.fgColor?.rgb) {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF' + style.fgColor.rgb }
    };
  }

  // 应用对齐方式
  if (style?.alignment) {
    cell.alignment = {
      vertical: style.alignment?.vertical || 'middle',
      horizontal: style.alignment?.horizontal || 'left',
      wrapText: true
    };
  }

  // 应用边框
  cell.border = {
    top: { style: 'thin', color: { argb: 'FF000000' } },
    left: { style: 'thin', color: { argb: 'FF000000' } },
    bottom: { style: 'thin', color: { argb: 'FF000000' } },
    right: { style: 'thin', color: { argb: 'FF000000' } }
  };
}

/**
 * 处理Excel工作表数据和样式
 * @param {ExcelJS.Worksheet} worksheet - Excel工作表对象
 * @returns {{ data: Array<Array<string>>, styles: Array<Array<Object>> }} 处理后的数据和样式
 */
function getCellStyle(cell) {
  const cellStyle = cell.style;
  const fontStyle = cellStyle?.font || {};
  const fillStyle = cellStyle?.fill || {};
  const borderStyle = cellStyle?.border || {};
  const alignmentStyle = cellStyle?.alignment || {};
  return {
    font: {
      name: fontStyle.name || 'Arial',
      size: fontStyle.size || 11,
      bold: fontStyle.bold || false,
      italic: fontStyle.italic || false,
      underline: fontStyle.underline || false,
      color: { rgb: fontStyle?.color?.argb?.substring(2) || '000000' }
    },
    fgColor: { rgb: fillStyle?.fgColor?.argb?.substring(2) || 'FFFFFF' },
    border: {
      top: { style: borderStyle.top?.style || 'thin' },
      left: { style: borderStyle.left?.style || 'thin' },
      bottom: { style: borderStyle.bottom?.style || 'thin' },
      right: { style: borderStyle.right?.style || 'thin' }
    },
    alignment: {
      vertical: alignmentStyle?.vertical || 'middle',
      horizontal: alignmentStyle?.horizontal || 'left',
      wrapText: alignmentStyle?.wrapText || true
    }
  };
}

/**
 * 获取excel合并单元格信息
 * @param {ExcelJS.Worksheet} worksheet - Excel工作表对象
 * @returns {Array} 合并单元格信息数组
 */
export function getMergeListByWorksheet(worksheet) {
  // 处理合并单元格信息
  const merges = worksheet._merges || {};
  const mergeCells = [];
  for (const [_, merge] of Object.entries(merges)) {
    const { top, left, bottom, right } = merge;
    mergeCells.push({
      row: top - 1,
      col: left - 1,
      rowspan: bottom - top + 1,
      colspan: right - left + 1
    });
  }
  return mergeCells;
}

/**
 * 获取表格合并单元格信息
 * @param {Object} hotCoreInstance - Handsontable实例
 * @returns {Array} 合并单元格信息数组
 */
export function getMergeListByTable(hotCoreInstance) {
  const mergePlugin = hotCoreInstance.getPlugin('mergeCells');
  const mergedCells = mergePlugin.mergedCellsCollection?.mergedCells;
  return (mergedCells || []).map((cell) => {
    return {
      row: cell.row,
      col: cell.col,
      rowspan: cell.rowspan,
      colspan: cell.colspan
    };
  });
}

/**
 * 处理Excel工作表数据和样式
 * @param {ExcelJS.Worksheet} worksheet - Excel工作表对象
 * @returns {{ data: Array<Array<string>>, styles: Array<Array<Object>> }} 处理后的数据和样式
 */
export function processExcelSheetData(worksheet) {
  const maxRow = worksheet.rowCount;
  const maxCol = worksheet.columnCount;

  // 初始化数据和样式数组
  const data = Array.from({ length: maxRow }, () => new Array(maxCol).fill(''));
  const styles = Array.from({ length: maxRow }, () => new Array(maxCol).fill(null));

  // 遍历所有单元格获取数据和样式
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const rowIndex = rowNumber - 1;
      const colIndex = colNumber - 1;
      data[rowIndex][colIndex] = cell.text || '';
      const cellStyle = getCellStyle(cell);
      styles[rowIndex][colIndex] = {
        ...cellStyle,
        ...styles[rowIndex][colIndex] // 保留合并单元格信息
      };
    });
  });

  return { data, styles };
}

/**
 * 下载Excel文件
 * @param {ExcelJS.Workbook} workbook - Excel工作簿对象
 * @param {string} fileName - 下载文件的名称，默认为'表格导出.xlsx'
 * @returns {Promise<void>}
 */
export function downloadExcel(data, fileName = '表格导出.xlsx') {
  return new Promise((resolve) => {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    resolve();
  });
}

/**
 * 拦截右键菜单
 * @param {object} menuItems - 菜单对象
 * @param {function} callback - 回调函数
 */
/**
 * 更新单元格样式
 * @param {Object} sheetData - 工作表数据引用
 * @param {string} activeSheet - 当前活动工作表名称
 * @param {string} key - 样式键值
 * @param {Array} selected - 选中的单元格范围
 */
export function updateStyles(sheetData, activeSheet, key, selected) {
  if (!selected?.length) return;

  // 初始化样式对象
  sheetData[activeSheet] ??= {};
  sheetData[activeSheet].styles ??= {};

  // 遍历所有选中的单元格
  for (const [startRow, startCol, endRow, endCol] of selected) {
    for (let row = startRow; row <= endRow; row++) {
      sheetData[activeSheet].styles[row] ??= {};

      for (let col = startCol; col <= endCol; col++) {
        sheetData[activeSheet].styles[row][col] ??= {};
        sheetData[activeSheet].styles[row][col].alignment ??= {};
        sheetData[activeSheet].styles[row][col].alignment.horizontal = key;
      }
    }
  }
}

/**
 * 拦截指定菜单的右键点击事件
 * @param {*} menuItems
 * @param {*} callback
 */
export function interceptContextMenu(menuItems, key, callback) {
  // 找到 alignment 子菜单项
  const alignmentMenu = menuItems.items.find((item) => item.key === key);

  if (alignmentMenu && alignmentMenu.submenu?.items) {
    alignmentMenu.submenu.items.forEach((subItem) => {
      const originalCallback = subItem.callback;
      subItem.callback = function (...args) {
        callback(subItem.key);
        // 原功能继续执行
        originalCallback?.apply(this, args);
      };
    });
  }
}

/**
 * 模拟微任务
 * @param {Function} callback 回调函数
 */
export function runMicrotask(tasks) {
  // 微任务队列
  if (typeof queueMicrotask === 'function') {
    return queueMicrotask(tasks);
  }
  // 微任务队列
  if (typeof Promise === 'function') {
    return Promise.resolve().then(tasks);
  }
  // 宏任务队列
  setTimeout(tasks, 0);
}

/**
 * 延迟执行
 * @param {*} time
 * @returns
 */
export function delay(time = 1000) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * 获取保存的数据
 * @param {*} sheet
 * @param {Array} sheetTabList
 * @returns
 */
export function getSheetData(sheet = {}, sheetTabList = []) {
  const dataList = [];
  for (const sheetName of sheetTabList) {
    const { data, styles, mergeList } = sheet[sheetName] || {};
    dataList.push({
      sheetName,
      data,
      styles,
      mergeList
    });
  }
  // const result = {};
  // for (const [sheetName, { data, styles, mergeList }] of Object.entries(sheet)) {
  //   const filteredData = filterEmptyRowsAndCols(data).filteredData;
  //   if (!result[sheetName]) result[sheetName] = {};
  //   result[sheetName].data = filteredData;
  //   result[sheetName].styles = styles;
  //   result[sheetName].mergeList = mergeList;
  // }
  return dataList;
}

/**
 * Blob转ArrayBuffer
 * @param {Blob} blob
 * @returns
 */
export function blobToArrayBuffer(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
}

/**
 * 处理删除行后的合并单元格更新
 * @param {Array} mergeList 合并单元格列表
 * @param {number} index 删除的起始行索引
 * @param {number} amount 删除的行数
 * @returns {Array} 更新后的合并单元格列表
 */
export function updateMergeListAfterRemoveRow(mergeList, index, amount) {
  return mergeList.reduce((acc, merge) => {
    const { row, rowspan } = merge;
    // 计算合并区域的结束行
    const endRow = row + rowspan;
    // 删除的结束行
    const deleteEndRow = index + amount;

    // 合并区域在删除范围之前
    if (endRow <= index) return [...acc, merge];

    // 合并区域在删除范围之后
    if (row >= deleteEndRow) {
      return [...acc, { ...merge, row: row - amount }];
    }

    // 合并区域与删除范围有交集
    if (row < deleteEndRow && endRow > index) {
      const newRowspan = rowspan - Math.min(deleteEndRow - row, rowspan);
      if (newRowspan > 0) {
        return [...acc, { ...merge, rowspan: newRowspan }];
      }
    }

    return acc;
  }, []);
}

/**
 * 删除列后更新合并单元格列表
 * @param {Array} mergeList 合并单元格列表
 * @param {number} index 删除的起始列索引
 * @param {number} amount 删除的列数
 * @returns {Array} 更新后的合并单元格列表
 */
export function updateMergeListAfterRemoveCol(mergeList, index, amount) {
  if (!mergeList || !mergeList.length) return mergeList;

  return mergeList
    .filter((merge) => {
      // 过滤掉完全在删除范围内的合并单元格
      return !(merge.col >= index && merge.col + merge.colspan <= index + amount);
    })
    .map((merge) => {
      const { col, colspan } = merge;
      if (col >= index + amount) {
        // 在删除范围之后的合并单元格，更新起始列
        return { ...merge, col: col - amount };
      } else if (col < index && col + colspan > index) {
        // 与删除范围有交集的合并单元格，更新合并列数和起始列
        const overlap = Math.min(col + colspan, index + amount) - index;
        return { ...merge, colspan: colspan - overlap };
      } else if (col >= index && col < index + amount) {
        // 合并区域起始列在删除范围内，但结束列在删除范围之后
        const newCol = index;
        const newColspan = colspan - (index + amount - col);
        return { ...merge, col: newCol, colspan: newColspan };
      }
      return merge;
    });
}
