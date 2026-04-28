const { execSync } = require("child_process");

const pluginsDir = ["plugins/vue"];
const packages = ["seamless-table", "org-chart"];

function generateCommand() {
  pluginsDir.forEach((dir) => {
    packages.forEach((pkg) => {
      execSync(`conventional-changelog -p angular --commit-path ${dir}/${pkg} -i ${dir}/${pkg}/CHANGELOG.md -s`, {
        stdio: "inherit",
      });
    });
  });
}

generateCommand();

// packages.forEach((pkg) => {
//   execSync(
//     `conventional-changelog -p angular \
//     --commit-path packages/${pkg} \
//     -i packages/${pkg}/CHANGELOG.md \
//     -s`,
//     { stdio: "inherit" }
//   );
// });
