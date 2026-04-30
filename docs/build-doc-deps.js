const { execSync } = require("child_process");
const pkg = require("./package.json");

// 是否有第三方依赖库，如果有则需将依赖打包进文档
const dependenciesModules = [
  "@develop-plugins/chart",
  "@develop-plugins/excel-preview",
  "@develop-plugins/pdf-export",
  "@develop-plugins/pdf-preview",
];

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
      const installCmd = `pnpm --filter ${depName} run build-doc`;
      console.log(`⚒️ 构建依赖: ${depName} 【${installCmd}】⚒️`);
      execSync(installCmd, { stdio: "inherit" });
    } else {
      const buildCmd = `pnpm --filter ${depName} run build`;
      console.log(`⚒️ 当前构建命令: 【${buildCmd}】⚒️`);
      execSync(buildCmd, { stdio: "inherit" });
    }
  }
}

executeBuild();
