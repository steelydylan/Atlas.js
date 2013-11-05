/**
 * Atlas.js v0.5.1
 * https://github.com/steelydylan/Atlas.js
 * Copyright steelydylan
 * <http://steelydylan.phpapps.jp/>
 * Released under the MIT license.
 */
(function () {
    var images = [];
    var sounds = [];
    var fonts = [];
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
		var succ = function (alpha) {
            return String.fromCharCode(alpha.charCodeAt(alpha.length - 1) + 1);
        };
        ret.enter = false;
    	ret.shift = false;
    	ret.space = false;
    	ret.right = false;
    	ret.left = false;
    	ret.up = false;
    	ret.down = false;
    	for(var i = 0; i < 26; i++){
            ret[String.fromCharCode(i+97)] = false;
        } 
	};
	var keydown = (function(){       
    	var ret = new Object();
		clearKeyState(ret);
		return ret;
    })();
    Atlas = function () {
        window.App = App;
        window.Sprite = Sprite;
        window.Text = Text;
        window.Shape = Shape;
        window.Group = Group;
        window.Map = Map;
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
    var Util = Atlas.createClass({
    	isMobile: isMobile,
    	orientation: orientation,
        initialize: function(){
        	this.eventListener = new Object();
        	this.visible = true;
        	this.parent;
        	var eventListener = this.eventListener;
        	eventListener.touchStart = false;
        	eventListener.touchMove = false;
        	eventListener.touchEnd = false;
        	eventListener.keyUp = false;
        	eventListener.keyDown = false;
        	eventListener.orientationChange = false; 
        },
        setPosition: function (x, y) {
            this.x = x;
            this.y = y;
        },
       	getTouchPosition: function (e) {
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
            if (e) {
                if (!isMobile || (isMobile && e.touches[0])) {
                    obj.x = (isMobile ? e.touches[0].pageX : e.pageX) - x;
                    obj.y = (isMobile ? e.touches[0].pageY : e.pageY) - y;
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
        handleEvent: function(e) {
        	e.preventDefault();
        	var pos = this.getTouchPosition(e);        		
        	if(e.which > 2){
        		var keyup = new Object();
        		for(var i in keydown)
            		keyup[i] = keydown[i];
            }
        	setKeyState(keyup,keydown,e);
			switch (e.type) {
				case 'touchstart': if(this.touchStart)this.touchStart(pos); break;
				case 'mousedown': if(this.touchStart)this.touchStart(pos); break;
				case 'touchmove': if(this.touchMove)this.touchMove(pos); break;
				case 'mousemove': if(this.touchMove)this.touchMove(pos); break;
				case 'touchend': if(this.touchEnd)this.touchEnd(); break;
				case 'mouseup': if(this.touchEnd)this.touchEnd(); break;
				case 'keydown': if(this.keyDown)this.keyDown(keydown); break;
				case 'keyup': if(this.keyUp)this.keyUp(keyup);break;
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
        }
    });
	var Group = Atlas.createClass(Array, {
    	initialize: function () {
            this.inherit();
            this._remove = false;
        },
        addChildren: function () {
            for(var i = 0, n = arguments.length; i < n; i++){
            	addChild(arguments[i]);
            }
        },
        remove: function(){
        	this._remove = true;
        },
        addChild: function(sprite){
        	sprite.parent = this;
        	this.push(sprite);
        },
        enterFrame: function (e) {
            for (var i = 0, n = this.length; i < n; i++) {
            	var target = this[i];
            	target.useEvent();
            	if(target.enterFrame)
                	target.enterFrame();
                if(target.visible)
                	target.draw();
                if (target._remove) {
                    this.splice(i, 1);
                    delete target;
                    i--;
                    n--;
                }
            }
        }
    });
    var App = Atlas.createClass(Util,{
        initialize: function (place) {
            var css = document.createElement("style");
    		css.media = 'screen';
    		css.type = "text/css";
    		document.getElementsByTagName("head")[0].appendChild(css);
        	var field = document.getElementById(place);
        	field.width = 320;
        	field.height = 480;
        	field.tabIndex = '1';
        	field.focus();
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
        	this.children = new Group();  
        	this.mainScene;
        	this.loadingScene;  	
        },
        addChild: function(child){
        	child.ctx = this.ctx;
        	child.field = this.field;
        	this.children.addChild(child);
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
        mainScene: function (fn) {
            this.mainScene = fn;
        },
        loadingScene: function (fn) {
            this.loadingScene = fn;
        },
        enterFrame: function(){
        	var field = this.field;
            this.ctx.clearRect(0, 0, field.width, field.height);
            if (allLoaded <= 0){            
                this.children.enterFrame();
                if(this.mainScene)
                	this.mainScene();
            }
            else if (this.loadingScene)
                this.loadingScene();        
        },
        setColor: function(color){
        	this.field.style.backgroundColor = color;
        },
        start: function () {
        	var field = this.field;
        	this.ctx.clearRect(0,0,field.width,field.height);
            var that = this;
            setInterval(function () {
            	that.useEvent();
                that.enterFrame();
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
                var data = arguments[i];
                var ext = getExtention(data);
                var css = this._css;
                if (ext == 'wav' || ext == 'mp3' || ext == 'ogg') {
                    var obj = new Audio(data);
                    obj.name = data;
                    allLoaded++;
                    obj.addEventListener("canplaythrough", function () {
                        allLoaded--;
                        console.log(this.src + " is loaded");
                    });
                    sounds.push(obj);
                } else if(ext == "TTF" || ext == "ttf"){
                	var rule =  document.createTextNode("@font-face{"+
                	"font-family:'"+data+"';"+
                	"src: url('"+data+"') format('truetype');"+
                	"}");
                	if(css.styleSheet)
                		css.styleSheet.cssText = rule;
                	else
                		css.appendChild(rule);
                	var font = new Object();
                	font.name = data;
                	font.url = data;
                	fonts.push(font);                	
                	console.log(data + " is loaded");
                } else {
                    var obj = new Image();
                    obj.src = data;
                    obj.name = data;
                    obj.onload = function () {
                        allLoaded--;
                        console.log(this.src + ' is loaded');
                    };
                    images.push(obj);
                }
            }
        },
        naming: function () {
            for (var t = 0, l = arguments.length; t < l; t++) {
                for (var i = 0, n = sounds.length; i < n; i++) {
                    if (sounds[i].name == arguments[t][0]) {
                        sounds[i].name = arguments[t][1];
                    }
                }
                for (var i = 0, n = images.length; i < n; i++) {
                    if (images[i].name == arguments[t][0]) {
                        images[i].name = arguments[t][1];
                    }
                }
                for (var i = 0, n = fonts.length; i < n; i++){
                	if(fonts[i].name == arguments[t][0]){
                		fonts[i].name = arguments[t][1];
                		var rule =  document.createTextNode("@font-face{"+
                		"font-family:'"+fonts[i].name+"';"+
                		"src: url('"+fonts[i].url+"') format('truetype');"+
                		"}");
                		var css = this._css;
                		if(css.styleSheet)
                			css.styleSheet.cssText = rule;
                		else
                			css.appendChild(rule);
                	}
                }
            }
        }
    });
    var Thing = Atlas.createClass(Util,{
        initialize: function(width,height){
            this.inherit();
            this.x = 0;
            this.y = 0;
            this.rot = 0;
            this._remove = false;
            this.width = width;
            this.height = height; 
            this.collisionShape = "box";
            this.alpha = 1;  
            this.field;        
        },
        intersect: function (ex, ey) {
            if (this.collisionShape == "box") {
                var x = ex - (this.x + this.width / 2);
                var y = ey - (this.y + this.height / 2);
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
                var x = ex - (this.x + radius);
                var y = ey - (this.y + radius);
                if (Math.sqrt(x * x + y * y) < radius)
                    return true;
                return false;
            } else {
                return false;
            }
        },
        within: function (target, range) {
            if (this.collisionShape == "box") {
                var thiscX = this.x + this.width / 2;
                var thiscY = this.y + this.height / 2;
            } else if (this.collisionShape == "circle") {
                var radius = this.width / 2;
                var thiscX = this.x + radius;
                var thiscY = this.y + radius;
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
            this.width *= sx;
            this.height *= sy;
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
    var Shape = new Object();
    Shape.Box = Atlas.createClass(Thing, {
        initialize: function (col, width, height) {
            this.inherit(width,height);
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
            this.inherit(width,height);
            this.spriteWidth = width;
            this.spriteHeight = height;
            this.getImage(name);
            this.frame = 0;
        },
        setSpriteSize:function (width,height){
	        this.spriteWidth = width;
	        this.spriteHeight = height;
        },
        getImage: function (name,width,height) {
            if(width && height)
                this.setSpriteSize(width,height);
            var length = images.length;
            for (var i = 0; i < length; i++)
                if (images[i].name == name)
                    this.img = i;
        },
        draw: function () {
        	var ctx = this.ctx;
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
            ctx.drawImage(image, dx, dy, SizeX, SizeY, 0, 0, SizeX, SizeY);
            ctx.restore();
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
        	this.x = 0;
        	this.y = 0;
        	this.alpha = 1;
        	this.spaceWidth = 0;
        	if (font)
       	    	this.font = "'" + font + "'";
        	else
            	this.font = "'Meiryo'";
        	if (size)
            	this.size = size + "pt";
        	else
            	this.size = "10pt";
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
            this.size = size + "pt";
        },
        setFont: function (font) {
            this.font = "'" + font + "'";
        },
        draw: function () {
            var x = this.x;
            var y = this.y;
            var ctx = this.ctx;
            var strings = this.string.split('<br>');
            var length = strings.length;
            ctx.globalAlpha = this.alpha;
            ctx.font = this.size + " " + this.font;
            ctx.fillStyle = this.color;
            if (length > 1) {
                var height = ctx.measureText('a').width * 1.5 + this.spaceWidth;
                for (var i = 0; i < length; i++) {
                    ctx.fillText(strings[i], x, y);
                    y += height;
                }
            } else
                ctx.fillText(this.string, x, y);
            ctx.globalAlpha = 1;
        }
    });
    Atlas.App = App;
    Atlas.Sprite = Sprite;
    Atlas.Text = Text;
    Atlas.Shape = Shape;
    Atlas.Group = Group;
    Atlas.Map = Map;
})();