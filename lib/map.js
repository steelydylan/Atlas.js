"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sprite_1 = require("./sprite");
var functions_1 = require("./functions");
/**
 * @class Atlas.Map
 * @extends Atlas.Sprite
 * */
var Map = /** @class */ (function (_super) {
    __extends(Map, _super);
    function Map(name, width, height) {
        var _this = _super.call(this, name, width, height) || this;
        _this.drawData = [];
        _this.hitData = [];
        return _this;
    }
    Map.prototype.intersect = function (ex, ey) {
        var array = this.hitData;
        var x = array[0].length;
        var y = array.length;
        var width = this._width || this.width;
        var height = this._height || this.height;
        var posX = this._x || this.x;
        var posY = this._y || this.y;
        for (var i = 0; i < y; i++) {
            for (var t = 0; t < x; t++) {
                if (array[i][t] == 1 && posX + t * width < ex && ex < posX + (t + 1) * width
                    && posY + i * height < ey && ey < posY + (i + 1) * height) {
                    return true;
                }
            }
        }
        return false;
    };
    Map.prototype.draw = function () {
        var images = functions_1.getImageAssets();
        var array = this.drawData;
        if (array && array[0]) {
            var x = array[0].length;
            var y = array.length;
            var width = this._width || this.width;
            var height = this._height || this.height;
            var px = this._x || this.x;
            var py = this._y || this.y;
            var i = 0;
            var t = 0;
            var field = this.field;
            var ctx = this.ctx;
            ctx.globalAlpha = this.alpha;
            ctx.globalCompositeOperation = this.drawMode;
            var fieldHeight = field.height;
            var fieldWidth = field.width;
            var frame = void 0;
            var image = images[this.img];
            var SizeX = this.spriteWidth;
            var SizeY = this.spriteHeight;
            var cX = width / 2;
            var cY = height / 2;
            var numX = image.width / SizeX;
            var numY = image.height / SizeY;
            var scaleX = this.width / SizeX;
            var scaleY = this.height / SizeY;
            var posX = px;
            var posY = py;
            while (i < y) {
                while (t < x) {
                    frame = array[i][t];
                    if (frame >= 0 && fieldHeight > py + height * i && py + height * (i + 1) > 0 && fieldWidth > px + width * t && px + width * (t + 1) > 0) {
                        var dx = (frame % numX) * SizeX;
                        var dy = (~~(frame / numX) % numY) * SizeY;
                        ctx.save();
                        ctx.translate(posX, posY);
                        ctx.scale(scaleX, scaleY);
                        ctx.drawImage(image, dx, dy, SizeX, SizeY, 0, 0, SizeX, SizeY);
                        ctx.restore();
                    }
                    posX += width;
                    t++;
                }
                posY += height;
                posX = px;
                i++;
                t = 0;
            }
        }
    };
    return Map;
}(sprite_1.Sprite));
exports.Map = Map;
//# sourceMappingURL=map.js.map