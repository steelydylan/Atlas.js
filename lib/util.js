"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var functions_1 = require("./functions");
/**
 * @class Atlas.Util
 * */
var Util = /** @class */ (function () {
    function Util() {
        this.isMobile = functions_1.isMobile;
        this.orientation = functions_1.orientation;
        this.mover = [];
        this.rot = 0;
        this.moverIndex = 0;
        this.visible = true;
        this.eventEnable = true;
        this.drawMode = 'source-over';
        this.eventListener = {
            touchStart: false,
            touchMove: false,
            touchEnd: false,
            keyUp: false,
            keyDown: false,
            multiTouchStart: false,
            multiTouchMove: false,
            multiTouchEnd: false,
            orientationChange: false
        };
    }
    // TODO
    Util.prototype.multiTouchStart = function (pos) { };
    ;
    Util.prototype.multiTouchMove = function (pos) { };
    ;
    Util.prototype.multiTouchEnd = function (pos) { };
    ;
    Util.prototype.touchStart = function (pos) { };
    ;
    Util.prototype.touchMove = function (pos) { };
    ;
    Util.prototype.touchEnd = function (pos) { };
    ;
    Util.prototype.keyUp = function (key) { };
    ;
    Util.prototype.keyDown = function (key) { };
    ;
    Util.prototype.enterFrame = function () { };
    ;
    Util.prototype.onSceneRemoved = function () { };
    ;
    Util.prototype.onScenePushed = function () { };
    ;
    Util.prototype.onLoad = function () { };
    ;
    Util.prototype.isLoaded = function () {
        return true;
    };
    Util.prototype._enterFrame = function () {
    };
    Util.prototype._onLoad = function () {
    };
    Util.prototype.draw = function () {
    };
    Util.prototype.tween = function () {
        var mover = this.mover;
        var length = mover.length;
        if (this.moverIndex < length) {
            var obj = mover[this.moverIndex];
            if (obj.animate) {
                this._animate(obj);
            }
            if (obj.moveTo) {
                this._moveTo(obj);
            }
            if (obj.moveBy) {
                this._moveBy(obj);
            }
            if (obj.rotateBy) {
                this._rotateBy(obj);
            }
            if (obj.scaleBy) {
                this._scaleBy(obj);
            }
            if (obj.then) {
                this._then(obj);
            }
            obj.time++;
            if (obj.time >= obj.frame) {
                this.moverIndex++;
                if (this.moverIndex == length) {
                    if (obj.loop) {
                        this._refresh();
                    }
                    else {
                        this.stop();
                    }
                }
            }
        }
    };
    Util.prototype._animate = function (obj) {
    };
    Util.prototype._scaleBy = function (obj) {
    };
    Util.prototype._refresh = function () {
        this.moverIndex = 0;
        var mover = this.mover;
        for (var i = 0, n = mover.length; i < n; i++) {
            var obj = mover[i];
            if (obj.time) {
                obj.time = 0;
            }
        }
    };
    /**
     * @method isQueEmpty
     * アニメーション用のキューが空かどうかを判定する
     * */
    Util.prototype.isQueEmpty = function () {
        return !this.mover.length;
    };
    /**
     * @method moveTo
     * オフジェクトを(x,y)の座標にframeフレームで移動させる
     * @param x {Number}
     * @param y {Number}
     * @param frame {Number}
     * */
    Util.prototype.moveTo = function (x, y, frame) {
        var obj = functions_1.Tween(this, 'moveTo', frame);
        obj.toX = x;
        obj.toY = y;
        this.mover.push(obj);
        return this;
    };
    Util.prototype._moveTo = function (obj) {
        if (obj.time === 0) {
            obj.diffX = obj.toX - this.x;
            obj.diffY = obj.toY - this.y;
        }
        this.x = obj.toX - obj.diffX * (1 - obj.time / obj.frame);
        this.y = obj.toY - obj.diffY * (1 - obj.time / obj.frame);
    };
    /**
     * @method moveTo
     * 現在の座標位置からframeフレームで(x,y)移動させる
     * @param x {Number}
     * @param y {Number}
     * @param frame {Number}
     * */
    Util.prototype.moveBy = function (x, y, frame) {
        var obj = functions_1.Tween(this, 'moveBy', frame);
        obj.diffX = x;
        obj.diffY = y;
        this.mover.push(obj);
        return this;
    };
    Util.prototype._moveBy = function (obj) {
        if (obj.time === 0) {
            obj.toX = this.x + obj.diffX;
            obj.toY = this.y + obj.diffY;
        }
        this.x = obj.toX - obj.diffX * (1 - obj.time / obj.frame);
        this.y = obj.toY - obj.diffY * (1 - obj.time / obj.frame);
    };
    /**
     * @method delay
     * アニメーションをframeフレーム待つ
     * @param frame {Number}
     * */
    Util.prototype.delay = function (frame) {
        var obj = functions_1.Tween(this, 'delay', frame);
        this.mover.push(obj);
        return this;
    };
    /**
     * @method and
     * アニメーションを二つ定義する
     * @example
     * sprite.moveBy(100,100,30).and().rotateBy(Math.PI,30);
     * */
    Util.prototype.and = function () {
        var mover = this.mover;
        var target = mover[mover.length - 1];
        if (target) {
            target.and = true;
        }
        return this;
    };
    /**
     * @method stop
     * アニメーションを中止する
     * */
    Util.prototype.stop = function () {
        this.mover = [];
        this.moverIndex = 0;
        return this;
    };
    /**
     * @method loop
     * アニメーションをループする
     * @example loop
     * sprite.moveBy(100,100,30).and().rotateBy(Math.PI,30).loop();
     * */
    Util.prototype.loop = function () {
        var obj = this.mover[this.mover.length - 1];
        obj.loop = true;
        return this;
    };
    /**
    * @method rotateBy
    * @param angle {Number}
    * @param frame {Number}
    * frameフレームでangle（ラジアン）回転させる
    * */
    Util.prototype.rotateBy = function (angle, frame) {
        var obj = functions_1.Tween(this, 'rotateBy', frame);
        this.mover.push(obj);
        obj.diffAngle = angle;
        return this;
    };
    Util.prototype._rotateBy = function (obj) {
        if (obj.time === 0) {
            obj.toAngle = this.rot + obj.diffAngle;
        }
        this.rot = obj.toAngle - obj.diffAngle * (1 - obj.time / obj.frame);
    };
    /**
    * @method then
    * アニメーションの途中に関数を実行する
    * */
    Util.prototype.then = function (fn, frame) {
        var obj = functions_1.Tween(this, 'then', frame);
        obj.exec = fn;
        this.mover.push(obj);
        return this;
    };
    Util.prototype._then = function (obj) {
        obj.exec.call(this);
    };
    /**
     * @method scaleBy
     * @param x Number
     * @param y Number
     * @param frame Number
     * frameフレームで横にx倍、縦にy倍拡大する
     * */
    Util.prototype.scaleBy = function (x, y, frame) {
        var obj = functions_1.Tween(this, 'scaleBy', frame);
        obj.scaleX = x;
        obj.scaleY = y;
        this.mover.push(obj);
        return this;
    };
    /**
     * @method setPosition
     * @param x Number
     * @param y Number
     * オフジェクトを座標(x,y)に移動
     * */
    Util.prototype.setPosition = function (x, y) {
        this.x = x;
        this.y = y;
        return this;
    };
    Util.prototype.saveData = function (key) {
        var obj = {};
        for (var i in this) {
            if (typeof (this[i]) !== 'function') {
                obj[i] = this[i];
            }
        }
        localStorage.setItem(key, JSON.stringify(obj));
    };
    Util.prototype.getData = function (key) {
        var obj = JSON.parse(localStorage.getItem(key));
        for (var i in obj) {
            //@ts-ignore TODO
            this[i] = obj[i];
        }
    };
    /**
     * @method getTouchPosition
     * @param e eventオブジェクト
     * @param num Number
     * eventオブジェクトからキャンバスの押された位置座標を取得
     * */
    Util.prototype.getTouchPosition = function (e, num) {
        if (!(num && e.touches[num])) {
            num = 0;
        }
        var field = this.field;
        var rateX = parseInt("" + field.width) / parseInt(field.style.width);
        var rateY = parseInt("" + field.height) / parseInt(field.style.height);
        var obj = {};
        var margin = field.getBoundingClientRect();
        var x = parseInt("" + margin.left);
        var y = parseInt("" + margin.top);
        if (isNaN(x)) {
            x = 0;
        }
        if (isNaN(y)) {
            y = 0;
        }
        var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
        var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
        if (e) {
            if (!functions_1.isMobile || (functions_1.isMobile && e.touches[num])) {
                obj.x = (functions_1.isMobile ? e.touches[num].pageX : e.pageX) - x - scrollX;
                obj.y = (functions_1.isMobile ? e.touches[num].pageY : e.pageY) - y - scrollY;
            }
            else {
                obj.x = -1;
                obj.y = -1;
            }
        }
        else {
            // @ts-ignore
            obj.x = event.x - x;
            // @ts-ignore
            obj.y = event.y - y;
        }
        obj.x = Math.floor(obj.x * rateX);
        obj.y = Math.floor(obj.y * rateY);
        return obj;
    };
    Util.prototype.getMultiTouchPosition = function (e) {
        var length = e.touches.length;
        var pos = [];
        for (var i = 0; i < length; i++) {
            pos[i] = this.getTouchPosition(e, i);
        }
        return pos;
    };
    Util.prototype.handleEvent = function (e) {
        if (this.eventEnable) {
            e.preventDefault();
            var pos = this.getTouchPosition(e);
            if (e.touches) {
                pos.touchCount = e.touches.length;
            }
            else {
                pos.touchCount = 1;
            }
            pos.event = e;
            var type = e.type;
            var keydown = functions_1.getKeydown();
            switch (type) {
                case 'touchstart':
                    if (this.multiTouchStart && e.touches.length > 1) {
                        this.multiTouchStart(this.getMultiTouchPosition(e));
                    }
                    else if (this.touchStart) {
                        this.touchStart(pos);
                    }
                    break;
                case 'mousedown':
                    if (this.touchStart)
                        this.touchStart(pos);
                    break;
                case 'touchmove':
                    if (this.multiTouchMove && e.touches.length > 1) {
                        this.multiTouchMove(this.getMultiTouchPosition(e));
                    }
                    else if (this.touchMove) {
                        this.touchMove(pos);
                    }
                    break;
                case 'mousemove':
                    if (this.touchMove)
                        this.touchMove(pos);
                    break;
                case 'touchend':
                    if (this.multiTouchEnd && e.touches.length > 1) {
                        this.multiTouchEnd(this.getMultiTouchPosition(e));
                    }
                    else if (this.touchEnd) {
                        this.touchEnd(pos);
                    }
                    break;
                case 'mouseup':
                    if (this.touchEnd)
                        this.touchEnd();
                    break;
                case 'keydown':
                    if (this.keyDown)
                        this.keyDown(keydown);
                    break;
                case 'keyup':
                    if (this.keyUp)
                        this.keyUp();
                    break;
            }
        }
    };
    Util.prototype.useEvent = function () {
        var field = this.field;
        var eventListener = this.eventListener;
        if (this.touchStart && eventListener.touchStart === false) {
            if (functions_1.isMobile) {
                field.addEventListener('touchstart', this, false);
            }
            else {
                field.addEventListener('mousedown', this, false);
            }
            eventListener.touchStart = true;
        }
        if (this.touchMove && eventListener.touchMove === false) {
            if (functions_1.isMobile) {
                field.addEventListener('touchmove', this, false);
            }
            else {
                field.addEventListener('mousemove', this, false);
            }
            eventListener.touchMove = true;
        }
        if (this.touchEnd && eventListener.touchEnd === false) {
            if (functions_1.isMobile) {
                field.addEventListener('touchend', this, false);
            }
            else {
                field.addEventListener('mouseup', this, false);
            }
            eventListener.touchEnd = true;
        }
        if (this.multiTouchStart && eventListener.multiTouchStart === false) {
            if (!eventListener.touchStart) {
                if (functions_1.isMobile) {
                    field.addEventListener('touchstart', this, false);
                }
                else {
                    field.addEventListener('mousedown', this, false);
                }
            }
            eventListener.touchStart = true;
        }
        if (this.multiTouchMove && eventListener.multiTouchMove === false) {
            if (!eventListener.touchMove) {
                if (functions_1.isMobile) {
                    field.addEventListener('touchmove', this, false);
                }
                else {
                    field.addEventListener('mousemove', this, false);
                }
            }
            eventListener.touchMove = true;
        }
        if (this.multiTouchEnd && eventListener.multiTouchEnd === false) {
            if (!eventListener.touchEnd) {
                if (functions_1.isMobile) {
                    field.addEventListener('touchend', this, false);
                }
                else {
                    field.addEventListener('mouseup', this, false);
                }
            }
            eventListener.touchEnd = true;
        }
        if (this.keyUp && eventListener.keyUp === false) {
            field.addEventListener('keyup', this, false);
            eventListener.keyUp = true;
        }
        if (this.keyDown && eventListener.keyDown === false) {
            field.addEventListener('keydown', this, false);
            eventListener.keyDown = true;
        }
    };
    /**
     * @method remove
     * オブジェクトをゲームから除外
     * */
    Util.prototype.remove = function () {
        this._remove = true;
    };
    /**
     * @method leave
     * オブジェクトをAppインスタンスやLayerインスタンスから引き離す
     * */
    Util.prototype.leave = function () {
        this._leave = true;
    };
    /**
     * @method getRand
     * @param a Number
     * @param b Number
     * a ~ bの間のランダムな数字を取得
     * */
    Util.prototype.getRand = function (a, b) {
        return ~~(Math.random() * (b - a + 1)) + a;
    };
    /**
     * @method getRandText
     * @param limit Number
     * limitまでの文字数で文字列を取得
     * */
    Util.prototype.getRandText = function (limit) {
        var ret = '';
        var strings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var length = strings.length;
        for (var i = 0; i < limit; i++) {
            ret += strings.charAt(Math.floor(this.getRand(0, length)));
        }
        return ret;
    };
    /**
     * @method rgbToHex
     * @param r Number
     * @param g Number
     * @param b Number
     * RGB形式から16進を取得する
     * */
    Util.prototype.rgbToHex = function (r, g, b) {
        var rgb = b | (g << 8) | (r << 16);
        return "#" + (0x1000000 + rgb).toString(16).slice(1);
    };
    /**
     * @method hexToRgb
     * @param color String
     * @param opacity Number
     * 16進からRGBを取得する
     * */
    Util.prototype.hexToRgb = function (color, opacity) {
        if (typeof this.color !== 'string') {
            return null;
        }
        var hex = color || this.color;
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (opacity) {
            return result ?
                "rgba(" + parseInt(result[1], 16) + "," + parseInt(result[2], 16) + "," + parseInt(result[3], 16) + "," + opacity + ")"
                : null;
        }
        return result ?
            "rgb(" + parseInt(result[1], 16) + "," + parseInt(result[2], 16) + "," + parseInt(result[3], 16) + ")"
            : null;
    };
    /**
     * @method hsbToHex
     * @param h Number
     * @param s Number
     * @param v Number
     * hsvから16進に変換する
     * */
    Util.prototype.hsvToHex = function (h, s, v) {
        var f;
        var i;
        var p;
        var q;
        var t;
        var r = 0;
        var g = 0;
        var b = 0;
        i = Math.floor(h / 60.0) % 6;
        f = (h / 60.0) - Math.floor(h / 60.0);
        p = Math.round(v * (1.0 - (s / 255.0)));
        q = Math.round(v * (1.0 - (s / 255.0) * f));
        t = Math.round(v * (1.0 - (s / 255.0) * (1.0 - f)));
        switch (i) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = v;
                b = p;
                break;
            case 2:
                r = p;
                g = v;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = v;
                break;
            case 4:
                r = t;
                g = p;
                b = v;
                break;
            case 5:
                r = v;
                g = p;
                b = q;
                break;
        }
        if (r <= 15) {
            r = "0" + r.toString(16);
        }
        else {
            r = r.toString(16);
        }
        if (g <= 15) {
            g = "0" + g.toString(16);
        }
        else {
            g = g.toString(16);
        }
        if (b <= 15) {
            b = "0" + b.toString(16);
        }
        else {
            b = b.toString(16);
        }
        return "#" + r + g + b;
    };
    Util.prototype.rgbToHsv = function (r, g, b) {
        var rr;
        var gg;
        var bb;
        var r = r / 255;
        var g = g / 255;
        var b = b / 255;
        var h = 0;
        var s = 0;
        var v = 0;
        v = Math.max(r, g, b);
        var diff = v - Math.min(r, g, b);
        if (diff == 0) {
            h = s = 0;
        }
        else {
            s = diff / v;
            rr = (v - r) / 6 / diff + 1 / 2;
            gg = (v - g) / 6 / diff + 1 / 2;
            bb = (v - b) / 6 / diff + 1 / 2;
            if (r === v) {
                h = bb - gg;
            }
            else if (g === v) {
                h = (1 / 3) + rr - bb;
            }
            else if (b === v) {
                h = (2 / 3) + gg - rr;
            }
            if (h < 0) {
                h += 1;
            }
            else if (h > 1) {
                h -= 1;
            }
        }
        return "hsv(" + Math.round(h * 360) + "," + Math.round(s * 100) + "," + Math.round(v * 100) + ")";
    };
    Util.prototype.hexToHsv = function (color) {
        var rgb = this.hexToRgb(color);
        return rgb;
    };
    Util.prototype.getObjFromRgb = function (color) {
        var arr = /rgb\((.*?),(.*?),(.*?)\)/.exec(color);
        return {
            r: parseInt(arr[1]),
            g: parseInt(arr[2]),
            b: parseInt(arr[3])
        };
    };
    Util.prototype.getObjFromHsv = function (color) {
        var arr = /hsv\((.*?),(.*?),(.*?)\)/.exec(color);
        return {
            h: parseInt(arr[1]),
            s: parseInt(arr[2]),
            v: parseInt(arr[3])
        };
    };
    /**
     * @method getSound
     * @param name String
     * Appインスタンスにロードされた音楽を取得する
     * */
    Util.prototype.getSound = function (name) {
        var sounds = functions_1.getSoundAssets();
        for (var i = 0, n = sounds.length; i < n; i++) {
            if (name == sounds[i].dataset.name) {
                this.sound = new Audio(sounds[i].src);
            }
        }
    };
    /**
     * @method soundClonePlay
     * セットされた音楽を複製して再生する
     * */
    Util.prototype.soundClonePlay = function () {
        var sound = this.sound;
        if (sound) {
            (new Audio(sound.src)).play();
        }
    };
    /**
     * @method soundLoopPlay
     * セットされた音楽をループ再生する
     * */
    Util.prototype.soundLoopPlay = function () {
        var sound = this.sound;
        if (sound) {
            if (!sound.loop) {
                sound.addEventListener('ended', function () {
                    this.currentTime = 0;
                    this.play();
                }, false);
            }
            sound.loop = true;
            sound.play();
        }
    };
    /**
     * @method soundReplay
     * 再生中の音楽をはじめから再生する
     * */
    Util.prototype.soundReplay = function () {
        var sound = this.sound;
        if (sound) {
            sound.load();
            sound.play();
        }
    };
    /**
     * @method soundStop
     * 再生中の音楽を停止する
     * */
    Util.prototype.soundStop = function () {
        var sound = this.sound;
        if (!sound.paused) {
            sound.pause();
            sound.currentTime = 0;
        }
        else {
            sound.load();
        }
    };
    /**
     * @method soundPlay
     * セットされた音楽を再生する
     * */
    Util.prototype.soundPlay = function () {
        var sound = this.sound;
        if (sound) {
            sound.play();
        }
    };
    /**
     * @method soundPause
     * 再生中の音楽を一時停止する
     * */
    Util.prototype.soundPause = function () {
        var sound = this.sound;
        if (sound) {
            sound.pause();
        }
    };
    /**
     * @method soundGetCount
     * 再生中の音楽の再生位置を取得する
     * */
    Util.prototype.soundGetCount = function () {
        var sound = this.sound;
        if (sound) {
            return sound.currentTime;
        }
    };
    /**
     * @method soundSetCount
     * @param time Number
     * 指定された位置に再生位置を設定する
     * */
    Util.prototype.soundSetCount = function (time) {
        var sound = this.sound;
        if (sound) {
            sound.currentTime = time;
        }
    };
    /**
     * @method soundGetVolume
     * セットされた音楽のボリュームを取得する
     * */
    Util.prototype.soundGetVolume = function () {
        var sound = this.sound;
        if (sound) {
            return sound.volume;
        }
    };
    /**
     * @method soundSetVolume
     * @param volume Number
     * セットされた音楽のボリュームを設定する
     * */
    Util.prototype.soundSetVolume = function (volume) {
        var sound = this.sound;
        if (sound) {
            sound.volume = volume;
        }
    };
    /**
     * @method soundGetAlltime
     * 全再生時間を取得する
     * */
    Util.prototype.soundGetAlltime = function () {
        var sound = this.sound;
        if (sound) {
            return sound.duration;
        }
    };
    /**
     * @method 音楽が再生中かを調べる
     * @return Boolean
     * */
    Util.prototype.soundIsPlaying = function () {
        var sound = this.sound;
        if (sound) {
            return !sound.paused;
        }
    };
    /**
     * @method getExtention
     * @param fileName String
     * ファイル名から拡張子を取得する
     * */
    Util.prototype.getExtention = function (fileName) {
        var ret = '';
        if (!fileName) {
            return ret;
        }
        var fileTypes = fileName.split('.');
        var len = fileTypes.length;
        if (len === 0) {
            return ret;
        }
        ret = fileTypes[len - 1];
        return ret;
    };
    return Util;
}());
exports.Util = Util;
//# sourceMappingURL=util.js.map