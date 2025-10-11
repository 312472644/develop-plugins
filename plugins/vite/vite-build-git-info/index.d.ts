import { Plugin } from 'vite';

/**
 * @param commit 提交commitId
 * @param branch 分支名称
 * @param author 提交作者
 * @param date 提交时间
 * @param message 提交消息
 * @param isNewVersion 是否为最新版本
 */
type Field = 'commit' | 'branch' | 'author' | 'date' | 'message' | 'isNewVersion';

interface IOptions {
  // git仓库地址名称，默认值为origin
  gitOriginName: string;
  // 是否显示git信息，默认值为true
  defaultShowLog: boolean;
  // 默认显示日志的函数名,默认值为showLogFunName
  showLogFunName: string;
  // 显示的字段列表 ['commit', 'branch', 'author', 'date', 'isNewVersion']
  showFieldList: Field[];
  // label样式
  labelStyle: string;
  // value样式
  valueStyle: string;
}

declare function gitFlowInfo(options: IOptions): Plugin;

export default gitFlowInfo;
