import { App } from 'vue'
export interface ISeamlessTableColumn {
  title: string;
  key: string;
  width?: number | string;
  align?: "left" | "center" | "right";
}

export interface ISeamlessTable {
  columns: ISeamlessTableColumn[];
  oddBackground?: string;
  evenBackground?: string;
  hoverBackground?: string;
  data: Record<string, any>[];
  height?: number | string;
  speed?: number;
}

export declare const SeamlessTableInstall: (app: App) => {
  install(app: App): void;
}