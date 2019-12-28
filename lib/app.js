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
var scene_1 = require("./scene");
var functions_1 = require("./functions");
/**
 * @class Atlas.App
 * @extends Atlas.Util
 * */
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App(place) {
        var _this = _super.call(this) || this;
        _this.assetPath = '';
        _this._basicConstructor = 'App';
        var css = document.createElement('style');
        css.media = 'screen';
        css.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(css);
        var field;
        if (place) {
            field = document.getElementById(place);
        }
        else {
            field = document.createElement('canvas');
            var Body = document.getElementsByTagName('body').item(0);
            if (Body) {
                Body.appendChild(field);
            }
        }
        field.width = 320;
        field.height = 480;
        field.style.top = 0 + "px";
        field.style.left = 0 + "px";
        // @ts-ignore
        field.tabIndex = '1';
        document.body.style.margin = '0em';
        if (functions_1.isMobile) {
            field.style.width = window.innerWidth + "px"; // mobile default
            field.style.height = window.innerHeight + "px"; // mobile default
            field.addEventListener('touchstart', function () { if (this.tabIndex != -1)
                this.focus(); });
        }
        else {
            field.style.width = 480 + "px";
            field.style.height = 620 + "px";
            field.addEventListener('mousedown', function () { if (this.tabIndex != -1)
                this.focus(); });
            field.addEventListener('keyup', function () {
                var keydown = functions_1.getKeydown();
                functions_1.clearKeyState(keydown);
            }, false);
            field.addEventListener('keydown', function (e) {
                var keydown = functions_1.getKeydown();
                functions_1.setKeyState(keydown, e);
            });
        }
        _this._css = css;
        _this.field = field;
        //@ts-ignore
        _this.ctx = field.getContext('2d');
        _this.fps = 30; // fps default
        _this.scene = new scene_1.Scene();
        _this.scene.ctx = _this.ctx;
        _this.scene.field = _this.field;
        _this.scene.parent = _this;
        return _this;
    }
    /**
     * @method clearLockMode
     * ゲーム画面のタブインデントを解除する
     * */
    App.prototype.clearLockMode = function () {
        this.field.tabIndex = -1;
    };
    /**
     * @method setLockMode
     * ゲーム画面のタブインデントを有効にする
     * */
    App.prototype.setLockMode = function () {
        this.field.tabIndex = 1;
    };
    /**
     * @method getCanvasURL
     * ゲーム画面のデータURLを取得
     * */
    App.prototype.getCanvasURL = function () {
        return this.field.toDataURL();
    };
    /**
     * @method getCanvasImage
     * キャンバス画面の画像を新しいタブで開く
     * */
    App.prototype.getCanvasImage = function () {
        var url = this.field.toDataURL();
        window.open(url, '_blank');
    };
    /**
     * @method getChild
     * ゲームに登録されたプロパティの一致するオブジェクトを取得する
     * */
    App.prototype.getChild = function (obj) {
        return this.scene.getChild(obj);
    };
    /**
     * @method getChildren
     * ゲームに登録されたプロパティの一致するオブジェクトをすべて取得する
     * */
    App.prototype.getChildren = function (obj) {
        return this.scene.getChildren(obj);
    };
    /**
     * @method colorToAlpha
     * ゲームに登録された画像の指定された色を透明にする
     * */
    App.prototype.colorToAlpha = function (imagename, hex) {
        var img = new Image();
        var images = functions_1.getImageAssets();
        for (var i = 0, n = images.length; i < n; i++) {
            if (images[i].name == imagename) {
                img = images[i];
                img.dataset.hex = hex;
                img.dataset.index = "" + i;
            }
        }
        img.addEventListener('load', function () {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            var width = img.width;
            var height = img.height;
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            if (!img.dataset.hex) {
                return;
            }
            var hex = img.dataset.hex.replace(shorthandRegex, function (m, r, g, b) { return r + r + g + g + b + b; });
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            var color = result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
            ctx.drawImage(img, 0, 0);
            var ImageData = ctx.getImageData(0, 0, width, height);
            var data = ImageData.data;
            for (var i = 0; i < height; i++) {
                for (var j = 0; j < width; j++) {
                    var t = i * (width * 4) + (j * 4);
                    if (color && data[t] == color.r && data[t + 1] == color.g && data[t + 2] == color.b) {
                        data[t + 3] = 0;
                    }
                }
            }
            ctx.putImageData(ImageData, 0, 0); // put image data back
            var newimg = new Image();
            newimg.src = canvas.toDataURL();
            images[parseInt(img.dataset.index)] = newimg;
        });
    };
    /**
     * @method addChild
     * @param child
     * ゲームにオブジェクトを登録する
     * */
    App.prototype.addChild = function (child) {
        child.ctx = this.ctx;
        child.field = this.field;
        this.scene.addChild(child);
    };
    /**
     * @method addChildren
     * ゲームにオブジェクトを複数登録する
     * */
    App.prototype.addChildren = function () {
        for (var i = 0, n = arguments.length; i < n; i++) {
            this.addChild(arguments[i]);
        }
    };
    /**
     * @method centerize
     * ゲーム画面を画面の中央に配置する
     * */
    App.prototype.centerize = function () {
        var style = this.field.style;
        style.marginTop = -parseInt(style.height) / 2 + "px";
        style.marginLeft = -parseInt(style.width) / 2 + "px";
        style.top = '50%';
        style.left = '50%';
        style.position = 'absolute';
    };
    /**
     * @method fitWindow
     * ゲーム画面をウィンドウにフィットさせる
     * */
    App.prototype.fitWindow = function () {
        this.setSize(window.innerWidth, window.innerHeight);
        var that = this;
        window.onresize = function () {
            that.setSize(window.innerWidth, window.innerHeight);
        };
    };
    /**
     * @method setQuality
     * @param width Number
     * @param height Number
     * ゲーム画面の解像度を設定する
     * */
    App.prototype.setQuality = function (width, height) {
        var field = this.field;
        field.width = width;
        field.height = height;
    };
    /**
     * @method setSize
     * @param width Number
     * @param height Number
     * ゲーム画面の大きさを設定する
     * */
    App.prototype.setSize = function (width, height) {
        var style = this.field.style;
        style.width = width + "px";
        style.height = height + "px";
    };
    /**
    * @method getSize
    * ゲーム画面の大きさを取得する
    * */
    App.prototype.getSize = function () {
        var size = {};
        size.width = parseInt(this.field.style.width);
        size.height = parseInt(this.field.style.height);
        return size;
    };
    /**
     * @method getQuality
     * ゲーム画面の解像度を取得する
     * */
    App.prototype.getQuality = function () {
        var size = {};
        size.width = this.field.width;
        size.height = this.field.height;
        return size;
    };
    /**
     * @method loadingScene
     * @param scene Sceneオブジェクト
     * ローディング中のシーンを登録する
     * */
    App.prototype.loadingScene = function (scene) {
        this.preScene = scene;
        this.preScene.parent = this;
    };
    App.prototype._preLoadEnterFrame = function () {
        var field = this.field;
        this.useEvent();
        var ctx = this.ctx;
        ctx.clearRect(0, 0, field.width, field.height);
        if (functions_1.isLoaded()) {
            if (this.preScene) {
                this.preScene._enterFrame();
            }
        }
        else {
            if (this.onLoad) {
                this.onLoad();
            }
            var children = this.scene.children;
            for (var i = 0, n = children.length; i < n; i++) {
                var child = children[i];
                // システム用
                if (child._onLoad) {
                    child._onLoad();
                }
                // フック用
                if (child.onLoad) {
                    child.onLoad();
                }
            }
            clearInterval(this.preLoadInterval);
            var that_1 = this;
            setInterval(function () {
                that_1._enterFrame();
            }, 1000 / this.fps);
        }
    };
    App.prototype._enterFrame = function () {
        var field = this.field;
        this.ctx.clearRect(0, 0, field.width, field.height);
        this.useEvent();
        if (this.enterFrame) {
            this.enterFrame();
        }
        this.scene._enterFrame();
    };
    /**
     * @method pushScene
     * @param scene Sceneオブジェクト
     * 現在のシーンを新しいシーンに置き換える
     * */
    App.prototype.pushScene = function (scene) {
        var ctx = this.ctx;
        var field = this.field;
        var children = this.scene.children;
        for (var i = 0, n = children.length; i < n; i++) {
            var target = children[i];
            target.eventEnable = false;
            if (target.onSceneRemoved) {
                target.onSceneRemoved();
            }
        }
        children = scene.children;
        for (var i = 0, n = children.length; i < n; i++) {
            var obj = children[i];
            obj.ctx = ctx;
            obj.field = field;
            obj.eventEnable = true;
            if (obj.onScenePushed) {
                obj.onScenePushed();
            }
        }
        scene.parent = this;
        scene.ctx = ctx;
        scene.field = field;
        var style = this.field.style;
        style.background = '';
        style.backgroundColor = 'white';
        if (scene.color) {
            this.setColor(scene.color);
        }
        if (scene.image) {
            this.setImage(scene.image);
        }
        this.scene = scene;
    };
    /**
     * @method setColor
     * @param color String
     * ゲームの背景色を設定する
     * */
    App.prototype.setColor = function (color) {
        var style = this.field.style;
        style.background = '';
        if (typeof color === 'string') {
            style.backgroundColor = color;
        }
    };
    /**
     * @method setImage
     * @param img String
     * ゲームの背景画像を設定する
     * */
    App.prototype.setImage = function (img) {
        var style = this.field.style;
        style.background = "url(" + img + ") no-repeat center";
        style.backgroundSize = 'cover';
    };
    /**
     * @method start
     * ゲームをスタートする
     * */
    App.prototype.start = function () {
        var field = this.field;
        var that = this;
        this.ctx.clearRect(0, 0, field.width, field.height);
        this.preLoadInterval = setInterval(function () {
            that._preLoadEnterFrame();
        }, 1000 / this.fps);
    };
    /**
     * @method load
     * 音楽や画像等の素材をロードする
     * */
    App.prototype.load = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _loop_1 = function (i, n) {
            var obj = args[i];
            var data = obj;
            var name_1 = obj;
            if (obj instanceof Array) {
                data = obj[0];
                name_1 = obj[1];
            }
            var ext = void 0;
            if (data.match('data:image/png')) {
                ext = 'png';
            }
            else {
                if (this_1.assetPath) {
                    data = "" + this_1.assetPath + data;
                }
                ext = this_1.getExtention(data);
            }
            if (ext == 'wav' || ext == 'mp3' || ext == 'ogg') {
                var audio_1 = new Audio(data);
                // @ts-ignore TODO
                audio_1.name = name_1;
                audio_1.addEventListener('canplaythrough', function () {
                    functions_1.finishLoad();
                    console.log(audio_1.src + " is loaded");
                });
                functions_1.addSound(audio_1);
            }
            else if (ext == 'TTF' || ext == 'ttf') {
                var css = this_1._css;
                var rule = document.createTextNode("" + '@font-face{' +
                    "font-family:'" + name_1 + "';" +
                    ("src: url('" + data + "') format('truetype');") +
                    '}');
                // @ts-ignore TODO
                if (css.styleSheet) {
                    // @ts-ignore TODO
                    css.styleSheet.cssText = rule;
                }
                else {
                    css.appendChild(rule);
                }
            }
            else if (ext == 'svg') {
                var obj_1 = document.createElement('object');
                obj_1.addEventListener('load', function () {
                    functions_1.finishLoad();
                    obj_1.style.display = 'none';
                    obj_1.dataset.loaded = 'true';
                    console.log(obj_1.data + " is loaded");
                });
                obj_1.data = data;
                obj_1.name = name_1;
                document.body.appendChild(obj_1);
                functions_1.addSvg(obj_1);
            }
            else if (ext == 'png' || ext == 'gif' || ext == 'jpeg' || ext == 'jpg') {
                var obj_2 = new Image();
                obj_2.addEventListener('load', function () {
                    functions_1.finishLoad();
                    obj_2.dataset.loaded = 'true';
                    console.log(obj_2.src + " is loaded");
                });
                obj_2.src = data;
                obj_2.name = name_1;
                functions_1.addImage(obj_2);
            }
        };
        var this_1 = this;
        for (var i = 0, n = args.length; i < n; i++) {
            _loop_1(i, n);
        }
    };
    return App;
}(util_1.Util));
exports.App = App;
//# sourceMappingURL=app.js.map