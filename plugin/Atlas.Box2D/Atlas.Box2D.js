/**
 * Atlas.Box2D.js v0.1.0
 * https://github.com/steelydylan/Atlas.js
 * Copyright Xipher
 * Released under the MIT license.
 */
(function(){
    var   b2Vec2 = Box2D.Common.Math.b2Vec2
    ,  b2BodyDef = Box2D.Dynamics.b2BodyDef
    ,  b2Body = Box2D.Dynamics.b2Body
    ,  b2FixtureDef = Box2D.Dynamics.b2FixtureDef
    ,  b2Fixture = Box2D.Dynamics.b2Fixture
    ,  b2World = Box2D.Dynamics.b2World
    ,  b2MassData = Box2D.Collision.Shapes.b2MassData
    ,  b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
    ,  b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
    ,  b2DebugDraw = Box2D.Dynamics.b2DebugDraw
    var fixDef = new b2FixtureDef;
    fixDef.density = 1;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.5;
    var bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_dynamicBody; 
    var world = new b2World(
        new b2Vec2(0, 10)    //gravity
        ,  true                 //allow sleep
    );
    var SCALE = 10;

    var Mixin = {
        setPosition: function (x, y) {
            this.body.GetBody().SetPosition(new b2Vec2(x/SCALE,y/SCALE));
            this.x = x;
            this.y = y;
            return this;
        },
        _enterFrame : function(){
            this.x = SCALE*(this.body.GetBody().GetPosition().x - this.width/(SCALE*2));
            this.y = SCALE*(this.body.GetBody().GetPosition().y - this.height/(SCALE*2));
            this.rot = this.body.GetBody().GetAngle();
        }
    };
    
    //物理演算含む箱の生成クラス
    PhysBox = Atlas.createClass(Atlas.Shape.Box,{
        initialize : function(color, width, height,density,friction,restitution){
            this.inherit(color, width, height);
            fixDef.density = density || 1.0;
            fixDef.friction = friction || 0.5;
            fixDef.restitution = restitution || 0.5;
            this._applyPhisics();
        },
        _applyPhisics:function(){
            bodyDef.type = b2Body.b2_dynamicBody;
            fixDef.shape = new b2PolygonShape;
            fixDef.shape.SetAsBox(
                this.width/(SCALE*2) //half width
                ,  this.height/(SCALE*2) //half height
            );
            bodyDef.position.x = this.x/SCALE;
            bodyDef.position.y = this.y/SCALE;
            bodyDef.angle = this.rot;
            this.body = world.CreateBody(bodyDef).CreateFixture(fixDef);
        }
    });

    Atlas.extendClass(PhysBox,Mixin);

    //物理演算含む丸の生成クラス
    PhysCircle = Atlas.createClass(Atlas.Shape.Circle,{
        initialize : function(color, radius, density,friction,restitution){
            this.inherit(color, radius);
            fixDef.density = density || 1.0;
            fixDef.friction = friction || 0.5;
            fixDef.restitution = restitution || 0.5;
            this._applyPhisics();
        },
        _applyPhisics:function(){
            bodyDef.type = b2Body.b2_dynamicBody;
            fixDef.shape = new b2CircleShape(
                this.width/SCALE/2 //radius
            );
            bodyDef.position.x = this.x/SCALE;
            bodyDef.position.y = this.y/SCALE;
            bodyDef.angle = this.rot;
            this.body = world.CreateBody(bodyDef).CreateFixture(fixDef);
        }
    });

    Atlas.extendClass(PhysCircle,Mixin);

    Atlas.extendClass(Atlas.App,{
        createGround:function(x,y,width,height){
            bodyDef.type = b2Body.b2_staticBody;
            bodyDef.position.x = x/SCALE;
            bodyDef.position.y = y/SCALE;
            fixDef.shape = new b2PolygonShape;
            fixDef.shape.SetAsBox(width/SCALE, height/SCALE);
            world.CreateBody(bodyDef).CreateFixture(fixDef); 

            bodyDef.position.x = 0;
            bodyDef.position.y = 0;
            fixDef.shape = new b2PolygonShape;
            fixDef.shape.SetAsBox(0, 1000/SCALE);
            world.CreateBody(bodyDef).CreateFixture(fixDef); 

            bodyDef.position.x = 500/SCALE;
            bodyDef.position.y = 0/SCALE;
            fixDef.shape = new b2PolygonShape;
            fixDef.shape.SetAsBox(0/SCALE, 1000/SCALE);
            world.CreateBody(bodyDef).CreateFixture(fixDef); 
        },
        enterFrame:function(){
            world.Step(
                1 / 60   //frame-rate
                ,  10       //velocity iterations
                ,  10       //position iterations
            );
            world.ClearForces();
        },
    });   
})();