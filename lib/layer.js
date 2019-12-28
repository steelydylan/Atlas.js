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
var group_1 = require("./group");
/**
 * @class Atlas.Layer
 * @extends Atlas.Group
 * */
var Layer = /** @class */ (function (_super) {
    __extends(Layer, _super);
    function Layer() {
        var _this = _super.call(this) || this;
        _this.rot = 0;
        _this._basicConstructor = 'Layer';
        _this.firstWidth = 100;
        _this.firstHeight = 100;
        _this.height = 100;
        _this.width = 100;
        _this.scaleX = 1;
        _this.scaleY = 1;
        return _this;
    }
    /**
     * @method fitToChildren
     * 登録されたオブジェクトが占める矩形幅にレイヤーのサイズを合わせる
     * */
    Layer.prototype.fitToChildren = function () {
        var children = this.children;
        var postx = this.x;
        var posty = this.y;
        this.x = Infinity;
        this.y = Infinity;
        this.width = 0;
        this.height = 0;
        for (var i = 0, n = children.length; i < n; i++) {
            var child = children[i];
            var x = child._x || child.x;
            var y = child._y || child.y;
            var width = child._width || child.width;
            var height = child._height || child.height;
            var centerX = x + (width / 2);
            var centerY = y + (height / 2);
            var rot = child._rot || child.rot;
            var x1 = Infinity;
            var x2 = Infinity;
            var y1 = Infinity;
            var y2 = Infinity;
            rot %= (2 * Math.PI);
            if (rot < 0) {
                rot += (2 * Math.PI);
            }
            if (rot >= 0 && rot <= Math.PI / 2) {
                x1 = Math.cos(rot) * (x - centerX) - Math.sin(rot) * (y + height - centerY) + centerX;
                x2 = Math.cos(rot) * (x + width - centerX) - Math.sin(rot) * (y - centerY) + centerX;
                y1 = Math.sin(rot) * (x - centerX) + Math.cos(rot) * (y - centerY) + centerY;
                y2 = Math.sin(rot) * (x + width - centerX) + Math.cos(rot) * (y + height - centerY) + centerY;
            }
            else if (Math.PI / 2 < rot && rot <= Math.PI) {
                x1 = Math.cos(rot) * (x + width - centerX) - Math.sin(rot) * (y + height - centerY) + centerX;
                x2 = Math.cos(rot) * (x - centerX) - Math.sin(rot) * (y - centerY) + centerX;
                y1 = Math.sin(rot) * (x - centerX) + Math.cos(rot) * (y + height - centerY) + centerY;
                y2 = Math.sin(rot) * (x + width - centerX) + Math.cos(rot) * (y - centerY) + centerY;
            }
            else if (Math.PI < rot && rot <= 3 / 2 * Math.PI) {
                x1 = Math.cos(rot) * (x + width - centerX) - Math.sin(rot) * (y - centerY) + centerX;
                x2 = Math.cos(rot) * (x - centerX) - Math.sin(rot) * (y + height - centerY) + centerX;
                y1 = Math.sin(rot) * (x + width - centerX) + Math.cos(rot) * (y + height - centerY) + centerY;
                y2 = Math.sin(rot) * (x - centerX) + Math.cos(rot) * (y - centerY) + centerY;
            }
            else if (3 / 2 * Math.PI < rot && rot <= 2 * Math.PI) {
                x1 = Math.cos(rot) * (x - centerX) - Math.sin(rot) * (y - centerY) + centerX;
                x2 = Math.cos(rot) * (x + width - centerX) - Math.sin(rot) * (y + height - centerY) + centerX;
                y1 = Math.sin(rot) * (x + width - centerX) + Math.cos(rot) * (y - centerY) + centerY;
                y2 = Math.sin(rot) * (x - centerX) + Math.cos(rot) * (y + height - centerY) + centerY;
            }
            if (!this.x || this.x > x1) {
                this.x = x1;
            }
            if (!this.y || this.y > y1) {
                this.y = y1;
            }
            if (this.width < x2) {
                this.width = x2;
            }
            if (this.height < y2) {
                this.height = y2;
            }
        }
        this.width -= this.x;
        this.height -= this.y;
        this.firstWidth = this.width;
        this.firstHeight = this.height;
        for (var i = 0, n = children.length; i < n; i++) {
            var child = children[i];
            if (!child._x) {
                child._x = child.x;
                child._y = child.y;
                child.x -= this.x;
                child.y -= this.y;
            }
            else {
                child.x += postx - this.x;
                child.y += posty - this.y;
            }
        }
        return this;
    };
    /**
     * @method releaseChild
     * @param child Atlas.Thingクラス
     * 登録されているオブジェクトを解放する
     * */
    Layer.prototype.releaseChild = function (child) {
        var parent = this.parent;
        child.x = child._x;
        child.y = child._y;
        child.width = child._width;
        child.height = child._height;
        child.rot = child._rot;
        child._x = Infinity;
        child._y = Infinity;
        child._width = Infinity;
        child._height = Infinity;
        child._rot = Infinity;
        child.grouped = false;
        child._leave = false;
        child.parent = parent;
    };
    /**
     * @method releaseAllChildren
     * 登録されているすべてのオブジェクトを解放する
     * */
    Layer.prototype.releaseAllChildren = function () {
        var children = this.children;
        for (var i = 0, n = children.length; i < n; i++) {
            var child = children[i];
            this.releaseChild(child);
        }
        this.children = [];
        this._remove = true;
        return this;
    };
    /**
     * @method removeChildrenByProperty
     * @param obj Object
     * プロパティの値が一致するオブジェクトを削除する
     * */
    Layer.prototype.removeChildrenByProperty = function (obj) {
        var children = this.getChildren(obj);
        for (var i = 0, n = children.length; i < n; i++) {
            children[i].remove();
        }
        return this;
    };
    /**
     * @method removeAllChildren
     * 登録されたすべてのオブジェクトを削除する
     * */
    Layer.prototype.removeAllChildren = function () {
        var children = this.children;
        var parent = this.parent;
        for (var i = 0, n = children.length; i < n; i++) {
            children[i].remove();
        }
        return this;
    };
    Layer.prototype._setAbsPos = function (child) {
        var centerX = (this.width / 2);
        var centerY = (this.height / 2);
        var rot = this.rot;
        child.Cx = (this.scaleX * child.x + child._width / 2);
        child.Cy = (this.scaleY * child.y + child._height / 2);
        child.startRot = true;
        var cx = Math.cos(rot) * (child.Cx - centerX) - Math.sin(rot) * (child.Cy - centerY) + centerX; // this.width/2
        var cy = Math.sin(rot) * (child.Cx - centerX) + Math.cos(rot) * (child.Cy - centerY) + centerY; // this.height/2
        child._x = cx - (child._width / 2);
        child._y = cy - (child._height / 2);
        child._x += this.x;
        child._y += this.y;
    };
    Layer.prototype.draw = function () {
        var children = this.children;
        this.scaleX = this.width / this.firstWidth;
        this.scaleY = this.height / this.firstHeight;
        for (var i = 0, n = children.length; i < n; i++) {
            var target = children[i];
            if (target._leave || target._remove) {
                children.splice(i, 1);
                this.releaseChild(target);
                i--;
                n--;
                continue;
            }
            target._rot = target.rot + this.rot;
            target._width = this.scaleX * target.width;
            target._height = this.scaleY * target.height;
            this._setAbsPos(target);
        }
    };
    return Layer;
}(group_1.Group));
exports.Layer = Layer;
//# sourceMappingURL=layer.js.map