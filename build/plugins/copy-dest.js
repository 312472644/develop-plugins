import path from 'path';
import { logError, logSuccess, copyFolderRecursive } from '../utils';

/**
 * @typedef ListItem
 * @property {String} target 目标目录
 * @property {String} source 源目录
 * @property {String} replacePath 替换路径
 */

/**
 * 复制文件目录到另一个目录
 * @param {Object} options
 * @param {Array<ListItem>} options.list 复制目录列表
 * @returns {import('vite').Plugin}
 */
function copyDest(options = { list: [] }) {
  const { list } = options;
  return {
    name: 'vite-copy-dest',
    closeBundle() {
      if (!list || list.length === 0) {
        logError('[vite-copy-dest] 请配置复制目录信息！');
        return;
      }
      try {
        list.forEach(item => {
          const { target, source, replacePath } = item;
          const packagesPath = process.cwd().replace(replacePath, '');
          const targetPath = path.join(packagesPath, target);
          const sourcePath = path.join(packagesPath, source);
          copyFolderRecursive(targetPath, sourcePath);
          logSuccess(`[vite-copy-dest] ${sourcePath}文件复制成功！`);
        });
      } catch (e) {
        logError(`[vite-copy-dest] 文件复制失败！错误信息：${e}`);
      }
    },
  };
}

export default copyDest;
