import { Group } from './group';
import { Util } from './util';
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
  setColor(color: string) {
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