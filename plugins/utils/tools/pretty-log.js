const LogTypeEnum = {
  Info: "Info",
  Warn: "Warn",
  Error: "Error",
  Success: "Success",
};

/**
 * 美化日志输出
 * @returns {Object} 包含四种日志类型的对象
 * @typedef {Object} PrettyLogReturn
 * @property {Function} info - 输出info级别的日志
 * @property {Function} error - 输出error级别的日志
 * @property {Function} warn - 输出warn级别的日志
 * @property {Function} success - 输出success级别的日志
 * @returns {PrettyLogReturn} 包含四种日志类型的对象
 * @example
 * const { info, error, warn, success } = prettyLog();
 * info("Hello World");
 * error("Hello World");
 */
function prettyLog() {
  const logColor = {
    [LogTypeEnum.Info]: {
      bgColor: "linear-gradient(135deg, #e6f3ff, #b3d9ff)",
      borderColor: "#1a8cff",
      color: "#004d99",
    },
    [LogTypeEnum.Warn]: {
      bgColor: "linear-gradient(135deg, #fff0d9, #ffb366)",
      borderColor: "#ff6600",
      color: "#e65c00",
    },
    [LogTypeEnum.Error]: {
      bgColor: "linear-gradient(135deg, #ffe6e6, #ff9999)",
      borderColor: "#ff1a1a",
      color: "#e60000",
    },
    [LogTypeEnum.Success]: {
      bgColor: "linear-gradient(135deg, #e6ffe6, #b3ffb3)",
      borderColor: "#33cc33",
      color: "#008000",
    },
  };
  const isEmpty = (value) => {
    return value === null || value === undefined || value === "";
  };

  const prettyPrint = (config = {}) => {
    const { title, text, colorConfig } = config;
    const { bgColor, borderColor, color } = colorConfig || {};
    console.log(
      `%c ${title} %c ${text} %c`,
      `background:${bgColor};border:1px solid ${borderColor}; padding: 1px; border-radius: 2px 0 0 2px; color: #000000e0;border-right: none;`,
      `border:1px solid ${borderColor}; padding: 1px; border-radius: 0 2px 2px 0; color: ${color};`,
      "background:transparent"
    );
  };

  // 打印日志
  const log = (logType = "", content = "", textOrTitle = "Log") => {
    const title = isEmpty(content) ? "Info" : textOrTitle;
    const text = isEmpty(content) ? textOrTitle : content;
    prettyPrint({ title, text, colorConfig: logColor[logType] });
  };

  /**
   * info级别的日志
   * @param {string} [content=""] - 日志内容
   * @param {string} [textOrTitle="Info"] - 日志标题或内容
   * @returns {void} 无返回值
   */
  const info = (content = "", textOrTitle = "Info") => {
    log(LogTypeEnum.Info, content, textOrTitle);
  };

  /**
   * error级别的日志
   * @param {string} [content=""] - 错误内容
   * @param {string} [textOrTitle="Error"] - 错误标题或内容
   * @returns {void} 无返回值
   */
  const error = (content = "", textOrTitle = "Error") => {
    log(LogTypeEnum.Error, content, textOrTitle);
  };

  /**
   * warn级别的日志
   * @param {string} [content=""] - 警告内容
   * @param {string} [textOrTitle="Warn"] - 警告标题或内容
   * @returns {void} 无返回值
   */
  const warn = (content = "", textOrTitle = "Warn") => {
    log(LogTypeEnum.Warn, content, textOrTitle);
  };

  /**
   * success级别的日志
   * @param {string} [content=""] - 成功内容
   * @param {string} [textOrTitle="Success"] - 成功标题或内容
   * @returns {void} 无返回值
   */
  const success = (content = "", textOrTitle = "Success") => {
    log(LogTypeEnum.Success, content, textOrTitle);
  };

  return { info, error, warn, success };
}

const { info, error, warn, success } = prettyLog();

export { info, error, warn, success };
