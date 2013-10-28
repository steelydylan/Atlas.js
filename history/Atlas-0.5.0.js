/**
 * Atlas.js v0.5.0
 * https://github.com/steelydylan/Atlas.js
 * Copyright steelydylan
 * <http://steelydylan.phpapps.jp/>
 * Released under the MIT license.
 */
(function () {
    var images = [];
    var sounds = [];
    var allLoaded = 0;
    var field;
    var ctx;
    var loadingScene;
    var mainScene;
    var bgColor = "black";
    var alpha = 1;
    var isMobile = false;
    Atlas = function (place) {
        field = document.getElementById(place);
        field.width = 320;
        field.height = 480;
        document.body.style.margin = "0em";
        ctx = field.getContext('2d');
        var userAgent = navigator.userAgent;
        if ((userAgent.indexOf('iPhone') > 0 && userAgent.indexOf('iPad') == -1) || userAgent.indexOf('iPod') > 0 || userAgent.indexOf('Android') > 0) {
            field.style.width = window.innerWidth+"px";//mobile default
            field.style.height = window.innerHeight+"px";//mobile default
            isMobile = true;
        } else {
            field.style.width = 480+"px";
            field.style.height = 620+"px";
        }
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
            newClass.prototype.inherent = function () {                
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
    var EventListener = Atlas.createClass({
        initialize: function(){
            this.key = new Object();
            var key = this.key;
            key.enter = false;
            key.shift = false;
            key.space = false;
            key.right = false;
            key.left = false;
            key.up = false;
            key.down = false;
            key.a = false;
            key.b = false;
            key._a = -1;
            key._b = -1;
        },
        enableEvent: function(){
            for(var i = 0,n = arguments.length; i < n; i++){
                var listener = arguments[i];
            	if(listener == "touchStart"){
            		if (isMobile)
                		field.addEventListener("touchstart", this, false);
            		else
                		field.addEventListener("mousedown", this, false);
            	}else if(listener == "touchMove"){
            		if (isMobile)
                		field.addEventListener("touchmove", this, false);
            		else
                		field.addEventListener("mousemove", this, false);
            	}else if(listener == "touchEnd"){
            		if (isMobile)
                		field.addEventListener("touchend", this, false);
            		else
                		field.addEventListener("mouseup", this, false);
            	}else if(listener == "keyDown"){
            		document.addEventListener("keydown", this, false);            		
            	}else if(listener == "keyUp"){
            	    document.addEventListener("keyup", this, false);  
            	}
            }
        },
        handleEvent: function(e) {
			switch (e.type) {
				case 'touchstart': this.touchStart(e); break;
				case 'mousedown': this.touchStart(e); break;
				case 'touchmove': this.touchMove(e); break;
				case 'mousemove': this.touchMove(e); break;
				case 'touchend': this.touchEnd(); break;
				case 'mouseup': this.touchEnd(); break;
				case 'keydown': this.keyDown(e); break;
				case 'keyup': this.keyUp(e);break;
			}
		},
		getTouchPosition: function (e) {
            e.preventDefault();
            var rateX = parseInt(field.width) / parseInt(field.style.width);
            var rateY = parseInt(field.height) / parseInt(field.style.height);
            var obj = new Object();
            var margin = field.getBoundingClientRect();
            if (e) {
                var x = parseInt(margin.left);
                var y = parseInt(margin.top);
                if (isNaN(x))
                    x = 0;
                if (isNaN(y))
                    y = 0;
                if (!isMobile || (isMobile && e.touches[0])) {
                    obj.x = (isMobile ? e.touches[0].pageX : e.pageX) - x;
                    obj.y = (isMobile ? e.touches[0].pageY : e.pageY) - y;
                } else {
                    obj.x = -1;
                    obj.y = -1;
                }
            }
            else {
                obj.x = event.x - x;
                obj.y = event.y - y;
            }
            obj.x = parseInt(obj.x * rateX);
            obj.y = parseInt(obj.y * rateY);
            return obj;
        },
        setKey: function (bA,bB) {
            var succ = function (alpha) {
                return String.fromCharCode(alpha.charCodeAt(alpha.length - 1) + 1);
            };
            var Set = function (button) {
                var ret;
                var alpha = "a";
                for (var i = 0; i < 24; i++) {
                    if (button == alpha) {
                        ret = 65 + i;
                        break;
                    }
                    alpha = succ(alpha);
                }
                return ret;
            };
            if (bA)
                key._a = Set(bA);
            if (bB)
                key._b = Set(bB);
        },
        setKeyState: function(e){
            var which = e.which;
            var key = this.key;
        	switch (which) {
                case 13:
                    key.enter = true;
                    break;
                case 16:
                    key.shift = true;
                    break;
                case 32:
                    key.space = true;
                    break;
                case 39: // Key[→]
                    key.right = true;
                    break;
                case 37: // Key[←]
                    key.left = true;
                    break;
                case 38: // Key[↑]
                    key.up = true;
                    break;
                case 40: // Key[↓]
                    key.down = true;
                    break;
                case key._a:
                	key.a = true;
                	break;
                case key._b:
                	key.b = true;
                	break;
            }
        },
        clearKeyState:function(){
            var key = this.key;
            key.enter = false;
            key.shift = false;
            key.space = false;
            key.right = false;
            key.left = false;
            key.up = false;
            key.down = false;
            key.a = false;
            key.b = false;
        },
        getRand: function (a, b) {
            return ~~(Math.random() * (b - a + 1)) + a;
        }
    });
    var App = Atlas.createClass(EventListener,{
        ctx: ctx,
        isMobile : isMobile,
        initialize: function () {
        	this.fps = 30;// fps default        	
       	 	if (isMobile) {
            	var mq = window.matchMedia("(orientation: portrait)");
            	if (mq.matches) {
                	this.orientation = "portrait";
           	    } else {
                	this.orientation = "landscape";
            	}
            }
        },
        setBackgroundColor: function (color) {
            bgColor = color;
        },
        setAlpha: function (n) {
            alpha = n;
        },
        centerize: function () {
            var style = field.style;
            style.marginTop = - parseInt(style.height) / 2+"px";
            style.marginLeft = - parseInt(style.width) / 2+"px";
            style.top = '50%';
            style.left = '50%';
            style.position = 'absolute';
        },
        fitWindow: function () {
            this.changeSize(window.innerWidth, window.innerHeight);
            var that = this;
            window.onresize = function () {
                that.changeSize(window.innerWidth, window.innerHeight);
            };
        },
        detectOrientation: function (portrait, landscape) {
            if (this.isMobile) {
                var that = this;
                window.addEventListener("orientationchange", function () {
                    var mq = window.matchMedia("(orientation: portrait)");
                    if (mq.matches) {
                        that.orientation = "portrait";
                    } else {
                        that.orientation = "landscape";
                    }
                }, false);
            }
        },
        changeQuality: function (width, height) {
            field.width = width;
            field.height = height;
        },
        changeSize: function (width, height) {
            var style = field.style;
            style.width = width+"px";
            style.height = height+"px";
        },
        getQuality:function(){
            var obj = new Object();
            obj.width = field.width;
            obj.height = field.height;
            return obj;
        },
        getSize:function(){
            var obj = new Object();
            obj.width = field.style.width;
            obj.height = field.style.height;
            return obj;
        },        
        mainScene: function (fn) {
            mainScene = fn;
        },
        loadingScene: function (fn) {
            loadingScene = fn;
        },
        start: function () {
            ctx.fillStyle = bgColor;
            ctx.globalAlpha = 1;
            ctx.fillRect(0, 0, field.width, field.height);
            setInterval(function () {
                ctx.fillStyle = bgColor;
                ctx.globalAlpha = alpha;
                ctx.fillRect(0, 0, field.width, field.height);
                ctx.globalAlpha = 1;
                if (allLoaded <= 0)
                    mainScene();
                else if (loadingScene)
                    loadingScene();
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
                if (ext == 'wav' || ext == 'mp3' || ext == 'ogg') {
                    var obj = new Audio(data);
                    obj.name = data;
                    allLoaded++;
                    obj.addEventListener("canplaythrough", function () {
                        allLoaded--;
                        console.log(this.src + " is loaded");
                    });
                    sounds.push(obj);
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
            }
        }
    });
    var Thing = Atlas.createClass(EventListener,{
        initialize: function(width,height){
            this.inherent();
            this.x = 0;
            this.y = 0;
            this.rot = 0;
            this.width = width;
            this.height = height; 
            this.collisionShape = "box";
            this.alpha = 1;          
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
        setPosition: function (x, y) {
            this.x = x;
            this.y = y;
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
            this.inherent(width,height);
            this.col = col;
        },
        draw: function () {
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.fillStyle = this.col;
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
            this.inherent(radius * 2,0);
            this.col = col;
            this.collisionShape = "circle";
        },
        draw: function () {
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.fillStyle = this.col;
            var plus = this.width / 2;
            ctx.arc(this.x + plus, this.y + plus, plus, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    });
    var Sprite = Atlas.createClass(Thing, {
        initialize: function (name, width, height) {
            this.inherent(width,height);
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
            this.inherent(name,width,height);
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
    var Text = Atlas.createClass(EventListener,{
    	initialize : function (string, col, size, font) {
    	    this.inherent();
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
            	this.col = col;
        	else
            	this.col = "white";
    	},
        setSize: function (size) {
            this.size = size + "pt";
        },
        setFont: function (font) {
            this.font = "'" + font + "'";
        },
        setPosition: function (x, y) {
            this.x = x;
            this.y = y;
        },
        draw: function () {
            var x = this.x;
            var y = this.y;
            var strings = this.string.split('<br>');
            var length = strings.length;
            ctx.globalAlpha = this.alpha;
            ctx.font = this.size + " " + this.font;
            ctx.fillStyle = this.col;
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
    var Group = Atlas.createClass(Array, {
    	initialize: function () {
            this.inherent();
        },
        add: function () {
            for(var i = 0, n = arguments.length; i < n; i++){
                var sprite = arguments[i];
                if (typeof sprite.move === 'function') {
                    sprite.remove = false;
                    this.push(sprite);
                }
            }
        },
        move: function () {
            var length = arguments.length;
            for (var i = 0, n = this.length; i < n; i++) {
                if (length > 0)
                    this[i].move.apply(this[i], arguments);
                else
                    this[i].move();
                if (this[i].remove) {
                    this.splice(i, 1);
                    i--;
                    n--;
                }
            }
        }
    });
    Atlas.App = App;
    Atlas.Sprite = Sprite;
    Atlas.Text = Text;
    Atlas.Shape = Shape;
    Atlas.Group = Group;
    Atlas.Map = Map;
})();