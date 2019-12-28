import { Util } from './util';
import { TweenState } from './types';
/**
 * @class Atlas.Text
 * @extends Atlas.Util
 * */
export class Text extends Util {
  public size: string;
  public spaceWidth: number;
  public font: string;
  public string: string;

  constructor(string: string, col: string, size: number, font: string) {
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
  setSize(size: number) {
    this.size = `${size}px`;
  }
  setFont(font: string) {
    this.font = `'${font}'`;
  }
  intersect(ex: number, ey: number) {
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
  scale(x: number, y: number) {
    this.scaleX *= x;
    this.scaleY *= y;
  }
  _scaleBy(obj: TweenState) {
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