export interface IOrgChart {
  data: {
    [x in string]: string;
  };
  collapsible?: boolean;
  direction?: "vertical" | "horizontal";
  isInit?: boolean;
}