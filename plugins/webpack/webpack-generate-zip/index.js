import archiver from 'archiver';
import path from 'path';
import fs from 'fs';
import { logError, logSuccess } from '@develop-plugins/build';

/**
 * webpack plugin
 * @description zip dist
 * @param {Object} options { targetPath: 压缩目标文件夹目录, filename: 压缩文件生成压缩包名}
 * @class Zip
 */
class Zip {
  constructor(options) {
    this.options = Object.assign(
      { targetPath: 'dist', filename: 'dist.zip', deleteSourceFiles: true },
      options
    );
  }
  apply(compiler) {
    compiler.hooks.done.tap('Zip', () => {
      const rootPath = process.cwd();
      const { targetPath, filename, deleteSourceFiles } = this.options;
      // 压缩文件的目标路径
      const filePath = path.resolve(rootPath, targetPath);
      // 压缩生成文件的路径
      const zipPath = path.resolve(rootPath, filename);
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', {
        zlib: { level: 9 },
      });
      archive.directory(filePath, false);
      archive.pipe(output);
      output.on('close', function () {
        if (deleteSourceFiles) {
          // 删除目标文件夹
          fs.rmdirSync(filePath, { recursive: true });
        }
        logSuccess('压缩完成');
      });
      archive.on('error', function (err) {
        logError('压缩失败', err);
      });
      archive.finalize();
    });
  }
}

export default Zip;
