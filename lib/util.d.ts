import { EventListenerState, TweenState, Key, Position, TouchEventWithPos } from "./types";
import { Scene } from "./scene";
/**
 * @class Atlas.Util
 * */
export declare class Util {
    isMobile: boolean;
    orientation: "portrait" | "landscape";
    rot: number;
    visible: boolean;
    eventEnable: boolean;
    drawMode: "source-over";
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
    Cx: number;
    Cy: number;
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
    startRot: boolean;
    grouped: boolean;
    multiTouchStart(pos?: Position[]): void;
    multiTouchMove(pos?: Position[]): void;
    multiTouchEnd(pos?: Position[]): void;
    touchStart(pos?: Position): void;
    touchMove(pos?: Position): void;
    touchEnd(pos?: Position): void;
    keyUp(key?: Key): void;
    keyDown(key?: Key): void;
    enterFrame(): void;
    onSceneRemoved(): void;
    onScenePushed(): void;
    onLoad(): void;
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
    moveTo(x: number, y: number, frame: number): this;
    protected _moveTo(obj: TweenState): void;
    /**
     * @method moveTo
     * 現在の座標位置からframeフレームで(x,y)移動させる
     * @param x {Number}
     * @param y {Number}
     * @param frame {Number}
     * */
    moveBy(x: number, y: number, frame: number): this;
    protected _moveBy(obj: TweenState): void;
    /**
     * @method delay
     * アニメーションをframeフレーム待つ
     * @param frame {Number}
     * */
    delay(frame: number): this;
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
    rotateBy(angle: number, frame: number): this;
    protected _rotateBy(obj: TweenState): void;
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
    setPosition(x: number, y: number): this;
    saveData(key: string): void;
    getData(key: string): void;
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
    getRand(a: number, b: number): number;
    /**
     * @method getRandText
     * @param limit Number
     * limitまでの文字数で文字列を取得
     * */
    getRandText(limit: number): string;
    /**
     * @method rgbToHex
     * @param r Number
     * @param g Number
     * @param b Number
     * RGB形式から16進を取得する
     * */
    rgbToHex(r: number, g: number, b: number): string;
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
    hsvToHex(h: number, s: number, v: number): string;
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
    soundSetCount(time: number): void;
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
    soundSetVolume(volume: number): void;
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
