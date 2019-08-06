const { Sprite, utils, Application, Rectangle, Container, Graphics, TextStyle, Text } = PIXI;

const bird1 = './images/bird-1.png';
const bird2 = './images/bird-2.png';
const bird3 = './images/bird-3.png';

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



const loader = app.loader;
const resources = loader.resources;
const TextureCache = utils.TextureCache;

//load an image and run the `setup` function when it's done
loader
  .add('bird1', bird1)
  .add('bird2', bird2)
  .add('bird3', bird3)
  .add('city', './images/bg-tile.png')
  .on("progress", loadProgressHandler)
  .load(setup);

function loadProgressHandler(loader, resource) {
  //Display the file `url` currently being loaded
  console.log(`loading: ${resource.name} ${resource.url}`); 
  //Display the percentage of files currently loaded
  console.log(`progress: ${loader.progress} %`); 
}

let gameScene;
let city;


function setup() {
  console.log('set up');
  gameScene = new Container();
  app.stage.addChild(gameScene);
  // 创建城市背景
  const cityTexture = TextureCache['city'];
  console.log(cityTexture.baseTexture.width, cityTexture.baseTexture.height)
  city = new PIXI.extras.TilingSprite(cityTexture,
    window.innerWidth,
    window.innerHeight
  );
  city.tileScale.set(window.innerWidth / cityTexture.baseTexture.width, window.innerHeight / cityTexture.baseTexture.height);
  city.tilePosition.x = 0;
  city.tilePosition.y = 0;
  gameScene.addChild(city);

  
  const arr = [
    TextureCache['bird1'],
    TextureCache['bird2'],
    TextureCache['bird3'],
  ];
  //创建动画精灵
  let pixie = new PIXI.extras.AnimatedSprite(arr); 
  pixie.height = 27 * 3;
  pixie.width = 38 * 3;
  //设置动画精灵的速度
  pixie.animationSpeed=0.1;
  //把动画精灵添加到舞台
  app.stage.addChild(pixie);
  //播放动画精灵
  pixie.play();

  state = play;

  app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta){
  //Move the cat 1 pixel 
  state(delta);
}

function play() {
  city.tilePosition.x -= 1;
}