import JsPdf from 'jspdf';
import autoTable from 'jspdf-autotable';
import './YeZiGongChangWanNengHeiTi-2-normal';

class PdfExport {
  // jspdf对象
  #pdfExport;
  // 页面宽度
  #pageWidth = 0;
  // 页面高度
  #pageHeight = 0;
  #contentWidth = 0;
  #contentHeight = 0;
  // 页边距
  #padding = 10;
  // 页码高度
  #pageNumbersHeight = 10;
  // 是否显示页码
  #showPageNumbers = false;
  #startY = 0;
  #defaultFontSize = 12;

  /**
   * PDF
   * @param {Object} pdfConfig
   * @param {number} pdfConfig.padding 页面边距，默认为10
   * @param {boolean} pdfConfig.showPageNumbers 是否显示页码，默认为false
   * @param pdfConfig 配置参考 https://artskydj.github.io/jsPDF/docs/jsPDF.html
   */
  constructor(pdfConfig) {
    const config = this.#mergeConfig(pdfConfig);
    const pdfExport = new JsPdf(config);
    this.#initPosition(pdfExport);
    this.#pdfExport.setFontSize(this.#defaultFontSize);
    // 起始Y坐标
    this.#startY = this.#padding;
    this.#generatePageNumbers();
  }

  #initPosition(pdfExport) {
    const pageWidth = pdfExport.internal.pageSize.width;
    const pageHeight = pdfExport.internal.pageSize.height;
    // 设置字体
    pdfExport.setFont('YeZiGongChangWanNengHeiTi-2');
    this.#pageNumbersHeight = this.#showPageNumbers ? 10 : 0;
    this.#pageWidth = pageWidth;
    this.#pageHeight = pageHeight;
    this.#contentHeight =
      pageHeight - this.#padding * 2 - this.#pageNumbersHeight;
    this.#contentWidth = pageWidth - this.#padding * 2;
    this.#pdfExport = pdfExport;
  }

  /**
   * 获取jspdf对象
   * @returns {object}
   */
  get jspdf() {
    return this.#pdfExport;
  }

  /**
   * 合并配置
   * @param {object} config
   * @param {number} [config.padding=10] 页边距
   * @param {boolean} [config.showPageNumbers=false] 是否显示页码
   * 其他配置参考 https://artskydj.github.io/jsPDF/docs/jsPDF.html
   * @returns {object}
   */
  #mergeConfig(config = {}) {
    const defaultConfig = {
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
    };
    this.#padding = typeof config?.padding === 'number' ? config.padding : 10;
    this.#showPageNumbers = config.showPageNumbers || false;
    const clone = { ...defaultConfig, ...config };
    delete clone.padding;
    delete clone.showPageNumbers;
    return clone;
  }

  /**
   * 获取文本左边位置
   * @param {string} text
   * @param {'left'|'center'|'right'} position
   */
  #getTextLeftPosition(text, position = 'left') {
    if (!text || !position) return;
    const textWidth = this.#pdfExport.getTextWidth(text);
    if (position === 'center') {
      return (this.#pageWidth - textWidth) / 2;
    }
    if (position === 'right') {
      return this.#pageWidth - textWidth - this.#padding;
    }
    return this.#padding;
  }

  /**
   * 检查文本位置是否合法
   * @param {'left'|'center'|'right'} [position='left']
   * @returns {boolean}
   */
  #checkPositionIsValid(position) {
    const validPositions = ['left', 'center', 'right'];
    if (!validPositions.includes(position) && position) {
      console.warn(`文本位置：【${position}】不合法, 支持left、center、right`);
      return false;
    }
    return true;
  }

  /**
   * 生成文本列表
   * @param {Object[]} configList
   * @param {string} configList[].text 文本
   * @param {'left'|'center'|'right'} [configList[].position='left']
   */
  generateTextList(configList = []) {
    if (!configList.length) return;
    const doc = this.#pdfExport;
    configList.forEach((config) => {
      const { text, position } = config;
      const isValid = this.#checkPositionIsValid(position);
      if (!isValid) return;
      // 将文本拆成多行
      const splitTextList = doc.splitTextToSize(text, this.#contentWidth) || [];
      if (splitTextList.length > 1 && position) {
        console.warn('多行文本不支持文本位置');
        return;
      }
      // 文本位置
      const left = this.#getTextLeftPosition(text, position);
      splitTextList.forEach((item) => {
        // 计算当前文本行高度
        const lineHeight = doc.getTextDimensions(item).h;
        // 分页
        if (
          this.#startY + lineHeight >
          this.#pageHeight - this.#pageNumbersHeight
        ) {
          doc.addPage();
          this.#generatePageNumbers();
          // 分页后重新计算
          this.#startY = this.#padding;
        }
        doc.text(item, left, this.#startY);
        this.#startY += lineHeight + (item.position ? 10 : 5);
      });
    });
  }

  /**
   * 生成页码
   */
  #generatePageNumbers() {
    if (!this.#showPageNumbers) return;
    const doc = this.#pdfExport;
    const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
    const yPoint = this.#pageHeight - this.#pageNumbersHeight;
    doc.line(this.#padding, yPoint, this.#pageWidth - this.#padding, yPoint);
    const text = `第 ${currentPage} 页`;
    doc.text(
      text,
      this.#getTextLeftPosition(text, 'center'),
      yPoint + this.#pageNumbersHeight / 2
    );
  }

  /**
   * 生成表格
   * @param {Object|string} config 支持表格dom选择器或配置
   * @param {string[][]} config.body 表格数据
   * @param {string[]} config.columns 表格列名
   * @param {Object} [config.columnStyles] 表格列样式
   * @param config https://github.com/simonbengtsson/jsPDF-AutoTable/tree/master
   */
  generateTable(config) {
    if (!Reflect.ownKeys(config).length) return;
    const doc = this.#pdfExport;
    autoTable(doc, {
      theme: 'striped',
      margin: 0,
      headStyles: {
        fillColor: '#ebeef2',
        textColor: '#000',
      },
      styles: {
        font: 'YeZiGongChangWanNengHeiTi-2',
        fontSize: this.#defaultFontSize,
        cellPadding: 3,
      },
      startY: this.#startY,
      pageBreak: 'auto',
      didDrawPage: (data) => {
        const startPageNumber = data.table.startPageNumber;
        const currentPageNumber = doc.internal.getCurrentPageInfo().pageNumber;
        // 如果当前页码大于总页码，则生成页码
        if (currentPageNumber > startPageNumber) {
          this.#generatePageNumbers();
        }
        this.#startY = this.#padding;
      },
      ...config,
    });
    this.#startY += doc.lastAutoTable.finalY;
  }

  /**
   * 生成图片
   * @param {string} imgUrl 图片链接
   * @param {'NONE'|'FAST'|'MEDIUM'|'SLOW'} compression 图片压缩级别
   * NONE: 不进行压缩，保持原始质量。
   * FAST: 使用快速的压缩方式，压缩比较低。
   * MEDIUM: 使用中等压缩方式，压缩比较平衡。
   * SLOW: 使用慢速的压缩方式，压缩比较高。
   */
  generateImage(imgUrl, compression) {
    if (!imgUrl) return;
    const doc = this.#pdfExport;
    // 获取图片宽高
    const { width: imgWidth, height: imgHeight } =
      doc.getImageProperties(imgUrl);
    // 换算比例
    const widthRatio = this.#contentWidth / imgWidth;
    const heightRatio = this.#contentHeight / imgHeight;
    const ratio = Math.min(widthRatio, heightRatio);
    // 得到图片宽高
    const w = imgWidth * ratio;
    const h = imgHeight * ratio;
    // 如果图片高度大于剩余高度，则新增一页
    if (this.#startY + h > this.#contentHeight) {
      doc.addPage();
      this.#generatePageNumbers();
      this.#startY = this.#padding;
    }
    doc.addImage(
      imgUrl,
      'JPEG',
      this.#padding,
      this.#startY,
      w,
      h,
      '',
      compression
    );
    this.#startY += h + this.#padding;
  }

  /**
   * 保存PDF
   * @param {string} fileName
   */
  save(fileName = '附件') {
    this.#pdfExport.save(fileName);
  }
}

export default PdfExport;
