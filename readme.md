Atlas.js
==========

<img src="https://raw.github.com/steelydylan/Atlas.js/master/logo.png"></img>

==========

JavaScript Game Engine


Download
--------

- [Atlas.js](https://raw.github.com/steelydylan/Atlas.js/master/Atlas.js)
- [Atlas.min.js](https://raw.github.com/steelydylan/Atlas.js/master/Atlas.min.js) (compressed)


Documentation
-------------

- Japanese
    - <http://steelydylan.github.io/Atlas.js/>

Usage
-----
```html
<script src='Atlas.js'></script>
<canvas id="app"></canvas>
<script>
    Atlas();
    window.onload = function(){
        var game = new App("app"); 
        game.load("chara.png");
        game.setQuality(500,500);
		game.setSize(500,500);
        var sprite = new Sprite("chara.png",32,32);
		sprite.setPosition(220,220)
		.animate([0,1,2],5).and().moveBy(0,50,30)
		.animate([6,7,8],5).and().moveBy(50,0,30)
		.animate([9,10,11],5).and().moveBy(0,-50,30)
		.animate([3,4,5],5).and().moveBy(-50,0,30)
		.loop();
		game.addChild(sprite);
        game.start();
    }
</script>
```


Design
------

- Compact
- object-type

## License
MIT License

Platform
--------

- Chrome
- Safari
- Firefox
- IE9 
- iOS
- Android 2.1+



Example
-----
- [JustEdit](http://jsdo.it/steelydylan/o5nG)



