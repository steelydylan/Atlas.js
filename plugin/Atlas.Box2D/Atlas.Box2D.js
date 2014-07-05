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
    
    PhysBox = Atlas.createClass(Atlas.Shape.Box,{
        initialize : function(color, width, height){
            this.inherit(color, width, height);
            this.setPosition(0,0);
            this._applyPhisics();
        },
        _enterFrame : function(){
            this.x = SCALE*(this.body.GetBody().GetPosition().x - this.width/(SCALE*2));
            this.y = SCALE*(this.body.GetBody().GetPosition().y - this.height/(SCALE*2));
            this.rot = this.body.GetBody().GetAngle();
            if(this.body.sleep){this.color = "#FFFFFF";}
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
        },
        setPosition: function (x, y) {
            this.body.setPosition(x/SCALE,y/SCALE);
            this.x = x;
            this.y = y;
            return this;
        }
    });
    
    
    
    Atlas.extendClass(Atlas.App,{
        createGround:function(x,y,width,height){
            bodyDef.type = b2Body.b2_staticBody;
            bodyDef.position.x = x/SCALE;
            bodyDef.position.y = y/SCALE;
            fixDef.shape = new b2PolygonShape;
            fixDef.shape.SetAsBox(width/SCALE, height/SCALE);
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