import { Thing } from "./thing";
import { Util } from "./util";
/**
 * @class Atlas.Group
 * @extends Atlas.Thing
 * */
export declare class Group extends Thing {
    children: Util[];
    constructor();
    addChild(sprite: Util): void;
    addChildren(): void;
    getChild(obj: Util): Util | undefined;
    getChildren(obj: {
        [key: string]: any;
    }): Util[];
    removeChild(obj: Util): void;
    removeChildren(obj: Util): void;
    draw(): void;
}
