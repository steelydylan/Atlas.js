import { Sprite } from './sprite';
/**
 * @class Atlas.Map
 * @extends Atlas.Sprite
 * */
export declare class Map extends Sprite {
    drawData: number[][];
    hitData: number[][];
    constructor(name: string, width: number, height: number);
    intersect(ex: number, ey: number): boolean;
    draw(): void;
}
