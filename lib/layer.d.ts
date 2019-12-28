import { Group } from './group';
import { Util } from './util';
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
    releaseChild(child: Util): void;
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
    removeChildrenByProperty(obj: Util): this;
    /**
     * @method removeAllChildren
     * 登録されたすべてのオブジェクトを削除する
     * */
    removeAllChildren(): this;
    _setAbsPos(child: Util): void;
    draw(): void;
}
