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
 * @class Atlas.Text
 * @extends Atlas.Util
 * */
var Text = /** @class */ (function (_super) {
    __extends(Text, _super);
    function Text(string, col, size, font) {
        var _this = _super.call(this) || this;
        _this._basicConstructor = 'Text';
        _this.x = 0;
        _this.y = 0;
        _this.scaleX = 1;
        _this.scaleY = 1;
        _this.alpha = 1;
        _this.spaceWidth = 7; /* append */
        if (font) {
            _this.font = "'" + font + "'";
        }
        else {
            _this.font = "'Meiryo'";
        }
        if (size) {
            _this.size = size + "px";
        }
        else {
            _this.size = '10px';
        }
        if (string) {
            _this.string = string;
        }
        else {
            _this.string = '';
        }
        if (col) {
            _this.color = col;
        }
        else {
            _this.color = 'white';
        }
        return _this;
    }
    Text.prototype.setSize = function (size) {
        this.size = size + "px";
    };
    Text.prototype.setFont = function (font) {
        this.font = "'" + font + "'";
    };
    Text.prototype.intersect = function (ex, ey) {
        var thisx = this._x || this.x;
        var thisy = this._y || this.y;
        var width = parseInt(this.size) * this.scaleX * this.string.length;
        var height = parseInt(this.size) * this.scaleY;
        var x = ex - (thisx + width / 2);
        var y = ey - (thisy + height / 2);
        var r = this._rot || this.rot;
        var s = Math.sin(-r);
        var c = Math.cos(-r);
        var xx = Math.abs(x * c - y * s);
        var yy = Math.abs(x * s + y * c);
        if (xx < width / 2.0 && yy < height / 2.0) {
            return true;
        }
        return false;
    };
    Text.prototype.scale = function (x, y) {
        this.scaleX *= x;
        this.scaleY *= y;
    };
    Text.prototype._scaleBy = function (obj) {
        if (obj.time == 0) {
            obj.diffWidth = obj.scaleX - this.scaleX;
            obj.diffHeight = obj.scaleY - this.scaleY;
        }
        this.scaleX = obj.scaleX - obj.diffWidth * (1 - obj.time / obj.frame);
        this.scaleY = obj.scaleY - obj.diffHeight * (1 - obj.time / obj.frame);
    };
    Text.prototype.draw = function () {
        var x = this._x || this.x;
        var y = this._y || this.y;
        var rot = this._rot || this.rot;
        var scaleX = this.scaleX;
        var scaleY = this.scaleY;
        var ctx = this.ctx;
        var strings = this.string.split('<br>');
        var length = strings.length;
        ctx.globalAlpha = this.alpha;
        ctx.globalCompositeOperation = this.drawMode;
        ctx.font = this.size + " " + this.font;
        var height = ctx.measureText('a').width * 1.5 + this.spaceWidth;
        ctx.fillStyle = this.color;
        ctx.save();
        var cX = parseInt(this.size) * this.scaleX * this.string.length / 2;
        var cY = parseInt(this.size) * this.scaleY / 2;
        ctx.translate(x + cX, y + cY);
        ctx.rotate(rot);
        ctx.translate(-cX, -cY);
        ctx.scale(scaleX, scaleY);
        for (var i = 0; i < length; i++) {
            ctx.fillText(strings[i], 0, height);
            height *= 2;
        }
        ctx.restore();
        ctx.globalAlpha = 1;
    };
    return Text;
}(util_1.Util));
exports.Text = Text;
//# sourceMappingURL=text.js.map