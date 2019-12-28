import { Util } from './util';
import { TweenState } from './types';
/**
 * @class Atlas.Text
 * @extends Atlas.Util
 * */
export declare class Text extends Util {
    size: string;
    spaceWidth: number;
    font: string;
    string: string;
    constructor(string: string, col?: string, size?: number, font?: string);
    setSize(size: number): void;
    setFont(font: string): void;
    intersect(ex: number, ey: number): boolean;
    scale(x: number, y: number): void;
    _scaleBy(obj: TweenState): void;
    draw(): void;
}
