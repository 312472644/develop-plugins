const fs = require('fs');
const path = require('path');
const process = require('process');

/**
 * 更新版本号
 * @returns {String} x.y.z更新后的版本号
 * @param versionStr
 */
function updateVersion(versionStr) {
  const versionList = versionStr.split('.');
  for (let i = versionList.length - 1; i >= 0; i--) {
    if (i === 0) {
      versionList[i] = parseInt(versionList[i]) + 1;
    } else {
      if (parseInt(versionList[i]) === 9) {
        versionList[i] = 0;
      } else {
        versionList[i] = parseInt(versionList[i]) + 1;
        break;
      }
    }
  }
  return versionList.join('.');
}

/**
 * 更新package.json版本号
 * 获取当前node执行目录所在package.json文件，更新版本号后写入
 */
function updatePackageVersion() {
  const packagePath = path.resolve(process.cwd(), 'package.json');
  try {
    const packageJSON = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const currentVersion = packageJSON.version;
    const updateVersionStr = updateVersion(currentVersion);
    console.log('packageJSON', updateVersionStr);
    fs.writeFileSync(
      packagePath,
      JSON.stringify({...packageJSON, version: updateVersionStr}, null, 2)
    );
    console.log('更新版本号成功');
  } catch (error) {
    console.log('error', error);
    console.log('更新版本号失败');
  }
}

updatePackageVersion();
