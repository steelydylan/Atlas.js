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
/**
 * @class Atlas.Group
 * @extends Atlas.Thing
 * */
var Group = /** @class */ (function (_super) {
    __extends(Group, _super);
    function Group() {
        var _this = _super.call(this) || this;
        _this.children = [];
        _this.x = 0;
        _this.y = 0;
        _this._basicConstructor = 'Group';
        return _this;
    }
    Group.prototype.addChild = function (sprite) {
        sprite.parent = this;
        this.children.push(sprite);
        if (this.parent) {
            sprite.ctx = this.parent.ctx;
            sprite.field = this.parent.field;
            this.parent.children.push(sprite);
        }
    };
    Group.prototype.addChildren = function () {
        for (var i = 0, n = arguments.length; i < n; i++) {
            this.addChild(arguments[i]);
        }
    };
    Group.prototype.getChild = function (obj) {
        var array = this.getChildren(obj);
        var ret = array[0];
        if (!ret) {
            return;
        }
        return ret;
    };
    Group.prototype.getChildren = function (obj) {
        var ret = [];
        var children = this.children;
        for (var i = 0, n = children.length; i < n; i++) {
            var flag = true;
            for (var key in obj) {
                if (key == '$not') {
                    for (var key2 in obj.$not) {
                        //@ts-ignore
                        if (obj.$not[key2] == children[i][key2]) {
                            flag = false;
                        }
                    }
                    //@ts-ignore
                }
                else if (obj[key] != children[i][key]) {
                    flag = false;
                }
            }
            if (flag == true) {
                ret.push(children[i]);
            }
        }
        return ret;
    };
    Group.prototype.removeChild = function (obj) {
        var child = this.getChild(obj);
        if (child) {
            child.remove();
        }
    };
    Group.prototype.removeChildren = function (obj) {
        var children = this.getChildren(obj);
        for (var i = 0, n = children.length; i < n; i++) {
            children[i].remove();
        }
    };
    Group.prototype.draw = function () {
    };
    return Group;
}(thing_1.Thing));
exports.Group = Group;
//# sourceMappingURL=group.js.map