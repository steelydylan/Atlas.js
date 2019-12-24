const images: string[] = [];
const sounds: string[] = [];
const svgs: string[] = [];
let allLoaded = 0;
const isMobile = (() => {
  const userAgent = navigator.userAgent;
  if ((userAgent.indexOf('iPhone') > 0 && userAgent.indexOf('iPad') == -1) || userAgent.indexOf('iPod') > 0 || userAgent.indexOf('Android') > 0) { return true; }
  return false;
})();
const orientation = ((e) => {
  const mq = window.matchMedia('(orientation: portrait)');
  const orientation = '';
  if (mq.matches) { return 'portrait'; }
  return 'landscape';
})();
const setKeyState = (ret, e: KeyboardEvent) => {
  const which = e.which;
  switch (which) {
    case 13:
      ret.enter = true;
      break;
    case 16:
      ret.shift = true;
      break;
    case 32:
      ret.space = true;
      break;
    case 39: // Key[→]
      ret.right = true;
      break;
    case 37: // Key[←]
      ret.left = true;
      break;
    case 38: // Key[↑]
      ret.up = true;
      break;
    case 40: // Key[↓]
      ret.down = true;
      break;
    case 8:
      ret.backspace = true;
      break;
  }
  if (e.metaKey) {
    ret.command = true;
  }
  for (let i = 0; i < 26; i++) {
    if (i + 65 == which) {
      const chr = String.fromCharCode(i + 97);
      ret[chr] = true;
      break;
    }
  }
};

const clearKeyState = (ret) => {
  ret.enter = false;
  ret.command = false;
  ret.shift = false;
  ret.space = false;
  ret.right = false;
  ret.left = false;
  ret.up = false;
  ret.down = false;
  ret.backspace = false;
  for (let i = 0; i < 26; i++) {
    ret[String.fromCharCode(i + 97)] = false;
  }
};

const keydown = (() => {
  const ret = {};
  clearKeyState(ret);
  return ret;
})();

type EventListenerState = {
  touchStart: boolean;
  touchMove: boolean;
  touchEnd: boolean;
  keyUp: boolean;
  keyDown: boolean;
  multiTouchStart: boolean;
  multiTouchEnd: boolean;
  multiTouchMove: boolean;
  orientationChange: boolean;
}

type GradientStyle = { 
  x1: number, 
  y1: number, 
  r1?: number, 
  x2: number, 
  y2: number, 
  r2?: number 
}

type Position = {
  x: number;
  y: number;
  touchCount: number;
  event: TouchEventWithPos;
}

type Size = {
  width: number;
  height: number;
}

type SVGDrawLineMethod = 'quadraticCurveBy' | 'quadraticCurveTo' | 'lineTo' | 'lineBy' | 
  'moveBy' | 'moveTo' | 'bezierCurveBy' | 'circle' | 'rect' |
  'bezierCurveTo' | 'horizontalBy' | 'horizontalTo' | 
  'verticalBy' | 'verticalTo' |  'bezierCurveShortBy' | 
  'bezierCurveShortTo' | 'quadraticCurveShortBy' | 'quadraticCurveShortTo';

type SVGDrawLineState = {
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
}

type ColorStop = {
  offset: string;
  color: string;
}

type Animation = 'moveTo' | 'moveBy' | 'delay' | 'rotateBy' | 'animate' | 'scaleBy' | 'then';

type TouchEventWithPos = TouchEvent & { pageX: number, pageY: number };

type TweenState = {
  time: number;
  loop: boolean;
  and: boolean;
  frame: number;
  toX: number;
  toY: number;
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
  array: TweenState[]
} & {
  [index in Animation]: boolean
};

const Tween = (that: any, kind: Animation, frame: number) => {
  const mover = that.mover;
  const target = mover[mover.length - 1];
  let obj = {} as TweenState;
  if (target && target.and) {
    obj = target;
  }
  obj.time = 0;
  if (frame) { obj.frame = frame; }
  obj.loop = false;
  obj.and = false;
  obj[kind] = true;
  return obj;
};

/**
 * @class Atlas.Util
 * */
export class Util {
  // todo _はprotectedにしたい
  public isMobile: boolean;
  public orientation: 'portrait' | 'landscape';
  public rot: number;
  public visible: boolean;
  public eventEnable: boolean;
  public drawMode: 'source-over';
  public assetPath!: string;
  public moverIndex: number;
  public eventListener: EventListenerState;
  public mover: TweenState[];
  public _remove!: boolean;
  public _leave!: boolean;
  public _css!: HTMLStyleElement;
  public _basicConstructor!: string;
  public _x!: number;
  public _y!: number;
  public _rot: number;
  public scaleX: number;
  public scaleY: number;
  public alpha: number;
  public ctx: CanvasRenderingContext2D;
  public width: number;
  public height: number;
  public _width: number;
  public _height: number;
  public fps: number;
  public scene: Scene;
  public parent: Util;
  public children: Util[];
  public x: number;
  public y: number;
  public field: HTMLCanvasElement;
  public sound: HTMLAudioElement;
  public color:  string | CanvasGradient;
  public frame: number;
  public prepared: boolean;
  // TODO
  public multiTouchStart: Function;
  public multiTouchMove: Function;
  public multiTouchEnd: Function;
  public touchStart: Function;
  public touchMove: Function;
  public touchEnd: Function;
  public keyUp: Function;
  public keyDown: Function;
  public enterFrame: Function;
  public onSceneRemoved: Function;
  public onScenePushed: Function;
  public onLoad: Function;

  constructor() {
    this.isMobile = isMobile;
    this.orientation = orientation;
    this.mover = [];
    this.rot = 0;
    this.moverIndex = 0;
    this.visible = true;
    this.eventEnable = true;
    this.drawMode = 'source-over';
    this.eventListener = {
      touchStart: false,
      touchMove: false,
      touchEnd: false,
      keyUp: false,
      keyDown: false,
      multiTouchStart: false,
      multiTouchMove: false,
      multiTouchEnd: false,
      orientationChange: false
    };
  }

  public isLoaded() {
    return true;
  }

  public _enterFrame() {

  }
  public _onLoad() {

  }

  public draw() {
    
  }

  public tween() {
    const mover = this.mover;
    const length = mover.length;
    if (this.moverIndex < length) {
      const obj = mover[this.moverIndex];
      if (obj.animate) { 
        this._animate(obj); 
      }
      if (obj.moveTo) { 
        this._moveTo(obj); 
      }
      if (obj.moveBy) { 
        this._moveBy(obj); 
      }
      if (obj.rotateBy) { 
        this._rotateBy(obj); 
      }
      if (obj.scaleBy) { 
        this._scaleBy(obj); 
      }
      if (obj.then) { 
        this._then(obj); 
      }
      obj.time++;
      if (obj.time >= obj.frame) {
        this.moverIndex++;
        if (this.moverIndex == length) {
          if (obj.loop) { 
            this._refresh(); 
          } else { 
            this.stop(); 
          }
        }
      }
    }
  }

  protected _animate(obj: TweenState) {

  }

  protected _scaleBy(obj: TweenState) {

  }

  protected _refresh() {
    this.moverIndex = 0;
    const mover = this.mover;
    for (let i = 0, n = mover.length; i < n; i++) {
      const obj = mover[i];
      if (obj.time) { 
        obj.time = 0; 
      }
    }
  }

  /**
   * @method isQueEmpty
   * アニメーション用のキューが空かどうかを判定する
   * */
  public isQueEmpty() {
    return !this.mover.length;
  }

  /**
   * @method moveTo
   * オフジェクトを(x,y)の座標にframeフレームで移動させる
   * @param x {Number}
   * @param y {Number}
   * @param frame {Number}
   * */
  public moveTo(x, y, frame) {
    const obj = Tween(this, 'moveTo', frame);
    obj.toX = x;
    obj.toY = y;
    this.mover.push(obj);
    return this;
  }
  protected _moveTo(obj) {
    if (obj.time === 0) {
      obj.diffX = obj.toX - this.x;
      obj.diffY = obj.toY - this.y;
    }
    this.x = obj.toX - obj.diffX * (1 - obj.time / obj.frame);
    this.y = obj.toY - obj.diffY * (1 - obj.time / obj.frame);
  }
  /**
   * @method moveTo
   * 現在の座標位置からframeフレームで(x,y)移動させる
   * @param x {Number}
   * @param y {Number}
   * @param frame {Number}
   * */
  public moveBy(x, y, frame) {
    const obj = Tween(this, 'moveBy', frame);
    obj.diffX = x;
    obj.diffY = y;
    this.mover.push(obj);
    return this;
  }
  protected _moveBy(obj) {
    if (obj.time === 0) {
      obj.toX = this.x + obj.diffX;
      obj.toY = this.y + obj.diffY;
    }
    this.x = obj.toX - obj.diffX * (1 - obj.time / obj.frame);
    this.y = obj.toY - obj.diffY * (1 - obj.time / obj.frame);
  }
  /**
   * @method delay
   * アニメーションをframeフレーム待つ
   * @param frame {Number}
   * */
  public delay(frame) {
    const obj = Tween(this, 'delay', frame);
    this.mover.push(obj);
    return this;
  }
  /**
   * @method and
   * アニメーションを二つ定義する
   * @example
   * sprite.moveBy(100,100,30).and().rotateBy(Math.PI,30);
   * */
  public and() {
    const mover = this.mover;
    const target = mover[mover.length - 1];
    if (target) { target.and = true; }
    return this;
  }
  /**
   * @method stop
   * アニメーションを中止する
   * */
  public stop() {
    this.mover = [];
    this.moverIndex = 0;
    return this;
  }
  /**
   * @method loop
   * アニメーションをループする
   * @example loop
   * sprite.moveBy(100,100,30).and().rotateBy(Math.PI,30).loop();
   * */
  public loop() {
    const obj = this.mover[this.mover.length - 1];
    obj.loop = true;
    return this;
  }
  /**
  * @method rotateBy
  * @param angle {Number}
  * @param frame {Number}
  * frameフレームでangle（ラジアン）回転させる
  * */
  public rotateBy(angle, frame) {
    const obj = Tween(this, 'rotateBy', frame);
    this.mover.push(obj);
    obj.diffAngle = angle;
    return this;
  }
  protected _rotateBy(obj) {
    if (obj.time === 0) { obj.toAngle = this.rot + obj.diffAngle; }
    this.rot = obj.toAngle - obj.diffAngle * (1 - obj.time / obj.frame);
  }
  /**
  * @method then
  * アニメーションの途中に関数を実行する
  * */
  public then(fn: Function, frame: number) {
    const obj = Tween(this, 'then', frame);
    obj.exec = fn;
    this.mover.push(obj);
    return this;
  }

  protected _then(obj: TweenState) {
    obj.exec.call(this);
  }
  /**
   * @method scaleBy
   * @param x Number
   * @param y Number
   * @param frame Number
   * frameフレームで横にx倍、縦にy倍拡大する
   * */
  scaleBy(x: number, y: number, frame: number) {
    const obj = Tween(this, 'scaleBy', frame);
    obj.scaleX = x;
    obj.scaleY = y;
    this.mover.push(obj);
    return this;
  }
  /**
   * @method setPosition
   * @param x Number
   * @param y Number
   * オフジェクトを座標(x,y)に移動
   * */
  setPosition(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }
  saveData(key: string) {
    const obj = {} as { [index: string]: any };
    for (const i in this) {
      if (typeof (this[i]) !== 'function') {
        obj[i] = this[i];
      }
    }
    localStorage.setItem(key, JSON.stringify(obj));
  }
  getData(key) {
    const obj = JSON.parse(localStorage.getItem(key));
    for (const i in obj) {
      this[i] = obj[i];
    }
  }
  /**
   * @method getTouchPosition
   * @param e eventオブジェクト
   * @param num Number
   * eventオブジェクトからキャンバスの押された位置座標を取得
   * */
  getTouchPosition(e: TouchEventWithPos, num?: number) {
    if (!(num && e.touches[num])) { num = 0; }
    const field = this.field;
    const rateX = parseInt(`${field.width}`) / parseInt(field.style.width);
    const rateY = parseInt(`${field.height}`) / parseInt(field.style.height);
    const obj = {} as Position;
    const margin = field.getBoundingClientRect();
    let x = parseInt(`${margin.left}`);
    let y = parseInt(`${margin.top}`);
    if (isNaN(x)) { x = 0; }
    if (isNaN(y)) { y = 0; }
    const scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    const scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    if (e) {
      if (!isMobile || (isMobile && e.touches[num])) {
        obj.x = (isMobile ? e.touches[num].pageX : e.pageX) - x - scrollX;
        obj.y = (isMobile ? e.touches[num].pageY : e.pageY) - y - scrollY;
      } else {
        obj.x = -1;
        obj.y = -1;
      }
    } else {
      // @ts-ignore
      obj.x = event.x - x;
      // @ts-ignore
      obj.y = event.y - y;
    }
    obj.x = Math.floor(obj.x * rateX);
    obj.y = Math.floor(obj.y * rateY);
    return obj;
  }

  getMultiTouchPosition(e: TouchEventWithPos) {
    const length = e.touches.length;
    const pos = [];
    for (let i = 0; i < length; i++) {
      pos[i] = this.getTouchPosition(e, i);
    }
    return pos;
  }

  handleEvent(e: TouchEventWithPos) {
    if (this.eventEnable) {
      e.preventDefault();
      const pos = this.getTouchPosition(e);
      if (e.touches) { pos.touchCount = e.touches.length; } else { pos.touchCount = 1; }
      pos.event = e;
      const type = e.type;
      switch (type) {
        case 'touchstart': if (this.multiTouchStart && e.touches.length > 1) { this.multiTouchStart(this.getMultiTouchPosition(e)); } else if (this.touchStart) { this.touchStart(pos); }
          break;
        case 'mousedown': if (this.touchStart) this.touchStart(pos); break;
        case 'touchmove': if (this.multiTouchMove && e.touches.length > 1) { this.multiTouchMove(this.getMultiTouchPosition(e)); } else if (this.touchMove) { this.touchMove(pos); }
          break;
        case 'mousemove': if (this.touchMove) this.touchMove(pos); break;
        case 'touchend': if (this.multiTouchEnd && e.touches.length > 1) { this.multiTouchEnd(this.getMultiTouchPosition(e)); } else if (this.touchEnd) { this.touchEnd(pos); }
          break;
        case 'mouseup': if (this.touchEnd) this.touchEnd(); break;
        case 'keydown': if (this.keyDown) this.keyDown(keydown); break;
        case 'keyup': if (this.keyUp) this.keyUp(); break;
      }
    }
  }

  useEvent() {
    const field = this.field;
    const eventListener = this.eventListener;
    if (this.touchStart && eventListener.touchStart === false) {
      if (isMobile) { field.addEventListener('touchstart', this, false); } else { field.addEventListener('mousedown', this, false); }
      eventListener.touchStart = true;
    }
    if (this.touchMove && eventListener.touchMove === false) {
      if (isMobile) { field.addEventListener('touchmove', this, false); } else { field.addEventListener('mousemove', this, false); }
      eventListener.touchMove = true;
    }
    if (this.touchEnd && eventListener.touchEnd === false) {
      if (isMobile) { field.addEventListener('touchend', this, false); } else { field.addEventListener('mouseup', this, false); }
      eventListener.touchEnd = true;
    }
    if (this.multiTouchStart && eventListener.multiTouchStart === false) {
      if (!eventListener.touchStart) {
        if (isMobile) { field.addEventListener('touchstart', this, false); } else { field.addEventListener('mousedown', this, false); }
      }
      eventListener.touchStart = true;
    }
    if (this.multiTouchMove && eventListener.multiTouchMove === false) {
      if (!eventListener.touchMove) {
        if (isMobile) { field.addEventListener('touchmove', this, false); } else { field.addEventListener('mousemove', this, false); }
      }
      eventListener.touchMove = true;
    }
    if (this.multiTouchEnd && eventListener.multiTouchEnd === false) {
      if (!eventListener.touchEnd) {
        if (isMobile) { field.addEventListener('touchend', this, false); } else { field.addEventListener('mouseup', this, false); }
      }
      eventListener.touchEnd = true;
    }
    if (this.keyUp && eventListener.keyUp === false) {
      field.addEventListener('keyup', this, false);
      eventListener.keyUp = true;
    }
    if (this.keyDown && eventListener.keyDown === false) {
      field.addEventListener('keydown', this, false);
      eventListener.keyDown = true;
    }
  }
  /**
   * @method remove
   * オブジェクトをゲームから除外
   * */
  remove() {
    this._remove = true;
  }
  /**
   * @method leave
   * オブジェクトをAppインスタンスやLayerインスタンスから引き離す
   * */
  leave() {
    this._leave = true;
  }
  /**
   * @method getRand
   * @param a Number
   * @param b Number
   * a ~ bの間のランダムな数字を取得
   * */
  getRand(a, b) {
    return ~~(Math.random() * (b - a + 1)) + a;
  }
  /**
   * @method getRandText
   * @param limit Number
   * limitまでの文字数で文字列を取得
   * */
  getRandText(limit) {
    let ret = '';
    const strings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = strings.length;
    for (let i = 0; i < limit; i++) {
      ret += strings.charAt(Math.floor(this.getRand(0, length)));
    }
    return ret;
  }
  /**
   * @method rgbToHex
   * @param r Number
   * @param g Number
   * @param b Number
   * RGB形式から16進を取得する
   * */
  rgbToHex(r, g, b) {
    const rgb = b | (g << 8) | (r << 16);
    return `#${(0x1000000 + rgb).toString(16).slice(1)}`;
  }
  /**
   * @method hexToRgb
   * @param color String
   * @param opacity Number
   * 16進からRGBを取得する
   * */
  hexToRgb(color: string, opacity?: number) {
    if (typeof this.color !== 'string') {
      return null;
    }
    const hex = color || this.color;
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (opacity) {
      return result ?
        `rgba(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)},${opacity})`
        : null;
    }
    return result ?
        `rgb(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)})`
        : null;
  }
  /**
   * @method hsbToHex
   * @param h Number
   * @param s Number
   * @param v Number
   * hsvから16進に変換する
   * */
  hsvToHex(h, s, v) {
    let f,
      i,
      p,
      q,
      t;
    let r,
      g,
      b;
    i = Math.floor(h / 60.0) % 6;
    f = (h / 60.0) - Math.floor(h / 60.0);
    p = Math.round(v * (1.0 - (s / 255.0)));
    q = Math.round(v * (1.0 - (s / 255.0) * f));
    t = Math.round(v * (1.0 - (s / 255.0) * (1.0 - f)));
    switch (i) {
      case 0: r = v; g = t; b = p; break;
      case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t; break;
      case 3: r = p; g = q; b = v; break;
      case 4: r = t; g = p; b = v; break;
      case 5: r = v; g = p; b = q; break;
    }
    if (r <= 15) { r = `0${r.toString(16)}`; } else { r = r.toString(16); }
    if (g <= 15) { g = `0${g.toString(16)}`; } else { g = g.toString(16); }
    if (b <= 15) { b = `0${b.toString(16)}`; } else { b = b.toString(16); }
    return `#${r}${g}${b}`;
  }
  rgbToHsv(r: number, g: number, b: number) {
    let rr;
    let gg;
    let bb;
    var r = r / 255;
    var g = g / 255;
    var b = b / 255;
    let h,
      s,
      v;
    v = Math.max(r, g, b);
    const diff = v - Math.min(r, g, b);
    if (diff == 0) {
      h = s = 0;
    } else {
      s = diff / v;
      rr = (v - r) / 6 / diff + 1 / 2;
      gg = (v - g) / 6 / diff + 1 / 2;
      bb = (v - b) / 6 / diff + 1 / 2;
      if (r === v) {
        h = bb - gg;
      } else if (g === v) {
        h = (1 / 3) + rr - bb;
      } else if (b === v) {
        h = (2 / 3) + gg - rr;
      }
      if (h < 0) {
        h += 1;
      } else if (h > 1) {
        h -= 1;
      }
    }
    return `hsv(${Math.round(h * 360)},${Math.round(s * 100)},${Math.round(v * 100)})`;
  }
  hexToHsv(color: string) {
    const rgb = this.hexToRgb(color);
    return rgb;
  }
  getObjFromRgb(color: string) {
    const arr = /rgb\((.*?),(.*?),(.*?)\)/.exec(color);
    return {
      r: parseInt(arr[1]),
      g: parseInt(arr[2]),
      b: parseInt(arr[3])
    };
  }
  getObjFromHsv(color: string) {
    const arr = /hsv\((.*?),(.*?),(.*?)\)/.exec(color);
    return {
      h: parseInt(arr[1]),
      s: parseInt(arr[2]),
      v: parseInt(arr[3])
    };
  }
  /**
   * @method getSound
   * @param name String
   * Appインスタンスにロードされた音楽を取得する
   * */
  getSound(name: string) {
    for (let i = 0, n = sounds.length; i < n; i++) {
      if (name == sounds[i].name) { 
        this.sound = new Audio(sounds[i].src); 
      }
    }
  }
  /**
   * @method soundClonePlay
   * セットされた音楽を複製して再生する
   * */
  soundClonePlay() {
    const sound = this.sound;
    if (sound) {
      (new Audio(sound.src)).play();
    }
  }
  /**
   * @method soundLoopPlay
   * セットされた音楽をループ再生する
   * */
  soundLoopPlay() {
    const sound = this.sound;
    if (sound) {
      if (!sound.loop) {
        sound.addEventListener('ended', function () {
          this.currentTime = 0;
          this.play();
        }, false);
      }
      sound.loop = true;
      sound.play();
    }
  }
  /**
   * @method soundReplay
   * 再生中の音楽をはじめから再生する
   * */
  soundReplay() {
    const sound = this.sound;
    if (sound) {
      sound.load();
      sound.play();
    }
  }
  /**
   * @method soundStop
   * 再生中の音楽を停止する
   * */
  soundStop() {
    const sound = this.sound;
    if (!sound.paused) {
      sound.pause();
      sound.currentTime = 0;
    } else {
      sound.load();
    }
  }
  /**
   * @method soundPlay
   * セットされた音楽を再生する
   * */
  soundPlay() {
    const sound = this.sound;
    if (sound) { sound.play(); }
  }
  /**
   * @method soundPause
   * 再生中の音楽を一時停止する
   * */
  soundPause() {
    const sound = this.sound;
    if (sound) { sound.pause(); }
  }
  /**
   * @method soundGetCount
   * 再生中の音楽の再生位置を取得する
   * */
  soundGetCount() {
    const sound = this.sound;
    if (sound) { return sound.currentTime; }
  }
  /**
   * @method soundSetCount
   * @param time Number
   * 指定された位置に再生位置を設定する
   * */
  soundSetCount(time) {
    const sound = this.sound;
    if (sound) { sound.currentTime = time; }
  }
  /**
   * @method soundGetVolume
   * セットされた音楽のボリュームを取得する
   * */
  soundGetVolume() {
    const sound = this.sound;
    if (sound) { return sound.volume; }
  }
  /**
   * @method soundSetVolume
   * @param volume Number
   * セットされた音楽のボリュームを設定する
   * */
  soundSetVolume(volume) {
    const sound = this.sound;
    if (sound) { sound.volume = volume; }
  }
  /**
   * @method soundGetAlltime
   * 全再生時間を取得する
   * */
  soundGetAlltime() {
    const sound = this.sound;
    if (sound) { return sound.duration; }
  }
  /**
   * @method 音楽が再生中かを調べる
   * @return Boolean
   * */
  soundIsPlaying() {
    const sound = this.sound;
    if (sound) { return !sound.paused; }
  }
  /**
   * @method getExtention
   * @param fileName String
   * ファイル名から拡張子を取得する
   * */
  getExtention(fileName: string): string {
    let ret;
    if (!fileName) {
      return ret;
    }
    const fileTypes = fileName.split('.');
    const len = fileTypes.length;
    if (len === 0) {
      return ret;
    }
    ret = fileTypes[len - 1];
    return ret;
  }
}
/**
 * @class Atlas.App
 * @extends Atlas.Util
 * */
export class App extends Util {
  public preScene!: Scene;
  public preLoadInterval!: number;
  enterFrame!: () => void;
  onLoad!: () => void;

  constructor(place: string) {
    super();
    this.assetPath = '';
    this._basicConstructor = 'App';
    const css = document.createElement('style');
    css.media = 'screen';
    css.type = 'text/css';
    document.getElementsByTagName('head')[0].appendChild(css);
    let field: HTMLCanvasElement;
    if (place) {
      field = document.getElementById(place) as HTMLCanvasElement;
    } else {
      field = document.createElement('canvas');
      const Body = document.getElementsByTagName('body').item(0);
      if (Body) {
        Body.appendChild(field);
      }
    }
    field.width = 320;
    field.height = 480;
    field.style.top = `${0}px`;
    field.style.left = `${0}px`;
    // @ts-ignore
    field.tabIndex = '1';
    document.body.style.margin = '0em';
    const userAgent = navigator.userAgent;
    if (isMobile) {
      field.style.width = `${window.innerWidth}px`;// mobile default
      field.style.height = `${window.innerHeight}px`;// mobile default
      field.addEventListener('touchstart', function () { if (this.tabIndex != -1) this.focus(); });
    } else {
      field.style.width = `${480}px`;
      field.style.height = `${620}px`;
      field.addEventListener('mousedown', function () { if (this.tabIndex != -1) this.focus(); });
      field.addEventListener('keyup', () => { clearKeyState(keydown); }, false);
      field.addEventListener('keydown', (e) => { setKeyState(keydown, e); });
    }
    this._css = css;
    this.field = field;
    this.ctx = field.getContext('2d');
    this.fps = 30;// fps default
    this.scene = new Scene();
    this.scene.ctx = this.ctx;
    this.scene.field = this.field;
    this.scene.parent = this;
  }
  /**
   * @method clearLockMode
   * ゲーム画面のタブインデントを解除する
   * */
  clearLockMode() {
    this.field.tabIndex = -1;
  }
  /**
   * @method setLockMode
   * ゲーム画面のタブインデントを有効にする
   * */
  setLockMode() {
    this.field.tabIndex = 1;
  }
  /**
   * @method getCanvasURL
   * ゲーム画面のデータURLを取得
   * */
  getCanvasURL() {
    return this.field.toDataURL();
  }
  /**
   * @method getCanvasImage
   * キャンバス画面の画像を新しいタブで開く
   * */
  getCanvasImage() {
    const url = this.field.toDataURL();
    window.open(url, '_blank');
  }
  /**
   * @method getChild
   * ゲームに登録されたプロパティの一致するオブジェクトを取得する
   * */
  getChild(obj) {
    return this.scene.getChild(obj);
  }
  /**
   * @method getChildren
   * ゲームに登録されたプロパティの一致するオブジェクトをすべて取得する
   * */
  getChildren(obj) {
    return this.scene.getChildren(obj);
  }
  /**
   * @method colorToAlpha
   * ゲームに登録された画像の指定された色を透明にする
   * */
  colorToAlpha(imagename: string, hex: string) {
    let img: HTMLImageElement;
    for (let i = 0, n = images.length; i < n; i++) {
      if (images[i].name == imagename) {
        img = images[i];
        img.hex = hex;
        img.index = i;
      }
    }
    img.addEventListener('load', function () {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const width = img.width;
      const height = img.height;
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      const hex = this.hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      const color = result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
      ctx.drawImage(this, 0, 0);
      const ImageData = ctx.getImageData(0, 0, width, height);
      const data = ImageData.data;
      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          const t = i * (width * 4) + (j * 4);
          if (data[t] == color.r && data[t + 1] == color.g && data[t + 2] == color.b) { data[t + 3] = 0; }
        }
      }
      ctx.putImageData(ImageData, 0, 0);// put image data back
      const newimg = new Image();
      newimg.src = canvas.toDataURL();
      images[this.index] = newimg;
    });
  }
  /**
   * @method addChild
   * @param child
   * ゲームにオブジェクトを登録する
   * */
  addChild(child) {
    child.ctx = this.ctx;
    child.field = this.field;
    this.scene.addChild(child);
  }
  /**
   * @method addChildren
   * ゲームにオブジェクトを複数登録する
   * */
  addChildren() {
    for (let i = 0, n = arguments.length; i < n; i++) { this.addChild(arguments[i]); }
  }
  /**
   * @method centerize
   * ゲーム画面を画面の中央に配置する
   * */
  centerize() {
    const style = this.field.style;
    style.marginTop = `${-parseInt(style.height) / 2}px`;
    style.marginLeft = `${-parseInt(style.width) / 2}px`;
    style.top = '50%';
    style.left = '50%';
    style.position = 'absolute';
  }
  /**
   * @method fitWindow
   * ゲーム画面をウィンドウにフィットさせる
   * */
  fitWindow() {
    this.setSize(window.innerWidth, window.innerHeight);
    const that = this;
    window.onresize = function () {
      that.setSize(window.innerWidth, window.innerHeight);
    };
  }
  /**
   * @method setQuality
   * @param width Number
   * @param height Number
   * ゲーム画面の解像度を設定する
   * */
  setQuality(width, height) {
    const field = this.field;
    field.width = width;
    field.height = height;
  }
  /**
   * @method setSize
   * @param width Number
   * @param height Number
   * ゲーム画面の大きさを設定する
   * */
  setSize(width, height) {
    const style = this.field.style;
    style.width = `${width}px`;
    style.height = `${height}px`;
  }
  /**
  * @method getSize
  * ゲーム画面の大きさを取得する
  * */
  getSize() {
    const size = {} as Size;
    size.width = parseInt(this.field.style.width);
    size.height = parseInt(this.field.style.height);
    return size;
  }
  /**
   * @method getQuality
   * ゲーム画面の解像度を取得する
   * */
  getQuality() {
    const size = {} as Size;
    size.width = this.field.width;
    size.height = this.field.height;
    return size;
  }
  /**
   * @method loadingScene
   * @param scene Sceneオブジェクト
   * ローディング中のシーンを登録する
   * */
  loadingScene(scene: Scene) {
    this.preScene = scene;
    this.preScene.parent = this;
  }

  _preLoadEnterFrame() {
    const field = this.field;
    this.useEvent();
    const ctx = this.ctx;
    ctx.clearRect(0, 0, field.width, field.height);
    if (allLoaded > 0) {
      if (this.preScene) { 
        this.preScene._enterFrame(); 
      }
    } else {
      if (this.onLoad) { 
        this.onLoad(); 
      }
      const children = this.scene.children;
      for (let i = 0, n = children.length; i < n; i++) {
        const child = children[i];
        // システム用
        if (child._onLoad) { 
          child._onLoad(); 
        }
        // フック用
        if (child.onLoad) { 
          child.onLoad(); 
        }
      }
      clearInterval(this.preLoadInterval);
      const that = this;
      setInterval(() => {
        that._enterFrame();
      }, 1000 / this.fps);
    }
  }

  _enterFrame() {
    const field = this.field;
    this.ctx.clearRect(0, 0, field.width, field.height);
    this.useEvent();
    if (this.enterFrame) { 
      this.enterFrame(); 
    }
    this.scene._enterFrame();
  }
  /**
   * @method pushScene
   * @param scene Sceneオブジェクト
   * 現在のシーンを新しいシーンに置き換える
   * */
  pushScene(scene) {
    const ctx = this.ctx;
    const field = this.field;
    let children = this.scene.children;
    for (let i = 0, n = children.length; i < n; i++) {
      const target = children[i];
      target.eventEnable = false;
      if (target.onSceneRemoved) { 
        target.onSceneRemoved(); 
      }
    }
    children = scene.children;
    for (let i = 0, n = children.length; i < n; i++) {
      const obj = children[i];
      obj.ctx = ctx;
      obj.field = field;
      obj.eventEnable = true;
      if (obj.onScenePushed) { 
        obj.onScenePushed(); 
      }
    }
    scene.parent = this;
    scene.ctx = ctx;
    scene.field = field;
    const style = this.field.style;
    style.background = null;
    style.backgroundColor = 'white';
    if (scene.color) { this.setColor(scene.color); }
    if (scene.image) { this.setImage(scene.image); }
    this.scene = scene;
  }
  /**
   * @method setColor
   * @param color String
   * ゲームの背景色を設定する
   * */
  setColor(color) {
    const style = this.field.style;
    style.background = null;
    style.backgroundColor = color;
  }
  /**
   * @method setImage
   * @param img String
   * ゲームの背景画像を設定する
   * */
  setImage(img) {
    const style = this.field.style;
    style.background = `url(${img}) no-repeat center`;
    style.backgroundSize = 'cover';
  }
  /**
   * @method start
   * ゲームをスタートする
   * */
  start() {
    const field = this.field;
    const that = this;
    this.ctx.clearRect(0, 0, field.width, field.height);
    this.preLoadInterval = setInterval(() => {
      that._preLoadEnterFrame();
    }, 1000 / this.fps);
  }
  /**
   * @method load
   * 音楽や画像等の素材をロードする
   * */
  load() {
    const musicLoaded = function () {
      allLoaded--;
      console.log(`${this.src} is loaded`);
    };
    const svgLoaded = function () {
      allLoaded--;
      this.style.display = 'none';
      this.loaded = true;
      console.log(`${this.data} is loaded`);
    };
    const imgLoaded = function () {
      allLoaded--;
      this.loaded = true;
      console.log(`${this.src} is loaded`);
    };
    for (let i = 0, n = arguments.length; i < n; i++) {
      var obj = arguments[i];
      var data = obj;
      var name = obj;
      if (obj instanceof Array) {
        var data = obj[0];
        var name = obj[1];
      }
      if (data.match('data:image/png')) {
        var ext = 'png';
      } else {
        if (this.assetPath) {
          data = `${this.assetPath}${data}`;
        }
        var ext = this.getExtention(data);
      }
      if (ext == 'wav' || ext == 'mp3' || ext == 'ogg') {
        const audio = new Audio(data);
        // @ts-ignore TODO
        audio.name = name;
        allLoaded++;
        audio.addEventListener('canplaythrough', musicLoaded);
        sounds.push(audio);
      } else if (ext == 'TTF' || ext == 'ttf') {
        const css = this._css;
        const rule = document.createTextNode(`${'@font-face{' +
          "font-family:'"}${name}';` +
          `src: url('${data}') format('truetype');` +
          '}');
        // @ts-ignore TODO
        if (css.styleSheet) { 
          // @ts-ignore TODO
          css.styleSheet.cssText = rule; 
        } else { 
          css.appendChild(rule); 
        }
      } else if (ext == 'svg') {
        const obj = document.createElement('object');
        obj.addEventListener('load', svgLoaded);
        obj.data = data;
        obj.name = name;
        document.body.appendChild(obj);
        allLoaded++;
        svgs.push(obj);
      } else if (ext == 'png' || ext == 'gif' || ext == 'jpeg' || ext == 'jpg') {
        const obj = new Image();
        obj.addEventListener('load', imgLoaded);
        obj.src = data;
        obj.name = name;
        allLoaded++;
        images.push(obj);
      }
    }
  }
}
/**
 * @class Atlas.Thing
 * @extends Atlas.Util
 * */
export class Thing extends Util {
  public collisionShape: 'box' | 'circle';
  public alpha: number;
  public prepared: boolean;
  public spriteWidth!: number;
  public spriteHeight!: number;
  public _scaleX!: number;
  public _scaleY!: number;
  public _rot!: number;
  public img!: number;

  constructor(width = 0, height = 0) {
    super();
    this.x = 0;
    this.y = 0;
    this._remove = false;
    this.width = width;
    this.height = height;
    this.collisionShape = 'box';
    this.prepared = false;/* 描画の準備が完了 */
    this.alpha = 1;
  }

  _scaleBy(obj: TweenState) {
    if (obj.time === 0) {
      obj.toWidth = this.width * obj.scaleX;
      obj.toHeight = this.height * obj.scaleY;
      obj.diffWidth = obj.toWidth - this.width;
      obj.diffHeight = obj.toHeight - this.height;
    }
    this.width = obj.toWidth - obj.diffWidth * (1 - obj.time / obj.frame);
    this.height = obj.toHeight - obj.diffHeight * (1 - obj.time / obj.frame);
  }
  /**
   * @method intersect
   * @param ex Number
   * @param ey Number
   * 座標(ex,ey)にオブジェクトが衝突しているかを判定する
   * */
  intersect(ex: number, ey: number) {
    const thisx = this._x || this.x;
    const thisy = this._y || this.y;
    const thisw = this._width || this.width;
    const thish = this._height || this.height;
    const r = this._rot || this.rot;
    if (this.collisionShape == 'box') {
      var x = ex - (thisx + thisw / 2);
      var y = ey - (thisy + thish / 2);
      const s = Math.sin(-r);
      const c = Math.cos(-r);
      const xx = Math.abs(x * c - y * s);
      const yy = Math.abs(x * s + y * c);
      if (xx < thisw / 2.0 && yy < thish / 2.0) { return true; }
      return false;
    } else if (this.collisionShape == 'circle') {
      const radius = thisw / 2;
      var x = ex - (thisx + radius);
      var y = ey - (thisy + radius);
      if (Math.sqrt(x * x + y * y) < radius) { return true; }
      return false;
    }
    return false;
  }
  /**
   * @method hitTest
   * @param target Thingオブジェクト
   * 自分がターゲットと接触しているかを判定する
   * */
  hitTest(target) { /* 衝突判定（自分の矩形は傾いてないものとする） */
    let thisx = this._x || this.x;
    let thisy = this._y || this.y;
    const thisW = this._width || this.width;
    const thisH = this._height || this.height;
    let thiscX = thisx + thisW / 2;
    let thiscY = thisy + thisH / 2;
    const targetx = target._x || target.x;
    const targety = target._y || target.y;
    const targetW = target._width || target.width;
    const targetH = target._height || target.height;
    const targetr = target._rot || target.rot;
    if (this.collisionShape == 'box') {
      if (target.collisionShape == 'circle') { return target.within(this, targetW / 2); }/* 矩形と円の当たり判定ならwithinで実装済み */
    } else if (this.collisionShape == 'circle') {
      return this.within(target, thisW / 2);/* 矩形と円の当たり判定ならwithinで実装済み */
    } else {
      return false;
    }
    if (targetr !== 0 && targetr != Math.PI) {
      if (target.collisionShape == 'box') {
        const centerX = targetx + targetW / 2;
        const centerY = targety + targetH / 2;
        const rot = -targetr;
        thiscX = Math.cos(rot) * (thiscX - centerX) -
          Math.sin(rot) * (thiscY - centerY) + centerX;
        thiscY = Math.sin(rot) * (thiscX - centerX) +
          Math.cos(rot) * (thiscY - centerY) + centerY;
        thisx = thiscX - thisW / 2;
        thisy = thiscY - thisH / 2;
      }
    }
    return (thisx < targetx + targetW) && (targetx < thisx + thisW) && (thisy < targety + targetH) && (targety < thisy + thisH);
  }
  /**
   * @method within
   * @param target Thingクラス
   * @param range Number
   * 自分がターゲットから半径range以内にいるかどうかを判定する
   * */
  within(target, range) {
    const thisx = this._x || this.x;
    const thisy = this._y || this.y;
    const thisw = this._width || this.width;
    const thish = this._height || this.height;
    const thisr = this._rot || this.rot;
    const targetx = target._x || target.x;
    const targety = target._y || target.y;
    const targetw = target._width || target.width;
    const targeth = target._height || target.height;
    const targetr = target._rot || target.rot;
    if (this.collisionShape == 'box') {
      var thiscX = thisx + thisw / 2;
      var thiscY = thisy + thish / 2;
    } else if (this.collisionShape == 'circle') {
      const radius = thisw / 2;
      var thiscX = thisx + radius;
      var thiscY = thisy + radius;
    } else {
      return false;
    }
    if (target.collisionShape == 'box') {
      const centerX = targetx + targetw / 2;
      const centerY = targety + targeth / 2;
      const rot = -targetr;
      const cx = Math.cos(rot) * (thiscX - centerX) -
        Math.sin(rot) * (thiscY - centerY) + centerX;
      const cy = Math.sin(rot) * (thiscX - centerX) +
        Math.cos(rot) * (thiscY - centerY) + centerY;
      var x,
        y;
      if (cx < targetx) { x = targetx; } else if (cx > targetx + targetw) { x = targetx + targetw; } else { x = cx; }
      if (cy < targety) { y = targety; } else if (cy > targety + targeth) { y = targety + targeth; } else { y = cy; }
      var a = Math.abs(cx - x);
      var b = Math.abs(cy - y);
    } else if (target.collisionShape == 'circle') {
      const tradius = targetw / 2;
      var x = targetx + tradius;
      var y = targety + tradius;
      var a = Math.abs(thiscX - x);
      var b = Math.abs(thiscY - y);
      range += tradius;
    } else {
      return false;
    }
    if (Math.sqrt((a * a) + (b * b)) < range) { return true; }
    return false;
  }
  /**
   * @method scale
   * @param sx Number
   * @param sy Number
   * オブジェクトを(sx,sy)倍する
   * */
  scale(sx: number, sy: number) {
    if (!this.width) {
      this._scaleX = sx;
      this._scaleY = sy;
    } else {
      this.width *= sx;
      this.height *= sy;
    }
    return this;
  }
  /**
   * @method setSize
   * @param w Number
   * @param h Number
   * オブジェクトを幅w、高さhに設定する
   * */
  setSize(w, h) {
    this.width = w;
    this.height = h;
  }
}
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
  public gradientType: number;
  public path: SVGDrawLineState[];
  public gradientStyle: GradientStyle;
  public color: string | CanvasGradient;

  constructor(path, color, lineColor) {
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
  setSpriteSize(width, height) {
    this.spriteWidth = width;
    this.spriteHeight = height;
  }
  /**
   * @method setImage
   * @param path String
   * ゲームにロードされたSVG画像をロードする
   * */
  setImage(path) {
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

  removeColorStopAt(num) {
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
  getNodeByName(name) {
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
  constructor(col, width, height) {
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
  constructor(col, radius) {
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
/**
 * @class Atlas.Sprite
 * @extends Atlas.Thing
 * 画像等を描画するクラス
 * */
export class Sprite extends Thing {
  public img: number;

  constructor(name, width = null, height = null) {
    super(width, height);
    this.setImage(name, width, height);
    this._basicConstructor = 'Sprite';
    this.frame = 0;
    this.alpha = 1;
  }
  /**
   * @method animate
   * フレームを変えてスプライトをアニメーションさせる
   * */
  animate(array, frameRate, frame) {
    const obj = Tween(this, 'animate', frame);
    obj.array = array;
    obj.frameRate = frameRate;
    obj.frameIdx = 0;
    this.mover.push(obj);
    return this;
  }
  
  _animate(obj) {
    if (obj.time == 0) { this.frame = obj.array[0]; }
    if (obj.time % obj.frameRate == 0) {
      obj.frameIdx = (obj.frameIdx + 1) % obj.array.length;
      this.frame = obj.array[obj.frameIdx];
    }
  }
  setSpriteSize(width, height) {
    this.spriteWidth = width;
    this.spriteHeight = height;
  }
  setImage(name, width, height) {
    if (width && height) { this.setSpriteSize(width, height); }
    const length = images.length;
    for (let i = 0; i < length; i++) {
      if (images[i].name == name) { this.img = i; }
    }
  }
  getImage() {
    return images[this.img];
  }
  isLoaded() {
    const image = this.getImage();
    if (image.loaded && this.ctx) {
      return true;
    }
    return false;
  }
  _onLoad() {
    const obj = this.getImageSize();
    if (!this.width && obj.width) {
      this.setSpriteSize(obj.width, obj.height);
      if (!this.width) {
        this.setSize(obj.width, obj.height);
        if (this._scaleX) {
          this.scale(this._scaleX, this._scaleY);
        }
      }
    }
    this.prepared = true;
  }
  getImageSize() {
    const obj = {} as Size;
    const img = images[this.img];
    obj.width = img.width;
    obj.height = img.height;
    return obj;
  }
  draw() {
    const ctx = this.ctx;
    ctx.globalAlpha = this.alpha;
    ctx.globalCompositeOperation = this.drawMode;
    const frame = this.frame;
    const image = images[this.img];
    const SizeX = this.spriteWidth;
    const SizeY = this.spriteHeight;
    const width = this._width || this.width;
    const height = this._height || this.height;
    const cX = width / 2;
    const cY = height / 2;
    const numX = image.width / SizeX;
    const numY = image.height / SizeY;
    const scaleX = width / SizeX;
    const scaleY = height / SizeY;
    const dx = (frame % numX) * SizeX;
    const dy = (~~(frame / numX) % numY) * SizeY;
    const x = this._x || this.x;
    const y = this._y || this.y;
    const rot = this._rot || this.rot;
    ctx.save();
    ctx.translate(x + cX, y + cY);
    ctx.rotate(rot);
    ctx.translate(-cX, -cY);
    ctx.scale(scaleX, scaleY);
    if (dx != null) { ctx.drawImage(image, dx, dy, SizeX, SizeY, 0, 0, SizeX, SizeY); }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
}
/**
 * @class Atlas.Map
 * @extends Atlas.Sprite
 * */
export class Map extends Sprite {
  public drawData: number[][]
  public hitData: number[][]

  constructor(name, width, height) {
    super(name, width, height);
    this.drawData = [];
    this.hitData = [];
  }
  intersect(ex, ey) {
    const array = this.hitData;
    const x = array[0].length;
    const y = array.length;
    const width = this._width || this.width;
    const height = this._height || this.height;
    const posX = this._x || this.x;
    const posY = this._y || this.y;
    for (let i = 0; i < y; i++) {
      for (let t = 0; t < x; t++) {
        if (array[i][t] == 1 && posX + t * width < ex && ex < posX + (t + 1) * width
          && posY + i * height < ey && ey < posY + (i + 1) * height) { return true; }
      }
    }
    return false;
  }
  draw() {
    const array = this.drawData;
    if (array && array[0]) {
      const x = array[0].length;
      const y = array.length;
      const width = this._width || this.width;
      const height = this._height || this.height;
      const px = this._x || this.x;
      const py = this._y || this.y;
      let i = 0;
      let t = 0;
      const field = this.field;
      const ctx = this.ctx;
      ctx.globalAlpha = this.alpha;
      ctx.globalCompositeOperation = this.drawMode;
      const fieldHeight = field.height;
      const fieldWidth = field.width;
      let frame;
      const image = images[this.img];
      const SizeX = this.spriteWidth;
      const SizeY = this.spriteHeight;
      const cX = width / 2;
      const cY = height / 2;
      const numX = image.width / SizeX;
      const numY = image.height / SizeY;
      const scaleX = this.width / SizeX;
      const scaleY = this.height / SizeY;
      let posX = px;
      let posY = py;
      while (i < y) {
        while (t < x) {
          frame = array[i][t];
          if (frame >= 0 && fieldHeight > py + height * i && py + height * (i + 1) > 0 && fieldWidth > px + width * t && px + width * (t + 1) > 0) {
            const dx = (frame % numX) * SizeX;
            const dy = (~~(frame / numX) % numY) * SizeY;
            ctx.save();
            ctx.translate(posX, posY);
            ctx.scale(scaleX, scaleY);
            ctx.drawImage(image, dx, dy, SizeX, SizeY, 0, 0, SizeX, SizeY);
            ctx.restore();
          }
          posX += width;
          t++;
        }
        posY += height;
        posX = px;
        i++;
        t = 0;
      }
    }
  }
}
/**
 * @class Atlas.Text
 * @extends Atlas.Util
 * */
export class Text extends Util {
  public size: string;
  public spaceWidth: number;
  public font: string;
  public string: string;

  constructor(string, col, size, font) {
    super();
    this._basicConstructor = 'Text';
    this.x = 0;
    this.y = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.alpha = 1;
    this.spaceWidth = 7;/* append */
    if (font) { this.font = `'${font}'`; } else { this.font = "'Meiryo'"; }
    if (size) { this.size = `${size}px`; } else { this.size = '10px'; }
    if (string) { this.string = string; } else { this.string = ''; }
    if (col) { this.color = col; } else { this.color = 'white'; }
  }
  setSize(size) {
    this.size = `${size}px`;
  }
  setFont(font) {
    this.font = `'${font}'`;
  }
  intersect(ex, ey) {
    const thisx = this._x || this.x;
    const thisy = this._y || this.y;
    const width = parseInt(this.size) * this.scaleX * this.string.length;
    const height = parseInt(this.size) * this.scaleY;
    const x = ex - (thisx + width / 2);
    const y = ey - (thisy + height / 2);
    const r = this._rot || this.rot;
    const s = Math.sin(-r);
    const c = Math.cos(-r);
    const xx = Math.abs(x * c - y * s);
    const yy = Math.abs(x * s + y * c);
    if (xx < width / 2.0 && yy < height / 2.0) { return true; }
    return false;
  }
  scale(x, y) {
    this.scaleX *= x;
    this.scaleY *= y;
  }
  _scaleBy(obj) {
    if (obj.time == 0) {
      obj.diffWidth = obj.scaleX - this.scaleX;
      obj.diffHeight = obj.scaleY - this.scaleY;
    }
    this.scaleX = obj.scaleX - obj.diffWidth * (1 - obj.time / obj.frame);
    this.scaleY = obj.scaleY - obj.diffHeight * (1 - obj.time / obj.frame);
  }
  draw() {
    const x = this._x || this.x;
    const y = this._y || this.y;
    const rot = this._rot || this.rot;
    const scaleX = this.scaleX;
    const scaleY = this.scaleY;
    const ctx = this.ctx;
    const strings = this.string.split('<br>');
    const length = strings.length;
    ctx.globalAlpha = this.alpha;
    ctx.globalCompositeOperation = this.drawMode;
    ctx.font = `${this.size} ${this.font}`;
    let height = ctx.measureText('a').width * 1.5 + this.spaceWidth;
    ctx.fillStyle = this.color;
    ctx.save();
    const cX = parseInt(this.size) * this.scaleX * this.string.length / 2;
    const cY = parseInt(this.size) * this.scaleY / 2;
    ctx.translate(x + cX, y + cY);
    ctx.rotate(rot);
    ctx.translate(-cX, -cY);
    ctx.scale(scaleX, scaleY);
    for (let i = 0; i < length; i++) {
      ctx.fillText(strings[i], 0, height);
      height *= 2;
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
}
/**
 * @class Atlas.Group
 * @extends Atlas.Thing
 * */
export class Group extends Thing {
  children: Util[];
  constructor() {
    super();
    this.children = [];
    this.x = 0;
    this.y = 0;
    this._basicConstructor = 'Group';
  }
  addChild(sprite) {
    sprite.parent = this;
    this.children.push(sprite);
    if (this.parent) {
      sprite.ctx = this.parent.ctx;
      sprite.field = this.parent.field;
      this.parent.children.push(sprite);
    }
  }
  public addChildren() {
    for (let i = 0, n = arguments.length; i < n; i++) {
      this.addChild(arguments[i]);
    }
  }
  public getChild(obj) {
    const array = this.getChildren(obj);
    let ret = array[0];
    if (!ret) { ret = null; }
    return ret;
  }
  public getChildren(obj) {
    const ret = [];
    const children = this.children;
    for (let i = 0, n = children.length; i < n; i++) {
      let flag = true;
      for (const key in obj) {
        if (key == '$not') {
          for (const key2 in obj.$not) {
            if (obj.$not[key2] == children[i][key2]) {
              flag = false;
            }
          }
        } else if (obj[key] != children[i][key]) { flag = false; }
      }
      if (flag == true) {
        ret.push(children[i]);
      }
    }
    return ret;
  }
  public removeChild(obj) {
    const child = this.getChild(obj);
    child.remove();
  }
  public removeChildren(obj) {
    const children = this.getChildren(obj);
    for (let i = 0, n = children.length; i < n; i++) {
      children[i].remove();
    }
  }
  public draw() {

  }
}
/**
 * @class Atlas.Scene
 * @extends Atlas.Group
 * */
export class Scene extends Group {
  public image!: string;

  constructor() {
    super();
    this._basicConstructor = 'Scene';
    this._remove = false;
  }
  addChild(sprite: Util) {
    sprite.parent = this;
    if (this.ctx && this.field) {
      sprite.ctx = this.ctx;
      sprite.field = this.field;
    }
    this.children.push(sprite);
    if (sprite._basicConstructor == 'Group' || sprite._basicConstructor == 'Layer') {
      const children = sprite.children;
      for (let i = 0, n = children.length; i < n; i++) {
        const child = children[i];
        if (!child.ctx) {
          child.ctx = this.ctx;
          child.field = this.field;
          this.children.push(child);
        }
      }
    }
  }
  setImage(image: string) {
    this.image = image;
  }
  setColor(color) {
    this.color = color;
  }
  _enterFrame() {
    if (this.enterFrame) { 
      this.enterFrame(); 
    }
    const children = this.children;
    for (let i = 0, n = children.length; i < n; i++) {
      let target = children[i];
      if (target._remove) {
        children.splice(i, 1);
        target = null;
        i--;
        n--;
        continue;
      }
      if (target._basicConstructor == 'Sprite'
        || target._basicConstructor == 'Map'
        || target._basicConstructor == 'Shape') {
        if (target.isLoaded() && !target.prepared) {
          target._onLoad();
          if (target.onLoad) {
            /* フックを登録していたら */
            target.onLoad();
          }
        }
      }/* ロードが終わったオブジェクトの描画準備を完了させる */
      if (target.useEvent) { target.useEvent(); }
      if (target._enterFrame) { target._enterFrame(); }
      if (target.enterFrame) { target.enterFrame(); }
      if (target.tween) { target.tween(); }
      if (target.visible) {
        target.draw();
      }
    }
  }
}
/**
 * @class Atlas.Layer
 * @extends Atlas.Group
 * */
export class Layer extends Group {
  
  protected firstWidth: number;
  protected firstHeight: number;


  constructor() {
    super();
    this.rot = 0;
    this._basicConstructor = 'Layer';
    this.firstWidth = 100;
    this.firstHeight = 100;
    this.height = 100;
    this.width = 100;
    this.scaleX = 1;
    this.scaleY = 1;
  }
  /**
   * @method fitToChildren
   * 登録されたオブジェクトが占める矩形幅にレイヤーのサイズを合わせる
   * */
  fitToChildren() {
    const children = this.children;
    const postx = this.x;
    const posty = this.y;
    this.x = null;
    this.y = null;
    this.width = 0;
    this.height = 0;
    for (let i = 0, n = children.length; i < n; i++) {
      var child = children[i];
      const x = child._x || child.x;
      const y = child._y || child.y;
      const width = child._width || child.width;
      const height = child._height || child.height;
      const centerX = x + (width / 2);
      const centerY = y + (height / 2);
      let rot = child._rot || child.rot;
      rot %= (2 * Math.PI);
      if (rot < 0) {
        rot += (2 * Math.PI);
      }
      if (rot >= 0 && rot <= Math.PI / 2) {
        var x1 = Math.cos(rot) * (x - centerX) - Math.sin(rot) * (y + height - centerY) + centerX;
        var x2 = Math.cos(rot) * (x + width - centerX) - Math.sin(rot) * (y - centerY) + centerX;
        var y1 = Math.sin(rot) * (x - centerX) + Math.cos(rot) * (y - centerY) + centerY;
        var y2 = Math.sin(rot) * (x + width - centerX) + Math.cos(rot) * (y + height - centerY) + centerY;
      } else if (Math.PI / 2 < rot && rot <= Math.PI) {
        var x1 = Math.cos(rot) * (x + width - centerX) - Math.sin(rot) * (y + height - centerY) + centerX;
        var x2 = Math.cos(rot) * (x - centerX) - Math.sin(rot) * (y - centerY) + centerX;
        var y1 = Math.sin(rot) * (x - centerX) + Math.cos(rot) * (y + height - centerY) + centerY;
        var y2 = Math.sin(rot) * (x + width - centerX) + Math.cos(rot) * (y - centerY) + centerY;
      } else if (Math.PI < rot && rot <= 3 / 2 * Math.PI) {
        var x1 = Math.cos(rot) * (x + width - centerX) - Math.sin(rot) * (y - centerY) + centerX;
        var x2 = Math.cos(rot) * (x - centerX) - Math.sin(rot) * (y + height - centerY) + centerX;
        var y1 = Math.sin(rot) * (x + width - centerX) + Math.cos(rot) * (y + height - centerY) + centerY;
        var y2 = Math.sin(rot) * (x - centerX) + Math.cos(rot) * (y - centerY) + centerY;
      } else if (3 / 2 * Math.PI < rot && rot <= 2 * Math.PI) {
        var x1 = Math.cos(rot) * (x - centerX) - Math.sin(rot) * (y - centerY) + centerX;
        var x2 = Math.cos(rot) * (x + width - centerX) - Math.sin(rot) * (y + height - centerY) + centerX;
        var y1 = Math.sin(rot) * (x + width - centerX) + Math.cos(rot) * (y - centerY) + centerY;
        var y2 = Math.sin(rot) * (x - centerX) + Math.cos(rot) * (y + height - centerY) + centerY;
      }
      if (!this.x || this.x > x1) {
        this.x = x1;
      }
      if (!this.y || this.y > y1) {
        this.y = y1;
      }
      if (this.width < x2) {
        this.width = x2;
      }
      if (this.height < y2) {
        this.height = y2;
      }
    }
    this.width -= this.x;
    this.height -= this.y;
    this.firstWidth = this.width;
    this.firstHeight = this.height;
    for (let i = 0, n = children.length; i < n; i++) {
      var child = children[i];
      if (!child._x) {
        child._x = child.x;
        child._y = child.y;
        child.x -= this.x;
        child.y -= this.y;
      } else {
        child.x += postx - this.x;
        child.y += posty - this.y;
      }
    }
    return this;
  }
  /**
   * @method releaseChild
   * @param child Atlas.Thingクラス
   * 登録されているオブジェクトを解放する
   * */
  releaseChild(child) {
    const parent = this.parent;
    child.x = child._x;
    child.y = child._y;
    child.width = child._width;
    child.height = child._height;
    child.rot = child._rot;
    child._x = null;
    child._y = null;
    child._width = null;
    child._height = null;
    child._rot = null;
    child.grouped = false;
    child._leave = false;
    child.parent = parent;
  }
  /**
   * @method releaseAllChildren
   * 登録されているすべてのオブジェクトを解放する
   * */
  releaseAllChildren() {
    const children = this.children;
    for (let i = 0, n = children.length; i < n; i++) {
      const child = children[i];
      this.releaseChild(child);
    }
    this.children = [];
    this._remove = true;
    return this;
  }
  /**
   * @method removeChildrenByProperty
   * @param obj Object
   * プロパティの値が一致するオブジェクトを削除する
   * */
  removeChildrenByProperty(obj) {
    const children = this.getChildren(obj);
    for (let i = 0, n = children.length; i < n; i++) {
      children[i].remove();
    }
    return this;
  }
  /**
   * @method removeAllChildren
   * 登録されたすべてのオブジェクトを削除する
   * */
  removeAllChildren() {
    const children = this.children;
    const parent = this.parent;
    for (let i = 0, n = children.length; i < n; i++) {
      children[i].remove();
    }
    return this;
  }

  _setAbsPos(child) {
    const centerX = (this.width / 2);
    const centerY = (this.height / 2);
    const rot = this.rot;
    child.Cx = (this.scaleX * child.x + child._width / 2);
    child.Cy = (this.scaleY * child.y + child._height / 2);
    child.startRot = true;
    const cx = Math.cos(rot) * (child.Cx - centerX) - Math.sin(rot) * (child.Cy - centerY) + centerX;// this.width/2
    const cy = Math.sin(rot) * (child.Cx - centerX) + Math.cos(rot) * (child.Cy - centerY) + centerY;// this.height/2
    child._x = cx - (child._width / 2);
    child._y = cy - (child._height / 2);
    child._x += this.x;
    child._y += this.y;
  }

  draw() {
    const children = this.children;
    this.scaleX = this.width / this.firstWidth;
    this.scaleY = this.height / this.firstHeight;
    for (let i = 0, n = children.length; i < n; i++) {
      const target = children[i];
      if (target._leave || target._remove) {
        children.splice(i, 1);
        this.releaseChild(target);
        i--;
        n--;
        continue;
      }
      target._rot = target.rot + this.rot;
      target._width = this.scaleX * target.width;
      target._height = this.scaleY * target.height;
      this._setAbsPos(target);
    }
  }
}
