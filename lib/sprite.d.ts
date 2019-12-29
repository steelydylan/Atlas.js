import { Thing } from "./thing";
import { TweenState, Size } from "./types";
/**
 * @class Atlas.Sprite
 * @extends Atlas.Thing
 * 画像等を描画するクラス
 * */
export declare class Sprite extends Thing {
    img: number;
    constructor(name: string, width: number, height: number);
    /**
     * @method animate
     * フレームを変えてスプライトをアニメーションさせる
     * */
    animate(array: number[], frameRate: number, frame: number): this;
    _animate(obj: TweenState): void;
    setSpriteSize(width: number, height: number): void;
    setImage(name: string, width: number, height: number): void;
    getImage(): HTMLImageElement;
    isLoaded(): boolean;
    _onLoad(): void;
    getImageSize(): Size;
    draw(): void;
}
