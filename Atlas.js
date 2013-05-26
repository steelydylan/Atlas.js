/**
 * Atlas.js v0.1.0
 * https://github.com/steelydylan/Atlas.js
 * Copyright steelydylan
 * <http://steelydylan.phpapps.jp/>
 * Released under the MIT license.
 */
(function () {
    var images = [];
    var musics = [];
    var MusicIndex = 0;
    var ImgIndex = 0;
    var IsAllLoaded = 0;
    var field;
    var ctx;
	var setting = [];
    var initScene;
    var loadingScene;
    var mainScene;
    var key = new Object();
    Atlas = function (place) {
        field = document.getElementById(place);
        this.fps = 30;// fps default
        this.width = 320;//resolution default
        this.height = 480;//resolution default
        this.isMobile = false;
        this.center = false;
        this.field = field;
        this.key = key;
        ctx = field.getContext('2d');
        this.ctx = ctx;
        if ((navigator.userAgent.indexOf('iPhone') > 0 && navigator.userAgent.indexOf('iPad') == -1) || navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('Android') > 0) {
            field.style.width = window.innerWidth;//mobile default
            field.style.height = window.innerHeight;//mobile default
            this.isMobile = true;
        } else {
            field.style.width = 480;//pc default
            field.style.height = 620;//pc default    
        }
        document.body.style.margin = "0em";
        window.Tile = Tile;
        window.Sound = Sound;
        if (!this.isMobile) {
            document.onkeydown = function (e) {
                switch (e.which) {
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
                }
                if (e.which == key.buttonA)
                    key.a = true;
                if (e.which == key.buttonB)
                    key.b = true;
                return false;
            };
            document.onkeyup = function (e) {
                switch (e.which) {
                    case 39: // Key[→]
                        key.right = false;
                        break;
                    case 37: // Key[←]
                        key.left = false;
                        break;
                    case 38: // Key[↑]
                        key.up = false;
                        break;
                    case 40: // Key[↓]
                        key.down = false;
                        break;
                }
                if (e.which == key.buttonA)
                    key.a = false;
                if (e.which == key.buttonB)
                    key.b = false;
                return false;
            };
        }
    };
    var succ = function (alpha) {
        return String.fromCharCode(alpha.charCodeAt(alpha.length - 1) + 1);
    };
    var Set = function (button) {
        var ret;
        var alpha = "a";
        if (button.length > 1) {
            switch (button) {
                case "enter":
                    ret = 13;
                    break;
                case "shift":
                    ret = 16;
                    break;
                case "space":
                    ret = 32;
                    break;
            }
        } else {
            for (var i = 0; i < 24; i++) {
                if (button == alpha) {
                    ret = 65 + i;
                    break;
                }
                alpha = succ(alpha);
            }
        }
        return ret;
    };
	Atlas.setting = function(fn){
	    if(typeof fn == "function"){
			var obj = new Object();
		    obj.method = fn;
		    setting.push(obj);
		}
	};
    Atlas.prototype = {
        touchStart: function (fn) {
            if (this.isMobile)
                field.addEventListener("touchstart", fn, false);
            else
                field.addEventListener("mousedown", fn, false);
        },
        touchMove: function (fn) {
            if (this.isMobile)
                field.addEventListener("touchmove", fn, false);
            else
                field.addEventListener("mousemove", fn, false);
        },
        touchEnd: function (fn) {
            if (this.isMobile)
                field.addEventListener("touchend", fn, false);
            else
                field.addEventListener("mouseup", fn, false);
        },
        centerize: function () {
            field.style.marginLeft = window.innerWidth / 2 - parseInt(field.style.width) / 2;
            field.style.marginTop = window.innerHeight / 2 - parseInt(field.style.height) / 2;
            this.center = true;
        },
        keySet: function (bA, bB) {
            key.buttonA = -1;
            key.buttonB = -1;
            key.a = false;
            key.b = false;
            if (bA)
                key.buttonA = Set(bA);
            if (bB)
                key.buttonB = Set(bB);
        },
        changeQuality: function (width, height) {
            field.width = width;
            field.height = height;
        },
        changeSize: function (width, height) {
            field.style.width = width;
            field.style.height = height;
            if (this.center) {
                field.style.marginLeft = window.innerWidth / 2 - width / 2;
                field.style.marginTop = window.innerHeight / 2 - height / 2;
            }
        },
        getRand: function (a, b) {
            return ~~(Math.random() * (b - a + 1)) + a;
        },
        getPosition: function (e) {
            e.preventDefault();
            var obj = new Object();
            if (e) {
                var x = parseInt(field.style.marginLeft);
                var y = parseInt(field.style.marginTop);
                if (isNaN(x))
                    x = 0;
                if (isNaN(y))
                    y = 0;
                obj.x = (this.isMobile ? e.touches[0].pageX : e.pageX) - x;
                obj.y = (this.isMobile ? e.touches[0].pageY : e.pageY) - y;
            }
            else {
                obj.x = event.x + document.body.scrollLeft;
                obj.y = event.y + document.body.scrollTop;
            }
            return obj;
        },
        mainScene: function (fn) {
            mainScene = fn;
        },
        loadingScene: function (fn) {
            loadingScene = fn;
        },
        initScene: function (fn) {
            initScene = fn;
        },
        start: function () {
		    var length = setting.length;
			for(var i = 0; i < length; i++){
			    setting[i].method();
			}
            if (initScene)
                initScene();
            setInterval(function () {
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, field.width, field.height);
                if (IsAllLoaded == 0)
                    mainScene();
                else if (loadingScene)
                    loadingScene();
            }, 1000 / this.fps);
        },
        drawText: function (x, y, string, col, font) {
            if (font)
                ctx.font = font;
            ctx.fillStyle = col;
            ctx.fillText(string, x, y);
        },
        drawBox: function (x, y, sizeX, sizeY, col, alpha) {
            if (alpha)
                ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.fillStyle = col;
            ctx.fillRect(x, y, sizeX, sizeY);
            ctx.globalAlpha = 1;
        }
    };
    var Tile = function (name, width, height, numX, numY) {
        this.width = width;
        this.height = height;
        this.x = 0;
        this.y = 0;
        this.sx = 1;
        this.sy = 1;
        this.rot = 0;
        this.frame = 0;
        this.mapping = false;
        if (arguments.length == 5)
            this.img = this.LoadDivGraph(name, numX, numY);
        else if (arguments.length == 1) {
            this.width = name.width;
            this.height = name.height;
            this.x = 0;
            this.y = 0;
            this.sx = 1;
            this.sy = 1;
            this.rot = 0;
            this.frame = 0;
            this.img = name.img;
        }
    };
    Tile.prototype = {
        LoadDivGraph: function (name, numX, numY) {
            IsAllLoaded++;
            images[ImgIndex] = new Image();
            images[ImgIndex].src = name;
            images[ImgIndex].numX = numX;
            images[ImgIndex].numY = numY;
            images[ImgIndex].onload = function () { IsAllLoaded--; console.log(this.src + ' isLoaded') };
            ImgIndex++;
            return ImgIndex - 1;
        },
        drawScaleGraph: function () {
            var frame = this.frame;
            var image = images[this.img];
            var SizeX = this.width;
            var SizeY = this.height;
            var numX = image.numX;
            var numY = image.numY;
            var dx = (frame % numX) * SizeX;
            var dy = (~~(frame / numX) % numY) * SizeY;
            ctx.save();
            ctx.translate(this.x + SizeX / 2, this.y + SizeY / 2);
            ctx.rotate(this.rot);
            ctx.translate(-SizeX / 2, -SizeY / 2);
            ctx.scale(this.sx, this.sy);
            ctx.drawImage(image, dx, dy, SizeX, SizeY, 0, 0, SizeX, SizeY);
            ctx.restore();
        },
        drawGraph: function () {
            var frame = this.frame;
            var image = images[this.img];
            var SizeX = this.width;
            var SizeY = this.height;
            var numX = image.numX;
            var numY = image.numY;
            var dx = (frame % numX) * SizeX;
            var dy = (~~(frame / numX) % numY) * SizeY;
            ctx.save();
            ctx.translate(this.x + SizeX / 2, this.y + SizeY / 2);
            ctx.rotate(this.rot);
            ctx.translate(-SizeX / 2, -SizeY / 2);
            ctx.drawImage(image, dx, dy, SizeX, SizeY, 0, 0, SizeX, SizeY);
            ctx.restore();
        },
        setMap: function (array) {
            this.map = array;
            this.mapping = true;
        },
        drawMapGraph: function () {
            if (this.mapping) {
                var x = this.map[0].length;
                var y = this.map.length;
                var array = this.map;
                var width = this.width;
                var height = this.height;
                var px = this.x;
                var py = this.y;
                var i = 0;
                var t = 0;
                while (i < y) {
                    while (t < x) {
                        this.frame = array[i][t];
                        this.drawGraph();
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
        },
        intersect: function (ex, ey) {
            if (ex > this.x && ex < this.x + this.width
            && ey > this.y && ey < this.y + this.height)
                return true;
            else
                return false;
        },
        within: function (tile, range) {
            var x = this.x + this.width / 2;
            var y = this.y + this.height / 2;
            var dx = tile.x + tile.width / 2;
            var dy = tile.y + tile.height / 2;
            var tmp;
            if (dx < x) {
                tmp = dx;
                dx = x;
                x = tmp;
            }
            if (dx - x > range || dy - y > range)
                return false;
            x = (dx - x) * (dx - x);
            y = (dy - y) * (dy - y);
            x = Math.sqrt(x + y);
            if (x < range)
                return true;
            else
                return false;
        }
    };
    var Sound = function (name) {
        this.id = this.loadSound(name);
        this.loop = 0;
    };
    Sound.prototype = {
        loadSound: function (name) {
            if (Audio) {
                musics[MusicIndex] = new Audio(name);
                MusicIndex++;
                return MusicIndex - 1;
            } else
                return 0;
        },
        playSound: function () {
            if (Audio) {
                if (this.loop == 1)
                    musics[id].loop = true;
                musics[id].play();
            }
        }
    };
})();