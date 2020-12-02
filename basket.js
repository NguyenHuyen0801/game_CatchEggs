// setup
const canvasEl = document.getElementById("canvas");
const context = canvasEl.getContext("2d");

canvasEl.width = window.innerWidth;
canvasEl.height = window.innerHeight;
const game = {
  gameOver: false,
};

// get element
let overScreen = document.querySelector(".over-screen");

//Create basket
let basket_player = new Sprite(
  innerWidth / 2 - 80 / 2,
  innerHeight / 2 - 120 / 2 + 220,
  120,
  100
);

// add img basket
const img_basket = new Image();
img_basket.src = "./images/bowl.png";

let direction = { x: 0, y: 0 };

// draw img_basket
basket_player.painter = {
  paint: (context, x, y, w, h) => {
    // handle touch Ox
    if (basket_player.x <= 0) {
      basket_player.x = 0;
    } else if (basket_player.x >= innerWidth - 120) {
      basket_player.x = innerWidth - 120;
    }

    // handle touch Oy
    if (basket_player.y <= 0) {
      basket_player.y = 0;
    } else if (basket_player.y >= innerHeight - 100) {
      basket_player.y = innerHeight - 100;
    }
    context.drawImage(img_basket, x, y, w, h); 
  },
};

// move 0x
basket_player.behaviors.push({
  //horizontal moving
  direction: 1,
  speed: 10,
  enable: false,
  exec: function (sprite) {
    sprite.x += this.direction * this.speed;
  },
});


//=== CREATE EGG ===
var eggArray = [];
var eggIndex = 0;
var egg_width = 40;
var egg_height = 40;
var egg_timer = 500; // hen gio sau 0.5s thi eeg lai xuat hien
var lastTime = 0;
var score = 0;

//add img eeg
const img_egg = new Image();
img_egg.src = "./images/egg1.png";

// create enemy object
function egg(x, y, dx, dy, img_egg, egg_width, egg_height, rotation) {
  this.x = x;
  this.y = y;
  this.dx = dx; 
  this.dy = dy;
  this.img = img_egg;
  this.width = egg_width;
  this.height = egg_height;
  this.rotation = rotation;
  eggIndex++;
  eggArray[eggIndex] = this; // luu cac gia tri doi tuong this(egg) vao trong mang eggArray
  this.id = eggIndex;

  // function update egg
  this.update = function () {
    this.y += this.dy;

    // TH: egg vuot qua truc Oy ==> delete egg
    if (this.y > innerHeight + this.height) {
      this.delete();
    }

    this.draw();
  };

  // handle delete egg
  this.delete = function () {
    delete eggArray[this.id];
  };

  // function draw egg
  this.draw = function () {
    context.drawImage(this.img, this.x, this.y, this.width, this.height);
  };
}

// create egg
function createEgg() {
  var x = Math.random() * (innerWidth - egg_width);
  var y = -egg_height;
  var dx = 4;
  var dy = 4;
  var rotation = Math.random();

  new egg(x, y, dx, dy, img_egg, egg_width, egg_height, rotation);
}


//=== CREATE EGG2===
var egg2Array = [];
var egg2Index = 0;
var egg2_width = 40;
var egg2_height = 40;
var egg2_timer = 2000; // hen gio sau 1.5s thi eeg2 lai xuat hien
var lastTime = 0;
var score = 0;

//add img eeg2
const img_egg2 = new Image();
img_egg2.src = "./images/egg2.png";

// create egg2 object
function egg2(x, y, dx, dy, img_egg2, egg2_width, egg2_height, rotation) {
  this.x = x;
  this.y = y;
  this.dx = dx; 
  this.dy = dy;
  this.img = img_egg2;
  this.width = egg2_width;
  this.height = egg2_height;
  this.rotation = rotation;
  egg2Index++;
  egg2Array[egg2Index] = this; // luu cac gia tri doi tuong this(egg2) vao trong mang eggArray
  this.id = egg2Index;

  // function update egg2
  this.update = function () {
    this.y += this.dy;

    // TH: egg2 vuot qua truc Oy ==> delete egg2
    if (this.y > innerHeight + this.height) {
      this.delete();
    }

    this.draw();
  };

  // handle delete egg2
  this.delete = function () {
    delete egg2Array[this.id];
  };

  // function draw egg2
  this.draw = function () {
    context.drawImage(this.img, this.x, this.y, this.width, this.height);
  };
}

// create egg2
function createEgg2() {
  var x = Math.random() * (innerWidth - egg2_width);
  var y = -egg2_height;
  var dx = 4;
  var dy = 4;
  var rotation = Math.random();

  new egg2(x, y, dx, dy, img_egg2, egg2_width, egg2_height, rotation);
}

//=== CREATE BOMB ===
var bombArray = [];
var bombIndex = 0;
var bomb_width = 60;
var bomb_height = 60;
var bomb_timer = 1500; // hen gio sau 1.5s thi bomb lai xuat hien
var lastTime = 0;

//add img bomb
const img_bomb = new Image();
img_bomb.src = "./images/bomb.png";

// create bomb object
function bomb(x, y, dx, dy, img_bomb, bomb_width, bomb_height, rotation) {
  this.x = x;
  this.y = y;
  this.dx = dx; 
  this.dy = dy;
  this.img = img_bomb;
  this.width = bomb_width;
  this.height = bomb_height;
  this.rotation = rotation;
  bombIndex++;
  bombArray[bombIndex] = this; // luu cac gia tri doi tuong this(bomb) vao trong mang eggArray
  this.id = bombIndex;

  // lam cho bomb xuat hien tu trai->phai va phai->trai
  if (this.rotation < 0.1) {
    this.dx = -this.dx;
  } else if (this.rotation > 0.5) {
    this.dx = -this.dx;
  } else {
    this.dx = 0;
    this.dx = this.dy;
  }

  // function update bomb
  this.update = function () {
    this.y += this.dy;
    this.x += this.dx;

       // TH: handle kha nang khi enemy cham canh trai va phai
       if (this.x + this.width >= innerWidth) {
        this.dx = -this.dx; // -this.dx: de enemy khi cham canh phai, enemy van di chuyen duoc trong chieu am cua Ox
      } else if (this.x <= 0) {
        this.dx = Math.abs(this.dx);
      }

    // TH: bomb vuot qua truc Oy ==> delete bomb
    if (this.y > innerHeight + this.height) {
      this.delete();
    }

    this.draw();
  };

  // handle delete bomb
  this.delete = function () {
    delete bombArray[this.id];
  };

  // function draw bomb
  this.draw = function () {
    context.drawImage(this.img, this.x, this.y, this.width, this.height);
  };
}

// create bomb
function createBomb() {
  var x = Math.random() * (innerWidth - bomb_width);
  var y = -bomb_height;
  var dx = 5;
  var dy = 5;
  var rotation = Math.random();

  new bomb(x, y, dx, dy, img_bomb, bomb_width, bomb_height, rotation);
}

// handle collides - xu ly va cham
function collides(a, b, flag) {
  if (
    ((a.x + a.width >= b.x  && b.x + b.width >= a.x ) ||
      (b.x + b.width >= a.x  && a.x + a.width >= b.x )) &&
    ((b.y + b.height > a.y  && a.y + a.height > b.y) ||
      (a.y + a.height > b.y  && b.y + b.height > a.y ))
  ) {
    console.log("flag");
    if (flag) {
      gameOver = true;
    }
    return true;
  }

  return false;
}

let gameOver = false;

//EGG1
function handleCollisions() {
  eggArray.forEach(function (egg) {
    if(collides(egg, basket_player, false)){
      egg.delete();
      score += 1;
  }
  });
}

//EGG2
function handleCollisions1() {
  egg2Array.forEach(function (egg2) {
    if(collides(egg2, basket_player, false)){
      egg2.delete();
      score += 2;
  }
  });
}

//BOMB
function handleCollisions2 () {
  bombArray.forEach (function (bomb) {
    if(collides(bomb, basket_player,true)) {
      bomb.delete();
    }
  });
}


// format game
function clear() {
  context.clearRect(0, 0, canvasEl.width, canvasEl.height);
}

function draw() {
  basket_player.paint(context);
}

function update() {
  basket_player.exec();
}

function gameLoop(currentTime) {
  clear();
  draw();
  update();

  // score
  context.font = "24px serif";
  context.fillStyle = "black";
  context.fillText("SCORE: " + score, 30, 30);

  //draw egg and bomb
  if (currentTime >= lastTime + bomb_timer && currentTime >= lastTime + egg_timer && currentTime >= lastTime + egg2_timer) {
    lastTime = currentTime;
    createBomb();
    createEgg();
    createEgg2();
  }

  // update bomb positions
  bombArray.forEach(function (bomb) {
    bomb.update();
  });

  // update egg positions
  eggArray.forEach(function (egg) {
    egg.update();
  });

   // update egg2 positions
   egg2Array.forEach(function (egg2) {
    egg2.update();
  });

// detect collision
handleCollisions();
handleCollisions1();
handleCollisions2();

if(gameOver) {
  context.font = "50px serif";
  context.fillStyle = "red";
  context.fillText("Game Over", innerWidth /2 + 30, innerHeight / 2 - 120);

  context.font= "24px serif";
  context.fillStyle = "red";
  context.fillText("Have fun!!!", innerWidth /2 - 50, innerHeight / 2 - 80);
}

if(!gameOver) requestAnimationFrame(gameLoop);
}

img_basket.onload = () => {
  gameLoop();
};

// event when click
document.onkeydown = (e) => {
  // console.log(e.code);
  if (e.code == "KeyF") {
    basket_player.behaviors[0].enable = true;
    basket_player.behaviors[0].direction = 1;
  }

  if (e.code == "KeyA") {
    basket_player.behaviors[0].enable = true;
    basket_player.behaviors[0].direction = -1;
  }

  if (e.code == "KeyW") {
    basket_player.behaviors[1].enable = true;
    basket_player.behaviors[1].direction = -1;
  }

  if (e.code == "KeyS") {
    basket_player.behaviors[1].enable = true;
    basket_player.behaviors[1].direction = 1;
  }
};

// event after click
document.onkeyup = (e) => {
  if (e.code == "KeyF" || e.code == "KeyA") {
    basket_player.behaviors[0].enable = false;
  }

  if (e.code == "KeyW" || e.code == "KeyS") {
    player_plane.behaviors[1].enable = false;
  }
};

