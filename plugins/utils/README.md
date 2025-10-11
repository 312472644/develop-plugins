## @develop-plugins/utils

### 描述

工具方法的集合。

### 安装

```bash
 # npm
 npm i @develop-plugins/utils
 
 # yarn
 yarn add @develop-plugins/utils
 
 # pnpm
 pnpm add @develop-plugins/utils
```

### 引用

```javascript
import { PrettyLog,PromiseUtils,TreeUtils,Helper } from '@develop-plugins/utils';
```

#### PrettyLog对象

美化日志输出的工具对象，提供四种不同级别的日志输出方法。每种方法都支持自定义标题和内容，并使用不同的颜色样式进行区分。

**方法说明：**

- `info(text: string, title?: string): void` - 输出信息级别的日志
  - text: 日志内容
  - title: 可选的日志标题
  - 样式：蓝色渐变背景

- `error(text: string, title?: string): void` - 输出错误级别的日志
  - text: 错误信息内容
  - title: 可选的错误标题
  - 样式：红色渐变背景

- `warn(text: string, title?: string): void` - 输出警告级别的日志
  - text: 警告信息内容
  - title: 可选的警告标题
  - 样式：橙色渐变背景

- `success(text: string, title?: string): void` - 输出成功级别的日志
  - text: 成功信息内容
  - title: 可选的成功标题
  - 样式：绿色渐变背景

**例子**

```javascript
const { info, error, warn, success } = PrettyLog;

// 输出信息日志
info("操作成功", "提示"); // 第二个参数为可选的标题

// 输出错误日志
error("操作失败", "错误");

// 输出警告日志
warn("注意事项", "警告");

// 输出成功日志
success("保存成功", "成功");
```

#### PromiseUtils对象

提供Promise相关的工具方法，包括Promise类型判断、可取消的Promise创建、并发控制等功能。

**方法说明：**

- `isPromiseLike(fn: any): boolean` - 判断是否符合PromiseA+规范
  - fn: 待检测的对象或函数
  - 返回：是否为Promise类型

- `createCancelPromise(asyncTask: Promise): Function` - 创建可取消的Promise任务
  - asyncTask: 异步任务函数
  - 返回：包装后的可取消Promise函数
  - 特点：每次调用会自动取消上一次未完成的任务

- `createCancelableFetch(fetchTask: (signal) => Promise): Function` - 创建可取消的Fetch请求
  - fetchTask: 包含signal参数的fetch请求函数
  - 返回：包装后的可取消fetch函数
  - 特点：支持AbortController取消请求

- `concurRequest(tasks: Function[], limit: number): Promise<any[]>` - 控制并发请求数量
  - tasks: Promise任务数组
  - limit: 最大并发数
  - 返回：所有任务的执行结果数组

**例子**

```javascript
const { isPromiseLike, createCancelPromise, createCancelableFetch, concurRequest } = PromiseUtils;

// 判断是否为Promise对象
isPromiseLike(Promise.resolve());

// 创建可取消的Promise
const cancelableTask = createCancelPromise(() => Promise.resolve(1));
const result = await cancelableTask();

// 创建可取消的Fetch请求
const cancelableFetch = createCancelableFetch((signal) => 
  fetch('https://api.example.com/data', { signal })
);

// 控制并发请求数量
const tasks = [
  () => fetch('url1'),
  () => fetch('url2'),
  () => fetch('url3')
];
const results = await concurRequest(tasks, 2); // 最多同时执行2个请求
```

#### TreeUtils对象

树形结构数据处理工具，提供了一系列处理树形数据的实用方法。

**数据结构：**

```typescript
interface TreeNode {
  id: number | string;
  label: string;
  parentId?: number | string;
  children?: TreeNode[];
  [key: string]: any;
}
```

**方法说明：**

- `flattenTreeData(tree: Array, config?: Object): Array` - 将树形结构转换为扁平结构
  - tree: 树形结构数据
  - config: 可选的配置对象
    - nodeKey: 节点唯一标识名称，默认为'id'
    - label: 节点显示属性名称，默认为'label'
    - children: 子节点属性显示名称，默认为'children'
  - 返回：扁平化后的数组

- `getTreeData(tree: Array, config?: Object): Array` - 将扁平结构转换为树形结构
  - tree: 扁平结构数据
  - config: 可选的配置对象
    - nodeKey: 节点唯一标识，默认为'id'
    - children: 子节点名称，默认为'children'
    - parentId: 父节点名称，默认为'parentId'
  - 返回：树形结构数据

- `getTreeDataByNodeKey(tree: Array, nodeKeyValue: string|number, config?: Object): Object` - 通过节点唯一标识获取节点
  - tree: 树形结构数据
  - nodeKeyValue: 节点唯一标识的值
  - config: 可选的配置对象
    - nodeKey: 节点唯一标识，默认为'id'
    - children: 子节点名称，默认为'children'
  - 返回：匹配的节点对象

- `getChildrenByNodeKey(tree: Array, nodeKeyValue: string|number, config?: Object): Array` - 获取指定节点的所有子节点
  - tree: 树形结构数据
  - nodeKeyValue: 节点唯一标识的值
  - config: 可选的配置对象
    - nodeKey: 节点唯一标识，默认为'id'
    - children: 子节点名称，默认为'children'
  - 返回：包含当前节点及其所有子节点的数组

- `getParentListByNode(tree: Array, nodeKeyValue: string|number, config?: Object): Array` - 获取指定节点的所有父节点
  - tree: 树形结构数据
  - nodeKeyValue: 节点唯一标识的值
  - config: 可选的配置对象
    - nodeKey: 节点唯一标识，默认为'id'
    - children: 子节点名称，默认为'children'
  - 返回：包含所有父节点的数组

**使用示例：**

```javascript
const { flattenTreeData, getTreeData, getTreeDataByNodeKey, getChildrenByNodeKey, getParentListByNode } = TreeUtils;

// 树形数据示例
const treeData = [
  {
    id: 1,
    label: "一级节点",
    children: [
      {
        id: 2,
        label: "二级节点",
        children: []
      }
    ]
  }
];

// 将树形结构转换为扁平结构
const flatData = flattenTreeData(treeData);

// 将扁平结构转换为树形结构
const tree = getTreeData(flatData);

// 通过节点ID获取节点
const node = getTreeDataByNodeKey(treeData, 2);

// 获取指定节点的所有子节点
const children = getChildrenByNodeKey(treeData, 1);

// 获取指定节点的所有父节点
const parents = getParentListByNode(treeData, 2);
```

#### Helper对象

提供常用的辅助工具方法，包括函数防抖、节流、深拷贝等实用功能。

**方法说明：**

- `debounce(fn: Function, delay: number = 500): Function` - 函数防抖
  - fn: 需要防抖的函数
  - delay: 延迟时间，默认500ms
  - 返回：防抖处理后的函数
  - 特点：在delay时间内多次调用，只执行最后一次

- `throttle(fn: Function, delay: number = 500, immediate: boolean = true): Function` - 函数节流
  - fn: 需要节流的函数
  - delay: 时间间隔，默认500ms
  - immediate: 是否立即执行，默认true
  - 返回：节流处理后的函数
  - 特点：在delay时间内只执行一次函数

- `deepClone(obj: any): any` - 对象深拷贝
  - obj: 需要深拷贝的对象
  - 返回：深拷贝后的新对象
  - 特点：支持循环引用，支持多种数据类型（包括Date、RegExp、Map、Set等）

- `disableBrowserDebugger(): void` - 禁用浏览器调试功能
  - 特点：通过检测调试行为来阻止开发者工具的使用

- `createOverload(): Function` - 函数重载实现
  - 返回：重载函数对象，包含addImpl方法用于添加实现
  - 特点：支持根据参数类型动态调用不同的实现

- `getUrlParams(url?: string, key?: string): Object` - 获取URL参数
  - url: URL字符串，默认为当前页面URL
  - key: 指定参数名，可选
  - 返回：参数对象或指定参数值

- `getRandomInt(min: number, max: number): number` - 获取随机整数
  - min: 最小值
  - max: 最大值
  - 返回：指定范围内的随机整数

- `getUniqueId(): string` - 获取唯一标识符
  - 返回：UUID格式的唯一字符串
  - 特点：生成符合UUID v4标准的唯一标识符

**例子**

```javascript
const { debounce, throttle, deepClone, disableBrowserDebugger, createOverload, getUrlParams, getRandomInt, getUniqueId } = Helper;

// 函数防抖
const debouncedFn = debounce(() => {
  console.log('执行函数');
}, 500);
debouncedFn(); // 多次调用，只在最后一次调用后500ms执行

// 函数节流
const throttledFn = throttle(() => {
  console.log('执行函数');
}, 500, true);
throttledFn(); // 500ms内多次调用，只执行一次

// 深拷贝对象
const obj = { 
  a: 1, 
  b: { c: 2 },
  date: new Date(),
  regexp: /test/,
  map: new Map([['key', 'value']]),
  set: new Set([1, 2, 3])
};
const clonedObj = deepClone(obj);

// 禁用浏览器调试功能
disableBrowserDebugger();

// 函数重载
const overloadFn = createOverload();
overloadFn.addImpl('string', (str) => `String: ${str}`);
overloadFn.addImpl('number', (num) => `Number: ${num}`);
overloadFn.addImpl('string', 'number', (str, num) => `String and Number: ${str}, ${num}`);

// 获取URL参数

// 自定义URL参数获取
const customUrl = 'https://custom.com?id=1&type=user';
const params = getUrlParams(customUrl); // { id: '1', type: 'user' }

// 获取随机整数
const random1 = getRandomInt(1, 10); // 返回1到10之间的随机整数

// 获取唯一标识符
const uuid1 = getUniqueId(); // 例如: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
```