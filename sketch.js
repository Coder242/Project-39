var score = 0;
var gamestate = "play";
var dog, backg, invisible_ground;
var dog_img, bone_img, obstacle_img, backg_img;
var bonegrp, obstaclegrp;
var target;
var result;

function preload(){
  
  dog_img = loadImage("dog.png");
  bone_img = loadImage("bone.png");
  obstacle_img = loadImage("obstacle.png");
  back_img = loadImage("double back.png");
  
}

function setup() {
  createCanvas(600,400);
  database = firebase.database()
  
  target = Math.round(random(3,25));
  
  dog = createSprite(50,370,10,10);
  dog.addImage(dog_img);
  dog.scale = 0.25;
  dog.setCollider("rectangle",-20,-5,300,160);
  // dog.debug = true;
  
  backg = createSprite(680,200,1,1);
  backg.addImage(back_img);
  backg.scale = 1.7;
  
  backg.depth = dog.depth;
  dog.depth = dog.depth+1;
  
  invisible_ground = createSprite(300,390,1200,10);
  invisible_ground.visible = false;
  
  bonegrp = new Group();
  obstaclegrp = new Group();

  comp_base = database.ref('Completion_Status')
  comp_base.on("value",function(data){
    result = data.val()
  })
  
}

function draw() {
  background('black');
  
  dog.collide(invisible_ground);
  
  if(gamestate == "play"){
    
    backg.velocityX = -6;
  
    if(backg.x < -50){
      backg.x = 630;
    }
    
    food();
    spawnObstacles();
    
    if(keyDown('space')&dog.y > 366){
      
      dog.velocityY = -20;
      
    }
   
    dog.velocityY = dog.velocityY+1;
    
    if(bonegrp.isTouching(dog)){
      bonegrp[0].destroy();
      score = score+1;
    }
    
    if(score === target){
      gamestate = "won";
    }
    else if(obstaclegrp.isTouching(dog)||dog.isTouching(obstaclegrp)){
      gamestate = "lose";      
    }
    else{
      null
    }
    
  }
  
  if(gamestate == "lose"){
    update_base("lose")
    
    backg.velocityX = 0;
    dog.velocityY = 0;
    
    obstaclegrp.setVelocityXEach(0);
    bonegrp.setVelocityXEach(0);
    
    obstaclegrp.setLifetimeEach(-1);
    bonegrp.setLifetimeEach(-1);
    
  }
  
  if(gamestate == "won"){
    update_base("won")
    
    backg.velocityX = 0;
    dog.velocityY = 0;

    obstaclegrp.setVelocityXEach(0);
    bonegrp.setVelocityXEach(0);
    
    obstaclegrp.setLifetimeEach(-1);
    bonegrp.setLifetimeEach(-1);
    
  }

  read_base();
  
  drawSprites();
  
  noStroke();
  fill('white');
  textSize(20);
  text("Food Needed: "+target+"||",2,20);
  text("||Food Collected: "+score,425,20);

  fill('yellow');
  text("Last Game: ",2,40);
  fill('green');
  text(result,110,25,500,50)
  
  if(gamestate == "lose"){
    textSize(40);
    stroke('red')
    fill('red');
    text("Oops!! You LOSE",150,200);
  }
  
  if(gamestate == "won"){
    textSize(40);
    stroke('gold')
    fill('gold');
    text("Yeah!! You WIN",150,200);
  }
  
  if(target <= 9){
    textSize(20);
    noStroke();
    fill('green');
    text("Difficulty Level: Easy",175,20);
  }
  
  if(target <= 16 && target>9){
    textSize(20);
    noStroke();
    fill('blue');
    text("Difficulty Level: Intermidiate",175,20);
  }
  
  if(target <= 25 && target>16){
    textSize(20);
    noStroke();
    fill('red');
    text("Difficulty Level: Hard",175,20);
  }
  
}

function food(){
  
  if(frameCount % 60 === 0){
    
    var a = Math.round(random(170,370));
    
    var bone = createSprite(630,a,10,10);
    bone.setCollider("circle",-10,0,114);
    // bone.debug = true;
    
    bone.addImage(bone_img);
    bone.scale = 0.2;
    
    bone.velocityX = -6;
    bone.lifetime = 120;
    
    bonegrp.add(bone);
    
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(630,330,40,40);
    obstacle.addImage(obstacle_img);
    obstacle.setCollider("rectangle",7,-3,200,280);
    // obstacle.debug = true;
    
    obstacle.velocityX = -10;
          
    obstacle.scale = 0.4;
    obstacle.lifetime = 120;
    
    obstaclegrp.add(obstacle);
    
  }
}
function update_base(status){
  database.ref('/').update({
    Completion_Status:status
  })
}
function read_base(data){
  comp_base.on("value",function(data){
    result = data.val()
  })
}
