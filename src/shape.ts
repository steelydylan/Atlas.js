import { Thing } from './thing';
import { SVGDrawLineState, GradientStyle } from './types';
/**
 * @class Atlas.Shape
 * @extends Atlas.Thing
 * SVGを描画するためのクラス
 * */
export class Shape extends Thing {
  protected obj: number;
  protected svgid: string;
  protected colorStops;
  public strokeColor: string;
  public closeMode: boolean;
  public strokeMode: boolean;
  public gradientType!: number;
  public path!: SVGDrawLineState[];
  public gradientStyle!: GradientStyle;
  public color: string | CanvasGradient;

  constructor(path: string, color: string, lineColor: string) {
    super(0, 0);
    this.obj = -1;
    this.svgid = '';
    this._basicConstructor = 'Shape';
    this.color = color || 'original';
    this.strokeColor = lineColor || 'original';
    this.colorStops = [];
    if (this.getExtention(path) != 'svg') {
      this.svgid = path;
    } else {
      this.setImage(path);
    }
    this.closeMode = true;
    this.strokeMode = true;
  }
  /**
   * @method setSpriteSize
   * @param width Number
   * @param height Number
   * スプライトの大きさを設定する
   * */
  setSpriteSize(width: number, height: number) {
    this.spriteWidth = width;
    this.spriteHeight = height;
  }
  /**
   * @method setImage
   * @param path String
   * ゲームにロードされたSVG画像をロードする
   * */
  setImage(path: string) {
    for (let i = 0, n = svgs.length; i < n; i++) {
      if (path == svgs[i].name) {
        this.obj = i;
      }
    }
  }
  /**
   * @method getImage
   * セットされているSVG画像を取得する
   * */
  getImage() {
    return svgs[this.obj];
  }
  /**
   * @method getImageName
   * セットされている画像名を取得する
   * */
  getImageName() {
    return svgs[this.obj].data;
  }
  /**
   * @method parsePolygon
   * @param polygon String
   * SVGのポリゴン要素を解析
   * */
  parsePolygon(polygon) {
    const pols = polygon.split(' ');
    const data = [];
    for (let i = 0, n = pols.length - 1; i < n; i++) {
      const pt = pols[i].split(',');
      const x = Number(pt[0]);
      const y = Number(pt[1]);
      const obj = { method: 'lineTo', x, y };
      data.push(obj);
    }
    return data;
  }
  /**
   * @method parsePath
   * @param path String
   * SVGのpath要素を解析
   * */
  parsePath(path) { /* SVGのpath要素を解析 */
    const length = { a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0 };
    const segment = /([astvzqmhlc])([^astvzqmhlc]*)/ig;
    const data = [];
    path.replace(segment, (_, command, args) => {
      let type = command.toLowerCase();
      args = args.match(/-?[.0-9]+(?:e[-+]?\d+)?/ig);
      args = args ? args.map(Number) : [];
      if (type == 'm' && args.length > 2) {
        data.push([command].concat(args.splice(0, 2)));
        type = 'l';
        command = command == 'm' ? 'l' : 'L';
      }
      while (true) {
        if (args.length == length[type]) {
          args.unshift(command);
          let obj = {} as SVGDrawLineState;
          if (args[0] == 'q') {
            obj = { method: 'quadraticCurveBy', cpx: args[1], cpy: args[2], x: args[3], y: args[4] };
          } else if (args[0] == 'Q') {
            obj = { method: 'quadraticCurveTo', cpx: args[1], cpy: args[2], x: args[3], y: args[4] };
          } else if (args[0] == 'l') {
            obj = { method: 'lineBy', x: args[1], y: args[2] };
          } else if (args[0] == 'L') {
            obj = { method: 'lineTo', x: args[1], y: args[2] };
          } else if (args[0] == 'm') {
            obj = { method: 'moveBy', x: args[1], y: args[2] };
          } else if (args[0] == 'M') {
            obj = { method: 'moveTo', x: args[1], y: args[2] };
          } else if (args[0] == 'c') {
            obj = { method: 'bezierCurveBy', cpx1: args[1], cpy1: args[2], cpx2: args[3], cpy2: args[4], x: args[5], y: args[6] };
          } else if (args[0] == 'C') {
            obj = { method: 'bezierCurveTo', cpx1: args[1], cpy1: args[2], cpx2: args[3], cpy2: args[4], x: args[5], y: args[6] };
          } else if (args[0] == 'h') {
            obj = { method: 'horizontalBy', x: args[1] };
          } else if (args[0] == 'H') {
            obj = { method: 'horizontalTo', x: args[1] };
          } else if (args[0] == 'v') {
            obj = { method: 'verticalBy', y: args[1] };
          } else if (args[0] == 'V') {
            obj = { method: 'verticalTo', y: args[1] };
          } else if (args[0] == 's') {
            obj = { method: 'bezierCurveShortBy', cpx2: args[1], cpy2: args[2], x: args[3], y: args[4] };
          } else if (args[0] == 'S') {
            obj = { method: 'bezierCurveShortTo', cpx2: args[1], cpy2: args[2], x: args[3], y: args[4] };
          } else if (args[0] == 't') {
            obj = { method: 'quadraticCurveShortBy', x: args[1], y: args[2] };
          } else if (args[0] == 'T') {
            obj = { method: 'quadraticCurveShortTo', x: args[1], y: args[2] };
          } else {
            obj = {};
          }
          return data.push(obj);
        }
        data.push([command].concat(args.splice(0, length[type])));
      }
    });
    return data;
  }
  /**
   * @method isLoaded
   * @return Boolean
   * 画像がロードされているかを返す
   * */
  isLoaded() {
    const image = this.getImage();
    if (!image) {
      return true;
    }
    if (image.loaded && this.ctx) {
      return true;
    }
    return false;
  }
  /**
   * @method setLinearGradient
   * オブジェクトに対して線形グラデーションを設定する
   * */
  setLinearGradient(x1: number, y1: number, x2: number, y2: number) {
    this.gradientStyle = { x1, y1, x2, y2 };
    this.gradientType = 1;
  }
  /**
   * @method setRadialGradient
   * オブジェクトに対して円形グラデーションを設定する
   * */
  setRadialGradient(x1, y1, r1, x2, y2, r2) {
    if (!x2) {
      x2 = x1;
      y2 = y1;
      r2 = r2;
    }
    this.gradientStyle = { x1, y1, r1, x2, y2, r2 };
    this.gradientType = 2;
  }

  _addColorStops(stops) {
    const grad = this.color;
    for (let i = 0, n = stops.length; i < n; i++) {
      const stop = stops[i];
      const color = stop.color;
      if (typeof grad !== 'string') {
        grad.addColorStop(stop.offset, color);
      }
    }
    this.color = grad;
  }

  setColorStops(stops) {
    this.colorStops = stops;
    const style = this.gradientStyle;
    if (this.gradientType == 1) {
      this.color = this.ctx.createLinearGradient(style.x1, style.y1, style.x2, style.y2);
    } else if (this.gradientType == 2) {
      this.color = this.ctx.createRadialGradient(style.x1, style.y1, style.r1, style.x2, style.y2, style.r2);
    }
    this._addColorStops(stops);
  }

  addColorStops(stops) {
    for (let i = 0, n = stops.length; i < n; i++) {
      this.colorStops.push(stops[i]);
    }
    this._addColorStops(stops);
  }

  removeColorStopAt(num: number) {
    this.colorStops.splice(num, 1);
    this.setColorStops(this.colorStops);
  }
  /**
   * @method getGradientType
   * 設定されているグラデーションの種類を取得する
   * */
  getGradientType() {
    const type = this.gradientType;
    if (type == 1) {
      return 'linear';
    } else if (type == 2) {
      return 'radial';
    }
    return 'single';
  }

  _onLoad() {
    let svg: HTMLElement;
    let svgdoc: HTMLElement;
    if (this.obj != -1) {
      svgdoc = svgs[this.obj].getSVGDocument();
      var element = svgdoc.getElementsByTagName('path')[0] || svgdoc.getElementsByTagName('circle')[0] || svgdoc.getElementsByTagName('rect')[0] || svgdoc.getElementsByTagName('polygon')[0];
      // @ts-ignore TODO
      svg = svgdoc.getElementsByTagName('svg')[0];
    } else {
      svg = document.getElementById(this.svgid);
      svgdoc = svg;
      var element = svgdoc.getElementsByTagName('path')[0] || svgdoc.getElementsByTagName('circle')[0] || svgdoc.getElementsByTagName('rect')[0] || svgdoc.getElementsByTagName('polygon')[0];
    }
    const color = svg.getElementsByTagName('linearGradient')[0] || svgdoc.getElementsByTagName('radialGradient')[0];
    if (color) {
      const stopsEle = color.getElementsByTagName('stop');
      const stops = [];
      for (let i = 0, n = stopsEle.length; i < n; i++) {
        const ele = stopsEle[i];
        const obj = {} as ColorStop;
        obj.offset = ele.getAttribute('offset');
        let styleCol = ele.style.stopColor.toString();
        const op = ele.style.stopOpacity;
        if (op) {
          styleCol = styleCol.replace('rgb', 'rgba');
          styleCol = styleCol.replace(')', `,${op})`);
        }
        obj.color = styleCol;
        stops.push(obj);
      }
      if (color.tagName == 'linearGradient') {
        const x1 = Number(color.getAttribute('x1'));
        const x2 = Number(color.getAttribute('x2'));
        const y1 = Number(color.getAttribute('y1'));
        const y2 = Number(color.getAttribute('y2'));
        this.setLinearGradient(x1, y1, x2, y2);
      } else if (color.tagName == 'radialGradient') {
        const cx = Number(color.getAttribute('cx'));
        const cy = Number(color.getAttribute('cy'));
        const r = Number(color.getAttribute('r'));
        this.setRadialGradient(cx, cy, 0, cx, cy, r);
      }
      this.setColorStops(stops);
    }
    if (this.color == 'original') {
      this.color = element.getAttribute('fill');
    }
    if (this.strokeColor == 'original') {
      this.strokeColor == element.getAttribute('stroke');
    }
    if (element.tagName == 'path') {
      const path = element.getAttribute('d');
      this.path = this.parsePath(path);
    } else if (element.tagName == 'circle') {
      const radius = element.getAttribute('r');
      var array = [];
      array.push({ method: 'circle', r: radius });
      this.path = array;
    } else if (element.tagName == 'polygon') {
      const points = element.getAttribute('points');
      this.path = this.parsePolygon(points);
    } else if (element.tagName == 'rect') {
      const width = element.getAttribute('width');
      const height = element.getAttribute('height');
      var array = [];
      array.push({ method: 'rect', width, height });
      this.path = array;
    }
    if (this.spriteWidth == void 0) {
      this.spriteWidth = parseInt(svg.getAttribute('width'));
      this.spriteHeight = parseInt(svg.getAttribute('height'));
      if (!this.spriteWidth) {
        const viewBox = svg.getAttribute('viewBox');
        if (viewBox) {
          const data = viewBox.split(' ');
          this.spriteWidth = parseInt(data[2]);
          this.spriteHeight = parseInt(data[3]);
        }
      }
    }
    if (!this.width) {
      this.width = this.spriteWidth;
    }
    if (!this.height) {
      this.height = this.spriteHeight;
    }
    this.prepared = true;
  }
  /**
   * @method draw
   * オブジェクトを描画する
   * */
  draw() {
    if (!this.path) {
      this._onLoad();
    }
    const path = this.path;
    const ctx = this.ctx;
    let x = 0;
    let y = 0;
    let tmpx = 0;
    let tmpy = 0;
    let rcpx = 0;
    let rcpy = 0;
    const width = this.width;
    const height = this.height;
    const scaleX = width / this.spriteWidth;
    const scaleY = height / this.spriteHeight;
    const cX = width / 2;
    const cY = height / 2;
    const transX = this._x || this.x;
    const transY = this._y || this.y;
    const rot = this._rot || this.rot;
    ctx.globalAlpha = this.alpha;
    ctx.globalCompositeOperation = this.drawMode;
    ctx.save();
    ctx.translate(transX + cX, transY + cY);
    ctx.rotate(rot);
    ctx.translate(-cX, -cY);
    ctx.scale(scaleX, scaleY);
    ctx.beginPath();
    for (let i = 0, n = path.length; i < n; i++) {
      const p = this.path[i];
      const method = p.method;
      if (method == 'moveTo' || method == 'horizontalTo' || method == 'verticalTo' || method == 'quadraticCurveTo' || method == 'bezierCurveTo' || method == 'lineTo' || method == 'bezierCurveShortTo' || method == 'quadraticCurveShortTo') { /* 絶対 */
        tmpx = 0;
        tmpy = 0;
        if (p.x || p.x == 0) {
          x = p.x;
        }
        if (p.y || p.y == 0) {
          y = p.y;
        }
      } else { /* 相対 */
        tmpx = x;
        tmpy = y;
        if (p.x) {
          x += p.x;
        }
        if (p.y) {
          y += p.y;
        }
      }
      if (method == 'circle') {
        const r = p.r;
        ctx.arc(x + r, y + r, r, 0, Math.PI * 2, false);
      } else if (method == 'rect') {
        ctx.fillRect(x, y, p.width, p.height);
      } else if (method == 'moveTo' || method == 'moveBy') {
        ctx.moveTo(x, y);
      } else if (method == 'lineTo' || method == 'lineBy') {
        ctx.lineTo(x, y);
      } else if (method == 'quadraticCurveBy' || method == 'quadraticCurveTo') {
        ctx.quadraticCurveTo(tmpx + p.cpx, tmpy + p.cpy, x, y);
        rcpx = 2 * x - (tmpx + p.cpx);
        rcpy = 2 * y - (tmpy + p.cpy);
      } else if (method == 'bezierCurveTo' || method == 'bezierCurveBy') {
        ctx.bezierCurveTo(tmpx + p.cpx1, tmpy + p.cpy1, tmpx + p.cpx2, tmpy + p.cpy2, x, y);
        rcpx = 2 * x - (tmpx + p.cpx2);
        rcpy = 2 * y - (tmpy + p.cpy2);
      } else if (method == 'horizontalTo' || method == 'horizontalBy') {
        ctx.lineTo(x, y);
      } else if (method == 'verticalTo' || method == 'verticalBy') {
        ctx.lineTo(x, y);
      } else if (method == 'bezierCurveShortBy' || method == 'bezierCurveShortTo') {
        ctx.bezierCurveTo(rcpx, rcpy, tmpx + p.cpx2, tmpy + p.cpy2, x, y);
        rcpx = 2 * x - (tmpx + p.cpx2);
        rcpy = 2 * y - (tmpy + p.cpy2);
      } else if (method == 'quadraticCurveShortBy' || method == 'quadraticCurveShortTo') {
        ctx.quadraticCurveTo(rcpx, rcpy, x, y);
        rcpx = 2 * x - rcpx;
        rcpy = 2 * y - rcpy;
      }
    }
    if (this.closeMode) {
      ctx.closePath();
    }
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.strokeStyle = this.strokeColor;
    if (this.strokeMode) {
      ctx.stroke();
    }
    ctx.restore();
  }
  /**
   * @method getNodeByName
   * SVGに設定されたNode（点）オブジェクトを返す
   * */
  getNodeByName(name: string) {
    const path = this.path;
    for (let i = 0, n = path.length; i < n; i++) {
      const p = path[i];
      if (name == p.name) {
        return p;
      }
    }
    return -1;
  }
}

/**
 * @class Atlas.Shape.Box
 * @extends Atlas.Thing
 * 四角形を描画するためのクラス
 * */
export class Box extends Thing {
  constructor(col: string, width: number, height: number) {
    super(width, height);
    this._basicConstructor = 'Shape.Box';
    this.color = col;
  }
  draw() {
    const ctx = this.ctx;
    ctx.globalAlpha = this.alpha;
    ctx.globalCompositeOperation = this.drawMode;
    ctx.beginPath();
    ctx.fillStyle = this.color;
    var x = this._x || this.x;
    var y = this._y || this.y;
    const rot = this._rot || this.rot;
    const width = this._width || this.width;
    const height = this._height || this.height;
    const moveX = x + this.width / 2;
    const moveY = y + this.height / 2;
    ctx.save();
    ctx.translate(moveX, moveY);
    ctx.rotate(rot);
    ctx.translate(-moveX, -moveY);
    var x = this._x || this.x;
    var y = this._y || this.y;
    ctx.fillRect(x, y, width, height);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
}
/**
 * @class Atlas.Shape.Circle
 * @extends Atlas.Thing
 * 円を描画するためのクラス
 * */
export class Circle extends Thing {
  constructor(col: string, radius: number) {
    super(radius * 2, radius * 2);
    this._basicConstructor = 'Shape.Circle';
    this.color = col;
    this.collisionShape = 'circle';
  }
  draw() {
    const ctx = this.ctx;
    ctx.globalAlpha = this.alpha;
    ctx.globalCompositeOperation = this.drawMode;
    ctx.beginPath();
    ctx.fillStyle = this.color;
    const width = this._width || this.width;
    const plus = width / 2;
    const x = this._x || this.x;
    const y = this._y || this.y;
    ctx.arc(x + plus, y + plus, plus, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}