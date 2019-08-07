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
    const arr = [
      TextureCache['bird1'],
      TextureCache['bird2'],
      TextureCache['bird3'],
    ];
    // create animated sprite, so the bird can have fly animation.
    let sprite = new PIXI.extras.AnimatedSprite(arr); 
    sprite.height = 27 * 2.5;
    sprite.width = 38 * 2.5;
    sprite.x = (config.width - sprite.width) / 2
    sprite.y = (config.height - sprite.height) / 2;
    //设置动画精灵的速度
    sprite.animationSpeed=0.1;
    this.sprite = sprite;
  }

  fly() {
    this.sprite.play();
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
  pipeDistance: 300,
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
  state = play;
  app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta){
  state(delta);
}

function play() {
  const speed = 1.5;
  landscape.move(speed);
  let pop = false;
  for (let index = 0; index < pipes.length; index++) {
    const pipePair = pipes[index];
    pipePair.top.move(speed);
    pipePair.bottom.move(speed);
    if (pipePair.top.outOfState()) {
      pop = true;
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