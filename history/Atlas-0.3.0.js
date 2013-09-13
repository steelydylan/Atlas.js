/**
 * Atlas.js v0.3.0
 * https://github.com/steelydylan/Atlas.js
 * Copyright steelydylan
 * <http://steelydylan.phpapps.jp/>
 * Released under the MIT license.
 */
(function () {
    var images = [];
    var ImgIndex = 0;
    var IsAllLoaded = 0;
    var field;
    var ctx;
    var loadingScene;
    var mainScene;
    var key = new Object();
    var bgColor = "black";
    var alpha = 1;
    var isMobile = false;
    Atlas = function (place) {
        field = document.getElementById(place);
        field.width = 320;
        field.height = 480;
        document.body.style.margin = "0em";
        ctx = field.getContext('2d');
        if ((navigator.userAgent.indexOf('iPhone') > 0 && navigator.userAgent.indexOf('iPad') == -1) || navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('Android') > 0) {
            field.style.width = window.innerWidth;//mobile default
            field.style.height = window.innerHeight;//mobile default
            isMobile = true;
        } else {
            this.width = 480;
            this.height = 620;
        }
        window.Screen = Screen;
        window.Tile = Tile;
        window.Sounds = Sounds;
        window.Text = Text;
        window.Shape = Shape;
        window.Group = Group;
        window.Util = Util;
    };
    var getRand = function (a, b) {
        return ~~(Math.random() * (b - a + 1)) + a;
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
    Atlas.createClass = function (superClass, obj) {
        var newClass = function () {
            this.initialize.apply(this, arguments);
        };
        if (typeof superClass == "function" && typeof obj == "object") {
            newClass.prototype = Object.create(superClass.prototype);
            newClass.prototype.inherent = function () {
                superClass.apply(this, arguments);
            };
        } else if (typeof superClass == "object" && obj == null) {
            obj = superClass;
        }
        for (var key in obj) {
            newClass.prototype[key] = obj[key];
        }
        newClass.prototype.constructor = newClass;
        return newClass;
    };
    var Util = function () {
        this.isMobile = isMobile;
        this.key = key;
    };
    Util.prototype = {
        getRand: getRand,
        keyEnable: function () {
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
        }
    };
    var Screen = function () {
        this.fps = 30;// fps default
        this.qualityWidth = 320;//resolution default
        this.qualityHeight = 480;//resolution default
        this.field = field;
        this.key = key;
        this.ctx = ctx;
        this.width = field.style.width;
        this.height = field.style.height;
    };
    Screen.prototype = {
        getRand: getRand,
        setBackgroundColor: function (color) {
            bgColor = color;
        },
        setAlpha: function (n) {
            alpha = n;
        },
        touchStart: function (fn) {
            if (isMobile)
                field.addEventListener("touchstart", fn, false);
            else
                field.addEventListener("mousedown", fn, false);
        },
        touchMove: function (fn) {
            if (isMobile)
                field.addEventListener("touchmove", fn, false);
            else
                field.addEventListener("mousemove", fn, false);
        },
        touchEnd: function (fn) {
            if (isMobile)
                field.addEventListener("touchend", fn, false);
            else
                field.addEventListener("mouseup", fn, false);
        },
        centerize: function () {
            field.style.marginTop = -this.height / 2;
            field.style.marginLeft = -this.width / 2;
            field.style.top = '50%';
            field.style.left = '50%';
            field.style.position = 'absolute';
        },
        fitWindow: function () {
            this.changeSize(window.innerWidth, window.innerHeight);
            var that = this;
            window.onresize = function () {
                that.changeSize(window.innerWidth, window.innerHeight);
            };
        },
        changeQuality: function (width, height) {
            field.width = width;
            field.height = height;
            this.qualityWidth = width;
            this.qualityHeight = height;
        },
        changeSize: function (width, height) {
            field.style.width = width;
            field.style.height = height;
            this.width = width;
            this.height = height;
        },
        getPosition: function (e) {
            e.preventDefault();
            var rateX = this.qualityWidth / this.width;
            var rateY = this.qualityHeight / this.height;
            var obj = new Object();
            var margin = field.getBoundingClientRect();
            if (e) {
                var x = parseInt(margin.left);
                var y = parseInt(margin.top);
                if (isNaN(x))
                    x = 0;
                if (isNaN(y))
                    y = 0;
                if (!this.isMobile || (this.isMobile && e.touches[0])) {
                    obj.x = (this.isMobile ? e.touches[0].pageX : e.pageX) - x;
                    obj.y = (this.isMobile ? e.touches[0].pageY : e.pageY) - y;
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
    var Tile = function (name, width, height) {
        this.x = 0;
        this.y = 0;
        this.sx = 1;
        this.sy = 1;
        this.rot = 0;
        this.frame = 0;
        this.mapping = false;
        this.width = width;
        this.height = height;
        if (typeof name == "string")
            this.img = this.LoadDivGraph(name);
        else {
            this.img = name.img;
        }
    };
    Tile.prototype = {
        getRand: getRand,
        LoadDivGraph: function (name) {
            IsAllLoaded++;
            images[ImgIndex] = new Image();
            images[ImgIndex].src = name;
            var that = this;
            images[ImgIndex].onload = function () {
                this.numX = this.width / that.width;
                this.numY = this.height / that.height;
                IsAllLoaded--;
                console.log(this.src + ' isLoaded');
            };
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
                var fieldHeight = field.height;
                var fieldWidth = field.width;
                while (i < y) {
                    while (t < x) {
                        this.frame = array[i][t];
                        if (this.frame >= 0 && fieldHeight > py + height * i && py + height * (i + 1) > 0 && fieldWidth > px + width * t && px + width * (t + 1) > 0)
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
        setPosition: function (x, y) {
            this.x = x;
            this.y = y;
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
            var dx, dy;
            if (tile.width) {
                dx = tile.x + tile.width / 2;
                dy = tile.y + tile.height / 2;
            } else {
                dx = tile.x;
                dy = tile.y;
            }
            if (!range)
                range = this.width / 2;
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
    var Shape = function (string, col, width, height) {
        this.x = 0;
        this.y = 0;
        this.col = col;
        this.alpha = 1;
        if (string == "box") {
            this.width = width;
            this.height = height;
            this.shape = 0;
        } else if (string == "circle") {
            this.radius = width;
            this.shape = 1;
        }
    };
    Shape.prototype = {
        getRand: getRand,
        setPosition: function (x, y) {
            this.x = x;
            this.y = y;
        },
        intersect: function (ex, ey) {
            if (this.shape == 0) {
                if (ex > this.x && ex < this.x + this.width
                && ey > this.y && ey < this.y + this.height)
                    return true;
                else
                    return false;
            } else if (this.shape == 1) {
                if (Math.squrt(Math.pow(ex - this.x, 2) + Math.pow(ey - this.y, 2)) < this.radius)
                    return true;
                else
                    return false;
            }
        },
        drawShape: function () {
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.fillStyle = this.col;
            if (this.shape == 0)
                ctx.fillRect(this.x, this.y, this.width, this.height);
            else if (this.shape == 1) {
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        }
    };
    var Text = function (string, size, font, col) {
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
            this.col = "white";
        this.x = 0;
        this.y = 0;

    };
    Text.prototype = {
        getRand: getRand,
        setSize: function (size) {
            this.size = size + "pt";
        },
        setFont: function (font) {
            this.font = "'" + font + "'";
        },
        drawText: function () {
            ctx.font = this.size + " " + this.font;
            ctx.fillStyle = this.color;
            ctx.fillText(this.string, this.x, this.y);
        }
    };
    var Sounds = Atlas.createClass(Array, {
        getRand: getRand,
        initialize: function () {
            this.inherent();
            for (var i = 0, n = arguments.length; i < n; i++) {
                this.push(new Audio(arguments[i]));
                this[i].playing = false;
            }
        },
        play: function (id) {
            if (this[id].paused)
                this[id].play();
            else if (!this[id].loop)
                (new Audio(this[id].src)).play();
            this[id].playing = true;
        },
        loop: function (id) {
            var data = this[id];
            if (!data.loop) {
                data.addEventListener('ended', function () {
                    data.currentTime = 0;
                    data.play();
                }, false);
            }
            data.loop = true;
            data.playing = true;
            data.play();
        },
        restart: function (id) {
            this[id].load();
            this[id].play();
            this[id].playing = true;
        },
        pause: function (id) {
            if (this[id].playing == true) {
                this[id].pause();
                this[id].playing = false;
            }
        },
        stop: function (id) {
            if (this[id].playing == true) {
                this[id].pause();
                this[id].currentTime = 0;
                this[id].playing = false;
            } else {
                this[id].load();
            }
        },
        getCount: function (id) {
            return this[id].currentTime;
        },
        setCount: function (id, time) {
            if (this[id].playing == true)
                this[id].currentTime = time;
        },
        getVolume: function (id) {
            return this[id].volume;
        },
        setVolume: function (id, volume) {
            this[id].volume = volume;
        },
        getAlltime: function (id) {
            return this[id].duration;
        },
        isPlaying: function (id) {
            return this[id].playing;
        }
    });
    var Group = Atlas.createClass(Array, {
        getRand: getRand,
        initialize: function () {
            this.inherent();
        },
        add: function (tile) {
            if (typeof tile == 'object' && typeof tile.move == 'function') {
                tile.remove = false;
                this.push(tile);
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
    Atlas.Screen = Screen;
    Atlas.Tile = Tile;
    Atlas.Sounds = Sounds;
    Atlas.Text = Text;
    Atlas.Shape = Shape;
    Atlas.Group = Group;
    Atlas.Util = Util;
})();