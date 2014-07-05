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
      fixDef.density = 5;
      fixDef.friction = 0.5;
      fixDef.restitution = 0.5;
      var bodyDef = new b2BodyDef;
      bodyDef.type = b2Body.b2_dynamicBody; 
      var world = new b2World(
         new b2Vec2(0, 150)    //gravity
         ,  true                 //allow sleep
      );
      Atlas.extendClass(Atlas.Thing,{
         _enterFrame:function(){
            if(this.body){
               this.x = this.body.GetBody().GetPosition().x - this.width/2;
               this.y = this.body.GetBody().GetPosition().y - this.height/2;
               this.rot = this.body.GetBody().GetAngle();
            }
         },
         applyPhisics:function(){
            bodyDef.type = b2Body.b2_dynamicBody;
            fixDef.shape = new b2PolygonShape;
            fixDef.shape.SetAsBox(
                     this.width/2 //half width
                  ,  this.height/2 //half height
            );
            bodyDef.position.x = this.x;
            bodyDef.position.y = this.y;
            this.body = world.CreateBody(bodyDef).CreateFixture(fixDef);
         },
         changeBody:function(){

         }
      });
      Atlas.extendClass(Atlas.App,{
         createGround:function(x,y,width,height){
            bodyDef.type = b2Body.b2_staticBody;
            bodyDef.position.x = x;
            bodyDef.position.y = y;
            fixDef.shape = new b2PolygonShape;
            fixDef.shape.SetAsBox(width, height);
            world.CreateBody(bodyDef).CreateFixture(fixDef);  
         },
         enterFrame:function(){
            world.Step(
                  1 / 30   //frame-rate
               ,  10       //velocity iterations
               ,  10       //position iterations
            );
            world.ClearForces();
         },
      });   
})();