const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let intern = new Intern(200, 200, 5, 20, canvas);
let boss   = new Boss(600, 400, 5, 25, canvas);

let keys = {};

window.addEventListener("keydown", (event) => {
  keys[event.key] = true;
});

window.addEventListener("keyup", (event) => {
  keys[event.key] = false;
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  intern.draw(ctx);
  boss.draw(ctx);
}

function update() {
  // Intern (flèches)
  if (keys["ArrowUp"]) intern.move("ArrowUp");
  if (keys["ArrowDown"]) intern.move("ArrowDown");
  if (keys["ArrowLeft"]) intern.move("ArrowLeft");
  if (keys["ArrowRight"]) intern.move("ArrowRight");

  // Boss (ZQSD)
  if (keys["z"] || keys["Z"]) boss.move("z");
  if (keys["s"] || keys["S"]) boss.move("s");
  if (keys["q"] || keys["Q"]) boss.move("q");
  if (keys["d"] || keys["D"]) boss.move("d");
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}


gameLoop();
