/**
 * 将node_modules/@develop-plugins/excel-preview/dist/assets复制到项目的public目录下，解决worker加载文件失败的问题
 */
const fs = require("fs");
const path = require("path");

const sourceDirectory = path.join(__dirname, "./dist/assets");
const destinationDirectory = getDestinationDirectory(path.join(__dirname));

function getDestinationDirectory(destinationDirectory) {
  const targetPath = destinationDirectory.split("node_modules")[0];
  return path.resolve(targetPath, "public/assets");
}

function copyDirectory() {
  if (!fs.existsSync(sourceDirectory)) return;
  if (!fs.existsSync(destinationDirectory)) {
    fs.mkdirSync(destinationDirectory);
  }
  fs.readdirSync(sourceDirectory).forEach((file) => {
    const sourcePath = path.join(sourceDirectory, file);
    const destinationPath = path.join(destinationDirectory, file);
    // 如果是目录，则递归复制
    if (fs.statSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, destinationPath);
    } else {
      fs.copyFileSync(sourcePath, destinationPath);
    }
  });
}

copyDirectory();
