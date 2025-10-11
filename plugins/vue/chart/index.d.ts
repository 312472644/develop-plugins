import { EChartsOption } from "echarts";

/**
 * 图表组件的属性接口
 */
export interface ChartProps {
  /**
   * 图表配置选项
   */
  option: EChartsOption;

  /**
   * 图表宽度
   * @default "100%"
   */
  width?: string;

  /**
   * 图表高度
   * @default "100%"
   */
  height?: string;

  /**
   * 图表主题
   * @default "default"
   */
  theme?: string;

  /**
   * 是否自动调整大小
   * @default true
   */
  autoResize?: boolean;

  /**
   * 是否显示加载状态
   * @default false
   */
  loading?: boolean;

  /**
   * 加载状态显示的文本
   * @default "加载中..."
   */
  loadingText?: string;
}

/**
 * 图表组件事件参数类型
 */
export interface ChartEventParams {
  componentType: string;
  seriesType?: string;
  seriesIndex?: number;
  seriesName?: string;
  name?: string;
  dataIndex?: number;
  data?: any;
  dataType?: string;
  value?: any;
  color?: string;
}

/**
 * 图表组件事件定义
 */
export interface ChartEmits {
  /**
   * 图表准备就绪事件
   */
  "chart-ready": (chartInstance: any) => void;

  /**
   * 鼠标点击事件
   */
  click: (params: ChartEventParams) => void;

  /**
   * 鼠标双击事件
   */
  dblclick: (params: ChartEventParams) => void;

  /**
   * 鼠标按下事件
   */
  mousedown: (params: ChartEventParams) => void;

  /**
   * 鼠标移动事件
   */
  mousemove: (params: ChartEventParams) => void;

  /**
   * 鼠标抬起事件
   */
  mouseup: (params: ChartEventParams) => void;

  /**
   * 鼠标悬停事件
   */
  mouseover: (params: ChartEventParams) => void;

  /**
   * 鼠标离开事件
   */
  mouseout: (params: ChartEventParams) => void;
}

/**
 * 图表组件暴露的方法接口
 */
export interface ChartExpose {
  /**
   * ECharts 实例
   */
  chartInstance: any;

  /**
   * 更新图表配置
   * @param newOption 新的配置选项
   */
  updateChart: (newOption: EChartsOption) => void;

  /**
   * 清空图表
   */
  clearChart: () => void;

  /**
   * 销毁图表
   */
  disposeChart: () => void;
}

/**
 * 图表插件选项接口
 */
export interface ChartPluginOptions {
  /**
   * 默认主题
   */
  defaultTheme?: string;

  /**
   * 全局配置选项
   */
  globalOptions?: Partial<EChartsOption>;
}
