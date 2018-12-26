'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
* Atlas.js v0.7.11 - ブラウザで動作する教育用JSゲームエンジン
* https://github.com/steelydylan/Atlas.js
* MIT Licensed
* Copyright (C) 2013 steelydylan http://horicdesign.com
*/
var images = [];
var sounds = [];
var svgs = [];
var allLoaded = 0;
var isMobile = function () {
  var userAgent = navigator.userAgent;
  if (userAgent.indexOf('iPhone') > 0 && userAgent.indexOf('iPad') == -1 || userAgent.indexOf('iPod') > 0 || userAgent.indexOf('Android') > 0) return true;else return false;
}();
var orientation = function (e) {
  var mq = window.matchMedia("(orientation: portrait)");
  var orientation = "";
  if (mq.matches) return "portrait";else return "landscape";
}();
var setKeyState = function setKeyState(ret, e) {
  var which = e.which;
  switch (which) {
    case 13:
      ret.enter = true;
      break;
    case 16:
      ret.shift = true;
      break;
    case 32:
      ret.space = true;
      break;
    case 39:
      // Key[→]
      ret.right = true;
      break;
    case 37:
      // Key[←]
      ret.left = true;
      break;
    case 38:
      // Key[↑]
      ret.up = true;
      break;
    case 40:
      // Key[↓]
      ret.down = true;
      break;
    case 8:
      ret.backspace = true;
      break;
  }
  if (e.metaKey) {
    ret.command = true;
  }
  for (var i = 0; i < 26; i++) {
    if (i + 65 == which) {
      var chr = String.fromCharCode(i + 97);
      ret[chr] = true;
      break;
    }
  }
};
var clearKeyState = function clearKeyState(ret) {
  ret.enter = false;
  ret.command = false;
  ret.shift = false;
  ret.space = false;
  ret.right = false;
  ret.left = false;
  ret.up = false;
  ret.down = false;
  ret.backspace = false;
  for (var i = 0; i < 26; i++) {
    ret[String.fromCharCode(i + 97)] = false;
  }
};
var keydown = function () {
  var ret = {};
  clearKeyState(ret);
  return ret;
}();
var Atlas = function Atlas() {
  for (var key in Atlas) {
    window[key] = Atlas[key];
  }
};
Atlas.createClass = function (superClass, obj) {
  var newClass = function newClass() {
    this.initialize.apply(this, arguments);
  };
  if (typeof superClass == "function" && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) == "object") {
    newClass.prototype = Object.create(superClass.prototype);
    newClass.prototype.inherit = function () {
      this.initialize = this.superClass.prototype.initialize;
      this.superClass = this.superClass.prototype.superClass;
      if (this.initialize) this.initialize.apply(this, arguments);
    };
  } else if ((typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)) == "object" && obj == void 0) {
    obj = superClass;
  }
  for (var key in obj) {
    newClass.prototype[key] = obj[key];
  }
  newClass.prototype.superClass = superClass;
  return newClass;
};
Atlas.extendClass = function (targetclass, obj) {
  for (var key in obj) {
    if (!obj.safetyExtend || obj.safetyExtend && !targetclass.prototype[key]) {
      targetclass.prototype[key] = obj[key];
    }
  }
};
/**
 * @class Array
 */
Atlas.extendClass(Array, {
  safetyExtend: true,
  forEach: function forEach(fn) {
    for (var i = 0, n = this.length; i < n; i++) {
      fn(this[i]);
    }
  },
  reduce: function reduce(fn) {
    var h = 0;
    for (var i = 0, n = this.length; i < n; i++) {
      h = fn(h, this[i]);
    }
    return h;
  },
  reduceRight: function reduceRight(fn) {
    var h = 0;
    for (var i = this.length - 1; i >= 0; i--) {
      h = fn(h, this[i]);
    }
    return h;
  },
  map: function map(fn) {
    for (var i = 0, n = this.length; i < n; i++) {
      this[i] = fn(this[i]);
    }
    return this;
  },
  /**
   * @method max
   * @param fn Function
   * 配列の値に関して関数を実行した値のうち一番大きな値を返す
   **/
  max: function max(fn) {
    var max = null;
    for (var i = 0, n = this.length; i < n; i++) {
      var ret = fn(this[i]);
      if (max === null || max < ret) {
        max = ret;
      }
    }
    return max;
  },
  /**
   * @method min
   * @param fn Function
   * 配列の値に関して関数を実行した値のうち一番小さな値を返す
   **/
  min: function min(fn) {
    var min = null;
    for (var i = 0, n = this.length; i < n; i++) {
      var ret = fn(this[i]);
      if (min === null || min > ret) {
        min = ret;
      }
    }
    return min;
  },
  /**
   * @method clone
   * 配列をコピーして返す
   **/
  clone: function clone() {
    if (this[0].constructor == Array) {
      var ar, n;
      ar = new Array(this.length);
      for (n = 0; n < ar.length; n++) {
        ar[n] = this[n].clone();
      }
      return ar;
    }
    return Array.apply(null, this);
  }
});
Atlas.main = function (fn) {
  Atlas._main = fn;
};
window.addEventListener("load", function () {
  if (Atlas._main) {
    Atlas._main();
  }
});
var Tween = function Tween(that, kind, frame) {
  var mover = that.mover;
  var target = mover[mover.length - 1];
  var obj = {};
  if (target && target.and) {
    obj = target;
  }
  obj.time = 0;
  if (frame) obj.frame = frame;
  obj.loop = false;
  obj.and = false;
  obj[kind] = true;
  return obj;
};
/**
 * @class Atlas.Util
 **/
Atlas.Util = Atlas.createClass({
  isMobile: isMobile,
  orientation: orientation,
  initialize: function initialize() {
    this.eventListener = {};
    this.mover = [];
    this.rot = 0;
    this.moverIndex = 0;
    this.visible = true;
    this.eventEnable = true;
    this.drawMode = "source-over";
    var eventListener = this.eventListener;
    eventListener.touchStart = false;
    eventListener.touchMove = false;
    eventListener.touchEnd = false;
    eventListener.keyUp = false;
    eventListener.keyDown = false;
    eventListener.multiTouchStart = false;
    eventListener.multiTouchMove = false;
    eventListener.multiTouchEnd = false;
    eventListener.orientationChange = false;
  },
  tween: function tween() {
    var mover = this.mover;
    var length = mover.length;
    if (this.moverIndex < length) {
      var obj = mover[this.moverIndex];
      if (obj.animate) this._animate(obj);
      if (obj.moveTo) this._moveTo(obj);
      if (obj.moveBy) this._moveBy(obj);
      if (obj.rotateBy) this._rotateBy(obj);
      if (obj.scaleBy) this._scaleBy(obj);
      if (obj.then) this._then(obj);
      obj.time++;
      if (obj.time >= obj.frame) {
        this.moverIndex++;
        if (this.moverIndex == length) {
          if (obj.loop) this._refresh();else this.stop();
        }
      }
    }
  },
  /**
   * @method isQueEmpty
   * アニメーション用のキューが空かどうかを判定する
   **/
  isQueEmpty: function isQueEmpty() {
    return this.mover.length ? false : true;
  },
  _refresh: function _refresh() {
    this.moverIndex = 0;
    var mover = this.mover;
    for (var i = 0, n = mover.length; i < n; i++) {
      var obj = mover[i];
      if (obj.time) obj.time = 0;
    }
  },
  /**
   * @method moveTo
   * オフジェクトを(x,y)の座標にframeフレームで移動させる
   * @param x {Number}
   * @param y {Number}
   * @param frame {Number}
   **/
  moveTo: function moveTo(x, y, frame) {
    var obj = Tween(this, "moveTo", frame);
    obj.toX = x;
    obj.toY = y;
    this.mover.push(obj);
    return this;
  },
  _moveTo: function _moveTo(obj) {
    if (obj.time === 0) {
      obj.diffX = obj.toX - this.x;
      obj.diffY = obj.toY - this.y;
    }
    this.x = obj.toX - obj.diffX * (1 - obj.time / obj.frame);
    this.y = obj.toY - obj.diffY * (1 - obj.time / obj.frame);
  },
  /**
   * @method moveTo
   * 現在の座標位置からframeフレームで(x,y)移動させる
   * @param x {Number}
   * @param y {Number}
   * @param frame {Number}
   **/
  moveBy: function moveBy(x, y, frame) {
    var obj = Tween(this, "moveBy", frame);
    obj.diffX = x;
    obj.diffY = y;
    this.mover.push(obj);
    return this;
  },
  _moveBy: function _moveBy(obj) {
    if (obj.time === 0) {
      obj.toX = this.x + obj.diffX;
      obj.toY = this.y + obj.diffY;
    }
    this.x = obj.toX - obj.diffX * (1 - obj.time / obj.frame);
    this.y = obj.toY - obj.diffY * (1 - obj.time / obj.frame);
  },
  /**
   * @method delay
   * アニメーションをframeフレーム待つ
   * @param frame {Number}
   **/
  delay: function delay(frame) {
    var obj = Tween(this, "delay", frame);
    this.mover.push(obj);
    return this;
  },
  /**
   * @method and
   * アニメーションを二つ定義する
   * @example
   * sprite.moveBy(100,100,30).and().rotateBy(Math.PI,30);
   **/
  and: function and() {
    var mover = this.mover;
    var target = mover[mover.length - 1];
    if (target) target.and = true;
    return this;
  },
  /**
   * @method stop
   * アニメーションを中止する
   **/
  stop: function stop() {
    this.mover = [];
    this.moverIndex = 0;
    return this;
  },
  /**
   * @method loop
   * アニメーションをループする
   * @example loop
   * sprite.moveBy(100,100,30).and().rotateBy(Math.PI,30).loop();
   **/
  loop: function loop() {
    var obj = this.mover[this.mover.length - 1];
    obj.loop = true;
    return this;
  },
  /**
  * @method rotateBy
  * @param angle {Number}
  * @param frame {Number}
  * frameフレームでangle（ラジアン）回転させる
  **/
  rotateBy: function rotateBy(angle, frame) {
    var obj = Tween(this, "rotateBy", frame);
    this.mover.push(obj);
    obj.diffAngle = angle;
    return this;
  },
  _rotateBy: function _rotateBy(obj) {
    if (obj.time === 0) obj.toAngle = this.rot + obj.diffAngle;
    this.rot = obj.toAngle - obj.diffAngle * (1 - obj.time / obj.frame);
  },
  /**
  * @method then
  * アニメーションの途中に関数を実行する
  **/
  then: function then(fn, frame) {
    var obj = Tween(this, "then", frame);
    obj.exec = fn;
    this.mover.push(obj);
    return this;
  },
  _then: function _then(obj) {
    obj.exec.call(this);
  },
  /**
   * @method scaleBy
   * @param x Number
   * @param y Number
   * @param frame Number
   * frameフレームで横にx倍、縦にy倍拡大する
   **/
  scaleBy: function scaleBy(x, y, frame) {
    var obj = Tween(this, "scaleBy", frame);
    obj.scaleX = x;
    obj.scaleY = y;
    this.mover.push(obj);
    return this;
  },
  /**
   * @method setPosition
   * @param x Number
   * @param y Number
   * オフジェクトを座標(x,y)に移動
   **/
  setPosition: function setPosition(x, y) {
    this.x = x;
    this.y = y;
    return this;
  },
  saveData: function saveData(key) {
    var obj = {};
    for (var i in this) {
      if (typeof this[i] != 'function') {
        obj[i] = this[i];
      }
    }
    localStorage.setItem(key, JSON.stringify(obj));
  },
  getData: function getData(key) {
    var obj = JSON.parse(localStorage.getItem(key));
    for (var i in obj) {
      this[i] = obj[i];
    }
  },
  /**
   * @method getTouchPosition
   * @param e eventオブジェクト
   * @param num Number
   * eventオブジェクトからキャンバスの押された位置座標を取得
   **/
  getTouchPosition: function getTouchPosition(e, num) {
    if (!(num && e.touches[num])) num = 0;
    var field = this.field;
    var rateX = parseInt(field.width) / parseInt(field.style.width);
    var rateY = parseInt(field.height) / parseInt(field.style.height);
    var obj = {};
    var margin = field.getBoundingClientRect();
    var x = parseInt(margin.left);
    var y = parseInt(margin.top);
    if (isNaN(x)) x = 0;
    if (isNaN(y)) y = 0;
    var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    if (e) {
      if (!isMobile || isMobile && e.touches[num]) {
        obj.x = (isMobile ? e.touches[num].pageX : e.pageX) - x - scrollX;
        obj.y = (isMobile ? e.touches[num].pageY : e.pageY) - y - scrollY;
      } else {
        obj.x = -1;
        obj.y = -1;
      }
    } else {
      obj.x = event.x - x;
      obj.y = event.y - y;
    }
    obj.x = parseInt(obj.x * rateX);
    obj.y = parseInt(obj.y * rateY);
    return obj;
  },
  getMultiTouchPosition: function getMultiTouchPosition(e) {
    var length = e.touches.length;
    var pos = [];
    for (var i = 0; i < length; i++) {
      pos[i] = this.getTouchPosition(e, i);
    }
    return pos;
  },
  handleEvent: function handleEvent(e) {
    if (this.eventEnable) {
      e.preventDefault();
      var pos = this.getTouchPosition(e);
      if (e.touches) pos.touchCount = e.touches.length;else pos.touchCount = 1;
      pos.event = e;
      var type = e.type;
      switch (type) {
        case 'touchstart':
          if (this.multiTouchStart && e.touches.length > 1) this.multiTouchStart(this.getMultiTouchPosition(e));else if (this.touchStart) this.touchStart(pos);
          break;
        case 'mousedown':
          if (this.touchStart) this.touchStart(pos);break;
        case 'touchmove':
          if (this.multiTouchMove && e.touches.length > 1) this.multiTouchMove(this.getMultiTouchPosition(e));else if (this.touchMove) this.touchMove(pos);
          break;
        case 'mousemove':
          if (this.touchMove) this.touchMove(pos);break;
        case 'touchend':
          if (this.multiTouchEnd && e.touches.length > 1) this.multiTouchEnd(this.getMultiTouchPosition(e));else if (this.touchEnd) this.touchEnd(pos);
          break;
        case 'mouseup':
          if (this.touchEnd) this.touchEnd();break;
        case 'keydown':
          if (this.keyDown) this.keyDown(keydown);break;
        case 'keyup':
          if (this.keyUp) this.keyUp();break;
      }
    }
  },
  useEvent: function useEvent() {
    var field = this.field;
    var eventListener = this.eventListener;
    if (this.touchStart && eventListener.touchStart === false) {
      if (isMobile) field.addEventListener("touchstart", this, false);else field.addEventListener("mousedown", this, false);
      eventListener.touchStart = true;
    }
    if (this.touchMove && eventListener.touchMove === false) {
      if (isMobile) field.addEventListener("touchmove", this, false);else field.addEventListener("mousemove", this, false);
      eventListener.touchMove = true;
    }
    if (this.touchEnd && eventListener.touchEnd === false) {
      if (isMobile) field.addEventListener("touchend", this, false);else field.addEventListener("mouseup", this, false);
      eventListener.touchEnd = true;
    }
    if (this.multiTouchStart && eventListener.multiTouchStart === false) {
      if (!eventListener.touchStart) {
        if (isMobile) field.addEventListener("touchstart", this, false);else field.addEventListener("mousedown", this, false);
      }
      eventListener.touchStart = true;
    }
    if (this.multiTouchMove && eventListener.multiTouchMove === false) {
      if (!eventListener.touchMove) {
        if (isMobile) field.addEventListener("touchmove", this, false);else field.addEventListener("mousemove", this, false);
      }
      eventListener.touchMove = true;
    }
    if (this.multiTouchEnd && eventListener.multiTouchEnd === false) {
      if (!eventListener.touchEnd) {
        if (isMobile) field.addEventListener("touchend", this, false);else field.addEventListener("mouseup", this, false);
      }
      eventListener.touchEnd = true;
    }
    if (this.keyUp && eventListener.keyUp === false) {
      field.addEventListener("keyup", this, false);
      eventListener.keyUp = true;
    }
    if (this.keyDown && eventListener.keyDown === false) {
      field.addEventListener("keydown", this, false);
      eventListener.keyDown = true;
    }
  },
  /**
   * @method remove
   * オブジェクトをゲームから除外
   **/
  remove: function remove() {
    this._remove = true;
  },
  /**
   * @method leave
   * オブジェクトをAppインスタンスやLayerインスタンスから引き離す
   **/
  leave: function leave() {
    this._leave = true;
  },
  /**
   * @method getRand
   * @param a Number
   * @param b Number
   * a ~ bの間のランダムな数字を取得
   **/
  getRand: function getRand(a, b) {
    return ~~(Math.random() * (b - a + 1)) + a;
  },
  /**
   * @method getRandText
   * @param limit Number
   * limitまでの文字数で文字列を取得
   **/
  getRandText: function getRandText(limit) {
    var ret = "";
    var strings = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var length = strings.length;
    for (var i = 0; i < limit; i++) {
      ret += strings.charAt(Math.floor(this.getRand(0, length)));
    }
    return ret;
  },
  /**
   * @method rgbToHex
   * @param r Number
   * @param g Number
   * @param b Number
   * RGB形式から16進を取得する
   **/
  rgbToHex: function rgbToHex(r, g, b) {
    var rgb = b | g << 8 | r << 16;
    return '#' + (0x1000000 + rgb).toString(16).slice(1);
  },
  /**
   * @method hexToRgb
   * @param color String
   * @param opacity Number
   * 16進からRGBを取得する
   **/
  hexToRgb: function hexToRgb(color, opacity) {
    if ((typeof color === 'undefined' ? 'undefined' : _typeof(color)) == Number) {
      opacity = color;
      color = null;
    }
    var hex = color || this.color;
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (opacity) {
      return result ? "rgba(" + parseInt(result[1], 16) + "," + parseInt(result[2], 16) + "," + parseInt(result[3], 16) + "," + opacity + ")" : null;
    } else {
      return result ? "rgb(" + parseInt(result[1], 16) + "," + parseInt(result[2], 16) + "," + parseInt(result[3], 16) + ")" : null;
    }
  },
  /**
   * @method hsbToHex
   * @param h Number
   * @param s Number
   * @param v Number
   * hsvから16進に変換する
   **/
  hsvToHex: function hsvToHex(h, s, v) {
    var f, i, p, q, t;
    var r, g, b;
    i = Math.floor(h / 60.0) % 6;
    f = h / 60.0 - Math.floor(h / 60.0);
    p = Math.round(v * (1.0 - s / 255.0));
    q = Math.round(v * (1.0 - s / 255.0 * f));
    t = Math.round(v * (1.0 - s / 255.0 * (1.0 - f)));
    switch (i) {
      case 0:
        r = v;g = t;b = p;break;
      case 1:
        r = q;g = v;b = p;break;
      case 2:
        r = p;g = v;b = t;break;
      case 3:
        r = p;g = q;b = v;break;
      case 4:
        r = t;g = p;b = v;break;
      case 5:
        r = v;g = p;b = q;break;
    }
    if (r <= 15) {
      r = "0" + r.toString(16);
    } else {
      r = r.toString(16);
    }
    if (g <= 15) {
      g = "0" + g.toString(16);
    } else {
      g = g.toString(16);
    }
    if (b <= 15) {
      b = "0" + b.toString(16);
    } else {
      b = b.toString(16);
    }
    return "#" + r + g + b;
  },
  rgbToHsv: function rgbToHsv(r, g, b) {
    var rr, gg, bb;
    var r = r / 255;
    var g = g / 255;
    var b = b / 255;
    var h, s, v;
    v = Math.max(r, g, b);
    var diff = v - Math.min(r, g, b);
    if (diff == 0) {
      h = s = 0;
    } else {
      s = diff / v;
      rr = (v - r) / 6 / diff + 1 / 2;
      gg = (v - g) / 6 / diff + 1 / 2;
      bb = (v - b) / 6 / diff + 1 / 2;
      if (r === v) {
        h = bb - gg;
      } else if (g === v) {
        h = 1 / 3 + rr - bb;
      } else if (b === v) {
        h = 2 / 3 + gg - rr;
      }
      if (h < 0) {
        h += 1;
      } else if (h > 1) {
        h -= 1;
      }
    }
    return "hsv(" + Math.round(h * 360) + "," + Math.round(s * 100) + "," + Math.round(v * 100) + ")";
  },
  hexToHsv: function hexToHsv(color) {
    var rgb = this.hexToRgb(color);
  },
  getObjFromRgb: function getObjFromRgb(color) {
    var arr = /rgb\((.*?),(.*?),(.*?)\)/.exec(color);
    return {
      r: parseInt(arr[1]),
      g: parseInt(arr[2]),
      b: parseInt(arr[3])
    };
  },
  getObjFromHsv: function getObjFromHsv(color) {
    var arr = /hsv\((.*?),(.*?),(.*?)\)/.exec(color);
    return {
      h: parseInt(arr[1]),
      s: parseInt(arr[2]),
      v: parseInt(arr[3])
    };
  },
  /**
   * @method getSound
   * @param name String
   * Appインスタンスにロードされた音楽を取得する
   **/
  getSound: function getSound(name) {
    for (var i = 0, n = sounds.length; i < n; i++) {
      if (name == sounds[i].name) this.sound = new Audio(sounds[i].src);
    }
  },
  /**
   * @method soundClonePlay
   * セットされた音楽を複製して再生する
   **/
  soundClonePlay: function soundClonePlay() {
    var sound = this.sound;
    if (sound) {
      new Audio(sound.src).play();
    }
  },
  /**
   * @method soundLoopPlay
   * セットされた音楽をループ再生する
   **/
  soundLoopPlay: function soundLoopPlay() {
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
  },
  /**
   * @method soundReplay
   * 再生中の音楽をはじめから再生する
   **/
  soundReplay: function soundReplay() {
    var sound = this.sound;
    if (sound) {
      sound.load();
      sound.play();
    }
  },
  /**
   * @method soundStop
   * 再生中の音楽を停止する
   **/
  soundStop: function soundStop() {
    var sound = this.sound;
    if (!sound.paused) {
      sound.pause();
      sound.currentTime = 0;
    } else {
      sound.load();
    }
  },
  /**
   * @method soundPlay
   * セットされた音楽を再生する
   **/
  soundPlay: function soundPlay() {
    var sound = this.sound;
    if (sound) sound.play();
  },
  /**
   * @method soundPause
   * 再生中の音楽を一時停止する
   **/
  soundPause: function soundPause() {
    var sound = this.sound;
    if (sound) sound.pause();
  },
  /**
   * @method soundGetCount
   * 再生中の音楽の再生位置を取得する
   **/
  soundGetCount: function soundGetCount() {
    var sound = this.sound;
    if (sound) return sound.currentTime;
  },
  /**
   * @method soundSetCount
   * @param time Number
   * 指定された位置に再生位置を設定する
   **/
  soundSetCount: function soundSetCount(time) {
    var sound = this.sound;
    if (sound) sound.currentTime = time;
  },
  /**
   * @method soundGetVolume
   * セットされた音楽のボリュームを取得する
   **/
  soundGetVolume: function soundGetVolume() {
    var sound = this.sound;
    if (sound) return sound.volume;
  },
  /**
   * @method soundSetVolume
   * @param volume Number
   * セットされた音楽のボリュームを設定する
   **/
  soundSetVolume: function soundSetVolume(volume) {
    var sound = this.sound;
    if (sound) sound.volume = volume;
  },
  /**
   * @method soundGetAlltime
   * 全再生時間を取得する
   **/
  soundGetAlltime: function soundGetAlltime() {
    var sound = this.sound;
    if (sound) return sound.duration;
  },
  /**
   * @method 音楽が再生中かを調べる
   * @return Boolean
   **/
  soundIsPlaying: function soundIsPlaying() {
    var sound = this.sound;
    if (sound) return !sound.paused;
  },
  /**
   * @method getExtention
   * @param fileName String
   * ファイル名から拡張子を取得する
   **/
  getExtention: function getExtention(fileName) {
    var ret;
    if (!fileName) {
      return ret;
    }
    var fileTypes = fileName.split(".");
    var len = fileTypes.length;
    if (len === 0) {
      return ret;
    }
    ret = fileTypes[len - 1];
    return ret;
  }
});
/**
 * @class Atlas.App
 * @extends Atlas.Util
 **/
Atlas.App = Atlas.createClass(Atlas.Util, {
  initialize: function initialize(place) {
    this.inherit();
    this._basicConstructor = "App";
    var css = document.createElement("style");
    css.media = 'screen';
    css.type = "text/css";
    document.getElementsByTagName("head")[0].appendChild(css);
    var field;
    if (place) {
      field = document.getElementById(place);
    } else {
      field = document.createElement("canvas");
      var Body = document.getElementsByTagName("body").item(0);
      Body.appendChild(field);
    }
    field.width = 320;
    field.height = 480;
    field.style.top = 0 + "px";
    field.style.left = 0 + "px";
    field.tabIndex = '1';
    document.body.style.margin = "0em";
    var userAgent = navigator.userAgent;
    if (isMobile) {
      field.style.width = window.innerWidth + "px"; //mobile default
      field.style.height = window.innerHeight + "px"; //mobile default
      field.addEventListener("touchstart", function () {
        if (this.tabIndex != -1) this.focus();
      });
    } else {
      field.style.width = 480 + "px";
      field.style.height = 620 + "px";
      field.addEventListener("mousedown", function () {
        if (this.tabIndex != -1) this.focus();
      });
      field.addEventListener("keyup", function () {
        clearKeyState(keydown);
      }, false);
      field.addEventListener("keydown", function (e) {
        setKeyState(keydown, e);
      });
    }
    this._css = css;
    this.field = field;
    this.ctx = field.getContext('2d');
    this.fps = 30; // fps default
    this.scene = new Atlas.Scene();
    this.scene.ctx = this.ctx;
    this.scene.field = this.field;
    this.scene.parent = this;
  },
  /**
   * @method clearLockMode
   * ゲーム画面のタブインデントを解除する
   **/
  clearLockMode: function clearLockMode() {
    this.field.tabIndex = '-1';
  },
  /**
   * @method setLockMode
   * ゲーム画面のタブインデントを有効にする
   **/
  setLockMode: function setLockMode() {
    this.field.tabIndex = '1';
  },
  /**
   * @method getCanvasURL
   * ゲーム画面のデータURLを取得
   **/
  getCanvasURL: function getCanvasURL() {
    return this.field.toDataURL();
  },
  /**
   * @method getCanvasImage
   * キャンバス画面の画像を新しいタブで開く
   **/
  getCanvasImage: function getCanvasImage() {
    var url = this.field.toDataURL();
    window.open(url, '_blank');
  },
  /**
   * @method getChild
   * ゲームに登録されたプロパティの一致するオブジェクトを取得する
   **/
  getChild: function getChild(obj) {
    return this.scene.getChild(obj);
  },
  /**
   * @method getChildren
   * ゲームに登録されたプロパティの一致するオブジェクトをすべて取得する
   **/
  getChildren: function getChildren(obj) {
    return this.scene.getChildren(obj);
  },
  /**
   * @method colorToAlpha
   * ゲームに登録された画像の指定された色を透明にする
   **/
  colorToAlpha: function colorToAlpha(imagename, hex) {
    var img;
    for (var i = 0, n = images.length; i < n; i++) {
      if (images[i].name == imagename) {
        img = images[i];
        img.hex = hex;
        img.index = i;
      }
    }
    img.addEventListener("load", function () {
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext('2d');
      var width = this.width;
      var height = this.height;
      var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      var hex = this.hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
      });
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      var color = result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
      ctx.drawImage(this, 0, 0);
      var ImageData = ctx.getImageData(0, 0, width, height);
      var data = ImageData.data;
      for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
          var t = i * (width * 4) + j * 4;
          if (data[t] == color.r && data[t + 1] == color.g && data[t + 2] == color.b) data[t + 3] = 0;
        }
      }
      ctx.putImageData(ImageData, 0, 0); //put image data back
      var newimg = new Image();
      newimg.src = canvas.toDataURL();
      images[this.index] = newimg;
    });
  },
  /**
   * @method addChild
   * @param child
   * ゲームにオブジェクトを登録する
   **/
  addChild: function addChild(child) {
    child.ctx = this.ctx;
    child.field = this.field;
    this.scene.addChild(child);
  },
  /**
   * @method addChildren
   * ゲームにオブジェクトを複数登録する
   **/
  addChildren: function addChildren() {
    for (var i = 0, n = arguments.length; i < n; i++) {
      this.addChild(arguments[i]);
    }
  },
  /**
   * @method centerize
   * ゲーム画面を画面の中央に配置する
   **/
  centerize: function centerize() {
    var style = this.field.style;
    style.marginTop = -parseInt(style.height) / 2 + "px";
    style.marginLeft = -parseInt(style.width) / 2 + "px";
    style.top = '50%';
    style.left = '50%';
    style.position = 'absolute';
  },
  /**
   * @method fitWindow
   * ゲーム画面をウィンドウにフィットさせる
   **/
  fitWindow: function fitWindow() {
    this.setSize(window.innerWidth, window.innerHeight);
    var that = this;
    window.onresize = function () {
      that.setSize(window.innerWidth, window.innerHeight);
    };
  },
  /**
   * @method setQuality
   * @param width Number
   * @param height Number
   * ゲーム画面の解像度を設定する
   **/
  setQuality: function setQuality(width, height) {
    var field = this.field;
    field.width = width;
    field.height = height;
  },
  /**
   * @method setSize
   * @param width Number
   * @param height Number
   * ゲーム画面の大きさを設定する
   **/
  setSize: function setSize(width, height) {
    var style = this.field.style;
    style.width = width + "px";
    style.height = height + "px";
  },
  /**
  * @method getSize
  * ゲーム画面の大きさを取得する
  **/
  getSize: function getSize() {
    var size = {};
    size.width = parseInt(this.field.style.width);
    size.height = parseInt(this.field.style.height);
    return size;
  },
  /**
   * @method getQuality
   * ゲーム画面の解像度を取得する
   **/
  getQuality: function getQuality() {
    var size = {};
    size.width = parseInt(this.field.width);
    size.height = parseInt(this.field.height);
    return size;
  },
  /**
   * @method loadingScene
   * @param scene Sceneオブジェクト
   * ローディング中のシーンを登録する
   **/
  loadingScene: function loadingScene(scene) {
    this.preScene = scene;
    this.preScene.parent = this;
  },
  _preLoadEnterFrame: function _preLoadEnterFrame() {
    var field = this.field;
    this.useEvent();
    var ctx = this.ctx;
    ctx.clearRect(0, 0, field.width, field.height);
    if (allLoaded > 0) {
      if (this.preScene) this.preScene._enterFrame();
    } else {
      if (this.onLoad) this.onLoad();
      var children = this.scene.children;
      for (var i = 0, n = children.length; i < n; i++) {
        var child = children[i];
        if (child._onLoad) child._onLoad(); //システム用
        if (child.onLoad) child.onLoad(); //フック用
      }
      clearInterval(this.preLoadInterval);
      var that = this;
      setInterval(function () {
        that._enterFrame();
      }, 1000 / this.fps);
    }
  },
  _enterFrame: function _enterFrame() {
    var field = this.field;
    this.ctx.clearRect(0, 0, field.width, field.height);
    this.useEvent();
    if (this.enterFrame) this.enterFrame();
    this.scene._enterFrame();
  },
  /**
   * @method pushScene
   * @param scene Sceneオブジェクト
   * 現在のシーンを新しいシーンに置き換える
   **/
  pushScene: function pushScene(scene) {
    var ctx = this.ctx;
    var field = this.field;
    var children = this.scene.children;
    for (var i = 0, n = children.length; i < n; i++) {
      var target = children[i];
      target.eventEnable = false;
      if (target.onSceneremoved) target.onSceneRemoved();
    }
    children = scene.children;
    for (i = 0, n = children.length; i < n; i++) {
      var obj = children[i];
      obj.ctx = ctx;
      obj.field = field;
      obj.eventEnable = true;
      if (obj.onScenePushed) obj.onScenePushed();
    }
    scene.parent = this;
    scene.ctx = ctx;
    scene.field = field;
    var style = this.field.style;
    style.background = null;
    style.backgroundColor = "white";
    if (scene.color) this.setColor(scene.color);
    if (scene.image) this.setImage(scene.image);
    this.scene = scene;
  },
  /**
   * @method setColor
   * @param color String
   * ゲームの背景色を設定する
   **/
  setColor: function setColor(color) {
    var style = this.field.style;
    style.background = null;
    style.backgroundColor = color;
  },
  /**
   * @method setImage
   * @param img String
   * ゲームの背景画像を設定する
   **/
  setImage: function setImage(img) {
    var style = this.field.style;
    style.background = "url(" + img + ") no-repeat center";
    style.backgroundSize = "cover";
  },
  /**
   * @method start
   * ゲームをスタートする
   **/
  start: function start() {
    var field = this.field;
    var that = this;
    this.ctx.clearRect(0, 0, field.width, field.height);
    this.preLoadInterval = setInterval(function () {
      that._preLoadEnterFrame();
    }, 1000 / this.fps);
  },
  /**
   * @method load
   * 音楽や画像等の素材をロードする
   **/
  load: function load() {
    var musicLoaded = function musicLoaded() {
      allLoaded--;
      console.log(this.src + " is loaded");
    };
    var svgLoaded = function svgLoaded() {
      allLoaded--;
      this.style.display = "none";
      this.loaded = true;
      console.log(this.data + ' is loaded');
    };
    var imgLoaded = function imgLoaded() {
      allLoaded--;
      this.loaded = true;
      console.log(this.src + ' is loaded');
    };
    for (var i = 0, n = arguments.length; i < n; i++) {
      var obj = arguments[i];
      var data = obj;
      var name = obj;
      if (obj instanceof Array) {
        var data = obj[0];
        var name = obj[1];
      }
      if (data.match("data:image/png")) {
        var ext = "png";
      } else {
        var ext = this.getExtention(data);
      }
      if (ext == 'wav' || ext == 'mp3' || ext == 'ogg') {
        var obj = new Audio(data);
        obj.name = name;
        allLoaded++;
        obj.addEventListener("canplaythrough", musicLoaded);
        sounds.push(obj);
      } else if (ext == "TTF" || ext == "ttf") {
        var css = this._css;
        var rule = document.createTextNode("@font-face{" + "font-family:'" + name + "';" + "src: url('" + data + "') format('truetype');" + "}");
        if (css.styleSheet) css.styleSheet.cssText = rule;else css.appendChild(rule);
      } else if (ext == "svg") {
        var obj = document.createElement("object");
        obj.addEventListener("load", svgLoaded);
        obj.data = data;
        obj.name = name;
        document.body.appendChild(obj);
        allLoaded++;
        svgs.push(obj);
      } else if (ext == "png" || ext == "gif" || ext == "jpeg" || ext == "jpg") {
        var obj = new Image();
        obj.addEventListener("load", imgLoaded);
        obj.src = data;
        obj.name = name;
        allLoaded++;
        images.push(obj);
      }
    }
  }
});
/**
 * @class Atlas.Thing
 * @extends Atlas.Util
 **/
Atlas.Thing = Atlas.createClass(Atlas.Util, {
  initialize: function initialize(width, height) {
    this.inherit();
    this.x = 0;
    this.y = 0;
    this._remove = false;
    this.width = width;
    this.height = height;
    this.collisionShape = "box";
    this.prepared = false; /*描画の準備が完了*/
    this.alpha = 1;
  },
  _scaleBy: function _scaleBy(obj) {
    if (obj.time === 0) {
      obj.toWidth = this.width * obj.scaleX;
      obj.toHeight = this.height * obj.scaleY;
      obj.diffWidth = obj.toWidth - this.width;
      obj.diffHeight = obj.toHeight - this.height;
    }
    this.width = obj.toWidth - obj.diffWidth * (1 - obj.time / obj.frame);
    this.height = obj.toHeight - obj.diffHeight * (1 - obj.time / obj.frame);
  },
  /**
   * @method intersect
   * @param ex Number
   * @param ey Number
   * 座標(ex,ey)にオブジェクトが衝突しているかを判定する
   **/
  intersect: function intersect(ex, ey) {
    var thisx = this._x || this.x;
    var thisy = this._y || this.y;
    var thisw = this._width || this.width;
    var thish = this._height || this.height;
    var r = this._rot || this.rot;
    if (this.collisionShape == "box") {
      var x = ex - (thisx + thisw / 2);
      var y = ey - (thisy + thish / 2);
      var s = Math.sin(-r);
      var c = Math.cos(-r);
      var xx = Math.abs(x * c - y * s);
      var yy = Math.abs(x * s + y * c);
      if (xx < thisw / 2.0 && yy < thish / 2.0) return true;
      return false;
    } else if (this.collisionShape == "circle") {
      var radius = thisw / 2;
      var x = ex - (thisx + radius);
      var y = ey - (thisy + radius);
      if (Math.sqrt(x * x + y * y) < radius) return true;
      return false;
    } else {
      return false;
    }
  },
  /**
   * @method hitTest
   * @param target Thingオブジェクト
   * 自分がターゲットと接触しているかを判定する
   **/
  hitTest: function hitTest(target) {
    /*衝突判定（自分の矩形は傾いてないものとする）*/
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
    if (this.collisionShape == "box") {
      if (target.collisionShape == "circle") return target.within(this, targetW / 2); /*矩形と円の当たり判定ならwithinで実装済み*/
    } else if (this.collisionShape == "circle") {
      return this.within(target, thisW / 2); /*矩形と円の当たり判定ならwithinで実装済み*/
    } else {
      return false;
    }
    if (targetr !== 0 && targetr != Math.PI) {
      if (target.collisionShape == "box") {
        var centerX = targetx + targetW / 2;
        var centerY = targety + targetH / 2;
        var rot = -targetr;
        thiscX = Math.cos(rot) * (thiscX - centerX) - Math.sin(rot) * (thiscY - centerY) + centerX;
        thiscY = Math.sin(rot) * (thiscX - centerX) + Math.cos(rot) * (thiscY - centerY) + centerY;
        thisx = thiscX - thisW / 2;
        thisy = thiscY - thisH / 2;
      }
    }
    return thisx < targetx + targetW && targetx < thisx + thisW && thisy < targety + targetH && targety < thisy + thisH;
  },
  /**
   * @method within
   * @param target Thingクラス
   * @param range Number
   * 自分がターゲットから半径range以内にいるかどうかを判定する
   **/
  within: function within(target, range) {
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
    if (this.collisionShape == "box") {
      var thiscX = thisx + thisw / 2;
      var thiscY = thisy + thish / 2;
    } else if (this.collisionShape == "circle") {
      var radius = thisw / 2;
      var thiscX = thisx + radius;
      var thiscY = thisy + radius;
    } else {
      return false;
    }
    if (target.collisionShape == "box") {
      var centerX = targetx + targetw / 2;
      var centerY = targety + targeth / 2;
      var rot = -targetr;
      var cx = Math.cos(rot) * (thiscX - centerX) - Math.sin(rot) * (thiscY - centerY) + centerX;
      var cy = Math.sin(rot) * (thiscX - centerX) + Math.cos(rot) * (thiscY - centerY) + centerY;
      var x, y;
      if (cx < targetx) x = targetx;else if (cx > targetx + targetw) x = targetx + targetw;else x = cx;
      if (cy < targety) y = targety;else if (cy > targety + targeth) y = targety + targeth;else y = cy;
      var a = Math.abs(cx - x);
      var b = Math.abs(cy - y);
    } else if (target.collisionShape == "circle") {
      var tradius = targetw / 2;
      var x = targetx + tradius;
      var y = targety + tradius;
      var a = Math.abs(thiscX - x);
      var b = Math.abs(thiscY - y);
      range += tradius;
    } else {
      return false;
    }
    if (Math.sqrt(a * a + b * b) < range) return true;
    return false;
  },
  /**
   * @method scale
   * @param sx Number
   * @param sy Number
   * オブジェクトを(sx,sy)倍する
   **/
  scale: function scale(sx, sy) {
    if (!this.width) {
      this._scaleX = sx;
      this._scaleY = sy;
    } else {
      this.width *= sx;
      this.height *= sy;
    }
    return this;
  },
  /**
   * @method setSize
   * @param w Number
   * @param h Number
   * オブジェクトを幅w、高さhに設定する
   **/
  setSize: function setSize(w, h) {
    this.width = w;
    this.height = h;
  }
});
/**
 * @class Atlas.Shape
 * @extends Atlas.Thing
 * SVGを描画するためのクラス
 **/
Atlas.Shape = Atlas.createClass(Atlas.Thing, {
  initialize: function initialize(path, color, lineColor) {
    this.inherit(0, 0);
    this.obj = -1;
    this.svgid = -1;
    this._basicConstructor = "Shape";
    this.color = color || "original";
    this.strokeColor = lineColor || "original";
    this.colorStops = [];
    if (this.getExtention(path) != "svg") {
      this.svgid = path;
    } else {
      this.setImage(path);
    }
    this.closeMode = true;
    this.strokeMode = true;
  },
  /**
   * @method setSpriteSize
   * @param width Number
   * @param height Number
   * スプライトの大きさを設定する
   **/
  setSpriteSize: function setSpriteSize(width, height) {
    this.spriteWidth = width;
    this.spriteHeight = height;
  },
  /**
   * @method setImage
   * @param path String
   * ゲームにロードされたSVG画像をロードする
   **/
  setImage: function setImage(path) {
    for (var i = 0, n = svgs.length; i < n; i++) {
      if (path == svgs[i].name) {
        this.obj = i;
      }
    }
  },
  /**
   * @method getImage
   * セットされているSVG画像を取得する
   **/
  getImage: function getImage() {
    return svgs[this.obj];
  },
  /**
   * @method getImageName
   * セットされている画像名を取得する
   **/
  getImageName: function getImageName() {
    return svgs[this.obj].data;
  },
  /**
   * @method parsePolygon
   * @param polygon String
   * SVGのポリゴン要素を解析
   **/
  parsePolygon: function parsePolygon(polygon) {
    var pols = polygon.split(" ");
    var data = [];
    for (var i = 0, n = pols.length - 1; i < n; i++) {
      var pt = pols[i].split(",");
      var x = Number(pt[0]);
      var y = Number(pt[1]);
      var obj = { method: "lineTo", x: x, y: y };
      data.push(obj);
    }
    return data;
  },
  /**
   * @method parsePath
   * @param path String
   * SVGのpath要素を解析
   **/
  parsePath: function parsePath(path) {
    /*SVGのpath要素を解析*/
    var length = { a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0 };
    var segment = /([astvzqmhlc])([^astvzqmhlc]*)/ig;
    var data = [];
    path.replace(segment, function (_, command, args) {
      var type = command.toLowerCase();
      args = args.match(/-?[.0-9]+(?:e[-+]?\d+)?/ig);
      args = args ? args.map(Number) : [];
      if (type == 'm' && args.length > 2) {
        data.push([command].concat(args.splice(0, 2)));
        type = 'l';
        command = command == 'm' ? 'l' : 'L';
      }
      while (true) {
        if (args.length == length[type]) {
          args.unshift(command);
          if (args[0] == "q") {
            var obj = { method: "quadraticCurveBy", cpx: args[1], cpy: args[2], x: args[3], y: args[4] };
          } else if (args[0] == "Q") {
            var obj = { method: "quadraticCurveTo", cpx: args[1], cpy: args[2], x: args[3], y: args[4] };
          } else if (args[0] == "l") {
            var obj = { method: "lineBy", x: args[1], y: args[2] };
          } else if (args[0] == "L") {
            var obj = { method: "lineTo", x: args[1], y: args[2] };
          } else if (args[0] == "m") {
            var obj = { method: "moveBy", x: args[1], y: args[2] };
          } else if (args[0] == "M") {
            var obj = { method: "moveTo", x: args[1], y: args[2] };
          } else if (args[0] == "c") {
            var obj = { method: "bezierCurveBy", cpx1: args[1], cpy1: args[2], cpx2: args[3], cpy2: args[4], x: args[5], y: args[6] };
          } else if (args[0] == "C") {
            var obj = { method: "bezierCurveTo", cpx1: args[1], cpy1: args[2], cpx2: args[3], cpy2: args[4], x: args[5], y: args[6] };
          } else if (args[0] == "h") {
            var obj = { method: "horizontalBy", x: args[1] };
          } else if (args[0] == "H") {
            var obj = { method: "horizontalTo", x: args[1] };
          } else if (args[0] == "v") {
            var obj = { method: "verticalBy", y: args[1] };
          } else if (args[0] == "V") {
            var obj = { method: "verticalTo", y: args[1] };
          } else if (args[0] == "s") {
            var obj = { method: "bezierCurveShortBy", cpx2: args[1], cpy2: args[2], x: args[3], y: args[4] };
          } else if (args[0] == "S") {
            var obj = { method: "bezierCurveShortTo", cpx2: args[1], cpy2: args[2], x: args[3], y: args[4] };
          } else if (args[0] == "t") {
            var obj = { method: "quadraticCurveShortBy", x: args[1], y: args[2] };
          } else if (args[0] == "T") {
            var obj = { method: "quadraticCurveShortTo", x: args[1], y: args[2] };
          } else {
            var obj = {};
          }
          return data.push(obj);
        }
        data.push([command].concat(args.splice(0, length[type])));
      }
    });
    return data;
  },
  /**
   * @method isLoaded
   * @return Boolean
   * 画像がロードされているかを返す
   **/
  isLoaded: function isLoaded() {
    var image = this.getImage();
    if (!image) {
      return true;
    }
    if (image.loaded && this.ctx) {
      return true;
    } else {
      return false;
    }
  },
  /**
   * @method setLinearGradient
   * オブジェクトに対して線形グラデーションを設定する
   **/
  setLinearGradient: function setLinearGradient(x1, y1, x2, y2) {
    var ctx = this.ctx;
    this.gradientStyle = { x1: x1, y1: y1, x2: x2, y2: y2 };
    this.gradientType = 1;
  },
  /**
   * @method setRadialGradient
   * オブジェクトに対して円形グラデーションを設定する
   **/
  setRadialGradient: function setRadialGradient(x1, y1, r1, x2, y2, r2) {
    var ctx = this.ctx;
    if (!x2) {
      x2 = x1;
      y2 = y1;
      r2 = r2;
    }
    this.gradientStyle = { x1: x1, y1: y1, r1: r1, x2: x2, y2: y2, r2: r2 };
    this.gradientType = 2;
  },
  _addColorStops: function _addColorStops(stops) {
    var grad = this.color;
    for (var i = 0, n = stops.length; i < n; i++) {
      var stop = stops[i];
      var color = stop.color;
      grad.addColorStop(stop.offset, color);
    }
    this.color = grad;
  },
  setColorStops: function setColorStops(stops) {
    this.colorStops = stops;
    var style = this.gradientStyle;
    if (this.gradientType == 1) {
      this.color = this.ctx.createLinearGradient(style.x1, style.y1, style.x2, style.y2);
    } else if (this.gradientType == 2) {
      this.color = this.ctx.createRadialGradient(style.x1, style.y1, style.r1, style.x2, style.y2, style.r2);
    }
    this._addColorStops(stops);
  },
  addColorStops: function addColorStops(stops) {
    for (var i = 0, n = stops.length; i < n; i++) {
      this.colorStops.push(stops[i]);
    }
    this._addColorStops(stops);
  },
  removeColorStopAt: function removeColorStopAt(num) {
    this.colorStops.splice(num, 1);
    this.setColorStops(this.colorStops);
  },
  /**
   * @method getGradientType
   * 設定されているグラデーションの種類を取得する
   **/
  getGradientType: function getGradientType() {
    var type = this.gradientType;
    if (type == 1) {
      return "linear";
    } else if (type == 2) {
      return "radial";
    } else {
      return "single";
    }
  },
  _onLoad: function _onLoad() {
    if (this.obj != -1) {
      var svgdoc = svgs[this.obj].getSVGDocument();
      var element = svgdoc.getElementsByTagName("path")[0] || svgdoc.getElementsByTagName("circle")[0] || svgdoc.getElementsByTagName("rect")[0] || svgdoc.getElementsByTagName("polygon")[0];
      var svg = svgdoc.getElementsByTagName("svg")[0];
    } else {
      var svg = document.getElementById(this.svgid);
      var svgdoc = svg;
      var element = svgdoc.getElementsByTagName("path")[0] || svgdoc.getElementsByTagName("circle")[0] || svgdoc.getElementsByTagName("rect")[0] || svgdoc.getElementsByTagName("polygon")[0];
    }
    var color = svg.getElementsByTagName("linearGradient")[0] || svgdoc.getElementsByTagName("radialGradient")[0];
    if (color) {
      var stopsEle = color.getElementsByTagName("stop");
      var stops = [];
      for (var i = 0, n = stopsEle.length; i < n; i++) {
        var ele = stopsEle[i];
        var obj = {};
        obj.offset = ele.getAttribute("offset");
        var styleCol = ele.style.stopColor.toString();
        var op = ele.style.stopOpacity;
        if (op) {
          styleCol = styleCol.replace("rgb", "rgba");
          styleCol = styleCol.replace(")", "," + op + ")");
        }
        obj.color = styleCol;
        stops.push(obj);
      }
      if (color.tagName == "linearGradient") {
        var x1 = Number(color.getAttribute("x1"));
        var x2 = Number(color.getAttribute("x2"));
        var y1 = Number(color.getAttribute("y1"));
        var y2 = Number(color.getAttribute("y2"));
        this.setLinearGradient(x1, y1, x2, y2);
      } else if (color.tagName == "radialGradient") {
        var cx = Number(color.getAttribute("cx"));
        var cy = Number(color.getAttribute("cy"));
        var r = Number(color.getAttribute("r"));
        this.setRadialGradient(cx, cy, 0, cx, cy, r);
      }
      this.setColorStops(stops);
    }
    if (this.color == "original") {
      this.color = element.getAttribute("fill");
    }
    if (this.strokeColor == "original") {
      this.strokeColor == element.getAttribute("stroke");
    }
    if (element.tagName == "path") {
      var path = element.getAttribute("d");
      this.path = this.parsePath(path);
    } else if (element.tagName == "circle") {
      var radius = element.getAttribute("r");
      var array = [];
      array.push({ method: "circle", r: radius });
      this.path = array;
    } else if (element.tagName == "polygon") {
      var points = element.getAttribute("points");
      this.path = this.parsePolygon(points);
    } else if (element.tagName == "rect") {
      var width = element.getAttribute("width");
      var height = element.getAttribute("height");
      var array = [];
      array.push({ method: "rect", width: width, height: height });
      this.path = array;
    }
    if (this.spriteWidth == void 0) {
      this.spriteWidth = parseInt(svg.getAttribute("width"));
      this.spriteHeight = parseInt(svg.getAttribute("height"));
      if (!this.spriteWidth) {
        var viewBox = svg.getAttribute("viewBox");
        if (viewBox) {
          var data = viewBox.split(" ");
          this.spriteWidth = data[2];
          this.spriteHeight = data[3];
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
  },
  /**
   * @method draw
   * オブジェクトを描画する
   **/
  draw: function draw() {
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
      if (method == "moveTo" || method == "horizontalTo" || method == "verticalTo" || method == "quadraticCurveTo" || method == "bezierCurveTo" || method == "lineTo" || method == "bezierCurveShortTo" || method == "quadraticCurveShortTo") {
        /*絶対*/
        tmpx = 0;
        tmpy = 0;
        if (p.x || p.x == 0) {
          x = p.x;
        }
        if (p.y || p.y == 0) {
          y = p.y;
        }
      } else {
        /*相対*/
        tmpx = x;
        tmpy = y;
        if (p.x) {
          x += p.x;
        }
        if (p.y) {
          y += p.y;
        }
      }
      if (method == "circle") {
        var r = p.r;
        ctx.arc(x + r, y + r, r, 0, Math.PI * 2, false);
      } else if (method == "rect") {
        ctx.fillRect(x, y, p.width, p.height);
      } else if (method == "moveTo" || method == "moveBy") {
        ctx.moveTo(x, y);
      } else if (method == "lineTo" || method == "lineBy") {
        ctx.lineTo(x, y);
      } else if (method == "quadraticCurveBy" || method == "quadraticCurveTo") {
        ctx.quadraticCurveTo(tmpx + p.cpx, tmpy + p.cpy, x, y);
        rcpx = 2 * x - (tmpx + p.cpx);
        rcpy = 2 * y - (tmpy + p.cpy);
      } else if (method == "bezierCurveTo" || method == "bezierCurveBy") {
        ctx.bezierCurveTo(tmpx + p.cpx1, tmpy + p.cpy1, tmpx + p.cpx2, tmpy + p.cpy2, x, y);
        rcpx = 2 * x - (tmpx + p.cpx2);
        rcpy = 2 * y - (tmpy + p.cpy2);
      } else if (method == "horizontalTo" || method == "horizontalBy") {
        ctx.lineTo(x, y);
      } else if (method == "verticalTo" || method == "verticalBy") {
        ctx.lineTo(x, y);
      } else if (method == "bezierCurveShortBy" || method == "bezierCurveShortTo") {
        ctx.bezierCurveTo(rcpx, rcpy, tmpx + p.cpx2, tmpy + p.cpy2, x, y);
        rcpx = 2 * x - (tmpx + p.cpx2);
        rcpy = 2 * y - (tmpy + p.cpy2);
      } else if (method == "quadraticCurveShortBy" || method == "quadraticCurveShortTo") {
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
  },
  /**
   * @method getNodeByName
   * SVGに設定されたNode（点）オブジェクトを返す
   **/
  getNodeByName: function getNodeByName(name) {
    var path = this.path;
    for (var i = 0, n = path.length; i < n; i++) {
      var p = path[i];
      if (name == p.name) {
        return p;
      }
    }
    return -1;
  }
});
/**
 * @class Atlas.Shape.Box
 * @extends Atlas.Thing
 * 四角形を描画するためのクラス
 **/
Atlas.Shape.Box = Atlas.createClass(Atlas.Thing, {
  initialize: function initialize(col, width, height) {
    this.inherit(width, height);
    this._basicConstructor = "Shape.Box";
    this.color = col;
  },
  draw: function draw() {
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
  }
});
/**
 * @class Atlas.Shape.Circle
 * @extends Atlas.Thing
 * 円を描画するためのクラス
 **/
Atlas.Shape.Circle = Atlas.createClass(Atlas.Thing, {
  initialize: function initialize(col, radius) {
    this.inherit(radius * 2, radius * 2);
    this._basicConstructor = "Shape.Circle";
    this.color = col;
    this.collisionShape = "circle";
  },
  draw: function draw() {
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
  }
});
/**
 * @class Atlas.Sprite
 * @extends Atlas.Thing
 * 画像等を描画するクラス
 **/
Atlas.Sprite = Atlas.createClass(Atlas.Thing, {
  initialize: function initialize(name, width, height) {
    if (typeof width === "undefined") {
      width = null;
      height = null;
    }
    this.inherit(width, height);
    this.setImage(name, width, height);
    this._basicConstructor = "Sprite";
    this.frame = 0;
    this.alpha = 1;
  },
  /**
   * @method animate
   * フレームを変えてスプライトをアニメーションさせる
   **/
  animate: function animate(array, frameRate, frame) {
    var obj = Tween(this, "animate", frame);
    obj.array = array;
    obj.frameRate = frameRate;
    obj.frameIdx = 0;
    this.mover.push(obj);
    return this;
  },
  _animate: function _animate(obj) {
    if (obj.time == 0) this.frame = obj.array[0];
    if (obj.time % obj.frameRate == 0) {
      obj.frameIdx = (obj.frameIdx + 1) % obj.array.length;
      this.frame = obj.array[obj.frameIdx];
    }
  },
  setSpriteSize: function setSpriteSize(width, height) {
    this.spriteWidth = width;
    this.spriteHeight = height;
  },
  setImage: function setImage(name, width, height) {
    if (width && height) this.setSpriteSize(width, height);
    var length = images.length;
    for (var i = 0; i < length; i++) {
      if (images[i].name == name) this.img = i;
    }
  },
  getImage: function getImage() {
    return images[this.img];
  },
  isLoaded: function isLoaded() {
    var image = this.getImage();
    if (image.loaded && this.ctx) {
      return true;
    } else {
      return false;
    }
  },
  _onLoad: function _onLoad() {
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
  },
  getImageSize: function getImageSize() {
    var obj = {};
    var img = images[this.img];
    obj.width = img.width;
    obj.height = img.height;
    return obj;
  },
  draw: function draw() {
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
    var dx = frame % numX * SizeX;
    var dy = ~~(frame / numX) % numY * SizeY;
    var x = this._x || this.x;
    var y = this._y || this.y;
    var rot = this._rot || this.rot;
    ctx.save();
    ctx.translate(x + cX, y + cY);
    ctx.rotate(rot);
    ctx.translate(-cX, -cY);
    ctx.scale(scaleX, scaleY);
    if (dx != null) ctx.drawImage(image, dx, dy, SizeX, SizeY, 0, 0, SizeX, SizeY);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
});
/**
 * @class Atlas.Map
 * @extends Atlas.Sprite
 **/
Atlas.Map = Atlas.createClass(Atlas.Sprite, {
  initialize: function initialize(name, width, height) {
    this.inherit(name, width, height);
    this.drawData;
    this.hitData;
  },
  intersect: function intersect(ex, ey) {
    var array = this.hitData;
    var x = array[0].length;
    var y = array.length;
    var width = this._width || this.width;
    var height = this._height || this.height;
    var posX = this._x || this.x;
    var posY = this._y || this.y;
    for (var i = 0; i < y; i++) {
      for (var t = 0; t < x; t++) {
        if (array[i][t] == 1 && posX + t * width < ex && ex < posX + (t + 1) * width && posY + i * height < ey && ey < posY + (i + 1) * height) return true;
      }
    }
    return false;
  },
  draw: function draw() {
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
      var frame;
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
            var dx = frame % numX * SizeX;
            var dy = ~~(frame / numX) % numY * SizeY;
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
  }
});
/**
 * @class Atlas.Text
 * @extends Atlas.Util
 **/
Atlas.Text = Atlas.createClass(Atlas.Util, {
  initialize: function initialize(string, col, size, font) {
    this.inherit();
    this._basicConstructor = "Text";
    this.x = 0;
    this.y = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.alpha = 1;
    this.spaceWidth = 7; /*append*/
    if (font) this.font = "'" + font + "'";else this.font = "'Meiryo'";
    if (size) this.size = size + "px";else this.size = "10px";
    if (string) this.string = string;else this.string = "";
    if (col) this.color = col;else this.color = "white";
  },
  setSize: function setSize(size) {
    this.size = size + "px";
  },
  setFont: function setFont(font) {
    this.font = "'" + font + "'";
  },
  intersect: function intersect(ex, ey) {
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
    if (xx < width / 2.0 && yy < height / 2.0) return true;
    return false;
  },
  scale: function scale(x, y) {
    this.scaleX *= x;
    this.scaleY *= y;
  },
  _scaleBy: function _scaleBy(obj) {
    if (obj.time == 0) {
      obj.diffWidth = obj.scaleX - this.scaleX;
      obj.diffHeight = obj.scaleY - this.scaleY;
    }
    this.scaleX = obj.scaleX - obj.diffWidth * (1 - obj.time / obj.frame);
    this.scaleY = obj.scaleY - obj.diffHeight * (1 - obj.time / obj.frame);
  },
  draw: function draw() {
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
  }
});
/**
 * @class Atlas.Group
 * @extends Atlas.Thing
 **/
Atlas.Group = Atlas.createClass(Atlas.Thing, {
  initialize: function initialize() {
    this.children = [];
    this.inherit();
    this.x = 0;
    this.y = 0;
    this._basicConstructor = "Group";
  },
  addChild: function addChild(sprite) {
    sprite.parent = this;
    this.children.push(sprite);
    if (this.parent) {
      sprite.ctx = this.parent.ctx;
      sprite.field = this.parent.field;
      this.parent.children.push(sprite);
    }
  },
  addChildren: function addChildren() {
    for (var i = 0, n = arguments.length; i < n; i++) {
      this.addChild(arguments[i]);
    }
  },
  getChild: function getChild(obj) {
    var array = this.getChildren(obj);
    var ret = array[0];
    if (!ret) ret = null;
    return ret;
  },
  getChildren: function getChildren(obj) {
    var ret = [];
    var children = this.children;
    for (var i = 0, n = children.length; i < n; i++) {
      var flag = true;
      for (var key in obj) {
        if (key == "$not") {
          for (var key2 in obj["$not"]) {
            if (obj["$not"][key2] == children[i][key2]) {
              flag = false;
            }
          }
        } else {
          if (obj[key] != children[i][key]) flag = false;
        }
      }
      if (flag == true) {
        ret.push(children[i]);
      }
    }
    return ret;
  },
  removeChild: function removeChild(obj) {
    var child = this.getChild(obj);
    child.remove();
  },
  removeChildren: function removeChildren(obj) {
    var children = this.getChildren(obj);
    for (var i = 0, n = children.length; i < n; i++) {
      children[i].remove();
    }
  },
  draw: function draw() {}
});
/**
 * @class Atlas.Scene
 * @extends Atlas.Group
 **/
Atlas.Scene = Atlas.createClass(Atlas.Group, {
  initialize: function initialize() {
    this.inherit();
    this._basicConstructor = "Scene";
    this._remove = false;
  },
  addChild: function addChild(sprite) {
    sprite.parent = this;
    if (this.ctx && this.field) {
      sprite.ctx = this.ctx;
      sprite.field = this.field;
    }
    this.children.push(sprite);
    if (sprite._basicConstructor == "Group" || sprite._basicConstructor == "Layer") {
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
  },
  setImage: function setImage(image) {
    this.image = image;
  },
  setColor: function setColor(color) {
    this.color = color;
  },
  _enterFrame: function _enterFrame(e) {
    if (this.enterFrame) this.enterFrame();
    var children = this.children;
    for (var i = 0, n = children.length; i < n; i++) {
      var target = children[i];
      if (target._remove) {
        children.splice(i, 1);
        target = null;
        i--;
        n--;
        continue;
      }
      if (target._basicConstructor == "Sprite" || target._basicConstructor == "Map" || target._basicConstructor == "Shape") {
        if (target.isLoaded() && !target.prepared) {
          target._onLoad();
          if (target.onLoad) {
            /*フックを登録していたら*/
            target.onLoad();
          }
        }
      } /*ロードが終わったオブジェクトの描画準備を完了させる*/
      if (target.useEvent) target.useEvent();
      if (target._enterFrame) target._enterFrame();
      if (target.enterFrame) target.enterFrame();
      if (target.tween) target.tween();
      if (target.visible) {
        target.draw();
      }
    }
  }
});
/**
 * @class Atlas.Layer
 * @extends Atlas.Group
 **/
Atlas.Layer = Atlas.createClass(Atlas.Group, {
  initialize: function initialize() {
    this.inherit();
    this.rot = 0;
    this._basicConstructor = "Layer";
    this.firstWidth = 100;
    this.firstHeight = 100;
    this.height = 100;
    this.width = 100;
    this.scaleX = 1;
    this.scaleY = 1;
  },
  /**
   * @method fitToChildren
   * 登録されたオブジェクトが占める矩形幅にレイヤーのサイズを合わせる
   **/
  fitToChildren: function fitToChildren() {
    var children = this.children;
    var postx = this.x;
    var posty = this.y;
    this.x = null;
    this.y = null;
    this.width = 0;
    this.height = 0;
    for (var i = 0, n = children.length; i < n; i++) {
      var child = children[i];
      var x = child._x || child.x;
      var y = child._y || child.y;
      var width = child._width || child.width;
      var height = child._height || child.height;
      var centerX = x + width / 2;
      var centerY = y + height / 2;
      var rot = child._rot || child.rot;
      rot = rot % (2 * Math.PI);
      if (rot < 0) {
        rot += 2 * Math.PI;
      }
      if (0 <= rot && rot <= Math.PI / 2) {
        var x1 = Math.cos(rot) * (x - centerX) - Math.sin(rot) * (y + height - centerY) + centerX;
        var x2 = Math.cos(rot) * (x + width - centerX) - Math.sin(rot) * (y - centerY) + centerX;
        var y1 = Math.sin(rot) * (x - centerX) + Math.cos(rot) * (y - centerY) + centerY;
        var y2 = Math.sin(rot) * (x + width - centerX) + Math.cos(rot) * (y + height - centerY) + centerY;
      } else if (Math.PI / 2 < rot && rot <= Math.PI) {
        var x1 = Math.cos(rot) * (x + width - centerX) - Math.sin(rot) * (y + height - centerY) + centerX;
        var x2 = Math.cos(rot) * (x - centerX) - Math.sin(rot) * (y - centerY) + centerX;
        var y1 = Math.sin(rot) * (x - centerX) + Math.cos(rot) * (y + height - centerY) + centerY;
        var y2 = Math.sin(rot) * (x + width - centerX) + Math.cos(rot) * (y - centerY) + centerY;
      } else if (Math.PI < rot && rot <= 3 / 2 * Math.PI) {
        var x1 = Math.cos(rot) * (x + width - centerX) - Math.sin(rot) * (y - centerY) + centerX;
        var x2 = Math.cos(rot) * (x - centerX) - Math.sin(rot) * (y + height - centerY) + centerX;
        var y1 = Math.sin(rot) * (x + width - centerX) + Math.cos(rot) * (y + height - centerY) + centerY;
        var y2 = Math.sin(rot) * (x - centerX) + Math.cos(rot) * (y - centerY) + centerY;
      } else if (3 / 2 * Math.PI < rot && rot <= 2 * Math.PI) {
        var x1 = Math.cos(rot) * (x - centerX) - Math.sin(rot) * (y - centerY) + centerX;
        var x2 = Math.cos(rot) * (x + width - centerX) - Math.sin(rot) * (y + height - centerY) + centerX;
        var y1 = Math.sin(rot) * (x + width - centerX) + Math.cos(rot) * (y - centerY) + centerY;
        var y2 = Math.sin(rot) * (x - centerX) + Math.cos(rot) * (y + height - centerY) + centerY;
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
      } else {
        child.x += postx - this.x;
        child.y += posty - this.y;
      }
    }
    return this;
  },
  /**
   * @method releaseChild
   * @param child Atlas.Thingクラス
   * 登録されているオブジェクトを解放する
   **/
  releaseChild: function releaseChild(child) {
    var parent = this.parent;
    child.x = child._x;
    child.y = child._y;
    child.width = child._width;
    child.height = child._height;
    child.rot = child._rot;
    child._x = null;
    child._y = null;
    child._width = null;
    child._height = null;
    child._rot = null;
    child.grouped = false;
    child._leave = false;
    child.parent = parent;
  },
  /**
   * @method releaseAllChildren
   * 登録されているすべてのオブジェクトを解放する
   **/
  releaseAllChildren: function releaseAllChildren() {
    var children = this.children;
    for (var i = 0, n = children.length; i < n; i++) {
      var child = children[i];
      this.releaseChild(child);
    }
    this.children = [];
    this._remove = true;
    return this;
  },
  /**
   * @method removeChildrenByProperty
   * @param obj Object
   * プロパティの値が一致するオブジェクトを削除する
   **/
  removeChildrenByProperty: function removeChildrenByProperty(obj) {
    var children = this.getChildren(obj);
    for (var i = 0, n = children.length; i < n; i++) {
      children[i].remove();
    }
    return this;
  },
  /**
   * @method removeAllChildren
   * 登録されたすべてのオブジェクトを削除する
   **/
  removeAllChildren: function removeAllChildren() {
    var children = this.children;
    var parent = this.parent;
    for (var i = 0, n = children.length; i < n; i++) {
      children[i].remove();
    }
    return this;
  },
  _setAbsPos: function _setAbsPos(child) {
    var centerX = this.width / 2;
    var centerY = this.height / 2;
    var rot = this.rot;
    child.Cx = this.scaleX * child.x + child._width / 2;
    child.Cy = this.scaleY * child.y + child._height / 2;
    child.startRot = true;
    var cx = Math.cos(rot) * (child.Cx - centerX) - Math.sin(rot) * (child.Cy - centerY) + centerX; //this.width/2
    var cy = Math.sin(rot) * (child.Cx - centerX) + Math.cos(rot) * (child.Cy - centerY) + centerY; //this.height/2
    child._x = cx - child._width / 2;
    child._y = cy - child._height / 2;
    child._x += this.x;
    child._y += this.y;
  },
  draw: function draw() {
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
  }
});

exports.default = Atlas;
module.exports = exports['default'];