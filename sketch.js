//Create variables here
var database;
var dog, dogimg, happyDog,textColor,value;
var foodS,foodStock
var feed, addFood;
var foodObj;
var lastFed, fedTime;
var changeState, readState;
var bedroom, garden, washroom;
var gameState = 0;

function preload(){
  dogimg = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
  bedroom = loadImage("images/Bed Room.png");
  garden = loadImage("images/Garden.png");
  washroom = loadImage("images/Wash Room.png");
}

function setup() {
  createCanvas(500,500);
    
  database = firebase.database();


  foodObj = new Food(20,100,10,30);

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);
  
  dog = createSprite(200,300,10,10);
  dog.addImage(dogimg);
  dog.scale = 0.15
  
  feed = createButton("Feed the Dog");
  feed.position(650,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(750,95);
  addFood.mousePressed(addFoods);

  readState = database.ref('gameState');
  readState.on("value", function(data){
  gameState = data.val();
  })

}


function draw() {  

  background(46, 139, 87);

  // if(keyWentDown(UP_ARROW)){
  //   writeStock(foodS);
  //   dog.addImage(happyDog);
  // }

  foodObj.display();

  fedTime = database.ref("FeedTime");

  fedTime.on("value",function(data){
    lastFed = data.val();
  });

  fill(255,255,254);
  textSize(15);

  if(lastFed>=12){
    text("Last Feed:" + lastFed%12 + "PM", 300, 30);
  }else if(lastFed===0){
    text("Last Feed: 12AM", 300,30);
  }else{
    text("Last Feed:" + lastFed + "AM", 300,30);
  }
  
  update();

  currentTime = hour();

  if(currentTime===(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }else if(currentTime==(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }else{
    update("Hungry");
    foodObj.display();
  }

  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage(dogimg);
  }

  drawSprites();
}

function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    fedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState: state
  });
}   