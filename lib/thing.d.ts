import { TweenState } from './types';
import { Util } from './util';
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
    hitTest(target: Thing): boolean;
    /**
     * @method within
     * @param target Thingクラス
     * @param range Number
     * 自分がターゲットから半径range以内にいるかどうかを判定する
     * */
    within(target: Thing, range: number): boolean;
    /**
     * @method scale
     * @param sx Number
     * @param sy Number
     * オブジェクトを(sx,sy)倍する
     * */
    scale(sx: number, sy: number): this;
    /**
     * @method setSize
     * @param w Number
     * @param h Number
     * オブジェクトを幅w、高さhに設定する
     * */
    setSize(w: number, h: number): void;
}
