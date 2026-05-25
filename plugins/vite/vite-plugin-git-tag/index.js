import GitTag from "./git-tag/GitTag.js";
import chalk from "chalk";

/**
 * 自动创建Git Tag标签插件
 * @param {object} params
 * @param {boolean} params.isCreatedTag 是否创建Tag标签
 * @param {number} params.commitCount 提交记录数量
 * @param {boolean} params.isSyncTag 是否同步到远端仓库
 * @returns
 */
export default function vitePluginGitTag(params = {}) {
  const { isCreatedTag, commitCount, isSyncTag } = { ...{ isCreatedTag: true }, ...params };
  return {
    name: "git-tag",
    apply: "build",
    buildEnd() {
      if (!isCreatedTag) return;
      setTimeout(() => {
        console.log(`\n${chalk.hex("#007bff")("【Git Tag】")}自动创建Git Tag标签\n\n`);
        const gitTag = new GitTag({ commitCount, isSyncTag });
        gitTag.init();
      }, 500);
    },
  };
}
