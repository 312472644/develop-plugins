import archiver from 'archiver';
import path from 'path';
import fs from 'fs';
import { logError, logSuccess } from '@develop-plugins/build';

/**
 * 生产环境打包完成后，将 dist 文件夹压缩成 dist.zip
 * @param {Object} options 配置项
 * @param {String} options.targetPath 目标文件夹，默认 dist
 * @param {String} options.filename 压缩包名称，默认 dist
 * @param {Boolean} options.deleteSourceFiles 是否删除源文件夹，默认 true
 * @returns
 */
export default function generateZip(options = {}) {
  return {
    name: 'vite-generate-zip',
    apply: 'build',
    closeBundle: function () {
      const mergeOptions = Object.assign(
        { targetPath: 'dist', filename: 'dist', deleteSourceFiles: true },
        options
      );
      const rootPath = process.cwd();
      const { targetPath, filename } = mergeOptions;
      // 压缩文件的目标路径
      const filePath = path.resolve(rootPath, targetPath);
      if (!fs.existsSync(filePath)) {
        logError('生成压缩文件失败，目标文件夹不存在');
        process.exit(1);
      }
      // 压缩生成文件的路径
      const zipPath = path.resolve(rootPath, `${filename}.zip`);
      if (fs.existsSync(zipPath)) {
        fs.unlinkSync(zipPath);
      }
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });
      archive.directory(filePath, false);
      archive.pipe(output);
      output.on('close', function () {
        if (mergeOptions.deleteSourceFiles) {
          // 删除目标文件夹
          fs.rmdirSync(filePath, { recursive: true });
        }
        logSuccess('压缩完成');
      });
      archive.on('error', function (err) {
        logError('压缩失败', err);
      });
      archive.finalize();
    },
  };
}
