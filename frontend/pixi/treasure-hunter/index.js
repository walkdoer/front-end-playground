const { Sprite, utils, Application, Rectangle, Container, Graphics, TextStyle, Text } = PIXI;
const dinasaurImg = './images/dinosaur.png';
const spritesImg  = './images/tileset.png';
const treasureHunterJSON = './images/hunter.json'

//The `randomInt` helper function
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//The `keyboard` helper function
function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };
  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };
  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}

let type = "WebGL"
if(!utils.isWebGLSupported()){
  type = "canvas"
}

utils.sayHello(type);

//Create a Pixi Applidinosaurion
let app = new Application({
  width: 512,
  height: 512,
  antialiasing: true, 
  transparent: false, 
  resolution: 1
});

// app.renderer.backgroundColor = 0x061639;

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

console.log(app.renderer.view.width);

// app.renderer.view.style.position = "absolute";
// app.renderer.view.style.display = "block";
// app.renderer.autoResize = true;

const loader = app.loader;
const resources = loader.resources;
const TextureCache = utils.TextureCache;
let state, healthBar, explorer, dungeon, treasure, gameOverScene, message, blobs;
//load an image and run the `setup` function when it's done
loader
  .add('sprites', spritesImg)
  .add(treasureHunterJSON)
  .on("progress", loadProgressHandler)
  .load(setup);

function loadProgressHandler(loader, resource) {
  //Display the file `url` currently being loaded
  console.log(`loading: ${resource.name} ${resource.url}`); 

  //Display the percentage of files currently loaded
  console.log(`progress: ${loader.progress} %`); 

  //If you gave your files names as the first argument 
  //of the `add` method, you can access them like this
}
//This `setup` function will run when the image has loaded

let rocket;
let gameScene;
let id;
function setup() {
  id = resources["./images/hunter.json"].textures; 
  //Make the game scene and add it to the stage
  gameScene = new Container();
  app.stage.addChild(gameScene);
  //Dungeon
  dungeon = new Sprite(id["dungeon.png"]);
  gameScene.addChild(dungeon);

  // Create the `tileset` sprite from the texture
  let texture = TextureCache["sprites"];
  // Tell the texture to use that rectangular section
  texture.frame = new Rectangle(192, 128, 64, 64);
  // Create the sprite from the texture

  // Door
  door = new Sprite(id["door.png"]); 
  door.position.set(32, 0);
  gameScene.addChild(door);

  //Explorer
  explorer = new Sprite(id["explorer.png"]);
  explorer.x = 68;
  explorer.y = gameScene.height / 2 - explorer.height / 2;;
  explorer.vx = 0;
  explorer.vy = 0;
  gameScene.addChild(explorer);

  //Treasure
  treasure = new Sprite(id["treasure.png"]);
  treasure.x = gameScene.width - treasure.width - 48;
  treasure.y = gameScene.height / 2 - treasure.height / 2;
  gameScene.addChild(treasure);

  //Make the blobs
  let numberOfBlobs = 6,
      spacing = 48,
      xOffset = 150,
      speed = 2,
      direction = 1;
  //An array to store all the blob monsters
  blobs = [];
  //Make as many blobs as there are `numberOfBlobs`
  for (let i = 0; i < numberOfBlobs; i++) {
    //Make a blob
    let blob = new Sprite(id["blob.png"]);
    //Space each blob horizontally according to the `spacing` value.
    //`xOffset` determines the point from the left of the screen
    //at which the first blob should be added
    let x = spacing * i + xOffset;
    //Give the blob a random y position
    let y = randomInt(0, app.stage.height - blob.height);
    //Set the blob's position
    blob.x = x;
    blob.y = y;
    //Set the blob's vertical velocity. `direction` will be either `1` or
    //`-1`. `1` means the enemy will move down and `-1` means the blob will
    //move up. Multiplying `direction` by `speed` determines the blob's
    //vertical direction
    blob.vy = speed * direction;
    //Reverse the direction for the next blob
    direction *= -1;
    //Push the blob into the `blobs` array
    blobs.push(blob);
    //Add the blob to the `gameScene`
    gameScene.addChild(blob);
  }

  //Create the health bar
  healthBar = new Container();
  healthBar.position.set(app.stage.width - 170, 4)
  gameScene.addChild(healthBar);

  //Create the black background rectangle
  let innerBar = new Graphics();
  innerBar.beginFill(0x000000);
  innerBar.drawRect(0, 0, 128, 8);
  innerBar.endFill();
  healthBar.addChild(innerBar);

  //Create the front red rectangle
  let outerBar = new Graphics();
  outerBar.beginFill(0xFF3300);
  outerBar.drawRect(0, 0, 128, 8);
  outerBar.endFill();
  healthBar.addChild(outerBar);

  healthBar.outer = outerBar;


  
  //Create the `gameOver` scene
  gameOverScene = new Container();
  app.stage.addChild(gameOverScene);
  //Make the `gameOver` scene invisible when the game first starts
  gameOverScene.visible = false;
  //Create the text sprite and add it to the `gameOver` scene
  let style = new TextStyle({
    fontFamily: "Futura",
    fontSize: 64,
    fill: "white"
  });
  message = new Text("The End!", style);
  message.x = 120;
  message.y = app.stage.height / 2 - 32;
  gameOverScene.addChild(message);

  //Capture the keyboard arrow keys
  let left = keyboard(37),
      up = keyboard(38),
      right = keyboard(39),
      down = keyboard(40);

  //Left arrow key `press` method
  left.press = () => {
    //Change the explorer's velocity when the key is pressed
    explorer.vx = -5;
    explorer.vy = 0;
  };
  
  //Left arrow key `release` method
  left.release = () => {
    if (!right.isDown && explorer.vy === 0) {
      explorer.vx = 0;
    }
  };

  //Up
  up.press = () => {
    explorer.vx = 0;
    explorer.vy = -5; 
  };
  up.release = () => {
    if (!down.isDown && explorer.vx === 0) {
      explorer.vy = 0;
    }
  };

  //Right
  right.press = () => {
    explorer.vx = 5;
    explorer.vy = 0;
  };
  right.release = () => {
    if (!left.isDown && explorer.vy === 0) {
      explorer.vx = 0;
    }
  };

  //Down
  down.press = () => {
    explorer.vx = 0;
    explorer.vy = 5;
  };
  down.release = () => {
    if (!up.isDown && explorer.vx === 0) {
      explorer.vy = 0;
    }
  };

  state = play;

  app.ticker.add(delta => gameLoop(delta));
}

const stageArea = {x: 28, y: 10, width: 488, height: 480};
function gameLoop(delta){
  //Move the cat 1 pixel 
  state(delta);
}

let explorerHit;
function play() {
  //Use the cat's velocity to make it move
  explorer.x += explorer.vx;
  explorer.y += explorer.vy;

  contain(explorer, stageArea);
  explorerHit = false
  blobsRunning();
  if (explorerHit) {
    explorer.alpha = 0.5;
    healthBar.outer.width -= 1;
  } else {
    explorer.alpha = 1;
  }

  if (hitTestRectangle(explorer, treasure)) {
    treasure.x = explorer.x + 8;
    treasure.y = explorer.y + 8;
  }

  if (healthBar.outer.width < 0) {
    state = end;
    message.text = "You lost!";
  }

  if (hitTestRectangle(treasure, door)) {
    state = end;
    message.text = "You won!";
  }
}


function blobsRunning() {
  blobs.forEach(function (blob) {
    blob.y += blob.vy;

    let blobHitWall = contain(blob, stageArea);
    if (blobHitWall === 'top' || blobHitWall === 'bottom') {
      blob.vy *= -1;
    }
    //Test for a collision. If any of the enemies are touching
    //the explorer, set `explorerHit` to `true`
    if(hitTestRectangle(explorer, blob)) {
      explorerHit = true;
    }
  });
}


function contain(sprite, container) {
  let collision = undefined;
  //Left
  if (sprite.x < container.x) {
    sprite.x = container.x;
    collision = "left";
  }
  //Top
  if (sprite.y < container.y) {
    sprite.y = container.y;
    collision = "top";
  }
  //Right
  if (sprite.x + sprite.width > container.width) {
    sprite.x = container.width - sprite.width;
    collision = "right";
  }
  //Bottom
  if (sprite.y + sprite.height > container.height) {
    sprite.y = container.height - sprite.height;
    collision = "bottom";
  }
  //Return the `collision` value
  return collision;
}

function end() {
  gameScene.visible = false;
  gameOverScene.visible = true;
}

//The `hitTestRectangle` function
function hitTestRectangle(r1, r2) {
  //Define the variables we'll need to calculate
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
  //hit will determine whether there's a collision
  hit = false;
  //Find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2; 
  r1.centerY = r1.y + r1.height / 2; 
  r2.centerX = r2.x + r2.width / 2; 
  r2.centerY = r2.y + r2.height / 2; 
  //Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;
  //Calculate the distance vector between the sprites
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;
  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;
  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {
    //A collision might be occuring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {
      //There's definitely a collision happening
      hit = true;
    } else {
      //There's no collision on the y axis
      hit = false;
    }
  } else {
    //There's no collision on the x axis
    hit = false;
  }
  //`hit` will be either `true` or `false`
  return hit;
};
