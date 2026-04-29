const { execSync } = require("child_process");
const pkg = require("./package.json");

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
    const buildCmd = `pnpm --filter ${depName} run build`;
    console.log("🚀 ~ executeBuild ~ buildCmd:", buildCmd);
    execSync(buildCmd, { stdio: "inherit" });
  }
}

executeBuild();
