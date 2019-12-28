import { Group } from './group';
import { Thing } from './thing';
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
  releaseChild(child: Thing) {
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
  removeChildrenByProperty(obj: Thing) {
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

  _setAbsPos(child: Thing) {
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