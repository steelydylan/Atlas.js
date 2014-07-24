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

    var SCALE = 100;
    var Mixin = {
        setPosition: function (x, y) {
            this.body.GetBody().SetPosition(new b2Vec2(x/SCALE,y/SCALE));
            //this.x = x;
            //this.y = y;
            return this;
        },
        setRelativePos:function(x,y,obj){
            var pos = obj.body.GetBody().GetPosition();
            this.body.GetBody().SetPosition(new b2Vec2(x/SCALE+pos.x,y/SCALE+pos.y))
        },
        _enterFrame : function(){
            this.x = SCALE*(this.body.GetBody().GetPosition().x - this.width/(SCALE*2));
            this.y = SCALE*(this.body.GetBody().GetPosition().y - this.height/(SCALE*2));
            this.rot = this.body.GetBody().GetAngle();
        },
        _applyPhisics:function(shape,body){
            body = body || {};
            fixDef.density = body.density || 1.0;
            fixDef.friction = body.friction || 0.5;
            fixDef.restitution = body.restitution || 0.5;
                        
            bodyDef.type = b2Body.b2_dynamicBody;
            if(body.type == "static"){
                bodyDef.type = b2Body.b2_staticBody;
            }
            if(shape == "Box"){
                fixDef.shape = new b2PolygonShape;
                fixDef.shape.SetAsBox(
                    this.width/(SCALE*2) //half width
                    ,    this.height/(SCALE*2) //half height
                );
            }else if(shape == "Circle"){
                fixDef.shape = new b2CircleShape(
                    this.width/SCALE/2 //radius
                );
            }
            bodyDef.position.x = this.x/SCALE;
            bodyDef.position.y = this.y/SCALE;
            bodyDef.angle = this.rot;
            this.body = world.CreateBody(bodyDef).CreateFixture(fixDef);
        },
        applyImpulse:function(x,y){
            this.body.GetBody().ApplyImpulse(new b2Vec2(x,y),this.body.GetBody().GetWorldCenter());
            //this.body.applyImpulse(x/SCALE,y/SCALE);
        },
        Rjoint:function(obj1, axis){
            var jointDef = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
            axis = axis || this.body.GetBody().GetWorldCenter();
            jointDef.Initialize(this.body.GetBody(), obj1.body.GetBody(), axis);
            var joint= Box2D.Dynamics.Joints.b2RevoluteJoint(world.CreateJoint(jointDef));
        },
        Djoint:function(obj, axis1, axis2, option){
            var jointDef = new Box2D.Dynamics.Joints.b2DistanceJointDef();
            axis1 = axis1 || this.body.GetBody().GetWorldCenter();
            axis2 = axis2 || this.body.GetBody().GetWorldCenter();
            jointDef.Initialize(obj.body.GetBody(), this.body.GetBody(), axis1, axis2);
            option = option || {};
            jointDef.frequencyHz  = option.frequency || 1;//小さい数字にするほどジョイントがよく伸びる。０で動かない？
            jointDef.dampingRatio = option.dampingRatio || 0.5;//上で設定した伸縮の減衰率 ０で減衰なし、１で最大減衰
            jointDef.length = option.length || 1.0;//自然な状態でのアンカー間の距離
            jointDef.collideConnected == true;
            var joint = Box2D.Dynamics.Joints.b2DistanceJoint(world.CreateJoint(jointDef));
        },
    };
    //物理演算含む箱の生成クラス
    PhysBox = Atlas.createClass(Atlas.Shape.Box,{
        initialize : function(color, width, height,body){
            this.inherit(color, width, height);
            this._applyPhisics("Box",body);
        },
    });

    Atlas.extendClass(PhysBox,Mixin);

    //物理演算含む丸の生成クラス
    PhysCircle = Atlas.createClass(Atlas.Shape.Circle,{
        initialize : function(color, radius, body){
            this.inherit(color, radius);
            this._applyPhisics("Circle",body);
        },
    });

    Atlas.extendClass(PhysCircle,Mixin);

    PhysSprite = Atlas.createClass(Atlas.Sprite,{
        initialize : function(image, width, height, body){
            this.inherit(image, width, height);
            this._applyPhisics(body.type || "Box",body);
        },
    });

    Atlas.extendClass(PhysSprite,Mixin);

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
        setSCALE : function(size){
            SCALE = size;
        }
    });   
})();