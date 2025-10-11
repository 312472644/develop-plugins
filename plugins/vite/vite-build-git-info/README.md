## 描述

浏览器控制台中查看最新一次git提交记录信息。

## 参数说明

| 参数           | 说明                                                         | 类型      | 默认值                                                   |
| -------------- | ------------------------------------------------------------ | --------- | -------------------------------------------------------- |
| gitOriginName  | git仓库地址名称                                              | `string`  | `'origin'`                                               |
| defaultShowLog | 是否显示git信息                                              | `boolean` | `true`                                                   |
| showLogFunName | 默认显示日志的函数名,`defaultShowLog`设置为`false`,可以通过调用该函数显示git信息 | `string`  | `showLogFunName`                                         |
| showFieldList  | 控制台显示的字段列表                                         | `Field[]` | `['commit', 'branch', 'author', 'date', 'isNewVersion']` |
| labelStyle     | label样式                                                    | `string`  | -                                                        |
| valueStyle     | value样式                                                    | `string`  | -                                                        |

### Field字段说明

| 名称         | 说明           |
| ------------ | -------------- |
| commit       | 提交commitId   |
| branch       | 分支名称       |
| author       | 提交作者       |
| date         | 提交时间       |
| message      | 提交消息       |
| isNewVersion | 是否为最新版本 |

