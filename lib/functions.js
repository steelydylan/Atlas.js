"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var images = [];
var sounds = [];
var svgs = [];
var allLoaded = 0;
exports.addImage = function (img) {
    allLoaded++;
    images.push(img);
};
exports.addSound = function (sound) {
    allLoaded++;
    sounds.push(sound);
};
exports.addSvg = function (svg) {
    allLoaded++;
    svgs.push(svg);
};
exports.finishLoad = function () {
    allLoaded--;
};
exports.isLoaded = function () { return allLoaded === 0; };
exports.getImageAssets = function () {
    return images;
};
exports.getSoundAssets = function () {
    return sounds;
};
exports.getSvgAssets = function () {
    return svgs;
};
exports.isMobile = (function () {
    var userAgent = navigator.userAgent;
    if ((userAgent.indexOf('iPhone') > 0 && userAgent.indexOf('iPad') == -1) || userAgent.indexOf('iPod') > 0 || userAgent.indexOf('Android') > 0) {
        return true;
    }
    return false;
})();
exports.orientation = (function (e) {
    var mq = window.matchMedia('(orientation: portrait)');
    if (mq.matches) {
        return 'portrait';
    }
    return 'landscape';
})();
exports.setKeyState = function (ret, e) {
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
        case 39: // Key[→]
            ret.right = true;
            break;
        case 37: // Key[←]
            ret.left = true;
            break;
        case 38: // Key[↑]
            ret.up = true;
            break;
        case 40: // Key[↓]
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
            //@ts-ignore
            ret[chr] = true;
            break;
        }
    }
};
exports.clearKeyState = function (ret) {
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
        //@ts-ignore
        ret[String.fromCharCode(i + 97)] = false;
    }
};
var keydown = (function () {
    var ret = {};
    exports.clearKeyState(ret);
    return ret;
})();
exports.getKeydown = function () { return keydown; };
exports.Tween = function (that, kind, frame) {
    var mover = that.mover;
    var target = mover[mover.length - 1];
    var obj = {};
    if (target && target.and) {
        obj = target;
    }
    obj.time = 0;
    if (frame) {
        obj.frame = frame;
    }
    obj.loop = false;
    obj.and = false;
    obj[kind] = true;
    return obj;
};
//# sourceMappingURL=functions.js.map