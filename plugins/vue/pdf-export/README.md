## PDF-Export

根据配置项导出相应的pdf文件。

### 安装

```
 # npm
 npm i @develop-plugins/pdf-export
 
 # yarn
 yarn add @develop-plugins/pdf-export
 
 # pnpm
 pnpm add @develop-plugins/pdf-export
```



### 示例

1. 初始化

   ```javascript
   import PdfExport from '@develop-plugins/pdf-export';
   
   const pdf = new PdfExport({
       padding: 20, // 页面边距，默认20
       showPageNumbers: true // 是否显示页码，默认显示
   });
   ```

   

2. 生成文本

   ```javascript
   const textList = [
       {  position: 'center', text: '居中文本' },
       {  position: 'left', text: '默认居左文本' }
       {  position: 'right', text: '居右文本' }
       { text: '超长超长的文本' }
   ];
   
   /**
   * list列表元素属性
   * @param {string} text 文字
   * @param {'left'|'center'|'right'} [position='left'] 文本显示位置
   */
   pdf.generateTextList(list);
   ```

   ⚠️只支持一行显示一列文本，不支持一行显示多列。

   

3. 生成表格

   ```javascript
   // 表格列配置
   const columns = [
     { header: '姓名', dataKey: 'name' },
     { header: '备注', dataKey: 'remark' },
   ];
   
   // 表格行配置
   const body = [
     { name: '小李', remark: '表格行配置' },
     { name: '小张', remark: '表格行配置' }
   ];
   
   pdf.generateTable({
       body,
       columns,
       columnStyles: { remark: { cellWidth: 100 } },
   });
   ```

   更多表格样式配置参考：https://github.com/simonbengtsson/jsPDF-AutoTable/tree/master

   

4. 生成图片

   ```javascript
   /**
    * 生成图片
    * @param {string} imgUrl 图片链接
    * @param {'NONE'|'FAST'|'MEDIUM'|'SLOW'} [compression='NONE'] 图片压缩级别
    * NONE: 不进行压缩，保持原始质量。
    * FAST: 使用快速的压缩方式，压缩比较低。
    * MEDIUM: 使用中等压缩方式，压缩比较平衡。
    * SLOW: 使用慢速的压缩方式，压缩比较高。
    */
   pdf.generateImage(
       'https://images.pexels.com/photos/2049422/pexels-photo-2049422.jpeg?auto=compress&cs=tinysrgb&w=600'
     );
   ```

   如果导出文件时间过长，可以尝试调整compression的值。

   

5. 保存PDF文件

   ```javascript
   pdf.save('测试文档');
   ```



### 方法



| 名称             | 说明                   | 参数               |
| ---------------- | ---------------------- | ------------------ |
| generateTextList | 通过列表生成对应的文本 | 查看示例代码配置项 |
| generateTable    | 通过配置生成对应的表格 | 查看示例代码配置项 |
| generateImage    | 生成图片               | 查看示例代码配置项 |
| save             | 保存PDF文件            | 查看示例代码配置项 |

