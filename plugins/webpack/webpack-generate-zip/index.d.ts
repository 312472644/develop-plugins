import { Plugin } from 'vite';

interface IOptions {
  // 目标文件夹
  targetPath: string;
  // 生成压缩包名称
  filename: string;
  // 是否删除源文件夹
  deleteSourceFiles: string;
}

declare function generateZip(options: IOptions): Plugin;

export default generateZip;
