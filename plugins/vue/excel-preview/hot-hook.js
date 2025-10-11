import { updateMergeListAfterRemoveRow, updateMergeListAfterRemoveCol } from './excel-sheet-utils';

/**
 * 插入行触发事件
 * @param {*} hotCoreInstance
 * @param {*} sheetData
 */
export function afterCreateRow(hotCoreInstance, currentSheet) {
  hotCoreInstance.addHook('afterCreateRow', (index, amount) => {
    if (!currentSheet) return;

    // 更新样式数组
    if (currentSheet.styles) {
      const newStyles = Array(amount).fill([]);
      currentSheet.styles.splice(index, 0, ...newStyles);
    }

    // 更新合并单元格
    if (currentSheet.mergeList) {
      currentSheet.mergeList = currentSheet.mergeList.map((merge) => {
        const { row, rowspan } = merge;
        // 更新起始行
        if (row >= index) return { ...merge, row: row + amount };
        // 更新合并行数
        if (row < index && row + rowspan > index) return { ...merge, rowspan: rowspan + amount };
        return merge;
      });
    }
  });
}

/**
 * 删除行触发事件
 * @param {*} hotCoreInstance
 * @param {*} currentSheet
 */
export function afterRemoveRow(hotCoreInstance, currentSheet) {
  hotCoreInstance.addHook('afterRemoveRow', (index, amount) => {
    if (!currentSheet) return;

    // 更新样式数组
    if (currentSheet.styles) {
      currentSheet.styles.splice(index, amount);
    }

    // 更新合并单元格
    if (currentSheet.mergeList) {
      currentSheet.mergeList = updateMergeListAfterRemoveRow(currentSheet.mergeList, index, amount);
    }
  });
}

/**
 * 插入列触发事件
 * @param {*} hotCoreInstance
 * @param {*} currentSheet
 */
export function afterCreateCol(hotCoreInstance, currentSheet) {
  hotCoreInstance.addHook('afterCreateCol', (index, amount) => {
    if (!currentSheet) return;

    // 更新样式数组
    if (currentSheet.styles) {
      currentSheet.styles.forEach((row) => {
        const newStyles = Array(amount).fill({});
        row.splice(index, 0, ...newStyles);
      });
    }

    // 更新合并单元格
    if (currentSheet.mergeList) {
      currentSheet.mergeList = currentSheet.mergeList.map((merge) => {
        const { col, colspan } = merge;
        // 更新起始列
        if (col >= index) return { ...merge, col: col + amount };
        // 更新合并列数
        if (col < index && col + colspan > index) return { ...merge, colspan: colspan + amount };
        return merge;
      });
    }
  });
}

/**
 * 删除列触发事件
 * @param {*} hotCoreInstance
 * @param {*} currentSheet
 */
export function afterRemoveCol(hotCoreInstance, currentSheet) {
  hotCoreInstance.addHook('afterRemoveCol', (index, amount) => {
    if (!currentSheet) return;

    // 更新样式数组
    if (currentSheet.styles) {
      currentSheet.styles.forEach((row) => {
        row.splice(index, amount);
      });
    }

    // 更新合并单元格
    if (currentSheet.mergeList) {
      currentSheet.mergeList = updateMergeListAfterRemoveCol(currentSheet.mergeList, index, amount);
    }
    console.log('currentSheet', currentSheet);
  });
}
