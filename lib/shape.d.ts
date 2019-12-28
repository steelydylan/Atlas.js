import { Thing } from './thing';
import { SVGDrawLineState, GradientStyle, ColorStop } from './types';
/**
 * @class Atlas.Shape
 * @extends Atlas.Thing
 * SVGを描画するためのクラス
 * */
export declare class Shape extends Thing {
    protected obj: number;
    protected svgid: string;
    protected colorStops: ColorStop[];
    strokeColor: string;
    closeMode: boolean;
    strokeMode: boolean;
    gradientType: number;
    path: SVGDrawLineState[];
    gradientStyle: GradientStyle;
    color: string | CanvasGradient;
    constructor(path: string, color: string, lineColor: string);
    /**
     * @method setSpriteSize
     * @param width Number
     * @param height Number
     * スプライトの大きさを設定する
     * */
    setSpriteSize(width: number, height: number): void;
    /**
     * @method setImage
     * @param path String
     * ゲームにロードされたSVG画像をロードする
     * */
    setImage(path: string): void;
    /**
     * @method getImage
     * セットされているSVG画像を取得する
     * */
    getImage(): HTMLObjectElement;
    /**
     * @method getImageName
     * セットされている画像名を取得する
     * */
    getImageName(): string;
    /**
     * @method parsePolygon
     * @param polygon String
     * SVGのポリゴン要素を解析
     * */
    parsePolygon(polygon: string): {
        method: string;
        x: number;
        y: number;
    }[];
    /**
     * @method parsePath
     * @param path String
     * SVGのpath要素を解析
     * */
    parsePath(path: string): any[];
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
    setRadialGradient(x1: number, y1: number, r1: number, x2?: number, y2?: number, r2?: number): void;
    _addColorStops(stops: ColorStop[]): void;
    setColorStops(stops: ColorStop[]): void;
    addColorStops(stops: ColorStop[]): void;
    removeColorStopAt(num: number): void;
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
    getNodeByName(name: string): SVGDrawLineState | -1;
}
/**
 * @class Atlas.Shape.Box
 * @extends Atlas.Thing
 * 四角形を描画するためのクラス
 * */
export declare class Box extends Thing {
    constructor(col: string, width: number, height: number);
    draw(): void;
}
/**
 * @class Atlas.Shape.Circle
 * @extends Atlas.Thing
 * 円を描画するためのクラス
 * */
export declare class Circle extends Thing {
    constructor(col: string, radius: number);
    draw(): void;
}
