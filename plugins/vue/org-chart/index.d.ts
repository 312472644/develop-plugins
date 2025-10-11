interface IObject {
  [x in string]: string;
}

export interface IOrgChart {
  data: IObject;
  collapsible?: boolean;
  direction?: "vertical" | "horizontal";
  isInit?: boolean;
}