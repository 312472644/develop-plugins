import { exec } from "child_process";
import pico from "picocolors";

/**
 * 执行命令，返回命令执行结果
 * @param {string} command
 * @returns {Promise<string>}
 * @description 执行命令，返回命令执行结果
 */
export function executeCommand(command) {
  if (!command) return Promise.reject("Command is required");

  return new Promise((resolve, reject) => {
    exec(command, { stdio: "pipe" }, (err, stdout) => {
      if (err) return reject(err);
      return resolve(stdout);
    });
  });
}

/**
 * 延迟执行
 * @param {number} ms - 延迟时间，单位毫秒
 * @returns {Promise<void>}
 * @description 延迟执行
 * */
export function delay(ms = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 获取当前分支
 * @returns {Promise<string>}
 * @description 获取当前分支
 * */
export async function getCurrentBranch() {
  const currentBranch = await executeCommand("git branch --show-current");
  return currentBranch.toString().trim();
}

/**
 * 从命令执行结果中提取列表
 * @param {string} stdout - 命令执行结果
 * @returns {string[]}
 * @description 从命令执行结果中提取列表
 * */
export function getListByStdout(stdout) {
  return stdout
    .toString()
    .trim()
    .split("\n")
    .filter((item) => Boolean(item));
}

/**
 * 标记为必填项
 * @param {string} message - 提示信息
 * @returns {string}
 * @description 标记为必填项
 * */
export function requiredItem(message) {
  return `${pico.red("* ")}${message}`;
}

/**
 * 获取当前日期
 * @returns {string}
 * @description 获取当前日期，格式为YYYY-MM-DD
 * */
export function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * 移除对象中值为undefined的属性
 * @param {Object} obj - 输入对象
 * @returns {Object}
 * @description 移除对象中值为undefined的属性
 * */
export function omitUndefined(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));
}
