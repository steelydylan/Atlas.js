export type EventListenerState = {
  touchStart: boolean;
  touchMove: boolean;
  touchEnd: boolean;
  keyUp: boolean;
  keyDown: boolean;
  multiTouchStart: boolean;
  multiTouchEnd: boolean;
  multiTouchMove: boolean;
  orientationChange: boolean;
};

export type ImageAsset = {
  hex?: string;
  index?: number;
  name: string;
};

export type GradientStyle = {
  x1: number;
  y1: number;
  r1: number;
  x2: number;
  y2: number;
  r2: number;
};

export type Position = {
  x: number;
  y: number;
  touchCount: number;
  event: TouchEventWithPos;
};

export type Size = {
  width: number;
  height: number;
};

export type SVGDrawLineMethod =
  | "quadraticCurveBy"
  | "quadraticCurveTo"
  | "lineTo"
  | "lineBy"
  | "moveBy"
  | "moveTo"
  | "bezierCurveBy"
  | "circle"
  | "rect"
  | "bezierCurveTo"
  | "horizontalBy"
  | "horizontalTo"
  | "verticalBy"
  | "verticalTo"
  | "bezierCurveShortBy"
  | "bezierCurveShortTo"
  | "quadraticCurveShortBy"
  | "quadraticCurveShortTo";

export type SVGDrawLineState = {
  method?: SVGDrawLineMethod;
  x?: number;
  y?: number;
  cpx1?: number;
  cpy1?: number;
  cpx2?: number;
  cpy2?: number;
  cpx?: number;
  cpy?: number;
  name?: string;
  r?: number;
  width?: number;
  height?: number;
};

export type ColorStop = {
  offset: string;
  color: string;
};

export type Animation =
  | "moveTo"
  | "moveBy"
  | "delay"
  | "rotateBy"
  | "animate"
  | "scaleBy"
  | "then";

export type TouchEventWithPos = TouchEvent & { pageX: number; pageY: number };

export type TweenState = {
  time: number;
  loop: boolean;
  and: boolean;
  frame: number;
  toX: number;
  toY: number;
  toAngle: number;
  toWidth: number;
  toHeight: number;
  diffX: number;
  diffY: number;
  diffWidth: number;
  diffHeight: number;
  diffAngle: number;
  scaleX: number;
  scaleY: number;
  exec: Function;
  frameRate: number;
  frameIdx: number;
  array: number[];
} & {
  [index in Animation]: boolean;
};

export type Key = {
  enter: boolean;
  shift: boolean;
  space: boolean;
  right: boolean;
  left: boolean;
  up: boolean;
  down: boolean;
  backspace: boolean;
  command: boolean;
  a: boolean;
  b: boolean;
  c: boolean;
  d: boolean;
  e: boolean;
  f: boolean;
  g: boolean;
  h: boolean;
  i: boolean;
  j: boolean;
  k: boolean;
  l: boolean;
  m: boolean;
  n: boolean;
  o: boolean;
  p: boolean;
  q: boolean;
  r: boolean;
  s: boolean;
  t: boolean;
  u: boolean;
  v: boolean;
  w: boolean;
  x: boolean;
  y: boolean;
  z: boolean;
};
