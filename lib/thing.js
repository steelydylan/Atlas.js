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
var util_1 = require("./util");
/**
 * @class Atlas.Thing
 * @extends Atlas.Util
 * */
var Thing = /** @class */ (function (_super) {
    __extends(Thing, _super);
    function Thing(width, height) {
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        var _this = _super.call(this) || this;
        _this.x = 0;
        _this.y = 0;
        _this._remove = false;
        _this.width = width;
        _this.height = height;
        _this.collisionShape = 'box';
        _this.prepared = false; /* 描画の準備が完了 */
        _this.alpha = 1;
        return _this;
    }
    Thing.prototype._scaleBy = function (obj) {
        if (obj.time === 0) {
            obj.toWidth = this.width * obj.scaleX;
            obj.toHeight = this.height * obj.scaleY;
            obj.diffWidth = obj.toWidth - this.width;
            obj.diffHeight = obj.toHeight - this.height;
        }
        this.width = obj.toWidth - obj.diffWidth * (1 - obj.time / obj.frame);
        this.height = obj.toHeight - obj.diffHeight * (1 - obj.time / obj.frame);
    };
    /**
     * @method intersect
     * @param ex Number
     * @param ey Number
     * 座標(ex,ey)にオブジェクトが衝突しているかを判定する
     * */
    Thing.prototype.intersect = function (ex, ey) {
        var thisx = this._x || this.x;
        var thisy = this._y || this.y;
        var thisw = this._width || this.width;
        var thish = this._height || this.height;
        var r = this._rot || this.rot;
        if (this.collisionShape == 'box') {
            var x = ex - (thisx + thisw / 2);
            var y = ey - (thisy + thish / 2);
            var s = Math.sin(-r);
            var c = Math.cos(-r);
            var xx = Math.abs(x * c - y * s);
            var yy = Math.abs(x * s + y * c);
            if (xx < thisw / 2.0 && yy < thish / 2.0) {
                return true;
            }
            return false;
        }
        else if (this.collisionShape == 'circle') {
            var radius = thisw / 2;
            var x = ex - (thisx + radius);
            var y = ey - (thisy + radius);
            if (Math.sqrt(x * x + y * y) < radius) {
                return true;
            }
            return false;
        }
        return false;
    };
    /**
     * @method hitTest
     * @param target Thingオブジェクト
     * 自分がターゲットと接触しているかを判定する
     * */
    Thing.prototype.hitTest = function (target) {
        var thisx = this._x || this.x;
        var thisy = this._y || this.y;
        var thisW = this._width || this.width;
        var thisH = this._height || this.height;
        var thiscX = thisx + thisW / 2;
        var thiscY = thisy + thisH / 2;
        var targetx = target._x || target.x;
        var targety = target._y || target.y;
        var targetW = target._width || target.width;
        var targetH = target._height || target.height;
        var targetr = target._rot || target.rot;
        if (this.collisionShape == 'box') {
            if (target.collisionShape == 'circle') {
                return target.within(this, targetW / 2);
            } /* 矩形と円の当たり判定ならwithinで実装済み */
        }
        else if (this.collisionShape == 'circle') {
            return this.within(target, thisW / 2); /* 矩形と円の当たり判定ならwithinで実装済み */
        }
        else {
            return false;
        }
        if (targetr !== 0 && targetr != Math.PI) {
            if (target.collisionShape == 'box') {
                var centerX = targetx + targetW / 2;
                var centerY = targety + targetH / 2;
                var rot = -targetr;
                thiscX = Math.cos(rot) * (thiscX - centerX) -
                    Math.sin(rot) * (thiscY - centerY) + centerX;
                thiscY = Math.sin(rot) * (thiscX - centerX) +
                    Math.cos(rot) * (thiscY - centerY) + centerY;
                thisx = thiscX - thisW / 2;
                thisy = thiscY - thisH / 2;
            }
        }
        return (thisx < targetx + targetW) && (targetx < thisx + thisW) && (thisy < targety + targetH) && (targety < thisy + thisH);
    };
    /**
     * @method within
     * @param target Thingクラス
     * @param range Number
     * 自分がターゲットから半径range以内にいるかどうかを判定する
     * */
    Thing.prototype.within = function (target, range) {
        var thisx = this._x || this.x;
        var thisy = this._y || this.y;
        var thisw = this._width || this.width;
        var thish = this._height || this.height;
        var thisr = this._rot || this.rot;
        var targetx = target._x || target.x;
        var targety = target._y || target.y;
        var targetw = target._width || target.width;
        var targeth = target._height || target.height;
        var targetr = target._rot || target.rot;
        var a;
        var b;
        var x;
        var y;
        if (this.collisionShape == 'box') {
            var thiscX = thisx + thisw / 2;
            var thiscY = thisy + thish / 2;
        }
        else if (this.collisionShape == 'circle') {
            var radius = thisw / 2;
            var thiscX = thisx + radius;
            var thiscY = thisy + radius;
        }
        else {
            return false;
        }
        if (target.collisionShape == 'box') {
            var centerX = targetx + targetw / 2;
            var centerY = targety + targeth / 2;
            var rot = -targetr;
            var cx = Math.cos(rot) * (thiscX - centerX) -
                Math.sin(rot) * (thiscY - centerY) + centerX;
            var cy = Math.sin(rot) * (thiscX - centerX) +
                Math.cos(rot) * (thiscY - centerY) + centerY;
            if (cx < targetx) {
                x = targetx;
            }
            else if (cx > targetx + targetw) {
                x = targetx + targetw;
            }
            else {
                x = cx;
            }
            if (cy < targety) {
                y = targety;
            }
            else if (cy > targety + targeth) {
                y = targety + targeth;
            }
            else {
                y = cy;
            }
            a = Math.abs(cx - x);
            b = Math.abs(cy - y);
        }
        else if (target.collisionShape == 'circle') {
            var tradius = targetw / 2;
            x = targetx + tradius;
            y = targety + tradius;
            a = Math.abs(thiscX - x);
            b = Math.abs(thiscY - y);
            range += tradius;
        }
        else {
            return false;
        }
        if (Math.sqrt((a * a) + (b * b)) < range) {
            return true;
        }
        return false;
    };
    /**
     * @method scale
     * @param sx Number
     * @param sy Number
     * オブジェクトを(sx,sy)倍する
     * */
    Thing.prototype.scale = function (sx, sy) {
        if (!this.width) {
            this._scaleX = sx;
            this._scaleY = sy;
        }
        else {
            this.width *= sx;
            this.height *= sy;
        }
        return this;
    };
    /**
     * @method setSize
     * @param w Number
     * @param h Number
     * オブジェクトを幅w、高さhに設定する
     * */
    Thing.prototype.setSize = function (w, h) {
        this.width = w;
        this.height = h;
    };
    return Thing;
}(util_1.Util));
exports.Thing = Thing;
//# sourceMappingURL=thing.js.map