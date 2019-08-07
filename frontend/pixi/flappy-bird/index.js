const { Sprite, utils, Application, Rectangle, Container, Graphics, TextStyle, Text } = PIXI;

const bird1 = './images/bird-1.png';
const bird2 = './images/bird-2.png';
const bird3 = './images/bird-3.png';
const PIPE_TOP = 'pipe-top';
const PIPE_BOTTOM = 'pipe-bottom';

//The `keyboard` helper function
function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.press = undefined;
  //The `downHandler`
  key.pressHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.press) key.press();
    }
    event.preventDefault();
  };
  //Attach event listeners
  window.addEventListener(
    "keypress", key.pressHandler.bind(key), false
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
  width: window.innerWidth,
  height: window.innerHeight,
  antialiasing: true, 
  transparent: false, 
  resolution: 1
});

app.renderer.backgroundColor = 0x061639;
//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);
// app.renderer.view.style.position = "absolute";
// app.renderer.view.style.display = "block";
// app.renderer.autoResize = true;

window.addEventListener("resize", function() {
  app.renderer.resize(window.innerWidth, window.innerHeight);
});

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const loader = app.loader;
const resources = loader.resources;
const TextureCache = utils.TextureCache;

//load an image and run the `setup` function when it's done
loader
  .add('bird1', bird1)
  .add('bird2', bird2)
  .add('bird3', bird3)
  .add('city', './images/bg-tile.png')
  .add(PIPE_TOP, './images/pipe-top.png')
  .add(PIPE_BOTTOM, './images/pipe-bottom.png')
  .on("progress", loadProgressHandler)
  .load(setup);

function loadProgressHandler(loader, resource) {
  //Display the file `url` currently being loaded
  console.log(`loading: ${resource.name} ${resource.url}`); 
  //Display the percentage of files currently loaded
  console.log(`progress: ${loader.progress} %`); 
}

class Bird {
  constructor(config) {
    this.raise = 0;
    const arr = [
      TextureCache['bird1'],
      TextureCache['bird2'],
      TextureCache['bird3'],
    ];
    // create animated sprite, so the bird can have fly animation.
    let sprite = new PIXI.extras.AnimatedSprite(arr); 
    sprite.height = 27;
    sprite.width = 38;
    sprite.scale.set(2,2);
    sprite.x = (config.width - sprite.width) / 2
    sprite.y = (config.height - sprite.height) / 2;
    //设置动画精灵的速度
    sprite.animationSpeed=0.1;
    this.sprite = sprite;
  }

  fly() {
    this.sprite.play();
  }

  die() {
    if (!this.dead) {
      this.sprite.stop();
      this.sprite.anchor.y = 0.3;
      this.sprite.anchor.x = -0.1;
      this.sprite.rotation = 0.5;
      this.dead = true;
    }
    this.drop(10);
  }
  up(speed) {
    this.sprite.y -= speed;
  }
  drop(speed) {
    this.sprite.y += speed;
  }
}

class Landscape {
  constructor(config) {
    const cityTexture = TextureCache['city'];
    const width = cityTexture.baseTexture.width;
    const height = cityTexture.baseTexture.height;
    const sprite = new PIXI.extras.TilingSprite(cityTexture,
      config.width,
      config.height
    );
    sprite.tileScale.set(config.width / width, config.height / height);
    sprite.tilePosition.x = 0;
    sprite.tilePosition.y = 0;
    this.sprite = sprite;
  }

  move(speed) {
    this.sprite.tilePosition.x -= speed;
  }
}


let gameScene;
let landscape;
let pipes = [];


class Pipe {
  constructor(config) {
    const texture = TextureCache[config.pipeType];
    const sprite = new Sprite(texture);
    sprite.height = config.height;
    sprite.width = config.width;
    sprite.position.set(config.x, config.y);
    this.sprite = sprite;
  }

  get x () { return this.sprite.x; }
  get y () { return this.sprite.y; }

  move(speed) {
    this.sprite.x -= speed;
  }

  outOfState() {
    return this.sprite.x + this.sprite.width < 0;
  }
}

function createPipePair(gameConfig, stageArea, prevPipe) {
  const gap = randomInt(gameConfig.minGap, gameConfig.maxGap);
  const remainHeight = stageArea.height - gap;
  const topHeight = randomInt(gameConfig.minPipeHeight, remainHeight);
  const bottomHeight = remainHeight - topHeight;
  const newX = gameConfig.pipeDistance + (prevPipe ? prevPipe.top.x : 0);
  const topPipe = new Pipe({
    pipeType: PIPE_TOP,
    height: topHeight,
    width: gameConfig.pipeWidth,
    x: newX,
    y: 0
  });
  const bottomPipe = new Pipe({
    pipeType: PIPE_BOTTOM,
    height: bottomHeight,
    width: gameConfig.pipeWidth,
    x: newX,
    y: stageArea.height - bottomHeight,
  });
  return { top: topPipe, bottom: bottomPipe };
};
const gameConfig = {
  pipeNumber: 8,
  maxGap: 800,
  minGap: 400,
  pipeWidth: 150,
  minPipeHeight: 400,
  pipeDistance: 400,
  bottomGap: 100,
};
const fullScreenWH = { width: app.screen.width, height: app.screen.height };
const stageArea = {x: 0 , y: 0, width: fullScreenWH.width, height: fullScreenWH.height - 50 };

function setup() {  
  gameScene = new Container();
  gameScene.sortableChildren = true;
  app.stage.addChild(gameScene);
  // create game's background landscape
  landscape = new Landscape(fullScreenWH);
  // crate bird;
  bird = new Bird(fullScreenWH);
  // add landscape to game scene
  gameScene.addChild(landscape.sprite);
  // create Pipes
  for (let index = 0; index < gameConfig.pipeNumber; index++) {
    const pipePair = createPipePair(gameConfig, stageArea, pipes[index - 1]);
    pipes.push(pipePair);
    gameScene.addChild(pipePair.top.sprite);
    gameScene.addChild(pipePair.bottom.sprite);
  }
  // add bird to game scene
  gameScene.addChild(bird.sprite);
  bird.fly();
  initKeyboard();
  state = play;
  app.ticker.add(delta => gameLoop(delta));
}

function initKeyboard() {
  const space = keyboard(32);
  space.press = () => {
    if (!birdHitPipe) {
      bird.up(50);
    }
  }
}

function gameLoop(delta){
  state(delta);
}

let birdHitPipe = false;
let landScapeSpeed = 3;
function play() {
  landscape.move(landScapeSpeed);
  if (birdHitPipe) {
    bird.die();
  } else {
    bird.drop(1);
  }
  let pop = false;
  for (let index = 0; !birdHitPipe && index < pipes.length; index++) {
    const pipePair = pipes[index];
    pipePair.top.move(landScapeSpeed);
    pipePair.bottom.move(landScapeSpeed);
    if (pipePair.top.outOfState()) {
      pop = true;
    }
    birdHitPipe = hitTestRectangle(bird.sprite, pipePair.top.sprite)
      || hitTestRectangle(bird.sprite, pipePair.bottom.sprite);
    if (birdHitPipe) {
      landScapeSpeed = 0;
      bird.die();
    }
  }
  if (pop) {
    pipes.shift();
    const pipePair = createPipePair(gameConfig, stageArea, pipes[pipes.length - 1]);
    pipes.push(pipePair);
    gameScene.addChild(pipePair.top.sprite);
    gameScene.addChild(pipePair.bottom.sprite);
  }
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
