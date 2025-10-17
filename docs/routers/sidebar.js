export default {
  '/components/': [
    {
      text: '组件总览',
      items: [
        { text: '组件介绍', link: '/components/' },
      ],
    },
    {
      text: '数据展示',
      items: [
        { text: 'Chart 图表', link: '/components/chart' },
        { text: 'OrgChart 组织架构图', link: '/components/org-chart' },
      ],
    },
    {
      text: '文档预览',
      items: [
        { text: 'ExcelPreview Excel预览', link: '/components/excel-preview' },
        { text: 'PdfPreview PDF预览', link: '/components/pdf-preview' },
        { text: 'PdfExport PDF导出', link: '/components/pdf-export' },
      ],
    },
    {
      text: 'UI组件',
      items: [
        { text: 'XMessage 消息', link: '/components/x-message' },
        { text: 'XScroll 滚动', link: '/components/x-scroll' },
        { text: 'TextEllipsis 文本省略', link: '/components/text-ellipsis' },
        { text: 'WaterMark 水印', link: '/components/water-mark' },
      ],
    },
  ],
  '/directives/': [
    {
      text: '指令总览',
      items: [
        { text: '指令介绍', link: '/directives/' },
      ],
    },
    {
      text: '实用指令',
      items: [
        { text: 'Directive 指令集合', link: '/directives/directive' },
      ],
    },
  ],
  '/plugins/': [
    {
      text: '插件总览',
      items: [
        { text: '插件介绍', link: '/plugins/' },
      ],
    },
    {
      text: '构建插件',
      items: [
        { text: 'vite-build-git-info Git信息', link: '/plugins/vite-build-git-info' },
        { text: 'vite-generate-zip 压缩包生成', link: '/plugins/vite-generate-zip' },
      ],
    },
  ],
};
