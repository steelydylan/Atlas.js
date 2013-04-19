/**
 * Acre.js v0.0.1
 * https://github.com/steelydylan/Acre.js
 * Copyright steelydylan
 * <ess_president@me.com>.
 * Released under the MIT license.
 */
var ctx;
var images = [];
var musics = [];
var MusicIndex = 0;
var ImgIndex = 0;
var IsAllLoaded = 0;
var IsTouch = false;
var Acre;
var key = new Object();
key.buttonA = -1;
key.buttonB = -1;
function getRand(a, b) {
    return ~~(Math.random() * (b - a + 1)) + a;
}
function Set(button){
var ret;
switch(button){
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
return ret;
}
function keySet(buttonA,buttonB){
if(buttonA)
    key.buttonA = Set(buttonA);
if(buttonB);   
    key.buttonB = Set(buttonB);
}
function fpsSet(){
}
document.onkeydown = function(e){
        switch(e.which){
            case 39: // Key[→]
            key.right = 1;
            break;
            case 37: // Key[←]
            key.left = 1;
            break;
            case 38: // Key[↑]
            key.up = 1;
            break;
            case 40: // Key[↓]
            key.down = 1;
            break;
        }
        if(e.which == key.buttonA)
            key.a = 1;
        if(e.which == key.buttonB)
            key.b = 1;
        return false;
}
document.onkeyup = function(e){
        switch(e.which){
            case 39: // Key[→]
            key.right = 0;
            break;
            case 37: // Key[←]
            key.left = 0;
            break;
            case 38: // Key[↑]
            key.up = 0;
            break;
            case 40: // Key[↓]
            key.down = 0;
            break;
        }
        if(e.which == key.buttonA)
            key.a = 0;
        if(e.which == key.buttonB)
            key.b = 0;
        return false;
}
function hideBar(){
 setTimeout(window.scrollTo(0,1), 100);
}
function GameLoop() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, Acre.width, Acre.height);
    if (IsAllLoaded == 0){
        MainGame();
    }
    else
        LoadingGame();
}
getPosition  = function(e) {
    e.preventDefault();
    var obj = new Object();
    if (e) {
        obj.x = (IsTouch ? e.touches[0].pageX : e.pageX);
        obj.y = (IsTouch ? e.touches[0].pageY : e.pageY);
    }
    else {
        obj.x = event.x + document.body.scrollLeft;
        obj.y = event.y + document.body.scrollTop;
    }
    return obj;
}

function LoadSound(name) {
    if (Audio) {
        musics[MusicIndex] = new Audio(name);
        MusicIndex++;
        return MusicIndex - 1;
    } else
        return 0;
}
function PlaySound(id, t) {
    if (Audio) {
        if (t == 1)
            musics[id].loop = true;
        musics[id].play();
    }
}
function GameConfig(center) {   
    window.onload = function(){
    Acre = document.getElementById("acre");
    Acre.fps = 30;  
    Acre.width = 320;
    Acre.height = 480;
    Acre.isMobile = false;
    Acre.center = false;
    ctx  = Acre.getContext('2d');
    if ((navigator.userAgent.indexOf('iPhone') > 0 && navigator.userAgent.indexOf('iPad') == -1) || navigator.userAgent.indexOf('iPod') > 0 ||      navigator.userAgent.indexOf('Android') > 0) {
        Acre.style.width = window.innerWidth;
        Acre.style.height = window.innerHeight;
        Acre.isMobile = true;
        if ("touchstart" in window)
            Acre.addEventListener("touchstart", touchstart, false);
        if ("touchmove" in window)
            Acre.addEventListener("touchmove", touchmove, false);
        if ("touchend" in window)
            Acre.addEventListener("touchend", touchend, false);
        IsTouch = true;
    }else{
        Acre.style.width = 480;
        Acre.style.height = 620;
        if(center){
            Acre.style.marginLeft = window.innerWidth/2 - 240;
            Acre.style.marginTop = window.innerHeight/2 - 310;
            Acre.center = true;
        }
        if ("touchstart" in window)
            Acre.addEventListener("mousedown", touchstart, false);
        if ("touchmove" in window)
            Acre.addEventListener("mousemove", touchmove, false);
        if ("touchend" in window)
            Acre.addEventListener("mouseup", touchend, false);    
    }   
    document.body.style.margin = "0em";
    if(typeof GameInit == "function")
    GameInit();
    if(typeof MainGame == "function" && typeof LoadingGame == "function")
    setInterval(GameLoop, 1000/Acre.fps);
    };
}
function changeQuality(width,height){
    Acre.width = width;
    Acre.height = height;
}

function changeSize(width,height){
    Acre.style.width = width;
    Acre.style.height = height;
    if(Acre.center && !Acre.isMobile){
        Acre.style.marginLeft = window.innerWidth/2 - width/2;
        Acre.style.marginTop = window.innerHeight/2 - height/2;
    } 
}

function isMobile(){
    if(Acre.isMobile)
    return true;
    else
    return false;
}
function drawScaleGraph(img, x, y, sx, sy, r, Num) {
    var SizeX = images[img].SizeX;
    var SizeY = images[img].SizeY;
    var numX = images[img].numX;
    var numY = images[img].numY;
    var dx = (Num % numX) * SizeX;
    var dy = (~~(Num / numX) % numY) * SizeY;
    ctx.save();
    ctx.translate(x + SizeX / 2, y + SizeY / 2);
    ctx.rotate(r);
    ctx.translate(-SizeX / 2, -SizeY / 2);
    ctx.scale(sx, sy);
    ctx.drawImage(images[img], dx, dy, SizeX, SizeY, 0, 0, SizeX, SizeY);
    ctx.restore();
}
function drawGraph(img, x, y, r, Num) {
    var SizeX = images[img].SizeX;
    var SizeY = images[img].SizeY;
    var numX = images[img].numX;
    var numY = images[img].numY;
    var dx = (Num % numX) * SizeX;
    var dy = (~~(Num / numX) % numY) * SizeY;
    ctx.save();
    ctx.translate(x + SizeX / 2, y + SizeY / 2);
    ctx.rotate(-r);
    ctx.translate(-SizeX / 2, -SizeY / 2);
    ctx.drawImage(images[img], dx, dy, SizeX, SizeY, 0, 0, SizeX, SizeY);
    ctx.restore();
}
function drawText(x, y, string, col,font) {
    if(font)
    ctx.font = font;
    ctx.fillStyle = col;
    ctx.fillText(string, x, y);
}
function LoadDivGraph(name, width, height, numX, numY) {
    IsAllLoaded++;
    images[ImgIndex] = new Image();
    images[ImgIndex].src = name;
    images[ImgIndex].SizeX = width;
    images[ImgIndex].SizeY = height;
    images[ImgIndex].numX = numX;
    images[ImgIndex].numY = numY;
    images[ImgIndex].onload = function () { IsAllLoaded--; console.log(this.src + ' isLoaded') }
    ImgIndex++;
    return ImgIndex - 1;
}
function IsTouched(img, dx, dy, ex, ey) {
    if (ex >= dx && ex <= dx + images[img].SizeX &&
    ey >= dy && ey <= dy + images[img].SizeY)
        return true;
    else
        return false;
}
function WithIn(img, x, y, img2, dx, dy, range) {
    x = x + images[img].SizeX / 2;
    y = y + images[img].SizeY / 2;
    dx = dx + images[img2].SizeX / 2;
    dy = dy + images[img2].SizeY / 2;
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
function drawBox(x, y, sizeX, sizeY, col, alpha) {
    if(alpha)
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.fillStyle = col;
    ctx.fillRect(x, y, sizeX, sizeY);
    ctx.globalAlpha = 1;
}
function Intersect(img, x, y, ex, ey) {
    if (ex > x && ex < x + images[img].SizeX
    && ey > y && ey < y + images[img].SizeY)
        return true;
    else
        return false;
}