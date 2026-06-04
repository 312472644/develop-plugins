import packageJson from "./package.json" with { type: "json" };
import pico from "picocolors";

const nodeVersion = packageJson.engines.node.replace(">=", "");

function checkNodeVersion() {
  const currentVersion = parseCurNodeVersion(process.version);
  if (currentVersion >= nodeVersion) {
    return;
  } else {
    printLog(nodeVersion, currentVersion);
    process.exit(1);
  }
}

function printLog(nodeVersion, currentVersion) {
  console.log("");
  console.log(pico.red(pico.bold("✗ Node.js 版本检查失败")));
  console.log("");
  console.log(pico.yellow(`  要求版本: ${pico.bold(nodeVersion)}+`));
  console.log(pico.green(`  当前版本: ${pico.bold(currentVersion)}`));
  console.log("");
  console.log(pico.white(pico.bgRed(`请升级 Node.js 到 ${nodeVersion} 或更高版本`)));
  console.log("");
}

function parseCurNodeVersion(version) {
  return version.replace("v", "").split(".")[0];
}

checkNodeVersion();
