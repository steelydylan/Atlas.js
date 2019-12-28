import { Util } from './util';
import { Scene } from './scene';
import { Size } from './types';
import { isMobile, clearKeyState, setKeyState, getImageAssets, getKeydown, isLoaded, finishLoad, addSound, addSvg, addImage } from './functions';
/**
 * @class Atlas.App
 * @extends Atlas.Util
 * */
export class App extends Util {
  public preScene!: Scene;
  public preLoadInterval!: NodeJS.Timer;
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
    if (isMobile) {
      field.style.width = `${window.innerWidth}px`;// mobile default
      field.style.height = `${window.innerHeight}px`;// mobile default
      field.addEventListener('touchstart', function () { if (this.tabIndex != -1) this.focus(); });
    } else {
      field.style.width = `${480}px`;
      field.style.height = `${620}px`;
      field.addEventListener('mousedown', function () { if (this.tabIndex != -1) this.focus(); });
      field.addEventListener('keyup', () => { 
        const keydown = getKeydown();
        clearKeyState(keydown); 
      }, false);
      field.addEventListener('keydown', (e) => { 
        const keydown = getKeydown();
        setKeyState(keydown, e); 
      });
    }
    this._css = css;
    this.field = field;
    //@ts-ignore
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
  getChild(obj: Util) {
    return this.scene.getChild(obj);
  }
  /**
   * @method getChildren
   * ゲームに登録されたプロパティの一致するオブジェクトをすべて取得する
   * */
  getChildren(obj: Util) {
    return this.scene.getChildren(obj);
  }
  /**
   * @method colorToAlpha
   * ゲームに登録された画像の指定された色を透明にする
   * */
  colorToAlpha(imagename: string, hex: string) {
    let img: HTMLImageElement = new Image();
    const images = getImageAssets();
    for (let i = 0, n = images.length; i < n; i++) {
      if (images[i].name == imagename) {
        img = images[i];
        img.dataset.hex = hex;
        img.dataset.index = `${i}`;
      }
    }
    img.addEventListener('load', () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      const width = img.width;
      const height = img.height;
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      if (!img.dataset.hex) {
        return;
      }
      const hex = img.dataset.hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      const color = result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
      ctx.drawImage(img, 0, 0);
      const ImageData = ctx.getImageData(0, 0, width, height);
      const data = ImageData.data;
      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          const t = i * (width * 4) + (j * 4);
          if (color && data[t] == color.r && data[t + 1] == color.g && data[t + 2] == color.b) { data[t + 3] = 0; }
        }
      }
      ctx.putImageData(ImageData, 0, 0);// put image data back
      const newimg = new Image();
      newimg.src = canvas.toDataURL();
      images[parseInt(img.dataset.index as string)] = newimg;
    });
  }
  /**
   * @method addChild
   * @param child
   * ゲームにオブジェクトを登録する
   * */
  addChild(child: Util) {
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
  setQuality(width: number, height: number) {
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
  setSize(width: number, height: number) {
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
    if (isLoaded()) {
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
  pushScene(scene: Scene) {
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
    style.background = '';
    style.backgroundColor = 'white';
    if (scene.color) { 
      this.setColor(scene.color); 
    }
    if (scene.image) { 
      this.setImage(scene.image); 
    }
    this.scene = scene;
  }
  /**
   * @method setColor
   * @param color String
   * ゲームの背景色を設定する
   * */
  setColor(color: string | CanvasGradient) {
    const style = this.field.style;
    style.background = '';
    if (typeof color === 'string') {
      style.backgroundColor = color;
    }
  }
  /**
   * @method setImage
   * @param img String
   * ゲームの背景画像を設定する
   * */
  setImage(img: string) {
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
  load(...args: string[] | string[][]) {
    for (let i = 0, n = args.length; i < n; i++) {
      const obj = args[i];
      let data = obj as string;
      let name = obj as string;
      if (obj instanceof Array) {
        data = obj[0];
        name = obj[1];
      }
      let ext: string;
      if (data.match('data:image/png')) {
        ext = 'png';
      } else {
        if (this.assetPath) {
          data = `${this.assetPath}${data}`;
        }
        ext = this.getExtention(data);
      }
      if (ext == 'wav' || ext == 'mp3' || ext == 'ogg') {
        const audio = new Audio(data);
        // @ts-ignore TODO
        audio.name = name;
        audio.addEventListener('canplaythrough', () => {
          finishLoad();
          console.log(`${audio.src} is loaded`);
        });
        addSound(audio);
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
        obj.addEventListener('load', () => {
          finishLoad();
          obj.style.display = 'none';
          obj.dataset.loaded = 'true';
          console.log(`${obj.data} is loaded`);
        });
        obj.data = data;
        obj.name = name;
        document.body.appendChild(obj);
        addSvg(obj);
      } else if (ext == 'png' || ext == 'gif' || ext == 'jpeg' || ext == 'jpg') {
        const obj = new Image();
        obj.addEventListener('load', () => {
          finishLoad();
          obj.dataset.loaded = 'true';
          console.log(`${obj.src} is loaded`);
        });
        obj.src = data;
        obj.name = name;
        addImage(obj);
      }
    }
  }
}