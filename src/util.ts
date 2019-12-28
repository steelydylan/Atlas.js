import { EventListenerState, TweenState, Key } from './types';
import { isMobile, orientation, Tween } from './functions';
import { Scene } from './scene';
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
  public Cx!: number;
  public Cy!: number;
  public _rot!: number;
  public scaleX!: number;
  public scaleY!: number;
  public alpha!: number;
  public ctx!: CanvasRenderingContext2D;
  public width!: number;
  public height!: number;
  public _width!: number;
  public _height!: number;
  public fps!: number;
  public scene!: Scene;
  public parent!: Util;
  public children!: Util[];
  public x!: number;
  public y!: number;
  public field!: HTMLCanvasElement;
  public sound!: HTMLAudioElement;
  public color!: string | CanvasGradient;
  public frame!: number;
  public prepared!: boolean;
  // TODO
  public multiTouchStart(pos?: Position[]) { };
  public multiTouchMove(pos?: Position[]) { };
  public multiTouchEnd(pos?: Position[]) { };
  public touchStart(pos?: Position) { };
  public touchMove(pos?: Position) { };
  public touchEnd(pos?: Position) { };
  public keyUp(key?: Key) { };
  public keyDown(key?: Key) { };
  public enterFrame() { };
  public onSceneRemoved() { };
  public onScenePushed() { };
  public onLoad() { };

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
  public moveTo(x: number, y: number, frame: number) {
    const obj = Tween(this, 'moveTo', frame);
    obj.toX = x;
    obj.toY = y;
    this.mover.push(obj);
    return this;
  }
  protected _moveTo(obj: TweenState) {
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
  public moveBy(x: number, y: number, frame: number) {
    const obj = Tween(this, 'moveBy', frame);
    obj.diffX = x;
    obj.diffY = y;
    this.mover.push(obj);
    return this;
  }
  protected _moveBy(obj: TweenState) {
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
  public delay(frame: number) {
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
  public rotateBy(angle: number, frame: number) {
    const obj = Tween(this, 'rotateBy', frame);
    this.mover.push(obj);
    obj.diffAngle = angle;
    return this;
  }
  protected _rotateBy(obj: TweenState) {
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
  setPosition(x: number, y: number) {
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
  getData(key: string) {
    const obj = JSON.parse(localStorage.getItem(key) as string);
    for (const i in obj) {
      //@ts-ignore TODO
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
  getRand(a: number, b: number) {
    return ~~(Math.random() * (b - a + 1)) + a;
  }
  /**
   * @method getRandText
   * @param limit Number
   * limitまでの文字数で文字列を取得
   * */
  getRandText(limit: number) {
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
  rgbToHex(r: number, g: number, b: number) {
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
  hsvToHex(h: number, s: number, v: number) {
    let f: number;
    let i: number;
    let p: number;
    let q: number;
    let t: number;
    let r: number | string = 0;
    let g: number | string = 0;
    let b: number | string = 0;
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
    let h = 0;
    let s = 0;
    let v = 0;
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
    const arr = /rgb\((.*?),(.*?),(.*?)\)/.exec(color) as RegExpExecArray;
    return {
      r: parseInt(arr[1]),
      g: parseInt(arr[2]),
      b: parseInt(arr[3])
    };
  }
  getObjFromHsv(color: string) {
    const arr = /hsv\((.*?),(.*?),(.*?)\)/.exec(color) as RegExpExecArray;
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
  soundSetCount(time: number) {
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
  soundSetVolume(volume: number) {
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
    let ret = '';
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