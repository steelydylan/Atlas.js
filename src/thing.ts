import { TweenState } from './types';
import { Util } from './util';
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
  public startRot!: boolean;

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
  hitTest(target: Thing) { /* 衝突判定（自分の矩形は傾いてないものとする） */
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
  within(target: Thing, range: number) {
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
    let a: number;
    let b: number;
    let x: number;
    let y: number;
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
      if (cx < targetx) { 
        x = targetx; 
      } else if (cx > targetx + targetw) { 
        x = targetx + targetw; 
      } else { 
        x = cx; 
      }
      if (cy < targety) { 
        y = targety; 
      } else if (cy > targety + targeth) { 
        y = targety + targeth; 
      } else { 
        y = cy; 
      }
      a = Math.abs(cx - x);
      b = Math.abs(cy - y);
    } else if (target.collisionShape == 'circle') {
      const tradius = targetw / 2;
      x = targetx + tradius;
      y = targety + tradius;
      a = Math.abs(thiscX - x);
      b = Math.abs(thiscY - y);
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
  setSize(w: number, h: number) {
    this.width = w;
    this.height = h;
  }
}