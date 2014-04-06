/**
 * Atlas.js v0.6.6
 * https://github.com/steelydylan/Atlas.js
 * Copyright steelydylan
 * <http://steelydylan.webcrow.jp/>
 * Released under the MIT license.
 */
(function () {
	"use strict";
    var images = [];
    var sounds = [];
    var allLoaded = 0;
    var isMobile = (function(){
        var userAgent = navigator.userAgent;
        if((userAgent.indexOf('iPhone') > 0 && userAgent.indexOf('iPad') == -1) || userAgent.indexOf('iPod') > 0 || userAgent.indexOf('Android') > 0)
            return true;
        else
            return false;
    })();
    var orientation = (function (e){
       var mq = window.matchMedia("(orientation: portrait)");
       var orientation = "";
       if (mq.matches)
           return "portrait";
       else
           return "landscape";
    })();
    var setKeyState = function(ret,ret2,e){
        var which = e.which;
        switch (which) {
            case 13:
                ret.enter = true;
                ret2.enter = true;
            break;
            case 16:
                ret.shift = true;
                ret2.shift = true;
            break;
            case 32:
                ret.space = true;
                ret2.space = true;
            break;
                case 39: // Key[→]
                ret.right = true;
                ret2.right = true;
            break;
            case 37: // Key[←]
                ret.left = true;
                ret2.left = true;
            break;
            case 38: // Key[↑]
                ret.up = true;
                ret2.up = true;
            break;
            case 40: // Key[↓]
                ret.down = true;
                ret2.down = true;
            break;
            case 8:
                ret.backspace = true;
                ret2.backspace = true;
            break;
        }
        for(var i = 0; i < 26; i++){
            if(i + 65 == which){
                var chr = String.fromCharCode(i+97);
                ret[chr] = true;
                ret2[chr] = true;
                break;
            }
        }
    };
    var clearKeyState = function(ret){
        ret.enter = false;
        ret.shift = false;
        ret.space = false;
        ret.right = false;
        ret.left = false;
        ret.up = false;
        ret.down = false;
        ret.backspace = false;
        for(var i = 0; i < 26; i++){
            ret[String.fromCharCode(i+97)] = false;
        } 
    };
    var keydown = (function(){       
        var ret = new Object();
        clearKeyState(ret);
        return ret;
    })();
    var Atlas = function () {
        for(var key in Atlas){
            window[key] = Atlas[key];
        }
    };
    Atlas.createClass = function (superClass, obj) {
        var newClass = function () {
            this.initialize.apply(this, arguments);
        };
        if (typeof superClass == "function" && typeof obj == "object") {
            newClass.prototype = Object.create(superClass.prototype);
            newClass.prototype.inherit = function () {                
                this.initialize = this.superClass.prototype.initialize;
                this.superClass = this.superClass.prototype.superClass;
                if(this.initialize)
                    this.initialize.apply(this, arguments);
            };
        } else if (typeof superClass == "object" && obj == null) {
            obj = superClass;
        }
        for (var key in obj) {
            newClass.prototype[key] = obj[key];
        }
        newClass.prototype.superClass = superClass;
        return newClass;
    };
    Atlas.extendClass = function (targetclass,obj){
        for(var key in obj){
            /*if(!targetclass.prototype[key])*/
            targetclass.prototype[key] = obj[key];
        }
    };
    var Tween = function(that,kind,frame){
        var mover = that.mover;
        var target = mover[mover.length - 1];
        if(target && target.and){
            var obj = target;
        }else{
            var obj = new Object();
            mover.push(obj);
        }
        obj.time = 0;
        if(frame)
            obj.frame = frame;
        obj.loop = false;
        obj.and = false;
        obj[kind] = true;
        return obj;
    };
    var Util = Atlas.createClass({
        isMobile: isMobile,
        orientation: orientation,
        initialize: function(){
            this.eventListener = new Object();
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
        tween: function(){
            var mover = this.mover;
            var length = mover.length;
            if(this.moverIndex < length){           
                var obj = mover[this.moverIndex];
                if(obj.animate)
                    this._animate(obj);
                if(obj.moveTo)
                    this._moveTo(obj);
                if(obj.moveBy)
                    this._moveBy(obj);   
                if(obj.rotateBy)
                    this._rotateBy(obj); 
                if(obj.scaleBy)
                    this._scaleBy(obj);
                if(obj.then)
                    this._then(obj);
                obj.time++;         
                if(obj.time > obj.frame){
                    this.moverIndex++;
                    if(this.moverIndex == length){
                        if(obj.loop)
                            this._refresh();
                        else 
                            this.stop();
                    }
                }
            }
        },
        isQueEmpty:function(){
            return this.mover.length ? false : true;
        },
        _refresh: function(){
            this.moverIndex = 0;
            var mover = this.mover;
            for(var i = 0, n = mover.length; i < n; i++){
                var obj = mover[i];
                if(obj.time)
                    obj.time = 0;
            }
        },
        moveTo: function(x,y,frame){
            var obj = Tween(this,"moveTo",frame);
            obj.toX = x;
            obj.toY = y;
            return this;
        },
        _moveTo : function(obj){
            if(obj.time == 0){
                obj.diffX = obj.toX - this.x;
                obj.diffY = obj.toY - this.y;
            }
            this.x = obj.toX - obj.diffX * (1 - obj.time / obj.frame);
            this.y = obj.toY - obj.diffY * (1 - obj.time / obj.frame);
        },
        moveBy: function(x,y,frame){
            var obj = Tween(this,"moveBy",frame);
            obj.diffX = x;
            obj.diffY = y;
            return this;
        },
        _moveBy: function(obj){
            if(obj.time == 0){
                obj.toX = this.x + obj.diffX;
                obj.toY = this.y + obj.diffY;
            }
            this.x = obj.toX - obj.diffX * (1 - obj.time / obj.frame);
            this.y = obj.toY - obj.diffY * (1 - obj.time / obj.frame);
        },
        delay: function(frame){
            var obj = Tween(this,"delay",frame);
            this.mover.push(obj);
            return this;
        },
        and : function(){
            var mover = this.mover;
            var target = mover[mover.length - 1];
            if(target)
                target.and = true;
            return this;
        },
        stop : function(){
            this.mover  = [];
            this.moverIndex = 0;
            return this;
        },
        loop : function(){
            var obj = this.mover[this.mover.length-1];
            obj.loop = true;
            return this;
        },
        rotateBy : function(angle,frame){
            var obj = Tween(this,"rotateBy",frame);
            obj.diffAngle = angle;
            return this;
        },
        _rotateBy : function(obj){
            if(obj.time == 0)
                obj.toAngle = this.rot + obj.diffAngle;
            this.rot = obj.toAngle - obj.diffAngle * (1 - obj.time / obj.frame);
        },
        then : function(fn,frame){
            var obj = Tween(this,"then",frame);
            obj.exec = fn;
            return this;
        },
        _then : function(obj){      
            obj.exec.call(this);
        },
        scaleBy: function(x,y,frame){
            var obj = Tween(this,"scaleBy",frame);
            obj.scaleX = x;
            obj.scaleY = y;
            return this;
        },
        setPosition: function (x, y) {
            this.x = x;
            this.y = y;
            return this;
        },
        saveData: function(key){
            var obj = new Object();
            for(var i in this){
                if(typeof(this[i]) != 'function')
                    obj[i] = this[i];
            }
            localStorage.setItem(key,JSON.stringify(obj));          
        },
        getData: function(key){
            var obj = JSON.parse(localStorage.getItem(key));
            for(var i in obj)
                this[i] = obj[i];
        },
        getTouchPosition: function (e,num) {
            if(!(num && e.touches[num]))
                num = 0;
            var field = this.field;
            var rateX = parseInt(field.width) / parseInt(field.style.width);
            var rateY = parseInt(field.height) / parseInt(field.style.height);
            var obj = new Object();
            var margin = field.getBoundingClientRect();
            var x = parseInt(margin.left);
            var y = parseInt(margin.top);
            if (isNaN(x))
                x = 0;
            if (isNaN(y))
                y = 0;
            var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
            var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
            if (e) {
                if (!isMobile || (isMobile && e.touches[num])) {
                    obj.x = (isMobile ? e.touches[num].pageX : e.pageX) - x - scrollX;
                    obj.y = (isMobile ? e.touches[num].pageY : e.pageY) - y - scrollY;
                } else {
                    obj.x = -1;
                    obj.y = -1;
                }
            }else{
                obj.x = event.x - x;
                obj.y = event.y - y;
            }
            obj.x = parseInt(obj.x * rateX);
            obj.y = parseInt(obj.y * rateY);
            return obj;
        },
        getMultiTouchPosition: function(e){
            var length = e.touches.length;
            var pos = [];
            for(var i = 0; i < length; i++){
                pos[i] = this.getTouchPosition(e,i);
            }
            return pos;
        },
        handleEvent: function(e) {
            if(this.eventEnable){
                e.preventDefault();
                var pos = this.getTouchPosition(e); 
                if(e.touches)
                    pos.touchCount = e.touches.length;
                else
                    pos.touchCount = 1;
                pos.event = e; 
                var type = e.type;              
                if(type == "keydown" || type == "keyup"){
                    var keyup = new Object();
                    for(var i in keydown)
                        keyup[i] = keydown[i];
                    setKeyState(keyup,keydown,e);
                }
                switch (type) {
                    case 'touchstart': if(this.multiTouchStart && e.touches.length > 1)
                                           this.multiTouchStart(this.getMultiTouchPosition(e));
                                       else if(this.touchStart)
                                           this.touchStart(pos); 
                                       break;
                    case 'mousedown': if(this.touchStart)this.touchStart(pos); break;
                    case 'touchmove': if(this.multiTouchMove && e.touches.length > 1)
                                           this.multiTouchMove(this.getMultiTouchPosition(e));
                                      else if(this.touchMove)
                                           this.touchMove(pos); 
                                      break;
                    case 'mousemove': if(this.touchMove)this.touchMove(pos); break;
                    case 'touchend': if(this.multiTouchEnd && e.touches.length > 1)
                                           this.multiTouchEnd(this.getMultiTouchPosition(e));
                                      else if(this.touchEnd)
                                           this.touchEnd(pos); 
                                      break;
                    case 'mouseup': if(this.touchEnd)this.touchEnd(); break;
                    case 'keydown': if(this.keyDown)this.keyDown(keydown); break;
                    case 'keyup': if(this.keyUp)this.keyUp(keyup);break;
                }
            }
        },
        useEvent: function(){
            var field = this.field;
            var eventListener = this.eventListener;
            if(this.touchStart && eventListener.touchStart == false){
                if(isMobile)
                    field.addEventListener("touchstart",this,false);
                else
                    field.addEventListener("mousedown",this,false);
                eventListener.touchStart = true;
                }
            if(this.touchMove && eventListener.touchMove == false){
                if(isMobile)
                    field.addEventListener("touchmove",this,false);
                else
                    field.addEventListener("mousemove",this,false);
                eventListener.touchMove = true;
            }
            if(this.touchEnd && eventListener.touchEnd == false){
                if(isMobile)
                    field.addEventListener("touchend",this,false);
                else
                    field.addEventListener("mouseup",this,false);
                eventListener.touchEnd = true;
            }
            if(this.multiTouchStart && eventListener.multiTouchStart == false){
                if(!eventListener.touchStart){
                    if(isMobile)
                        field.addEventListener("touchstart",this,false);
                    else
                        field.addEventListener("mousedown",this,false);
                }
                eventListener.touchStart = true;
            }
            if(this.multiTouchMove && eventListener.multiTouchMove== false){
                if(!eventListener.touchMove){
                    if(isMobile)
                        field.addEventListener("touchmove",this,false);
                    else
                        field.addEventListener("mousemove",this,false);
                }
                eventListener.touchMove = true;
            }
            if(this.multiTouchEnd && eventListener.multiTouchEnd == false){
                if(!eventListener.touchEnd){
                    if(isMobile)
                        field.addEventListener("touchend",this,false);
                    else
                        field.addEventListener("mouseup",this,false);
                }
                eventListener.touchEnd = true;
            }              
            if(this.keyUp && eventListener.keyUp == false){
                field.addEventListener("keyup",this,false);
                eventListener.keyUp = true;
            }
            if(this.keyDown && eventListener.keyDown == false){
                field.addEventListener("keydown",this,false);
                eventListener.keyDown = true;
            }
        },
        remove: function(){
            this._remove = true;
        },
        getRand: function (a, b) {
            return ~~(Math.random() * (b - a + 1)) + a;
        },
        getSound: function (name) {
            for (var i = 0, n = sounds.length; i < n; i++) {
                if (name == sounds[i].name)
                    this.sound = new Audio(sounds[i].src);
            }
        },
        soundClonePlay: function () {
            var sound = this.sound;
            if (sound) {
                (new Audio(sound.src)).play();
            }
        },
        soundLoopPlay: function () {
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
        soundReplay: function () {
            var sound = this.sound;
            if (sound) {
                sound.load();
                sound.play();
            }
        },
        soundStop: function () {
            var sound = this.sound;
            if (!sound.paused) {
                sound.pause();
                sound.currentTime = 0;
            } else {
                sound.load();
            }
        },
        soundPlay: function () {
            var sound = this.sound;
            if (sound)
                sound.play();
        },
        soundPause: function () {
            var sound = this.sound;
            if (sound)
                sound.pause();
        },
        soundGetCount: function () {
            var sound = this.sound;
            if (sound)
                return sound.currentTime;
        },
        soundSetCount: function (time) {
            var sound = this.sound;
            if (sound)
                sound.currentTime = time;
        },
        soundGetVolume: function () {
            var sound = this.sound;
            if (sound)
                return sound.volume;
        },
        soundSetVolume: function (volume) {
            var sound = this.sound;
            if (sound)
                sound.volume = volume;
        },
        soundGetAlltime: function () {
            var sound = this.sound;
            if (sound)
                return sound.duration;
        },
        soundIsPlaying: function () {
            var sound = this.sound;
            if (sound)
                return !sound.paused;
        }
    });
    var Scene = Atlas.createClass(Array, {
        initialize: function () {
            this.inherit();
            this._basicConstructor = "Scene";
            this._remove = false;
        },
        addChild: function(sprite){
            sprite.parent = this;
            //for Group
            if(sprite.children){
                var children = sprite.children;
                for(var i = 0,n = children.length; i < n; i++){
                    var child = children[i];
                    child.ctx = this.ctx;
                    child.field = this.field;
                }
            }
            if(this.ctx && this.field){
                sprite.ctx = this.ctx;
                sprite.field = this.field;
            }
            this.push(sprite);
        },
        addChildren: function () {
            for(var i = 0, n = arguments.length; i < n; i++){
                this.addChild(arguments[i]);
            }
        },
        getChild: function(obj){    
            var array = this.getChildren(obj);
            var ret = array[0];
            if(!ret)
                ret = null; 
            return ret;
        },
        getChildren: function(obj){    
            var ret = [];       
            for(var i = 0, n = this.length; i < n; i++){
                var flag = true;
                for(var key in obj){
                    if(obj[key] != this[i][key])
                        flag = false;
                }
                if(flag == true){
                    ret.push(this[i]);
                }
            }
            return ret;
        },
        remove: function(){
            this._remove = true;
        },
        setImage : function(image){
            this.image = image;
        },
        setColor : function(color){
            this.color = color;
        },
        _enterFrame: function (e) {
            if(this.enterFrame)
                this.enterFrame();
            for (var i = 0, n = this.length; i < n; i++) {
                var target = this[i];
                if(target._basicConstructor == "Sprite"){
	                var obj = target.getImageSize();
	                if(obj.width){
		                target.setSpriteSize(obj.width,obj.height);
		                if(!target.width){
		                	target.setSize(obj.width,obj.height);
		                	if(target._scaleX){
			                	target.scale(target._scaleX,target._scaleY);
		                	}
		                }
		            }
                }
                if(target.useEvent)
                    target.useEvent();
                if(target.enterFrame)
                    target.enterFrame();
                if(target.tween)
                    target.tween();
                if(target.visible){
                    if(target.preDraw)
                        target.preDraw();
                    target.draw();
                }
                if (target._remove) {
                    this.splice(i, 1);
                    target = null;
                    i--;
                    n--;
                }
            }
        }
    });
    var App = Atlas.createClass(Util,{
        initialize: function (place) {
            this.inherit();
            this._basicConstructor = "App";
            var css = document.createElement("style");
            css.media = 'screen';
            css.type = "text/css";
            document.getElementsByTagName("head")[0].appendChild(css);
            var field;
            if(place){
                field = document.getElementById(place);
            }else{
                field = document.createElement("canvas");
                var Body = document.getElementsByTagName("body").item(0);
                Body.appendChild(field); 
            }
            field.width = 320;
            field.height = 480;
            field.style.top = 0+"px";
            field.style.left = 0+"px";
            field.tabIndex = '1';
            document.body.style.margin = "0em";
            var userAgent = navigator.userAgent;
            if (isMobile) {
                field.style.width = window.innerWidth+"px";//mobile default
                field.style.height = window.innerHeight+"px";//mobile default
                field.addEventListener("touchstart",function(){this.focus()});
            } else {
                field.style.width = 480+"px";
                field.style.height = 620+"px"; 
                field.addEventListener("mousedown",function(){this.focus()});
                field.addEventListener("keyup",function(){clearKeyState(keydown);},false);
            }
            this._css = css;
            this.field = field;
            this.ctx = field.getContext('2d');
            this.fps = 30;// fps default
            this.scene = new Scene();
            this.scene.ctx = this.ctx;
            this.scene.field = this.field; 
            this.scene.parent = this;
        },
        colorToAlpha : function(imagename,hex){
            var img;
            for(var i = 0,n = images.length; i < n; i++){
                if(images[i].name == imagename){
                    img = images[i];
                    img.hex = hex;
                    img.index = i;
                }
            }
            img.addEventListener("load",function(){
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext('2d') ;
                var width = this.width;
                var height = this.height;
                var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
                var hex = this.hex.replace(shorthandRegex, function(m, r, g, b) {
                    return r + r + g + g + b + b;
                });
                var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                var color = result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : null;
                ctx.drawImage(this, 0, 0);   
                var ImageData = ctx.getImageData(0,0,width,height);
                var data = ImageData.data;
                for(var i=0;i<height;i++){
                    for(var j=0;j<width;j++){
                        var t = i*(width*4) + (j*4);
                        if(data[t] == color.r && data[t + 1] == color.g && data[t + 2] == color.b) 
                            data[t + 3] = 0;
                    }
                }
                ctx.putImageData(ImageData,0,0);//put image data back
                var newimg = new Image();
                newimg.src = canvas.toDataURL();
                images[this.index] = newimg;
            });
        },
        addChild: function(child){
            child.ctx = this.ctx;
            child.field = this.field;
            this.scene.addChild(child);
        },
        addChildren: function(){
            for(var i = 0,n = arguments.length; i < n; i++)
                this.addChild(arguments[i]);
        },
        centerize: function () {
            var style = this.field.style;
            style.marginTop = - parseInt(style.height) / 2+"px";
            style.marginLeft = - parseInt(style.width) / 2+"px";
            style.top = '50%';
            style.left = '50%';
            style.position = 'absolute';
        },
        fitWindow: function () {
            this.setSize(window.innerWidth, window.innerHeight);
            var that = this;
            window.onresize = function () {
                that.setSize(window.innerWidth, window.innerHeight);
            };
        },
        setQuality: function (width, height) {
            var field = this.field;
            field.width = width;
            field.height = height;
        },
        setSize: function (width, height) {
            var style = this.field.style;
            style.width = width+"px";
            style.height = height+"px";
        },       
        loadingScene: function (scene) {
            this.preScene = scene;
            this.preScene.parent = this;
        },
        _preLoadEnterFrame: function(){
            var field = this.field;
            this.useEvent();
            var ctx = this.ctx;
            ctx.clearRect(0, 0, field.width, field.height);
            if (allLoaded > 0 && this.preScene){
                this.preScene._enterFrame();
            }else{
                if(this.onLoad)
                    this.onLoad(); 
                var children = this.scene;
                for(var i = 0,n = children.length; i < n; i++){
                    var child = children[i];
                    if(child.onLoad)
                        child.onLoad();
                } 
                clearInterval(this.preLoadInterval);
                var that = this;            
                setInterval(function () {
                    that._enterFrame();
                }, 1000 / this.fps);
            }    
        },
        _enterFrame : function(){
            var field = this.field;
            this.ctx.clearRect(0, 0, field.width, field.height);
            this.useEvent();
            if(this.enterFrame)
                this.enterFrame();           
            this.scene._enterFrame();
        },
        pushScene: function(scene){
            var ctx = this.ctx;
            var field = this.field;
            var children = this.scene;
            for(var i = 0,n = children.length; i < n; i++){
                var target = children[i];
                target.eventEnable = false;
                if(target.onSceneremoved)
                    target.onSceneRemoved();
            }
            for(var i = 0,n = scene.length; i < n; i++){
                var obj = scene[i];
                obj.ctx = ctx;
                obj.field = field;
                obj.eventEnable = true;
                if(obj.onScenePushed)
                    obj.onScenePushed();
            }
            scene.parent = this;
            scene.ctx = ctx;
            scene.field = field;
            var style = this.field.style;
            style.background = null;
            style.backgroundColor = "white";
            if(scene.color)
                this.setColor(scene.color);
            if(scene.image)
                this.setImage(scene.image);
            this.scene = scene;
        },
        setColor: function(color){
            var style = this.field.style;
            style.background = null;
            style.backgroundColor = color;
        },
        setImage: function(img){
            var style = this.field.style;
            style.background = "url("+img+") no-repeat center";
            style.backgroundSize = "cover";
        },
        start: function () {
            var field = this.field;
            var that = this;
            this.ctx.clearRect(0,0,field.width,field.height);
            this.preLoadInterval = setInterval(function () {
                that._preLoadEnterFrame();
            }, 1000 / this.fps);
        },
        load: function () {
            function getExtention(fileName) {
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
            for (var i = 0, n = arguments.length; i < n; i++) {
                var obj = arguments[i];
                if(obj instanceof Array){
                    var data = obj[0];
                    var name = obj[1];
                }else{
                    var data = obj;
                    var name = obj;
                }
                var ext = getExtention(data);
                if (ext == 'wav' || ext == 'mp3' || ext == 'ogg') {
                    var obj = new Audio(data);
                    obj.name = name;
                    allLoaded++;
                    obj.addEventListener("canplaythrough", function () {
                        allLoaded--;
                        console.log(this.src + " is loaded");
                    });
                    sounds.push(obj);
                } else if(ext == "TTF" || ext == "ttf"){
                    var css = this._css;
                    var rule =  document.createTextNode("@font-face{"+
                    "font-family:'"+name+"';"+
                    "src: url('"+data+"') format('truetype');"+
                    "}");
                    if(css.styleSheet)
                        css.styleSheet.cssText = rule;
                    else
                        css.appendChild(rule);
                } else {
                    var obj = new Image();
                    obj.src = data;
                    obj.name = name;
                    allLoaded++;
                    obj.addEventListener("load",function () {
                        allLoaded--;
                        console.log(this.src + ' is loaded');
                    });
                    images.push(obj);
                }
            }
        },
    });
    var Thing = Atlas.createClass(Util,{
        initialize: function(width,height){
            this.inherit();
            this.x = 0;
            this.y = 0;
            this._remove = false;
            this.width = width;
            this.height = height; 
            this.collisionShape = "box";
            this.alpha = 1;  
            this.field;        
        },
        _scaleBy: function(obj){
            if(obj.time == 0){
                obj.toWidth = this.width * obj.scaleX;
                obj.toHeight = this.height * obj.scaleY;
                obj.diffWidth = obj.toWidth - this.width;
                obj.diffHeight = obj.toHeight - this.height;
            }
            this.width = obj.toWidth - obj.diffWidth * (1 - obj.time / obj.frame);
            this.height = obj.toHeight - obj.diffHeight * (1 - obj.time / obj.frame);           
        },
        intersect: function (ex, ey) {
            var thisx = this.x;
            var thisy = this.y;
            if(this.parent.className == "Group"){
                thisx += this.parent.x;
                thisy += this.parent.y;
            }
            if (this.collisionShape == "box") {
                var x = ex - (thisx + this.width / 2);
                var y = ey - (thisy + this.height / 2);
                var r = this.rot;
                var s = Math.sin(-r);
                var c = Math.cos(-r);
                var xx = Math.abs(x * c - y * s);
                var yy = Math.abs(x * s + y * c);
                if (xx < this.width / 2.0 && yy < this.height / 2.0)
                    return true;
                return false;
            } else if (this.collisionShape == "circle") {
                var radius = this.width / 2;
                var x = ex - (thisx + radius);
                var y = ey - (thisy + radius);
                if (Math.sqrt(x * x + y * y) < radius)
                    return true;
                return false;
            } else {
                return false;
            }
        },
        within: function (target, range) {
            var thisx = this.x;
            var thisy = this.y;
            if(this.parent._basicConstructor == "Group"){
                thisx += this.parent.x;
                thisy += this.parent.y;
            }
            if (this.collisionShape == "box") {
                var thiscX = thisx + this.width / 2;
                var thiscY = thisy + this.height / 2;
            } else if (this.collisionShape == "circle") {
                var radius = this.width / 2;
                var thiscX = thisx + radius;
                var thiscY = thisy + radius;
            } else {
                return false;
            }
            if (target.collisionShape == "box") {
                var centerX = target.x + target.width / 2;
                var centerY = target.y + target.height / 2;
                var rot = -target.rot;
                var cx = Math.cos(rot) * (thiscX - centerX) -
                    Math.sin(rot) * (thiscY - centerY) + centerX;
                var cy = Math.sin(rot) * (thiscX - centerX) +
                    Math.cos(rot) * (thiscY - centerY) + centerY;
                var x, y;
                if (cx < target.x)
                    x = target.x;
                else if (cx > target.x + target.width)
                    x = target.x + target.width;
                else
                    x = cx;
                if (cy < target.y)
                    y = target.y;
                else if (cy > target.y + target.height)
                    y = target.y + target.height;
                else
                    y = cy;
                var a = Math.abs(cx - x);
                var b = Math.abs(cy - y);
            } else if (target.collisionShape == "circle") {
                var tradius = target.width / 2;
                var x = target.x + tradius;
                var y = target.y + tradius;
                var a = Math.abs(thiscX - x);
                var b = Math.abs(thiscY - y);
                range += tradius;
            } else {
                return false;
            }
            if (Math.sqrt((a * a) + (b * b)) < range)
                return true;
            return false;
        },
        scale: function (sx, sy) {
        	if(!this.width){
	        	this._scaleX = sx;
	        	this._scaleY = sy;
        	}else{
	            this.width *= sx;
	            this.height *= sy;
	        }
            return this;
        },
        setSize : function(w,h){
	        this.width = w;
	        this.height = h;
        }
    });
    var Shape = new Object();
    Shape.Box = Atlas.createClass(Thing, {
        initialize: function (col, width, height) {
            this.inherit(width,height);
            this._basicConstructor = "Shape";            
            this.color = col;
        },
        draw: function () {
            var ctx = this.ctx;
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.fillStyle = this.color;
            var moveX = this.x + this.width / 2;
            var moveY = this.y + this.height / 2;
            ctx.save();
            ctx.translate(moveX, moveY);
            ctx.rotate(this.rot);
            ctx.translate(-moveX, -moveY);
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.restore();
            ctx.globalAlpha = 1;
        }
    });
    Shape.Circle = Atlas.createClass(Thing, {
        initialize: function (col, radius) {
            this.inherit(radius * 2,0);
            this._basicConstructor = "Shape";
            this.color = col;
            this.collisionShape = "circle";
        },
        draw: function () {
            var ctx = this.ctx;
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.fillStyle = this.color;
            var plus = this.width / 2;
            ctx.arc(this.x + plus, this.y + plus, plus, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    });
    var Sprite = Atlas.createClass(Thing, {
        initialize: function (name, width, height) {
        	if(typeof width === "undefined"){
	        	width = null;
	        	height = null;
        	}
            this.inherit(width,height);
            this.setImage(name,width,height);
            this._basicConstructor = "Sprite";
            this.frame = 0;
            this.alpha = 1;
        },
        animate: function(array,frameRate,frame){
            var obj = Tween(this,"animate",frame);
            obj.array = array;
            obj.frameRate = frameRate;
            obj.frameIdx = 0;
            return this;
        },
        _animate: function(obj){
            if(obj.time == 0)
                this.frame = obj.array[0];
            if(obj.time % obj.frameRate == 0){
                obj.frameIdx = (obj.frameIdx + 1) % obj.array.length;
                this.frame = obj.array[obj.frameIdx];
            }
        },
        setSpriteSize:function (width,height){
            this.spriteWidth = width;
            this.spriteHeight = height;
        },
        setImage: function (name,width,height) {
            if(width && height)
                this.setSpriteSize(width,height);
            var length = images.length;
            for (var i = 0; i < length; i++)
                if (images[i].name == name)
                    this.img = i;
        },
        getImage : function(){
            return images[this.img];
        },
        getImageSize : function(){
	      	var obj = {};
	      	var img = images[this.img];
	      	obj.width = img.width;
	      	obj.height = img.height;
	      	return obj;  
        },
        draw: function () {
            var ctx = this.ctx;
            ctx.globalAlpha = this.alpha;
            ctx.globalCompositeOperation = this.drawMode;
            var frame = this.frame;
            var image = images[this.img];
            var SizeX = this.spriteWidth;
            var SizeY = this.spriteHeight;
            var cX = this.width / 2;
            var cY = this.height / 2;
            var numX = image.width / SizeX;
            var numY = image.height / SizeY;
            var scaleX = this.width / SizeX;
            var scaleY = this.height / SizeY;
            var dx = (frame % numX) * SizeX;
            var dy = (~~(frame / numX) % numY) * SizeY;
            ctx.save();
            ctx.translate(this.x + cX, this.y + cY);
            ctx.rotate(this.rot);
            ctx.translate(-cX, -cY);
            ctx.scale(scaleX, scaleY);
            if(dx != null)
                ctx.drawImage(image, dx, dy, SizeX, SizeY, 0, 0, SizeX, SizeY);
            ctx.restore();
            ctx.globalAlpha = 1;
        }
    });
    var Map = Atlas.createClass(Sprite, {
        initialize: function (name, width, height) {
            this.inherit(name,width,height);
            this.drawData;
            this.hitData;
        },
        intersect: function (ex, ey) {
            var array = this.hitData;
            var x = array[0].length;
            var y = array.length;
            var width = this.width;
            var height = this.height;
            var posX = this.x;
            var posY = this.y;
            for (var i = 0; i < y; i++) {
                for (var t = 0; t < x; t++) {
                    if (array[i][t] == 1 && posX + t * width < ex && ex < posX + (t + 1) * width
                       && posY + i * height < ey && ey < posY + (i + 1) * height)
                        return true;
                }
            }
            return false;
        },
        draw: function () {
            var array = this.drawData;
            var x = array[0].length;
            var y = array.length;
            var width = this.width;
            var height = this.height;
            var px = this.x;
            var py = this.y;
            var i = 0;
            var t = 0;
            var field = this.field;
            var ctx = this.ctx;
            var fieldHeight = field.height;
            var fieldWidth = field.width;
            var frame;
            var image = images[this.img];
            var SizeX = this.spriteWidth;
            var SizeY = this.spriteHeight;
            var cX = this.width / 2;
            var cY = this.height / 2;
            var numX = image.width / SizeX;
            var numY = image.height / SizeY;
            var scaleX = this.width / SizeX;
            var scaleY = this.height / SizeY;
            var dx = (frame % numX) * SizeX;
            var dy = (~~(frame / numX) % numY) * SizeY;
            while (i < y) {
                while (t < x) {
                    frame = array[i][t];
                    if (frame >= 0 && fieldHeight > py + height * i && py + height * (i + 1) > 0 && fieldWidth > px + width * t && px + width * (t + 1) > 0) {
                        var dx = (frame % numX) * SizeX;
                        var dy = (~~(frame / numX) % numY) * SizeY;
                        ctx.save();
                        ctx.translate(this.x, this.y);
                        ctx.scale(scaleX, scaleY);
                        ctx.drawImage(image, dx, dy, SizeX, SizeY, 0, 0, SizeX, SizeY);
                        ctx.restore();
                    }
                    this.x += width;
                    t++;
                }
                this.y += height;
                i++;
                this.x = px;
                t = 0;
            }
            this.x = px;
            this.y = py;
        }
    });
    var Text = Atlas.createClass(Util,{
        initialize : function (string, col, size, font) {
            this.inherit();
            this._basicConstructor = "Text";
            this.x = 0;
            this.y = 0;
            this.scaleX = 1;
            this.scaleY = 1;
            this.alpha = 1;
            this.spaceWidth = 0;
            if (font)
                this.font = "'" + font + "'";
            else
                this.font = "'Meiryo'";
            if (size)
                this.size = size + "px";
            else
                this.size = "10px";
            if (string)
                this.string = string;
            else
                this.string = "";
            if (col)
                this.color = col;
            else
                this.color = "white";
        },
        setSize: function (size) {
            this.size = size + "px";
        },
        setFont: function (font) {
            this.font = "'" + font + "'";
        },
		intersect: function(ex,ey){
			var thisx = this.x;
			var thisy = this.y;
			var width = parseInt(this.size) * this.scaleX * this.string.length;
			var height = parseInt(this.size) * this.scaleY;
	        var x = ex - (thisx + width / 2);
	        var y = ey - (thisy + height / 2);
	        var r = this.rot;
	        var s = Math.sin(-r);
	        var c = Math.cos(-r);
	        var xx = Math.abs(x * c - y * s);
	        var yy = Math.abs(x * s + y * c);
	        if (xx < width / 2.0 && yy < height / 2.0)
	            return true;
	        return false;
	    },
        scale: function(x,y){
            this.scaleX *= x;
            this.scaleY *= y;
        },
        _scaleBy: function(obj){
            if(obj.time == 0){
                obj.diffWidth = obj.scaleX - this.scaleX;
                obj.diffHeight = obj.scaleY - this.scaleY;
            }
            this.scaleX = obj.scaleX - obj.diffWidth * (1 - obj.time / obj.frame);
            this.scaleY = obj.scaleY - obj.diffHeight * (1 - obj.time / obj.frame)     
        },
        draw: function () {
            var x = this.x;
            var y = this.y;
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
            ctx.translate(x + cX,y + cY);
            ctx.rotate(this.rot);
            ctx.translate(-cX,-cY);
            ctx.scale(scaleX,scaleY);
            for (var i = 0; i < length; i++) {
                ctx.fillText(strings[i], 0, height);
                y += height;
            }
            ctx.restore();
            ctx.globalAlpha = 1;
        }
    });
    var Input = Atlas.createClass(Text,{
        initialize : function(image,width,height,col,font){
            this.inherit("",col,height-5,font);
            this.box = new Atlas.Sprite(image);
            this.box.width = width;
            this.box.height = height;
            var element = document.createElement('input');
            element.style.position = "absolute";
            element.style.zIndex = -1;
            element.parent = this;
            var Body = document.getElementsByTagName("body").item(0);
            Body.appendChild(element);
            this.element = element;
            element.addEventListener('input', 
                function() {
                    var parent = this.parent;
                    var ctx = parent.ctx;
                    var tmp = this.value;
                    while(ctx.measureText(tmp).width > parent.box.width){
                        tmp = tmp.slice(1,tmp.length);
                    }
                    parent.string = tmp;
                }
            );
        },
        onLoad : function(){
            this.element.style.top = this.field.style.top;
            this.element.style.left = this.field.style.left;
            this.element.style.marginTop = this.field.style.marginTop;
            this.element.style.marginLeft = this.field.style.marginLeft;
            var box = this.box;
            var img = box.getImage();
            box.setSpriteSize(img.width,img.height);
            box.field = this.field;
            box.ctx = this.ctx;
            box.setPosition(this.x,this.y);
            this.parent.addChild(box);
        },
        enterFrame : function(){
            var box = this.box;
            box.setPosition(this.x,this.y);
        },
        touchStart : function(e){
            if(this.box.intersect(e.x,e.y)){
                this.element.focus();
            }
        },
        getValue : function(){
            return this.element.value;
        }
    });
    var Group = Atlas.createClass(Thing,{
        initialize:function(){
            this.inherit();
            this.children = [];
            this._basicConstructor = "Group";
            for(var i = 0,n = arguments.length; i < n; i++){
                this.children.push(arguments[i]);
            }
        },
        draw: function () {
            var children = this.children;
            for(var i = 0,n = children.length; i < n; i++){
                var target = children[i];
                target.x += this.x;
                target.y += this.y;
                if(target.useEvent)
                    target.useEvent();
                if(target.enterFrame)
                    target.enterFrame();
                if(target.tween)
                    target.tween();
                if(target.visible)
                    target.draw();
                if (target._remove) {
                    this.splice(i, 1);
                    target = null;
                    i--;
                    n--;
                }   
                target.x -= this.x;
                target.y -= this.y;            
            }
        },
        scale:function(x,y){
            var children = this.children;
            for(var i = 0, n = arguments.length; i < n; i++){
                var child = children[i];
                if(child.scale)
                    child.scale(x,y);
            }
        },
        addChild:function(sprite){
            sprite.parent = this;
            this.children.push(sprite);
        },
        addChildren:function(){
            for(var i = 0,n = arguments.length; i < n; i++){
                this.addChild(arguments[i]);
            }
        },
    });
    window.Atlas = Atlas;
    Atlas.Util = Util;
    Atlas.Thing = Thing;
    Atlas.App = App;
    Atlas.Sprite = Sprite;
    Atlas.Shape = Shape;
    Atlas.Map = Map;
    Atlas.Text = Text;
    Atlas.Scene = Scene;
    Atlas.Input = Input;
    Atlas.Group = Group;
})();