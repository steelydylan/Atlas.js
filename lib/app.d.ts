import { Util } from "./util";
import { Scene } from "./scene";
import { Size } from "./types";
/**
 * @class Atlas.App
 * @extends Atlas.Util
 * */
export declare class App extends Util {
    preScene: Scene;
    preLoadInterval: number;
    enterFrame: () => void;
    onLoad: () => void;
    constructor(place: string);
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
    getChild(obj: Util): Util | undefined;
    /**
     * @method getChildren
     * ゲームに登録されたプロパティの一致するオブジェクトをすべて取得する
     * */
    getChildren(obj: Util): Util[];
    /**
     * @method colorToAlpha
     * ゲームに登録された画像の指定された色を透明にする
     * */
    colorToAlpha(imagename: string, hex: string): void;
    /**
     * @method addChild
     * @param child
     * ゲームにオブジェクトを登録する
     * */
    addChild(child: Util): void;
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
    setQuality(width: number, height: number): void;
    /**
     * @method setSize
     * @param width Number
     * @param height Number
     * ゲーム画面の大きさを設定する
     * */
    setSize(width: number, height: number): void;
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
    pushScene(scene: Scene): void;
    /**
     * @method setColor
     * @param color String
     * ゲームの背景色を設定する
     * */
    setColor(color: string | CanvasGradient): void;
    /**
     * @method setImage
     * @param img String
     * ゲームの背景画像を設定する
     * */
    setImage(img: string): void;
    /**
     * @method start
     * ゲームをスタートする
     * */
    start(): void;
    /**
     * @method load
     * 音楽や画像等の素材をロードする
     * */
    load(...args: string[] | string[][]): void;
}
