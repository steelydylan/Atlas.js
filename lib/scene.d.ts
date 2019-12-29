import { Group } from "./group";
import { Util } from "./util";
/**
 * @class Atlas.Scene
 * @extends Atlas.Group
 * */
export declare class Scene extends Group {
    image: string;
    constructor();
    addChild(sprite: Util): void;
    setImage(image: string): void;
    setColor(color: string): void;
    _enterFrame(): void;
}
