import { Plugin } from 'vite';

export interface GitTagOptions {
  // 获取的提交记录数量
  commitCount: number;
  // 标签创建成功后,是否同步Tag标签
  isSyncTag: boolean;
  // 是否创建Tag标签
  isCreateTag: boolean;
}

declare function ViteGitTag(options?: GitTagOptions): Plugin

export default ViteGitTag