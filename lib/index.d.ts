declare type EventListenerState = {
    touchStart: boolean;
    touchMove: boolean;
    touchEnd: boolean;
    keyUp: boolean;
    keyDown: boolean;
    multiTouchStart: boolean;
    multiTouchEnd: boolean;
    multiTouchMove: boolean;
    orientationChange: boolean;
};
declare type GradientStyle = {
    x1: number;
    y1: number;
    r1?: number;
    x2: number;
    y2: number;
    r2?: number;
};
declare type Position = {
    x: number;
    y: number;
    touchCount: number;
    event: TouchEventWithPos;
};
declare type Size = {
    width: number;
    height: number;
};
declare type SVGDrawLineMethod = 'quadraticCurveBy' | 'quadraticCurveTo' | 'lineTo' | 'lineBy' | 'moveBy' | 'moveTo' | 'bezierCurveBy' | 'circle' | 'rect' | 'bezierCurveTo' | 'horizontalBy' | 'horizontalTo' | 'verticalBy' | 'verticalTo' | 'bezierCurveShortBy' | 'bezierCurveShortTo' | 'quadraticCurveShortBy' | 'quadraticCurveShortTo';
declare type SVGDrawLineState = {
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
};
declare type Animation = 'moveTo' | 'moveBy' | 'delay' | 'rotateBy' | 'animate' | 'scaleBy' | 'then';
declare type TouchEventWithPos = TouchEvent & {
    pageX: number;
    pageY: number;
};
declare type TweenState = {
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
    array: TweenState[];
} & {
    [index in Animation]: boolean;
};
/**
 * @class Atlas.Util
 * */
export declare class Util {
    isMobile: boolean;
    orientation: 'portrait' | 'landscape';
    rot: number;
    visible: boolean;
    eventEnable: boolean;
    drawMode: 'source-over';
    assetPath: string;
    moverIndex: number;
    eventListener: EventListenerState;
    mover: TweenState[];
    _remove: boolean;
    _leave: boolean;
    _css: HTMLStyleElement;
    _basicConstructor: string;
    _x: number;
    _y: number;
    _rot: number;
    scaleX: number;
    scaleY: number;
    alpha: number;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    _width: number;
    _height: number;
    fps: number;
    scene: Scene;
    parent: Util;
    children: Util[];
    x: number;
    y: number;
    field: HTMLCanvasElement;
    sound: HTMLAudioElement;
    color: string | CanvasGradient;
    frame: number;
    prepared: boolean;
    multiTouchStart: Function;
    multiTouchMove: Function;
    multiTouchEnd: Function;
    touchStart: Function;
    touchMove: Function;
    touchEnd: Function;
    keyUp: Function;
    keyDown: Function;
    enterFrame: Function;
    onSceneRemoved: Function;
    onScenePushed: Function;
    onLoad: Function;
    constructor();
    isLoaded(): boolean;
    _enterFrame(): void;
    _onLoad(): void;
    draw(): void;
    tween(): void;
    protected _animate(obj: TweenState): void;
    protected _scaleBy(obj: TweenState): void;
    protected _refresh(): void;
    /**
     * @method isQueEmpty
     * アニメーション用のキューが空かどうかを判定する
     * */
    isQueEmpty(): boolean;
    /**
     * @method moveTo
     * オフジェクトを(x,y)の座標にframeフレームで移動させる
     * @param x {Number}
     * @param y {Number}
     * @param frame {Number}
     * */
    moveTo(x: any, y: any, frame: any): this;
    protected _moveTo(obj: any): void;
    /**
     * @method moveTo
     * 現在の座標位置からframeフレームで(x,y)移動させる
     * @param x {Number}
     * @param y {Number}
     * @param frame {Number}
     * */
    moveBy(x: any, y: any, frame: any): this;
    protected _moveBy(obj: any): void;
    /**
     * @method delay
     * アニメーションをframeフレーム待つ
     * @param frame {Number}
     * */
    delay(frame: any): this;
    /**
     * @method and
     * アニメーションを二つ定義する
     * @example
     * sprite.moveBy(100,100,30).and().rotateBy(Math.PI,30);
     * */
    and(): this;
    /**
     * @method stop
     * アニメーションを中止する
     * */
    stop(): this;
    /**
     * @method loop
     * アニメーションをループする
     * @example loop
     * sprite.moveBy(100,100,30).and().rotateBy(Math.PI,30).loop();
     * */
    loop(): this;
    /**
    * @method rotateBy
    * @param angle {Number}
    * @param frame {Number}
    * frameフレームでangle（ラジアン）回転させる
    * */
    rotateBy(angle: any, frame: any): this;
    protected _rotateBy(obj: any): void;
    /**
    * @method then
    * アニメーションの途中に関数を実行する
    * */
    then(fn: Function, frame: number): this;
    protected _then(obj: TweenState): void;
    /**
     * @method scaleBy
     * @param x Number
     * @param y Number
     * @param frame Number
     * frameフレームで横にx倍、縦にy倍拡大する
     * */
    scaleBy(x: number, y: number, frame: number): this;
    /**
     * @method setPosition
     * @param x Number
     * @param y Number
     * オフジェクトを座標(x,y)に移動
     * */
    setPosition(x: any, y: any): this;
    saveData(key: string): void;
    getData(key: any): void;
    /**
     * @method getTouchPosition
     * @param e eventオブジェクト
     * @param num Number
     * eventオブジェクトからキャンバスの押された位置座標を取得
     * */
    getTouchPosition(e: TouchEventWithPos, num?: number): Position;
    getMultiTouchPosition(e: TouchEventWithPos): Position[];
    handleEvent(e: TouchEventWithPos): void;
    useEvent(): void;
    /**
     * @method remove
     * オブジェクトをゲームから除外
     * */
    remove(): void;
    /**
     * @method leave
     * オブジェクトをAppインスタンスやLayerインスタンスから引き離す
     * */
    leave(): void;
    /**
     * @method getRand
     * @param a Number
     * @param b Number
     * a ~ bの間のランダムな数字を取得
     * */
    getRand(a: any, b: any): any;
    /**
     * @method getRandText
     * @param limit Number
     * limitまでの文字数で文字列を取得
     * */
    getRandText(limit: any): string;
    /**
     * @method rgbToHex
     * @param r Number
     * @param g Number
     * @param b Number
     * RGB形式から16進を取得する
     * */
    rgbToHex(r: any, g: any, b: any): string;
    /**
     * @method hexToRgb
     * @param color String
     * @param opacity Number
     * 16進からRGBを取得する
     * */
    hexToRgb(color: string, opacity?: number): string | null;
    /**
     * @method hsbToHex
     * @param h Number
     * @param s Number
     * @param v Number
     * hsvから16進に変換する
     * */
    hsvToHex(h: any, s: any, v: any): string;
    rgbToHsv(r: number, g: number, b: number): string;
    hexToHsv(color: string): string | null;
    getObjFromRgb(color: string): {
        r: number;
        g: number;
        b: number;
    };
    getObjFromHsv(color: string): {
        h: number;
        s: number;
        v: number;
    };
    /**
     * @method getSound
     * @param name String
     * Appインスタンスにロードされた音楽を取得する
     * */
    getSound(name: string): void;
    /**
     * @method soundClonePlay
     * セットされた音楽を複製して再生する
     * */
    soundClonePlay(): void;
    /**
     * @method soundLoopPlay
     * セットされた音楽をループ再生する
     * */
    soundLoopPlay(): void;
    /**
     * @method soundReplay
     * 再生中の音楽をはじめから再生する
     * */
    soundReplay(): void;
    /**
     * @method soundStop
     * 再生中の音楽を停止する
     * */
    soundStop(): void;
    /**
     * @method soundPlay
     * セットされた音楽を再生する
     * */
    soundPlay(): void;
    /**
     * @method soundPause
     * 再生中の音楽を一時停止する
     * */
    soundPause(): void;
    /**
     * @method soundGetCount
     * 再生中の音楽の再生位置を取得する
     * */
    soundGetCount(): number | undefined;
    /**
     * @method soundSetCount
     * @param time Number
     * 指定された位置に再生位置を設定する
     * */
    soundSetCount(time: any): void;
    /**
     * @method soundGetVolume
     * セットされた音楽のボリュームを取得する
     * */
    soundGetVolume(): number | undefined;
    /**
     * @method soundSetVolume
     * @param volume Number
     * セットされた音楽のボリュームを設定する
     * */
    soundSetVolume(volume: any): void;
    /**
     * @method soundGetAlltime
     * 全再生時間を取得する
     * */
    soundGetAlltime(): number | undefined;
    /**
     * @method 音楽が再生中かを調べる
     * @return Boolean
     * */
    soundIsPlaying(): boolean | undefined;
    /**
     * @method getExtention
     * @param fileName String
     * ファイル名から拡張子を取得する
     * */
    getExtention(fileName: string): string;
}
/**
 * @class Atlas.App
 * @extends Atlas.Util
 * */
export declare class App extends Util {
    preScene: Scene;
    preLoadInterval: number;
    enterFrame: () => void;
    onLoad: () => void;
    constructor(place: any);
    /**
     * @method clearLockMode
     * ゲーム画面のタブインデントを解除する
     * */
    clearLockMode(): void;
    /**
     * @method setLockMode
     * ゲーム画面のタブインデントを有効にする
     * */
    setLockMode(): void;
    /**
     * @method getCanvasURL
     * ゲーム画面のデータURLを取得
     * */
    getCanvasURL(): string;
    /**
     * @method getCanvasImage
     * キャンバス画面の画像を新しいタブで開く
     * */
    getCanvasImage(): void;
    /**
     * @method getChild
     * ゲームに登録されたプロパティの一致するオブジェクトを取得する
     * */
    getChild(obj: any): Util;
    /**
     * @method getChildren
     * ゲームに登録されたプロパティの一致するオブジェクトをすべて取得する
     * */
    getChildren(obj: any): Util[];
    /**
     * @method colorToAlpha
     * ゲームに登録された画像の指定された色を透明にする
     * */
    colorToAlpha(imagename: any, hex: any): void;
    /**
     * @method addChild
     * @param child
     * ゲームにオブジェクトを登録する
     * */
    addChild(child: any): void;
    /**
     * @method addChildren
     * ゲームにオブジェクトを複数登録する
     * */
    addChildren(): void;
    /**
     * @method centerize
     * ゲーム画面を画面の中央に配置する
     * */
    centerize(): void;
    /**
     * @method fitWindow
     * ゲーム画面をウィンドウにフィットさせる
     * */
    fitWindow(): void;
    /**
     * @method setQuality
     * @param width Number
     * @param height Number
     * ゲーム画面の解像度を設定する
     * */
    setQuality(width: any, height: any): void;
    /**
     * @method setSize
     * @param width Number
     * @param height Number
     * ゲーム画面の大きさを設定する
     * */
    setSize(width: any, height: any): void;
    /**
    * @method getSize
    * ゲーム画面の大きさを取得する
    * */
    getSize(): Size;
    /**
     * @method getQuality
     * ゲーム画面の解像度を取得する
     * */
    getQuality(): Size;
    /**
     * @method loadingScene
     * @param scene Sceneオブジェクト
     * ローディング中のシーンを登録する
     * */
    loadingScene(scene: Scene): void;
    _preLoadEnterFrame(): void;
    _enterFrame(): void;
    /**
     * @method pushScene
     * @param scene Sceneオブジェクト
     * 現在のシーンを新しいシーンに置き換える
     * */
    pushScene(scene: any): void;
    /**
     * @method setColor
     * @param color String
     * ゲームの背景色を設定する
     * */
    setColor(color: any): void;
    /**
     * @method setImage
     * @param img String
     * ゲームの背景画像を設定する
     * */
    setImage(img: any): void;
    /**
     * @method start
     * ゲームをスタートする
     * */
    start(): void;
    /**
     * @method load
     * 音楽や画像等の素材をロードする
     * */
    load(): void;
}
/**
 * @class Atlas.Thing
 * @extends Atlas.Util
 * */
export declare class Thing extends Util {
    collisionShape: 'box' | 'circle';
    alpha: number;
    prepared: boolean;
    spriteWidth: number;
    spriteHeight: number;
    _scaleX: number;
    _scaleY: number;
    _rot: number;
    img: number;
    constructor(width?: number, height?: number);
    _scaleBy(obj: TweenState): void;
    /**
     * @method intersect
     * @param ex Number
     * @param ey Number
     * 座標(ex,ey)にオブジェクトが衝突しているかを判定する
     * */
    intersect(ex: number, ey: number): boolean;
    /**
     * @method hitTest
     * @param target Thingオブジェクト
     * 自分がターゲットと接触しているかを判定する
     * */
    hitTest(target: any): any;
    /**
     * @method within
     * @param target Thingクラス
     * @param range Number
     * 自分がターゲットから半径range以内にいるかどうかを判定する
     * */
    within(target: any, range: any): boolean;
    /**
     * @method scale
     * @param sx Number
     * @param sy Number
     * オブジェクトを(sx,sy)倍する
     * */
    scale(sx: any, sy: any): this;
    /**
     * @method setSize
     * @param w Number
     * @param h Number
     * オブジェクトを幅w、高さhに設定する
     * */
    setSize(w: any, h: any): void;
}
/**
 * @class Atlas.Shape
 * @extends Atlas.Thing
 * SVGを描画するためのクラス
 * */
export declare class Shape extends Thing {
    protected obj: number;
    protected svgid: string;
    protected colorStops: any;
    strokeColor: string;
    closeMode: boolean;
    strokeMode: boolean;
    gradientType: number;
    path: SVGDrawLineState[];
    gradientStyle: GradientStyle;
    color: string | CanvasGradient;
    constructor(path: any, color: any, lineColor: any);
    /**
     * @method setSpriteSize
     * @param width Number
     * @param height Number
     * スプライトの大きさを設定する
     * */
    setSpriteSize(width: any, height: any): void;
    /**
     * @method setImage
     * @param path String
     * ゲームにロードされたSVG画像をロードする
     * */
    setImage(path: any): void;
    /**
     * @method getImage
     * セットされているSVG画像を取得する
     * */
    getImage(): any;
    /**
     * @method getImageName
     * セットされている画像名を取得する
     * */
    getImageName(): any;
    /**
     * @method parsePolygon
     * @param polygon String
     * SVGのポリゴン要素を解析
     * */
    parsePolygon(polygon: any): {
        method: string;
        x: number;
        y: number;
    }[];
    /**
     * @method parsePath
     * @param path String
     * SVGのpath要素を解析
     * */
    parsePath(path: any): any[];
    /**
     * @method isLoaded
     * @return Boolean
     * 画像がロードされているかを返す
     * */
    isLoaded(): boolean;
    /**
     * @method setLinearGradient
     * オブジェクトに対して線形グラデーションを設定する
     * */
    setLinearGradient(x1: number, y1: number, x2: number, y2: number): void;
    /**
     * @method setRadialGradient
     * オブジェクトに対して円形グラデーションを設定する
     * */
    setRadialGradient(x1: any, y1: any, r1: any, x2: any, y2: any, r2: any): void;
    _addColorStops(stops: any): void;
    setColorStops(stops: any): void;
    addColorStops(stops: any): void;
    removeColorStopAt(num: any): void;
    /**
     * @method getGradientType
     * 設定されているグラデーションの種類を取得する
     * */
    getGradientType(): "linear" | "radial" | "single";
    _onLoad(): void;
    /**
     * @method draw
     * オブジェクトを描画する
     * */
    draw(): void;
    /**
     * @method getNodeByName
     * SVGに設定されたNode（点）オブジェクトを返す
     * */
    getNodeByName(name: any): SVGDrawLineState | -1;
}
/**
 * @class Atlas.Shape.Box
 * @extends Atlas.Thing
 * 四角形を描画するためのクラス
 * */
export declare class Box extends Thing {
    constructor(col: any, width: any, height: any);
    draw(): void;
}
/**
 * @class Atlas.Shape.Circle
 * @extends Atlas.Thing
 * 円を描画するためのクラス
 * */
export declare class Circle extends Thing {
    constructor(col: any, radius: any);
    draw(): void;
}
/**
 * @class Atlas.Sprite
 * @extends Atlas.Thing
 * 画像等を描画するクラス
 * */
export declare class Sprite extends Thing {
    img: number;
    constructor(name: any, width?: null, height?: null);
    /**
     * @method animate
     * フレームを変えてスプライトをアニメーションさせる
     * */
    animate(array: any, frameRate: any, frame: any): this;
    _animate(obj: any): void;
    setSpriteSize(width: any, height: any): void;
    setImage(name: any, width: any, height: any): void;
    getImage(): any;
    isLoaded(): boolean;
    _onLoad(): void;
    getImageSize(): Size;
    draw(): void;
}
/**
 * @class Atlas.Map
 * @extends Atlas.Sprite
 * */
export declare class Map extends Sprite {
    drawData: number[][];
    hitData: number[][];
    constructor(name: any, width: any, height: any);
    intersect(ex: any, ey: any): boolean;
    draw(): void;
}
/**
 * @class Atlas.Text
 * @extends Atlas.Util
 * */
export declare class Text extends Util {
    size: string;
    spaceWidth: number;
    font: string;
    string: string;
    constructor(string: any, col: any, size: any, font: any);
    setSize(size: any): void;
    setFont(font: any): void;
    intersect(ex: any, ey: any): boolean;
    scale(x: any, y: any): void;
    _scaleBy(obj: any): void;
    draw(): void;
}
/**
 * @class Atlas.Group
 * @extends Atlas.Thing
 * */
export declare class Group extends Thing {
    children: Util[];
    constructor();
    addChild(sprite: any): void;
    addChildren(): void;
    getChild(obj: any): Util;
    getChildren(obj: any): Util[];
    removeChild(obj: any): void;
    removeChildren(obj: any): void;
    draw(): void;
}
/**
 * @class Atlas.Scene
 * @extends Atlas.Group
 * */
export declare class Scene extends Group {
    image: string;
    constructor();
    addChild(sprite: any): void;
    setImage(image: string): void;
    setColor(color: any): void;
    _enterFrame(): void;
}
/**
 * @class Atlas.Layer
 * @extends Atlas.Group
 * */
export declare class Layer extends Group {
    protected firstWidth: number;
    protected firstHeight: number;
    constructor();
    /**
     * @method fitToChildren
     * 登録されたオブジェクトが占める矩形幅にレイヤーのサイズを合わせる
     * */
    fitToChildren(): this;
    /**
     * @method releaseChild
     * @param child Atlas.Thingクラス
     * 登録されているオブジェクトを解放する
     * */
    releaseChild(child: any): void;
    /**
     * @method releaseAllChildren
     * 登録されているすべてのオブジェクトを解放する
     * */
    releaseAllChildren(): this;
    /**
     * @method removeChildrenByProperty
     * @param obj Object
     * プロパティの値が一致するオブジェクトを削除する
     * */
    removeChildrenByProperty(obj: any): this;
    /**
     * @method removeAllChildren
     * 登録されたすべてのオブジェクトを削除する
     * */
    removeAllChildren(): this;
    _setAbsPos(child: any): void;
    draw(): void;
}
export {};
