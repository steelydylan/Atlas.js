import { Sprite } from './sprite';
/**
 * @class Atlas.Map
 * @extends Atlas.Sprite
 * */
export class Map extends Sprite {
  public drawData: number[][]
  public hitData: number[][]

  constructor(name: string, width: number, height: number) {
    super(name, width, height);
    this.drawData = [];
    this.hitData = [];
  }
  intersect(ex: number, ey: number) {
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