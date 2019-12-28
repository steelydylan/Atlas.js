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
 * @class Atlas.Scene
 * @extends Atlas.Group
 * */
var Scene = /** @class */ (function (_super) {
    __extends(Scene, _super);
    function Scene() {
        var _this = _super.call(this) || this;
        _this._basicConstructor = 'Scene';
        _this._remove = false;
        return _this;
    }
    Scene.prototype.addChild = function (sprite) {
        sprite.parent = this;
        if (this.ctx && this.field) {
            sprite.ctx = this.ctx;
            sprite.field = this.field;
        }
        this.children.push(sprite);
        if (sprite._basicConstructor == 'Group' || sprite._basicConstructor == 'Layer') {
            var children = sprite.children;
            for (var i = 0, n = children.length; i < n; i++) {
                var child = children[i];
                if (!child.ctx) {
                    child.ctx = this.ctx;
                    child.field = this.field;
                    this.children.push(child);
                }
            }
        }
    };
    Scene.prototype.setImage = function (image) {
        this.image = image;
    };
    Scene.prototype.setColor = function (color) {
        this.color = color;
    };
    Scene.prototype._enterFrame = function () {
        if (this.enterFrame) {
            this.enterFrame();
        }
        var children = this.children;
        for (var i = 0, n = children.length; i < n; i++) {
            var target = children[i];
            if (target._remove) {
                children.splice(i, 1);
                i--;
                n--;
                continue;
            }
            if (target._basicConstructor == 'Sprite'
                || target._basicConstructor == 'Map'
                || target._basicConstructor == 'Shape') {
                if (target.isLoaded() && !target.prepared) {
                    target._onLoad();
                    if (target.onLoad) {
                        /* フックを登録していたら */
                        target.onLoad();
                    }
                }
            } /* ロードが終わったオブジェクトの描画準備を完了させる */
            if (target.useEvent) {
                target.useEvent();
            }
            if (target._enterFrame) {
                target._enterFrame();
            }
            if (target.enterFrame) {
                target.enterFrame();
            }
            if (target.tween) {
                target.tween();
            }
            if (target.visible) {
                target.draw();
            }
        }
    };
    return Scene;
}(group_1.Group));
exports.Scene = Scene;
//# sourceMappingURL=scene.js.map