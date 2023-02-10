export interface PropTypes {
  value?: DotType[];
  onChange?: (any) => void;
  disabled?: boolean;
}
export interface DotType {
  id: string;
  week: number,
  hour: number,
  discount: number
}

export interface SelectRectType {
  left: number,
  right: number,
  top: number,
  bottom: number,
  centerX: number,
  centerY: number,
}
export interface StateTypes {
  dots: any[],
  emptyDots: DotType[],
  formValues: {
    discount: number | undefined,
    radioType: number
  },
  isSelect: boolean, // 选完正在填form
  isSelecting: boolean, // 正在选
  selectRect: SelectRectType,
  startDot: DotType,
  endDot: DotType,
  showTip: boolean,
  currentTip: any,
}
