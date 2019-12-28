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
 * @class Atlas.Shape
 * @extends Atlas.Thing
 * SVGを描画するためのクラス
 * */
var Shape = /** @class */ (function (_super) {
    __extends(Shape, _super);
    function Shape(path, color, lineColor) {
        var _this = _super.call(this, 0, 0) || this;
        _this.obj = -1;
        _this.svgid = '';
        _this._basicConstructor = 'Shape';
        _this.color = color || 'original';
        _this.strokeColor = lineColor || 'original';
        _this.colorStops = [];
        if (_this.getExtention(path) != 'svg') {
            _this.svgid = path;
        }
        else {
            _this.setImage(path);
        }
        _this.closeMode = true;
        _this.strokeMode = true;
        return _this;
    }
    /**
     * @method setSpriteSize
     * @param width Number
     * @param height Number
     * スプライトの大きさを設定する
     * */
    Shape.prototype.setSpriteSize = function (width, height) {
        this.spriteWidth = width;
        this.spriteHeight = height;
    };
    /**
     * @method setImage
     * @param path String
     * ゲームにロードされたSVG画像をロードする
     * */
    Shape.prototype.setImage = function (path) {
        var svgs = functions_1.getSvgAssets();
        for (var i = 0, n = svgs.length; i < n; i++) {
            if (path == svgs[i].name) {
                this.obj = i;
            }
        }
    };
    /**
     * @method getImage
     * セットされているSVG画像を取得する
     * */
    Shape.prototype.getImage = function () {
        var svgs = functions_1.getSvgAssets();
        return svgs[this.obj];
    };
    /**
     * @method getImageName
     * セットされている画像名を取得する
     * */
    Shape.prototype.getImageName = function () {
        var svgs = functions_1.getSvgAssets();
        return svgs[this.obj].data;
    };
    /**
     * @method parsePolygon
     * @param polygon String
     * SVGのポリゴン要素を解析
     * */
    Shape.prototype.parsePolygon = function (polygon) {
        var pols = polygon.split(' ');
        var data = [];
        for (var i = 0, n = pols.length - 1; i < n; i++) {
            var pt = pols[i].split(',');
            var x = Number(pt[0]);
            var y = Number(pt[1]);
            var obj = { method: 'lineTo', x: x, y: y };
            data.push(obj);
        }
        return data;
    };
    /**
     * @method parsePath
     * @param path String
     * SVGのpath要素を解析
     * */
    Shape.prototype.parsePath = function (path) {
        var length = { a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0 };
        var segment = /([astvzqmhlc])([^astvzqmhlc]*)/ig;
        var data = [];
        //@ts-ignore
        path.replace(segment, function (_, command, args) {
            var type = command.toLowerCase();
            args = args.match(/-?[.0-9]+(?:e[-+]?\d+)?/ig);
            args = args ? args.map(Number) : [];
            if (type == 'm' && args.length > 2) {
                //@t
                data.push([command].concat(args.splice(0, 2)));
                type = 'l';
                command = command == 'm' ? 'l' : 'L';
            }
            while (true) {
                //@ts-ignore
                if (args.length == length[type]) {
                    args.unshift(command);
                    var obj = {};
                    if (args[0] == 'q') {
                        obj = { method: 'quadraticCurveBy', cpx: args[1], cpy: args[2], x: args[3], y: args[4] };
                    }
                    else if (args[0] == 'Q') {
                        obj = { method: 'quadraticCurveTo', cpx: args[1], cpy: args[2], x: args[3], y: args[4] };
                    }
                    else if (args[0] == 'l') {
                        obj = { method: 'lineBy', x: args[1], y: args[2] };
                    }
                    else if (args[0] == 'L') {
                        obj = { method: 'lineTo', x: args[1], y: args[2] };
                    }
                    else if (args[0] == 'm') {
                        obj = { method: 'moveBy', x: args[1], y: args[2] };
                    }
                    else if (args[0] == 'M') {
                        obj = { method: 'moveTo', x: args[1], y: args[2] };
                    }
                    else if (args[0] == 'c') {
                        obj = { method: 'bezierCurveBy', cpx1: args[1], cpy1: args[2], cpx2: args[3], cpy2: args[4], x: args[5], y: args[6] };
                    }
                    else if (args[0] == 'C') {
                        obj = { method: 'bezierCurveTo', cpx1: args[1], cpy1: args[2], cpx2: args[3], cpy2: args[4], x: args[5], y: args[6] };
                    }
                    else if (args[0] == 'h') {
                        obj = { method: 'horizontalBy', x: args[1] };
                    }
                    else if (args[0] == 'H') {
                        obj = { method: 'horizontalTo', x: args[1] };
                    }
                    else if (args[0] == 'v') {
                        obj = { method: 'verticalBy', y: args[1] };
                    }
                    else if (args[0] == 'V') {
                        obj = { method: 'verticalTo', y: args[1] };
                    }
                    else if (args[0] == 's') {
                        obj = { method: 'bezierCurveShortBy', cpx2: args[1], cpy2: args[2], x: args[3], y: args[4] };
                    }
                    else if (args[0] == 'S') {
                        obj = { method: 'bezierCurveShortTo', cpx2: args[1], cpy2: args[2], x: args[3], y: args[4] };
                    }
                    else if (args[0] == 't') {
                        obj = { method: 'quadraticCurveShortBy', x: args[1], y: args[2] };
                    }
                    else if (args[0] == 'T') {
                        obj = { method: 'quadraticCurveShortTo', x: args[1], y: args[2] };
                    }
                    else {
                        obj = {};
                    }
                    return data.push(obj);
                }
                //@ts-ignore
                data.push([command].concat(args.splice(0, length[type])));
            }
        });
        return data;
    };
    /**
     * @method isLoaded
     * @return Boolean
     * 画像がロードされているかを返す
     * */
    Shape.prototype.isLoaded = function () {
        var image = this.getImage();
        if (!image) {
            return true;
        }
        if (image.dataset.loaded && this.ctx) {
            return true;
        }
        return false;
    };
    /**
     * @method setLinearGradient
     * オブジェクトに対して線形グラデーションを設定する
     * */
    Shape.prototype.setLinearGradient = function (x1, y1, x2, y2) {
        //@ts-ignore
        this.gradientStyle = { x1: x1, y1: y1, x2: x2, y2: y2 };
        this.gradientType = 1;
    };
    /**
     * @method setRadialGradient
     * オブジェクトに対して円形グラデーションを設定する
     * */
    Shape.prototype.setRadialGradient = function (x1, y1, r1, x2, y2, r2) {
        if (!x2) {
            x2 = x1;
            y2 = y1;
            r2 = r2;
        }
        //@ts-ignore
        this.gradientStyle = { x1: x1, y1: y1, r1: r1, x2: x2, y2: y2, r2: r2 };
        this.gradientType = 2;
    };
    Shape.prototype._addColorStops = function (stops) {
        var grad = this.color;
        for (var i = 0, n = stops.length; i < n; i++) {
            var stop_1 = stops[i];
            var color = stop_1.color;
            if (typeof grad !== 'string') {
                grad.addColorStop(parseInt(stop_1.offset), color);
            }
        }
        this.color = grad;
    };
    Shape.prototype.setColorStops = function (stops) {
        this.colorStops = stops;
        var style = this.gradientStyle;
        if (this.gradientType == 1) {
            this.color = this.ctx.createLinearGradient(style.x1, style.y1, style.x2, style.y2);
        }
        else if (this.gradientType == 2) {
            this.color = this.ctx.createRadialGradient(style.x1, style.y1, style.r1, style.x2, style.y2, style.r2);
        }
        this._addColorStops(stops);
    };
    Shape.prototype.addColorStops = function (stops) {
        for (var i = 0, n = stops.length; i < n; i++) {
            this.colorStops.push(stops[i]);
        }
        this._addColorStops(stops);
    };
    Shape.prototype.removeColorStopAt = function (num) {
        this.colorStops.splice(num, 1);
        this.setColorStops(this.colorStops);
    };
    /**
     * @method getGradientType
     * 設定されているグラデーションの種類を取得する
     * */
    Shape.prototype.getGradientType = function () {
        var type = this.gradientType;
        if (type == 1) {
            return 'linear';
        }
        else if (type == 2) {
            return 'radial';
        }
        return 'single';
    };
    Shape.prototype._onLoad = function () {
        var svg;
        var svgdoc;
        var svgs = functions_1.getSvgAssets();
        if (this.obj != -1) {
            svgdoc = svgs[this.obj].getSVGDocument();
            var element = svgdoc.getElementsByTagName('path')[0] || svgdoc.getElementsByTagName('circle')[0] || svgdoc.getElementsByTagName('rect')[0] || svgdoc.getElementsByTagName('polygon')[0];
            // @ts-ignore TODO
            svg = svgdoc.getElementsByTagName('svg')[0];
        }
        else {
            svg = document.getElementById(this.svgid);
            svgdoc = svg;
            var element = svgdoc.getElementsByTagName('path')[0] || svgdoc.getElementsByTagName('circle')[0] || svgdoc.getElementsByTagName('rect')[0] || svgdoc.getElementsByTagName('polygon')[0];
        }
        var color = svg.getElementsByTagName('linearGradient')[0] || svgdoc.getElementsByTagName('radialGradient')[0];
        if (color) {
            var stopsEle = color.getElementsByTagName('stop');
            var stops = [];
            for (var i = 0, n = stopsEle.length; i < n; i++) {
                var ele = stopsEle[i];
                var obj = {};
                obj.offset = ele.getAttribute('offset');
                var styleCol = ele.style.stopColor;
                var op = ele.style.stopOpacity;
                if (op) {
                    styleCol = styleCol.replace('rgb', 'rgba');
                    styleCol = styleCol.replace(')', "," + op + ")");
                }
                obj.color = styleCol;
                stops.push(obj);
            }
            if (color.tagName == 'linearGradient') {
                var x1 = Number(color.getAttribute('x1'));
                var x2 = Number(color.getAttribute('x2'));
                var y1 = Number(color.getAttribute('y1'));
                var y2 = Number(color.getAttribute('y2'));
                this.setLinearGradient(x1, y1, x2, y2);
            }
            else if (color.tagName == 'radialGradient') {
                var cx = Number(color.getAttribute('cx'));
                var cy = Number(color.getAttribute('cy'));
                var r = Number(color.getAttribute('r'));
                this.setRadialGradient(cx, cy, 0, cx, cy, r);
            }
            this.setColorStops(stops);
        }
        if (this.color == 'original') {
            this.color = element.getAttribute('fill');
        }
        if (this.strokeColor == 'original') {
            this.strokeColor == element.getAttribute('stroke');
        }
        if (element.tagName == 'path') {
            var path = element.getAttribute('d');
            this.path = this.parsePath(path);
        }
        else if (element.tagName == 'circle') {
            var radius = element.getAttribute('r');
            var array = [];
            array.push({ method: 'circle', r: parseInt(radius) });
            this.path = array;
        }
        else if (element.tagName == 'polygon') {
            var points = element.getAttribute('points');
            //@ts-ignore
            this.path = this.parsePolygon(points);
        }
        else if (element.tagName == 'rect') {
            var width = element.getAttribute('width');
            var height = element.getAttribute('height');
            var array = [];
            array.push({ method: 'rect', width: width, height: height });
            //@ts-ignore
            this.path = array;
        }
        if (this.spriteWidth == void 0) {
            this.spriteWidth = parseInt(svg.getAttribute('width'));
            this.spriteHeight = parseInt(svg.getAttribute('height'));
            if (!this.spriteWidth) {
                var viewBox = svg.getAttribute('viewBox');
                if (viewBox) {
                    var data = viewBox.split(' ');
                    this.spriteWidth = parseInt(data[2]);
                    this.spriteHeight = parseInt(data[3]);
                }
            }
        }
        if (!this.width) {
            this.width = this.spriteWidth;
        }
        if (!this.height) {
            this.height = this.spriteHeight;
        }
        this.prepared = true;
    };
    /**
     * @method draw
     * オブジェクトを描画する
     * */
    Shape.prototype.draw = function () {
        if (!this.path) {
            this._onLoad();
        }
        var path = this.path;
        var ctx = this.ctx;
        var x = 0;
        var y = 0;
        var tmpx = 0;
        var tmpy = 0;
        var rcpx = 0;
        var rcpy = 0;
        var width = this.width;
        var height = this.height;
        var scaleX = width / this.spriteWidth;
        var scaleY = height / this.spriteHeight;
        var cX = width / 2;
        var cY = height / 2;
        var transX = this._x || this.x;
        var transY = this._y || this.y;
        var rot = this._rot || this.rot;
        ctx.globalAlpha = this.alpha;
        ctx.globalCompositeOperation = this.drawMode;
        ctx.save();
        ctx.translate(transX + cX, transY + cY);
        ctx.rotate(rot);
        ctx.translate(-cX, -cY);
        ctx.scale(scaleX, scaleY);
        ctx.beginPath();
        for (var i = 0, n = path.length; i < n; i++) {
            var p = this.path[i];
            var method = p.method;
            if (method == 'moveTo' || method == 'horizontalTo' || method == 'verticalTo' || method == 'quadraticCurveTo' || method == 'bezierCurveTo' || method == 'lineTo' || method == 'bezierCurveShortTo' || method == 'quadraticCurveShortTo') { /* 絶対 */
                tmpx = 0;
                tmpy = 0;
                if (p.x || p.x == 0) {
                    x = p.x;
                }
                if (p.y || p.y == 0) {
                    y = p.y;
                }
            }
            else { /* 相対 */
                tmpx = x;
                tmpy = y;
                if (p.x) {
                    x += p.x;
                }
                if (p.y) {
                    y += p.y;
                }
            }
            if (method == 'circle') {
                var r = p.r;
                ctx.arc(x + r, y + r, r, 0, Math.PI * 2, false);
            }
            else if (method == 'rect') {
                ctx.fillRect(x, y, p.width, p.height);
            }
            else if (method == 'moveTo' || method == 'moveBy') {
                ctx.moveTo(x, y);
            }
            else if (method == 'lineTo' || method == 'lineBy') {
                ctx.lineTo(x, y);
            }
            else if (method == 'quadraticCurveBy' || method == 'quadraticCurveTo') {
                ctx.quadraticCurveTo(tmpx + p.cpx, tmpy + p.cpy, x, y);
                rcpx = 2 * x - (tmpx + p.cpx);
                rcpy = 2 * y - (tmpy + p.cpy);
            }
            else if (method == 'bezierCurveTo' || method == 'bezierCurveBy') {
                ctx.bezierCurveTo(tmpx + p.cpx1, tmpy + p.cpy1, tmpx + p.cpx2, tmpy + p.cpy2, x, y);
                rcpx = 2 * x - (tmpx + p.cpx2);
                rcpy = 2 * y - (tmpy + p.cpy2);
            }
            else if (method == 'horizontalTo' || method == 'horizontalBy') {
                ctx.lineTo(x, y);
            }
            else if (method == 'verticalTo' || method == 'verticalBy') {
                ctx.lineTo(x, y);
            }
            else if (method == 'bezierCurveShortBy' || method == 'bezierCurveShortTo') {
                ctx.bezierCurveTo(rcpx, rcpy, tmpx + p.cpx2, tmpy + p.cpy2, x, y);
                rcpx = 2 * x - (tmpx + p.cpx2);
                rcpy = 2 * y - (tmpy + p.cpy2);
            }
            else if (method == 'quadraticCurveShortBy' || method == 'quadraticCurveShortTo') {
                ctx.quadraticCurveTo(rcpx, rcpy, x, y);
                rcpx = 2 * x - rcpx;
                rcpy = 2 * y - rcpy;
            }
        }
        if (this.closeMode) {
            ctx.closePath();
        }
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = this.strokeColor;
        if (this.strokeMode) {
            ctx.stroke();
        }
        ctx.restore();
    };
    /**
     * @method getNodeByName
     * SVGに設定されたNode（点）オブジェクトを返す
     * */
    Shape.prototype.getNodeByName = function (name) {
        var path = this.path;
        for (var i = 0, n = path.length; i < n; i++) {
            var p = path[i];
            if (name == p.name) {
                return p;
            }
        }
        return -1;
    };
    return Shape;
}(thing_1.Thing));
exports.Shape = Shape;
/**
 * @class Atlas.Shape.Box
 * @extends Atlas.Thing
 * 四角形を描画するためのクラス
 * */
var Box = /** @class */ (function (_super) {
    __extends(Box, _super);
    function Box(col, width, height) {
        var _this = _super.call(this, width, height) || this;
        _this._basicConstructor = 'Shape.Box';
        _this.color = col;
        return _this;
    }
    Box.prototype.draw = function () {
        var ctx = this.ctx;
        ctx.globalAlpha = this.alpha;
        ctx.globalCompositeOperation = this.drawMode;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        var x = this._x || this.x;
        var y = this._y || this.y;
        var rot = this._rot || this.rot;
        var width = this._width || this.width;
        var height = this._height || this.height;
        var moveX = x + this.width / 2;
        var moveY = y + this.height / 2;
        ctx.save();
        ctx.translate(moveX, moveY);
        ctx.rotate(rot);
        ctx.translate(-moveX, -moveY);
        var x = this._x || this.x;
        var y = this._y || this.y;
        ctx.fillRect(x, y, width, height);
        ctx.restore();
        ctx.globalAlpha = 1;
    };
    return Box;
}(thing_1.Thing));
exports.Box = Box;
/**
 * @class Atlas.Shape.Circle
 * @extends Atlas.Thing
 * 円を描画するためのクラス
 * */
var Circle = /** @class */ (function (_super) {
    __extends(Circle, _super);
    function Circle(col, radius) {
        var _this = _super.call(this, radius * 2, radius * 2) || this;
        _this._basicConstructor = 'Shape.Circle';
        _this.color = col;
        _this.collisionShape = 'circle';
        return _this;
    }
    Circle.prototype.draw = function () {
        var ctx = this.ctx;
        ctx.globalAlpha = this.alpha;
        ctx.globalCompositeOperation = this.drawMode;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        var width = this._width || this.width;
        var plus = width / 2;
        var x = this._x || this.x;
        var y = this._y || this.y;
        ctx.arc(x + plus, y + plus, plus, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.globalAlpha = 1;
    };
    return Circle;
}(thing_1.Thing));
exports.Circle = Circle;
//# sourceMappingURL=shape.js.map