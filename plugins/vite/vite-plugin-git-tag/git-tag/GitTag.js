import { intro, outro, text, spinner, log, select, isCancel, group } from "@clack/prompts";
import pico from "picocolors";
import {
  executeCommand,
  getCurrentBranch,
  delay,
  getListByStdout,
  requiredItem,
  getCurrentDate,
  omitUndefined,
} from "./utils.js";

/**
 * GitTag类
 * @param {Object} config 配置对象
 * @param {number} config.commitCount 获取的提交记录数量
 * @param {boolean} config.isSyncTag 标签创建成功后,是否同步Tag标签
 */
class GitTag {
  constructor(config = {}) {
    this.config = { ...{ commitCount: 10, isSyncTag: true }, ...omitUndefined(config) };
    this.tagInfo = {
      branch: "",
      commitHash: "",
      tagMessage: "",
      tagName: getCurrentDate(),
    };
    this.spinner = spinner({ indicator: "dots" });
  }
  /**
   * 从远端拉取项目所有分支列表
   * @returns
   */
  async fetchRemoteBranch() {
    try {
      this.spinner.start("正在从远端拉取项目所有分支列表...");
      const branches = await executeCommand("git branch");
      await delay();
      this.spinner.stop("项目所有分支列表拉取完成");
      const selectBranch = await this.createGitOptions(branches);
      if (!selectBranch) return;
      this.tagInfo.branch = selectBranch;
      // 从远端拉取项目所有提交记录
      this.fetchRemoteCommitByBranch(selectBranch);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
  /**
   * 从远端拉取项目所有提交记录
   * @param {string} branch 分支名称
   */
  async fetchRemoteCommitByBranch(branch) {
    try {
      this.spinner.start(`正在拉取${branch}分支的前${this.config.commitCount}条提交记录...`);
      const topCommitsStdout = await executeCommand(`git log --oneline -n${this.config.commitCount} ${branch}`);
      await delay();
      this.spinner.stop(`拉取${branch}分支记录完成`);
      const commitHash = await this.createLatestCommitOptions(getListByStdout(topCommitsStdout));
      if (!commitHash) return;
      this.tagInfo.commitHash = commitHash;
      // 输入Tag标签名称和说明信息
      await this.inputTagInfo();
    } catch (error) {
      console.error(error);
      outro(pico.red("拉取项目所有提交记录失败"));
      process.exit(1);
    }
  }
  /**
   * 输入Tag标签名称和说明信息
   * @returns {Promise<{tagName: string, tagMessage: string}>} 包含Tag标签名称和说明信息的对象
   */
  async inputTagInfo() {
    const { tagName } = this.tagInfo;

    const results = await group(
      {
        tagName: () =>
          text({
            message: requiredItem("请输入Tag标签名称"),
            name: "tagName",
            placeholder: "请输入Tag标签名称",
            initialValue: tagName,
            validate(value) {
              if (value?.length === 0) return pico.red(`请输入Tag标签名称`);
            },
          }),
        tagMessage: () =>
          text({
            message: "请输入Tag标签说明信息",
            name: "tagMessage",
            initialValue: "",
            placeholder: "请输入Tag标签说明信息,不超过50个字",
          }),
      },
      {
        onCancel: () => {
          outro(pico.bgRed("用户取消输入Tag标签名称和说明信息"));
          process.exit(0);
        },
      }
    );
    this.tagInfo.tagName = results.tagName.trim();
    this.tagInfo.tagMessage = results.tagMessage.trim();

    // 检查Tag标签是否存在已存在
    const isExist = await this.checkTagIsExist();
    if (isExist) {
      log.error(pico.red(`Tag标签：【${this.tagInfo.tagName}】已存在`));
      // 重新输入Tag标签名称和说明信息
      await this.inputTagInfo();
      return;
      // process.exit(1);
    }

    // 创建Tag标签,并推送至远程仓库
    await this.createTag();
  }
  async createTag() {
    const tagInfo = this.tagInfo;
    try {
      this.spinner.start("创建Tag标签...");
      // git tag -a <标签名称> -m "标签说明信息" <提交哈希值>
      // 创建tag标签
      await executeCommand(`git tag -a ${tagInfo.tagName} -m "${tagInfo.tagMessage}" ${tagInfo.commitHash}`);
      // 推送tag标签至远程仓库
      await executeCommand(`git push origin ${tagInfo.tagName}`);
      await delay();
      this.spinner.stop("创建Tag标签完成");
      // 同步Tag标签列表到本地仓库
      await this.syncRemoteTag();
      outro(pico.green(`Tag标签：${tagInfo.tagName}创建成功`));
    } catch (error) {
      // 删除本地Tag标签
      await executeCommand(`git tag -d ${tagInfo.tagName}`);
      outro(pico.red(`Tag标签：${tagInfo.tagName}创建失败`));
      process.exit(1);
    } finally {
      this.clearTagInfo();
    }
  }
  /**
   * 将远端Tag标签列表同步到本地仓库。会以远程仓库的Tag标签列表为准，覆盖本地仓库Tag标签列表。
   * @returns
   */
  async syncRemoteTag() {
    if (!this.config.isSyncTag) return;
    // 强制从远程仓库拉取所有标签
    await executeCommand(`git fetch --prune --prune-tags`);
    this.spinner.start("正在从远程仓库同步Tag标签列表...");
    await delay();
    this.spinner.stop("从远程仓库同步Tag标签列表完成");
  }
  async checkTagIsExist() {
    // 获取远端Tag标签列表
    const tags = await executeCommand(`git ls-remote --tags origin`);
    const tagList = getListByStdout(tags).map((item) => item.split("/").pop());
    if (!tagList.length) return false;
    return tagList.includes(this.tagInfo.tagName);
  }
  async createGitOptions(branches) {
    // 获取当前分支名称
    const currentBranch = await getCurrentBranch();
    const branchList = getListByStdout(branches).map((branch) => ({
      label: branch.replace("*", "").trim(),
      value: branch.replace("*", "").trim(),
      hint: branch.indexOf("*") !== -1 ? "当前分支" : "",
    }));

    const selectBranch = await select({
      message: requiredItem("请选择要创建Tag标签的分支"),
      name: "branch",
      initialValue: currentBranch,
      options: branchList,
    });
    return this.handleIsCancel(selectBranch, "用户取消选择分支");
  }
  async createLatestCommitOptions(commits) {
    if (commits.length === 0) return [];
    const options = commits.map((commit) => {
      const [hash, ...message] = commit.split(" ");
      return { label: message.join(""), value: hash };
    });
    const selectCommit = await select({
      message: requiredItem("请选择要创建Tag标签的提交记录"),
      name: "commit",
      initialValue: options[0].value,
      options: options,
    });
    return this.handleIsCancel(selectCommit, "用户取消选择提交记录");
  }
  /**
   * 处理用户取消选择
   * @param {*} value 用户选择的值
   * @param {string} message 提示信息
   * @returns
   */
  handleIsCancel(value, message) {
    if (isCancel(value)) {
      outro(pico.red(message));
      process.exit(0);
    }
    return value;
  }
  clearTagInfo() {
    this.tagInfo = {
      branch: "",
      commitHash: "",
      tagMessage: "",
      tagName: "",
    };
  }
  init() {
    try {
      intro(pico.blue("开始创建Tag标签"));
      // 从远端拉取项目所有分支列表
      this.fetchRemoteBranch();
    } catch (error) {
      outro(pico.red("初始化Tag标签失败", error));
      process.exit(1);
    }
  }
}

export default GitTag;
