import { Thing } from './thing';
import { TweenState } from './types';
import { Tween } from './functions';
/**
 * @class Atlas.Sprite
 * @extends Atlas.Thing
 * 画像等を描画するクラス
 * */
export class Sprite extends Thing {
  public img!: number;

  constructor(name: string, width: number, height: number) {
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
  animate(array: number[], frameRate: number, frame: number) {
    const obj = Tween(this, 'animate', frame);
    obj.array = array;
    obj.frameRate = frameRate;
    obj.frameIdx = 0;
    this.mover.push(obj);
    return this;
  }
  
  _animate(obj: TweenState) {
    if (obj.time == 0) { this.frame = obj.array[0]; }
    if (obj.time % obj.frameRate == 0) {
      obj.frameIdx = (obj.frameIdx + 1) % obj.array.length;
      this.frame = obj.array[obj.frameIdx];
    }
  }
  setSpriteSize(width: number, height: number) {
    this.spriteWidth = width;
    this.spriteHeight = height;
  }
  setImage(name: string, width: number, height: number) {
    if (width && height) { 
      this.setSpriteSize(width, height); 
    }
    const length = images.length;
    for (let i = 0; i < length; i++) {
      if (images[i].name == name) { 
        this.img = i; 
      }
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