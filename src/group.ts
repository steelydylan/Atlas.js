import { Thing } from './thing';
import { Util } from './util';
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
  addChild(sprite: Util) {
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
  public getChild(obj: Util) {
    const array = this.getChildren(obj);
    let ret = array[0];
    if (!ret) {
      return
    }
    return ret;
  }
  public getChildren(obj: { [key: string]: any }) {
    const ret = [];
    const children = this.children;
    for (let i = 0, n = children.length; i < n; i++) {
      let flag = true;
      for (const key in obj) {
        if (key == '$not') {
          for (const key2 in obj.$not) {
            //@ts-ignore
            if (obj.$not[key2] == children[i][key2]) {
              flag = false;
            }
          }
          //@ts-ignore
        } else if (obj[key] != children[i][key]) { 
          flag = false; 
        }
      }
      if (flag == true) {
        ret.push(children[i]);
      }
    }
    return ret;
  }
  public removeChild(obj: Util) {
    const child = this.getChild(obj);
    if (child) {
      child.remove();
    }
  }
  public removeChildren(obj: Util) {
    const children = this.getChildren(obj);
    for (let i = 0, n = children.length; i < n; i++) {
      children[i].remove();
    }
  }
  public draw() {

  }
}