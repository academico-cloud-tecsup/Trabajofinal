const gameArea = document.getElementById("gameArea");
const apple = document.getElementById("apple");
const scoreElement = document.getElementById("score");
const milestoneGif = document.getElementById("milestone-gif");
const eatSound = document.getElementById("eat-sound");
let pokemons = [{ x: 185, y: 385 }];
let dx = 0.7;
let dy = 0;
let step = 0.7;
let score = 0;
let applesEaten = 0;
let isGamePaused = false;
let currentDirection = "right";
const pokemonSpacing = 40;

// Variables del efecto láser
let canvas, ctx, w, h, laser, text, particles, input;

function createPokemonElement(x, y) {
  const pokemon = document.createElement("div");
  pokemon.className = "pokemon right";
  pokemon.style.left = `${x}px`;
  pokemon.style.top = `${y}px`;
  gameArea.appendChild(pokemon);
  return pokemon;
}

let pokemonElements = [createPokemonElement(pokemons[0].x, pokemons[0].y)];

function updatePositions() {
  if (isGamePaused) return;

  let newX = pokemons[0].x + dx;
  let newY = pokemons[0].y + dy;

  if (
    newX < 0 ||
    newX > gameArea.clientWidth - 30 ||
    newY < 0 ||
    newY > gameArea.clientHeight - 30
  ) {
    showGameOverMessage();
    return;
  }

  for (let i = pokemons.length - 1; i > 0; i--) {
    pokemons[i].x = pokemons[i - 1].x - (dx * pokemonSpacing) / step;
    pokemons[i].y = pokemons[i - 1].y - (dy * pokemonSpacing) / step;
  }

  pokemons[0].x = newX;
  pokemons[0].y = newY;

  if (dx > 0) currentDirection = "right";
  else if (dx < 0) currentDirection = "left";
  else if (dy < 0) currentDirection = "up";
  else if (dy > 0) currentDirection = "down";

  pokemonElements.forEach((element, index) => {
    element.style.left = `${pokemons[index].x}px`;
    element.style.top = `${pokemons[index].y}px`;
    element.className = `pokemon ${currentDirection}`;
  });
}

function generateApple() {
  const appleSize = 70;
  const maxX = gameArea.clientWidth - appleSize;
  const maxY = gameArea.clientHeight - appleSize;
  const appleX = Math.floor(Math.random() * maxX);
  const appleY = Math.floor(Math.random() * maxY);
  apple.style.left = appleX + "px";
  apple.style.top = appleY + "px";
}

function checkCollision() {
  const headRect = pokemonElements[0].getBoundingClientRect();
  const appleRect = apple.getBoundingClientRect();

  if (
    headRect.left < appleRect.right &&
    headRect.right > appleRect.left &&
    headRect.top < appleRect.bottom &&
    headRect.bottom > appleRect.top
  ) {
    score++;
    applesEaten++;
    scoreElement.textContent = `Puntuación: ${score}`;
    generateApple();
    growPokemon();
    playEatSound();

    if (
      applesEaten === 1 ||
      applesEaten === 5 ||
      applesEaten === 10 ||
      applesEaten === 15 ||
      applesEaten === 48
    ) {
      increaseSpeed();
    }

    if (score === 15 || score === 30 || score === 50) {
      showMilestoneGif();
    }
  }
}

function increaseSpeed() {
  const speedIncrease = 1.4;
  dx *= speedIncrease;
  dy *= speedIncrease;
  step *= speedIncrease;
}

function growPokemon() {
  const lastPokemon = pokemons[pokemons.length - 1];
  const newX = lastPokemon.x - (dx * pokemonSpacing) / step;
  const newY = lastPokemon.y - (dy * pokemonSpacing) / step;
  pokemons.push({ x: newX, y: newY });
  const newElement = createPokemonElement(newX, newY);
  pokemonElements.push(newElement);
}

function showMilestoneGif() {
  isGamePaused = true;
  if (score === 15) {
    milestoneGif.style.backgroundImage = "url('nivel15.gif')";
    milestoneGif.style.width = "300px";
    milestoneGif.style.height = "300px";
    milestoneGif.style.display = "block";
    milestoneGif.onclick = () => {
      milestoneGif.style.display = "none";
      isGamePaused = false;
    };
  } else if (score === 30) {
    milestoneGif.style.backgroundImage = "url('nivel30.gif')";
    milestoneGif.style.width = "300px";
    milestoneGif.style.height = "300px";
    milestoneGif.style.display = "block";
    milestoneGif.onclick = () => {
      milestoneGif.style.display = "none";
      isGamePaused = false;
    };
  } else if (score === 50) {
    showLaserEffect();
  }
}

const borderHitSound = new Audio("pj1.mp3");
const backgroundMusic = new Audio("pj2.mp3");

function showGameOverMessage() {
  isGamePaused = true;
  borderHitSound.play(); // Play border hit sound
  milestoneGif.style.backgroundImage = "url('chocac.gif')";
  milestoneGif.style.backgroundSize = "contain";
  milestoneGif.style.backgroundColor = "transparent";
  milestoneGif.style.color = "orange";
  milestoneGif.style.textShadow = "0px 0px 10px rgba(255, 128, 0, 0.8)";
  milestoneGif.style.display = "flex";
  milestoneGif.style.justifyContent = "center";
  milestoneGif.style.alignItems = "center";
  milestoneGif.style.fontSize = "24px";
  milestoneGif.style.width = "80%";
  milestoneGif.style.height = "80%";
  milestoneGif.style.maxWidth = "none";
  milestoneGif.style.maxHeight = "none";
  milestoneGif.textContent = "Asustado, Potter?ñajañaja";
  milestoneGif.style.cursor = "pointer";
  milestoneGif.onclick = resetGame;
}

function showLaserEffect() {
  const laserEffect = document.querySelector(".page-laser-to-text");
  laserEffect.style.display = "flex";
  initLaserEffect();

  if (score >= 50) {
    backgroundMusic.loop = true;
    backgroundMusic.play();
  }
}

function changeDirection(newDx, newDy, newDirection) {
  dx = newDx * step;
  dy = newDy * step;
  currentDirection = newDirection;
}

function playEatSound() {
  eatSound.currentTime = 0;
  eatSound.play();
}

function resetGame() {
  pokemons = [{ x: 185, y: 385 }];
  dx = 0.7;
  dy = 0;
  step = 0.7;
  score = 0;
  applesEaten = 0;
  scoreElement.textContent = "Puntuación: 0";

  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;

  pokemonElements.forEach((element, index) => {
    if (index !== 0) element.remove();
  });
  pokemonElements = [pokemonElements[0]];

  pokemonElements[0].style.left = `${pokemons[0].x}px`;
  pokemonElements[0].style.top = `${pokemons[0].y}px`;

  generateApple();
  isGamePaused = false;
  milestoneGif.style.display = "none";
  currentDirection = "right";

  const laserEffect = document.querySelector(".page-laser-to-text");
  laserEffect.style.display = "none";
}

function gameLoop() {
  updatePositions();
  checkCollision();
  requestAnimationFrame(gameLoop);
}

// Funciones del efecto láser
function showLaserEffect() {
  const laserEffect = document.querySelector(".page-laser-to-text");
  laserEffect.style.display = "flex";
  initLaserEffect();

  // Añadir botón de cierre
  const closeButton = document.createElement("button");
  closeButton.textContent = "X";
  closeButton.style.position = "absolute";
  closeButton.style.top = "10px";
  closeButton.style.right = "10px";
  closeButton.style.fontSize = "20px";
  closeButton.style.cursor = "pointer";
  closeButton.onclick = () => {
    laserEffect.style.display = "none";
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    isGamePaused = false;
  };
  laserEffect.appendChild(closeButton);
}

function initLaserEffect() {
  canvas = document.getElementById("laser-canvas");
  input = document.getElementById("laser-input");
  ctx = canvas.getContext("2d");
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;
  laser = [];
  particles = [];

  text = new Text({
    copy: "Pide un Deseoˆˆ",
  });

  let musicStarted = false;

  input.addEventListener("input", (e) => {
    if (!musicStarted) {
      backgroundMusic.loop = true;
      backgroundMusic.play();
      musicStarted = true;
    }

    clearTimeout(cb);
    cb = setTimeout(() => {
      text = new Text({
        copy: input.value,
      });
    }, 300);
  });

  loop();
}

function Laser(options) {
  options = options || {};
  this.lifespan = options.lifespan || Math.round(Math.random() * 20 + 20);
  this.maxlife = this.lifespan;
  this.color = options.color || "#ff7f00";
  this.x = options.x || text.x + text.bound.width / 2;
  this.y = options.y || text.y + text.bound.height / 2;
  this.width = options.width || 2;

  this.update = function (index, array) {
    this.lifespan > 0 && this.lifespan--;
    this.lifespan <= 0 && this.remove(index, array);
  };

  this.render = function (ctx) {
    if (this.lifespan <= 0) return;
    ctx.beginPath();
    ctx.globalAlpha = this.lifespan / this.maxlife;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(w, this.y);
    ctx.stroke();
    ctx.closePath();
  };

  this.remove = function (index, array) {
    array.splice(index, 1);
  };
}

function Spark(options) {
  options = options || {};
  this.x = options.x || w * 0.5;
  this.y = options.y || h * 0.5;
  this.v = options.v || {
    direct: Math.random() * Math.PI * 2,
    weight: Math.random() * 10 + 2,
    friction: 0.94,
  };
  this.a = options.a || {
    change: Math.random() * 0.2 - 0.1,
    min: this.v.direct - Math.PI * 0.4,
    max: this.v.direct + Math.PI * 0.4,
  };
  this.g = options.g || {
    direct: Math.PI * 0.5 + (Math.random() * 0.4 - 0.2),
    weight: Math.random() * 0.5 + 0.5,
  };
  this.width = options.width || Math.random() * 3;
  this.lifespan = options.lifespan || Math.round(Math.random() * 20 + 40);
  this.maxlife = this.lifespan;
  this.color = options.color || "#fdab23";
  this.prev = { x: this.x, y: this.y };

  this.update = function (index, array) {
    this.prev = { x: this.x, y: this.y };
    this.x += Math.cos(this.v.direct) * this.v.weight;
    this.x += Math.cos(this.g.direct) * this.g.weight;
    this.y += Math.sin(this.v.direct) * this.v.weight;
    this.y += Math.sin(this.g.direct) * this.g.weight;
    this.v.weight *= this.v.friction;
    this.v.direct += this.a.change;
    (this.v.direct > this.a.max || this.v.direct < this.a.min) &&
      (this.a.change *= -1);
    this.lifespan > 0 && this.lifespan--;
    this.lifespan <= 0 && this.remove(index, array);
  };

  this.render = function (ctx) {
    if (this.lifespan <= 0) return;
    ctx.beginPath();
    ctx.globalAlpha = this.lifespan / this.maxlife;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.prev.x, this.prev.y);
    ctx.stroke();
    ctx.closePath();
  };

  this.remove = function (index, array) {
    array.splice(index, 1);
  };
}

function Particles(options) {
  options = options || {};
  this.max = options.max || Math.round(Math.random() * 20 + 10);
  this.sparks = [...new Array(this.max)].map(() => new Spark(options));

  this.update = function () {
    this.sparks.forEach((s, i) => s.update(i, this.sparks));
  };

  this.render = function (ctx) {
    this.sparks.forEach((s) => s.render(ctx));
  };
}

function Text(options) {
  options = options || {};
  const pool = document.createElement("canvas");
  const buffer = pool.getContext("2d");
  pool.width = w;
  buffer.fillStyle = "#000000";
  buffer.fillRect(0, 0, pool.width, pool.height);

  this.size = options.size || 100;
  this.copy = (options.copy || `Hello!`) + " ";
  this.color = options.color || "#ff7f00";
  this.delay = options.delay || 2;
  this.basedelay = this.delay;

  buffer.font = `${this.size}px Comic Sans MS`;
  this.bound = buffer.measureText(this.copy);
  this.bound.height = this.size * 1.5;
  this.x = options.x || w * 0.5 - this.bound.width * 0.5;
  this.y = options.y || h * 0.5 - this.size * 0.5;

  buffer.strokeStyle = this.color;
  buffer.strokeText(this.copy, 0, this.bound.height * 0.8);
  this.data = buffer.getImageData(0, 0, this.bound.width, this.bound.height);
  this.index = 0;

  this.update = function () {
    if (this.index >= this.bound.width) {
      this.index = 0;
      return;
    }
    const data = this.data.data;
    for (let i = this.index * 4; i < data.length; i += 4 * this.data.width) {
      const bitmap = data[i] + data[i + 1] + data[i + 2] + data[i + 3];
      if (bitmap > 255 && Math.random() > 0.86) {
        const x = this.x + this.index;
        const y = this.y + i / this.bound.width / 4;
        const isLetterPixel =
          x >= this.x &&
          x <= this.x + this.bound.width &&
          y >= this.y &&
          y <= this.y + this.bound.height;
        if (isLetterPixel) {
          laser.push(
            new Laser({
              x: x,
              y: y,
            })
          );
          Math.random() > 0.7 &&
            particles.push(
              new Particles({
                x: x,
                y: y,
              })
            );
        }
      }
    }
    this.delay-- < 0 && this.index++ && (this.delay += this.basedelay);
  };

  this.render = function (ctx) {
    ctx.putImageData(
      this.data,
      this.x,
      this.y,
      0,
      0,
      this.index,
      this.bound.height
    );
  };
}

function loop() {
  update();
  render();
  requestAnimationFrame(loop);
}

function update() {
  text.update();
  laser.forEach((l, i) => l.update(i, laser));
  particles.forEach((p) => p.update());
}

function render() {
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, w, h);

  ctx.globalCompositeOperation = "screen";
  text.render(ctx);
  laser.forEach((l) => l.render(ctx));
  particles.forEach((p) => p.render(ctx));
}

// Inicialización y eventos
function init() {
  canvas = document.getElementById("laser-canvas");
  input = document.getElementById("laser-input");
  ctx = canvas.getContext("2d");
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;
  laser = [];
  particles = [];

  text = new Text({
    copy: "Pide un Deseoˆˆ",
  });

  canvas.addEventListener("click", (e) => {
    const x = e.clientX;
    const y = e.clientY;
    laser.push(
      new Laser({
        x: x,
        y: y,
      })
    );
    particles.push(
      new Particles({
        x: x,
        y: y,
      })
    );
  });

  let cb = 0;
  input.addEventListener("keyup", (e) => {
    clearTimeout(cb);
    cb = setTimeout(() => {
      text = new Text({
        copy: input.value,
      });
    }, 300);
  });

  loop();
}

// Iniciar el juego
generateApple();
gameLoop();

// Eventos del juego
document.addEventListener("keydown", (event) => {
  if (isGamePaused) return;
  switch (event.key) {
    case "ArrowUp":
      changeDirection(0, -1, "up");
      break;
    case "ArrowDown":
      changeDirection(0, 1, "down");
      break;
    case "ArrowLeft":
      changeDirection(-1, 0, "left");
      break;
    case "ArrowRight":
      changeDirection(1, 0, "right");
      break;
  }
});

document
  .getElementById("up-button")
  .addEventListener("click", () => changeDirection(0, -1, "up"));
document
  .getElementById("down-button")
  .addEventListener("click", () => changeDirection(0, 1, "down"));
document
  .getElementById("left-button")
  .addEventListener("click", () => changeDirection(-1, 0, "left"));
document
  .getElementById("right-button")
  .addEventListener("click", () => changeDirection(1, 0, "right"));

// Ajustar tamaño del juego cuando cambia el tamaño de la ventana
window.addEventListener("resize", adjustGameSize);

function adjustGameSize() {
  const containerWidth = gameArea.clientWidth;
  const containerHeight = gameArea.clientHeight;
  const scaleFactor = Math.min(containerWidth / 400, containerHeight / 600, 1);

  gameArea.style.transform = `scale(${scaleFactor})`;
  gameArea.style.transformOrigin = "center";
}

// Llamar a adjustGameSize inicialmente y cuando cambie el tamaño de la ventana
adjustGameSize();

// Inicializar el efecto láser cuando sea necesario
init();
