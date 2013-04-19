var game = new Atlas("Atlas");
var IMAGE = '3dK04.png';
var sprite = new Tile(IMAGE,32,32,1,1);
var sps = [];
game.fps = 200;
game.changeQuality(400,400);
game.changeSize(window.innerHeight,window.innerHeight);
game.InitScene = function(){
var move = function(){
if (this.x + this.vecx > 368 ||
                this.x + this.vecx < 0)
                this.vecx = -this.vecx;
            this.x += this.vecx;
            if (this.y + this.vecy > 368 ||
                this.y + this.vecy < 0)
                this.vecy = -this.vecy;
            this.y += this.vecy;
}
for (var i=0; i<1000; i++) {
	        sps[i] = new Tile(sprite);
	        sps[i].x = Math.floor(Math.random() * 300) + 50;
            sps[i].y = Math.floor(Math.random() * 300) + 50;
            sps[i].vecx = Math.floor(Math.random() * 2) * 2 - 1;
            sps[i].vecy = Math.floor(Math.random() * 2) * 2 - 1;  
            sps[i].move = move;
        }
}
game.LoadingScene = function(){};
game.MainScene = function(){
    for(var i = 0; i<1000; i++){
    sps[i].move();
    sps[i].drawGraph();
    }
};   
game.start(); 
var stats = new Stats();
stats.setMode(0); // 0: fps, 1: ms

// Align top-left
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';

document.body.appendChild( stats.domElement );

setInterval( function () {

    stats.begin();

    // your code goes here

    stats.end();

}, 1000 / 60 );   