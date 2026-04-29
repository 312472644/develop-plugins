const { execSync } = require("child_process");
const pkg = require("./package.json");

// 是否需要重新安装依赖
const dependenciesModules = ["@develop-plugins/excel-preview"];

function getDeps() {
  const deps = [];
  for (const dep in pkg.dependencies) {
    if (dep.startsWith("@develop-plugins")) {
      deps.push(dep.split(":")[0]);
    }
  }
  return deps;
}

// 构建所有依赖项
function executeBuild() {
  const deps = getDeps();
  for (const depName of deps) {
    if (dependenciesModules.includes(depName)) {
      const installCmd = `pnpm --filter ${depName} i`;
      console.log(`⚒️ 安装依赖: ${depName} 【${installCmd}】⚒️`);
      execSync(installCmd, { stdio: "inherit" });
    }
    const buildCmd = `pnpm --filter ${depName} run build`;
    console.log(`⚒️ 当前构建命令: 【${buildCmd}】⚒️`);
    execSync(buildCmd, { stdio: "inherit" });
  }
}

executeBuild();
