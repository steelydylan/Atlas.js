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
var thing_1 = require("./thing");
var functions_1 = require("./functions");
/**
 * @class Atlas.Sprite
 * @extends Atlas.Thing
 * 画像等を描画するクラス
 * */
var Sprite = /** @class */ (function (_super) {
    __extends(Sprite, _super);
    function Sprite(name, width, height) {
        var _this = _super.call(this, width, height) || this;
        _this.setImage(name, width, height);
        _this._basicConstructor = 'Sprite';
        _this.frame = 0;
        _this.alpha = 1;
        return _this;
    }
    /**
     * @method animate
     * フレームを変えてスプライトをアニメーションさせる
     * */
    Sprite.prototype.animate = function (array, frameRate, frame) {
        var obj = functions_1.Tween(this, 'animate', frame);
        obj.array = array;
        obj.frameRate = frameRate;
        obj.frameIdx = 0;
        this.mover.push(obj);
        return this;
    };
    Sprite.prototype._animate = function (obj) {
        if (obj.time == 0) {
            this.frame = obj.array[0];
        }
        if (obj.time % obj.frameRate == 0) {
            obj.frameIdx = (obj.frameIdx + 1) % obj.array.length;
            this.frame = obj.array[obj.frameIdx];
        }
    };
    Sprite.prototype.setSpriteSize = function (width, height) {
        this.spriteWidth = width;
        this.spriteHeight = height;
    };
    Sprite.prototype.setImage = function (name, width, height) {
        if (width && height) {
            this.setSpriteSize(width, height);
        }
        var images = functions_1.getImageAssets();
        var length = images.length;
        for (var i = 0; i < length; i++) {
            if (images[i].name == name) {
                this.img = i;
            }
        }
    };
    Sprite.prototype.getImage = function () {
        var images = functions_1.getImageAssets();
        return images[this.img];
    };
    Sprite.prototype.isLoaded = function () {
        var image = this.getImage();
        if (image.dataset.loaded && this.ctx) {
            return true;
        }
        return false;
    };
    Sprite.prototype._onLoad = function () {
        var obj = this.getImageSize();
        if (!this.width && obj.width) {
            this.setSpriteSize(obj.width, obj.height);
            if (!this.width) {
                this.setSize(obj.width, obj.height);
                if (this._scaleX) {
                    this.scale(this._scaleX, this._scaleY);
                }
            }
        }
        this.prepared = true;
    };
    Sprite.prototype.getImageSize = function () {
        var images = functions_1.getImageAssets();
        var obj = {};
        var img = images[this.img];
        obj.width = img.width;
        obj.height = img.height;
        return obj;
    };
    Sprite.prototype.draw = function () {
        var images = functions_1.getImageAssets();
        var ctx = this.ctx;
        ctx.globalAlpha = this.alpha;
        ctx.globalCompositeOperation = this.drawMode;
        var frame = this.frame;
        var image = images[this.img];
        var SizeX = this.spriteWidth;
        var SizeY = this.spriteHeight;
        var width = this._width || this.width;
        var height = this._height || this.height;
        var cX = width / 2;
        var cY = height / 2;
        var numX = image.width / SizeX;
        var numY = image.height / SizeY;
        var scaleX = width / SizeX;
        var scaleY = height / SizeY;
        var dx = (frame % numX) * SizeX;
        var dy = (~~(frame / numX) % numY) * SizeY;
        var x = this._x || this.x;
        var y = this._y || this.y;
        var rot = this._rot || this.rot;
        ctx.save();
        ctx.translate(x + cX, y + cY);
        ctx.rotate(rot);
        ctx.translate(-cX, -cY);
        ctx.scale(scaleX, scaleY);
        if (dx != null) {
            ctx.drawImage(image, dx, dy, SizeX, SizeY, 0, 0, SizeX, SizeY);
        }
        ctx.restore();
        ctx.globalAlpha = 1;
    };
    return Sprite;
}(thing_1.Thing));
exports.Sprite = Sprite;
//# sourceMappingURL=sprite.js.map