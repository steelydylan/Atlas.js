/*
	レイヤークラスに挿入されたスプライトは
	_x画像の絶対位置 x画像の相対位置
	二つの座標を持っている。
	当たり判定や描画などには絶対位置が使用される。
	++目標++
	このレイヤークラスを利用するユーザは絶対位置を
	意識せずにプログラムが出来るようする。		
*/
var Layer = Atlas.createClass(Atlas.Group,{
	initialize:function(){
		this.inherit.call(this,arguments);
		this.rot = 0;
		this._basicConstructor = "Layer";
		this.scaleX = 1;
		this.scaleY = 1;
	},
	_setAbsPos:function(child){
		var centerX = this.scaleX*(this.width / 2);
		var centerY = this.scaleY*(this.height / 2);
		rot = this.rot;
		child.Cx = this.scaleX*(child.x + child._width / 2);
		child.Cy = this.scaleY*(child.y + child._height / 2);
		child.startRot = true;			
		var cx = Math.cos(rot)*(child.Cx - centerX) - Math.sin(rot)*(child.Cy - centerY) + centerX;
		var cy = Math.sin(rot)*(child.Cx - centerX) + Math.cos(rot)*(child.Cy - centerY) + centerY;
		child._x = cx - child._width/2;
		child._y = cy - child._height/2;
		child._x += this.x;
        child._y += this.y;
	},
	scale:function(scaleX,scaleY){
		this.scaleX *= scaleX;
		this.scaleY *= scaleY;
		return this;
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
        var children = this.children;
        for(var i = 0,n = children.length; i < n; i++){
            var target = children[i];
            target._rot = target.rot + this.rot;
            target._width = this.scaleX * target.width;
            target._height = this.scaleY * target.height;
            this._setAbsPos(target);
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
        }
    },
});