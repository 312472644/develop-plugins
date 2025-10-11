

### 项目目录结构

- build。项目构建相关的文件。
- docs。组件库以及工具库使用文档说明。
- example。组件库展示效果工程的web项目。
- packages。组件库以及工具库代码工程，默认该项目会发布到Npm官网。

### 中枢管理操作

在 workspace 模式下，代码仓根目录通常不会作为一个子模块或者 `npm` 包，而是**主要作为一个管理中枢，执行一些全局操作，安装一些共有的依赖。**下面介绍一些常用的中枢管理操作。

- 创建一个 `package.json` 文件。

  ``````shell
  pnpm init
  ``````

- 
  设置用户的全局 .npmrc 配置

  ``````shell
  pnpm config set <key> <value>
  ``````

- 
  根据当前目录 `package.json` 中的依赖声明安装全部依赖，在 workspace 模式下会一并处理所有子模块的依赖安装。

  ```shell
  pnpm install
  ```

  

- 安装项目公共开发依赖，声明在根目录的 `package.json - devDependencies` 中。`-w` 选项代表在 monorepo 模式下的根目录进行操作。
  每个子包都能访问根目录的依赖，适合把 `TypeScript、Vite、eslint` 等公共开发依赖装在这里。

  ```shell
  pnpm install -wD xxx
  ```

  

- 
  卸载公共依赖，在根目录的 `package.json - devDependencies` 中删去对应声明

  ```shell
  pnpm uninstall -w xxx
  ```

- 
  执行根目录的 package.json 中的脚本

  ```shell
  pnpm run xxx
  ```

### 子包管理操作

在 `workspace` 模式下，`pnpm` 主要通过 `--filter` 选项过滤子模块，实现对各个工作空间进行精细化操作的目的。

1. **为指定模块安装外部依赖。**

   - 下面的例子指为 `a` 包安装 `lodash` 外部依赖。

   - 同样的道理，`-S` 和 `-D` 选项分别可以将依赖安装为正式依赖(`dependencies`)或者开发依赖(`devDependencies`)。

     ```shell
     # 为 a 包安装 lodash
     pnpm --filter a i -S lodash
     pnpm --filter a i -D lodash
     ```

2. **指定内部模块之间的互相依赖。**

   - 指定模块之间的互相依赖。下面的例子演示了为 `a` 包安装内部依赖 `b`。

     ```shell
     # 指定 a 模块依赖于 b 模块
     pnpm --filter a i -S b
     ```

     `pnpm workspace` 对内部依赖关系的表示不同于外部，它自己约定了一套 [Workspace 协议 (workspace:)](https://link.juejin.cn/?target=https%3A%2F%2Fpnpm.io%2Fzh%2Fworkspaces%23workspace-%E5%8D%8F%E8%AE%AE-workspace)。下面给出一个内部模块 `a` 依赖同是内部模块 `b` 的例子。

     ```shell
     {
       "name": "a",
       "dependencies": {
         "b": "workspace:^"
       }
     ```

     在实际发布 `npm` 包时，`workspace:^` 会被替换成内部模块 `b` 的对应版本号(对应 `package.json` 中的 `version` 字段)。替换规律如下所示：

     ```shell
     {
       "dependencies": {
         "a": "workspace:*", // 固定版本依赖，被转换成 x.x.x
         "b": "workspace:~", // minor 版本依赖，将被转换成 ~x.x.x
         "c": "workspace:^"  // major 版本依赖，将被转换成 ^x.x.x
       }
     }
     ```

3. **过滤的高级用法**。

   - 用 `--filter` 过滤出目标工作空间集合后，不仅支持 `install` 安装依赖，`run`(执行脚本)、`publish`(发布包) 等绝大多数包管理操作都能够执行。

     ```shell
     # 发布所有包名为 @a/ 开头的包
     pnpm --filter @a/* publish
     ```

   

